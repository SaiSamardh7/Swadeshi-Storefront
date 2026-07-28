import { Router, type IRouter } from "express";
import { and, desc, eq, sql } from "drizzle-orm";
import {
  CreateOrderBody,
  CreateOrderResponse,
  GetMyOrdersResponse,
  PayOrderParams,
  PayOrderResponse,
} from "@workspace/api-zod";
import {
  db,
  ordersTable,
  orderItemsTable,
  orderDeliveriesTable,
  type Order,
  type OrderItem,
} from "@workspace/db";
import { getMenuItem } from "@workspace/menu";
import { DELIVERY_CONFIG, evaluateDelivery, generateSlots } from "@workspace/delivery";
import { getSessionUser } from "../lib/session";
import { getStoreSettings, listMenuOverrides } from "../lib/store-state";
import { sendBusinessEmail } from "../lib/mailer";
import { geocodeAddress } from "../lib/geocode";
import { deliveriesByOrderId, type OrderDeliveryView } from "../lib/order-delivery";
import { chargeOrder } from "../lib/payment";

const router: IRouter = Router();

const PICKUP_MINUTES = 30;

// Thrown inside the capacity transaction so a full slot rolls back cleanly.
class SlotFullError extends Error {}

type PricedItem = { itemId: string; name: string; unitPriceCents: number; qty: number };

// Price a cart from the server-side catalog with staff overrides applied —
// never trust a client-supplied name or price. Shared by pickup and delivery.
async function priceItems(
  items: { itemId: string; qty: number }[],
): Promise<{ items: PricedItem[] } | { error: string }> {
  const overrides = new Map((await listMenuOverrides()).map((o) => [o.itemId, o]));
  const soldOutNames: string[] = [];
  const priced = items.map((i): PricedItem | null => {
    const catalogItem = getMenuItem(i.itemId);
    if (!catalogItem) return null;
    const override = overrides.get(i.itemId);
    if (override?.soldOut) {
      soldOutNames.push(catalogItem.name);
      return null;
    }
    const unitPriceCents = override?.priceCents ?? catalogItem.priceCents;
    return { itemId: i.itemId, name: catalogItem.name, unitPriceCents, qty: i.qty };
  });
  if (soldOutNames.length > 0) {
    return { error: `Sold out today: ${soldOutNames.join(", ")}. Please remove from your cart.` };
  }
  if (priced.some((i) => i === null)) {
    return { error: "One or more items are no longer on the menu." };
  }
  return { items: priced as PricedItem[] };
}

function dollars(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatTicket(order: Order, items: OrderItem[]): string {
  const lines = [
    `New pickup order #${order.id} — ${order.pickupName}`,
    ...items.map((i) => `  ${i.qty}x ${i.name} — ${dollars(i.unitPriceCents)} each`),
    `Subtotal: ${dollars(order.subtotalCents)}`,
  ];
  if (order.note) lines.push(`Note: ${order.note}`);
  const eta = order.pickupEta
    ? order.pickupEta.toLocaleTimeString("en-US", { timeZone: "America/Chicago" })
    : "ASAP";
  lines.push(`Pickup by: ${eta}`, "Customer pays at pickup — no online payment collected.");
  return lines.join("\n");
}

function formatDeliveryTicket(order: Order, items: OrderItem[], delivery: OrderDeliveryView): string {
  const when = order.scheduledFor
    ? order.scheduledFor.toLocaleString("en-US", { timeZone: "America/Chicago" })
    : "unscheduled";
  const line2 = delivery.line2 ? `, ${delivery.line2}` : "";
  const lines = [
    `New DELIVERY order #${order.id} — ${order.pickupName}`,
    ...items.map((i) => `  ${i.qty}x ${i.name} — ${dollars(i.unitPriceCents)} each`),
    `Items subtotal: ${dollars(order.subtotalCents)}`,
    `Delivery fee:   ${dollars(delivery.deliveryFeeCents)}`,
    `Order total:    ${dollars(order.subtotalCents + delivery.deliveryFeeCents)}`,
    "",
    "Deliver to:",
    `  ${delivery.line1}${line2}`,
    `  ${delivery.city}, ${delivery.state} ${delivery.zip}`,
    `Scheduled for: ${when}`,
  ];
  if (order.note) lines.push(`Note: ${order.note}`);
  lines.push("", "PAYMENT PENDING — no online payment gateway is wired yet (see docs/LAUNCH_READINESS.md).");
  return lines.join("\n");
}

router.post("/orders", async (req, res) => {
  const user = await getSessionUser(req);
  if (!user) {
    res.status(401).json({ error: "Log in to place an order." });
    return;
  }

  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Your cart looks empty or invalid." });
    return;
  }

  const { pickupName, note, items, fulfillmentType, address, scheduledFor } = parsed.data;

  const settings = await getStoreSettings();
  if (settings.orderingPaused) {
    res.status(400).json({ error: "Online ordering is paused right now — please call the store." });
    return;
  }

  // Price from the server-side catalog — the same rule for both fulfillment types.
  const pricing = await priceItems(items);
  if ("error" in pricing) {
    res.status(400).json({ error: pricing.error });
    return;
  }
  const pricedItems = pricing.items;
  const subtotalCents = pricedItems.reduce((sum, i) => sum + i.unitPriceCents * i.qty, 0);

  // ---------------------------------------------------------------- Delivery
  if (fulfillmentType === "delivery") {
    if (!address || !scheduledFor) {
      res.status(400).json({ error: "Delivery needs a full address and a time slot." });
      return;
    }

    // Re-geocode and re-check eligibility server-side — never trust the fee or
    // distance the browser saw at quote time.
    const coords = await geocodeAddress(address);
    if (!coords) {
      res.status(422).json({ error: "We couldn't verify that address. Check it, or choose pickup." });
      return;
    }
    const { eligible, distanceMeters, deliveryFeeCents } = evaluateDelivery(coords);
    if (!eligible) {
      res.status(400).json({ error: "That address is outside our delivery range. Pickup is still available." });
      return;
    }

    if (subtotalCents < DELIVERY_CONFIG.minimumOrderCents) {
      res.status(400).json({
        error: `Delivery orders have a ${dollars(DELIVERY_CONFIG.minimumOrderCents)} minimum. Add a little more to your cart.`,
      });
      return;
    }

    // The chosen slot must be one we currently offer (enforces hours + lead time).
    const slotMs = scheduledFor.getTime();
    if (!generateSlots(new Date()).some((s) => s.startMs === slotMs)) {
      res.status(400).json({ error: "That delivery time is no longer available. Pick another slot." });
      return;
    }

    try {
      const created = await db.transaction(async (tx) => {
        // Serialize concurrent bookings for this exact slot so capacity can't
        // be oversold. The lock releases automatically at commit/rollback.
        await tx.execute(sql`select pg_advisory_xact_lock(${slotMs}::bigint)`);

        const [{ count }] = await tx
          .select({ count: sql<number>`count(*)::int` })
          .from(ordersTable)
          .where(
            and(eq(ordersTable.fulfillmentType, "delivery"), eq(ordersTable.scheduledFor, scheduledFor)),
          );
        if (count >= DELIVERY_CONFIG.slotCapacity) throw new SlotFullError();

        const [order] = await tx
          .insert(ordersTable)
          .values({ userId: user.id, fulfillmentType: "delivery", pickupName, note, subtotalCents, scheduledFor })
          .returning();

        const insertedItems = await tx
          .insert(orderItemsTable)
          .values(pricedItems.map((i) => ({ orderId: order.id, ...i })))
          .returning();

        await tx.insert(orderDeliveriesTable).values({
          orderId: order.id,
          line1: address.line1,
          line2: address.line2 ?? null,
          city: address.city,
          state: address.state,
          zip: address.zip,
          lat: coords.lat,
          lng: coords.lng,
          distanceMeters,
          deliveryFeeCents,
        });

        return { order, items: insertedItems };
      });

      const delivery: OrderDeliveryView = {
        line1: address.line1,
        line2: address.line2 ?? null,
        city: address.city,
        state: address.state,
        zip: address.zip,
        distanceMeters,
        deliveryFeeCents,
        deliveryStatus: "unassigned",
        driverId: null,
        driverName: null,
      };

      await sendBusinessEmail(
        `New delivery order #${created.order.id} — ${pickupName}`,
        formatDeliveryTicket(created.order, created.items, delivery),
      );

      res.status(201).json(CreateOrderResponse.parse({ ...created.order, items: created.items, delivery }));
    } catch (e) {
      if (e instanceof SlotFullError) {
        res.status(409).json({ error: "That slot just filled up. Please pick another time." });
        return;
      }
      throw e;
    }
    return;
  }

  // ------------------------------------------------------------------ Pickup
  const pickupEta = new Date(Date.now() + PICKUP_MINUTES * 60 * 1000);

  const [order] = await db
    .insert(ordersTable)
    .values({ userId: user.id, fulfillmentType: "pickup", pickupName, note, subtotalCents, pickupEta })
    .returning();

  const insertedItems = await db
    .insert(orderItemsTable)
    .values(pricedItems.map((i) => ({ orderId: order.id, ...i })))
    .returning();

  // Interim kitchen-visibility path (see docs/LAUNCH_READINESS.md Phase 2
  // gates) — email plus the /admin board, until a direct Heartland order API
  // is confirmed.
  await sendBusinessEmail(`New order #${order.id} — ${pickupName}`, formatTicket(order, insertedItems));

  res.status(201).json(CreateOrderResponse.parse({ ...order, items: insertedItems, delivery: null }));
});

router.get("/orders/mine", async (req, res) => {
  const user = await getSessionUser(req);
  if (!user) {
    res.status(401).json({ error: "Log in to see your orders." });
    return;
  }

  const orders = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.userId, user.id))
    .orderBy(desc(ordersTable.createdAt));

  const deliveries = await deliveriesByOrderId(orders.map((o) => o.id));
  const withItems = await Promise.all(
    orders.map(async (order) => {
      const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, order.id));
      return { ...order, items, delivery: deliveries.get(order.id) ?? null };
    }),
  );

  res.json(GetMyOrdersResponse.parse(withItems));
});

router.post("/orders/:id/pay", async (req, res) => {
  const user = await getSessionUser(req);
  if (!user) {
    res.status(401).json({ error: "Log in to pay for your order." });
    return;
  }

  const params = PayOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid order id." });
    return;
  }

  const [order] = await db
    .select()
    .from(ordersTable)
    .where(and(eq(ordersTable.id, params.data.id), eq(ordersTable.userId, user.id)))
    .limit(1);
  if (!order) {
    res.status(404).json({ error: "Order not found." });
    return;
  }
  if (order.fulfillmentType !== "delivery") {
    res.status(400).json({ error: "This order is pay-at-store; no online payment needed." });
    return;
  }

  const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, order.id));
  const delivery = (await deliveriesByOrderId([order.id])).get(order.id) ?? null;

  // Idempotent: never charge an already-paid order again.
  if (order.paymentStatus === "paid") {
    res.json(PayOrderResponse.parse({ ...order, items, delivery }));
    return;
  }

  const amountCents = order.subtotalCents + (delivery?.deliveryFeeCents ?? 0);
  const result = await chargeOrder({ orderId: order.id, amountCents });

  if (result.status !== "paid") {
    await db.update(ordersTable).set({ paymentStatus: "failed" }).where(eq(ordersTable.id, order.id));
    res.status(402).json({ error: "Payment could not be completed. Please try again." });
    return;
  }

  // Conditional on still-pending so a concurrent pay can't double-apply.
  const [updated] = await db
    .update(ordersTable)
    .set({ paymentStatus: "paid", paymentRef: result.ref })
    .where(and(eq(ordersTable.id, order.id), eq(ordersTable.paymentStatus, "pending")))
    .returning();

  res.json(PayOrderResponse.parse({ ...(updated ?? order), paymentStatus: "paid", items, delivery }));
});

export default router;
