import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { CreateOrderBody, CreateOrderResponse, GetMyOrdersResponse } from "@workspace/api-zod";
import { db, ordersTable, orderItemsTable, type Order, type OrderItem } from "@workspace/db";
import { getMenuItem } from "@workspace/menu";
import { getSessionUser } from "../lib/session";
import { getStoreSettings, listMenuOverrides } from "../lib/store-state";
import { sendBusinessEmail } from "../lib/mailer";

const router: IRouter = Router();

const PICKUP_MINUTES = 30;

function formatTicket(order: Order, items: OrderItem[]): string {
  const lines = [
    `New pickup order #${order.id} — ${order.pickupName}`,
    ...items.map((i) => `  ${i.qty}x ${i.name} — $${(i.unitPriceCents / 100).toFixed(2)} each`),
    `Subtotal: $${(order.subtotalCents / 100).toFixed(2)}`,
  ];
  if (order.note) lines.push(`Note: ${order.note}`);
  lines.push(
    `Pickup by: ${order.pickupEta.toLocaleTimeString("en-US", { timeZone: "America/Chicago" })}`,
    "Customer pays at pickup — no online payment collected.",
  );
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

  const { pickupName, note, items } = parsed.data;

  const settings = await getStoreSettings();
  if (settings.orderingPaused) {
    res.status(400).json({ error: "Online ordering is paused right now — please call the store." });
    return;
  }

  // Price from the server-side catalog — never trust a client-supplied name
  // or price for what becomes a real, pay-at-pickup order. Staff overrides
  // (sold out / repriced) win over the printed catalog.
  const overrides = new Map((await listMenuOverrides()).map((o) => [o.itemId, o]));
  const soldOutNames: string[] = [];
  const priced = items.map((i) => {
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
    res.status(400).json({ error: `Sold out today: ${soldOutNames.join(", ")}. Please remove from your cart.` });
    return;
  }
  if (priced.some((i) => i === null)) {
    res.status(400).json({ error: "One or more items are no longer on the menu." });
    return;
  }
  const pricedItems = priced as NonNullable<(typeof priced)[number]>[];

  const subtotalCents = pricedItems.reduce((sum, i) => sum + i.unitPriceCents * i.qty, 0);
  const pickupEta = new Date(Date.now() + PICKUP_MINUTES * 60 * 1000);

  const [order] = await db
    .insert(ordersTable)
    .values({ userId: user.id, pickupName, note, subtotalCents, pickupEta })
    .returning();

  const insertedItems = await db
    .insert(orderItemsTable)
    .values(pricedItems.map((i) => ({ orderId: order.id, ...i })))
    .returning();

  // Interim kitchen-visibility path (see docs/LAUNCH_READINESS.md Phase 2
  // gates) — email plus the /admin board, until a direct Heartland order API
  // is confirmed.
  await sendBusinessEmail(`New order #${order.id} — ${pickupName}`, formatTicket(order, insertedItems));

  res.status(201).json(CreateOrderResponse.parse({ ...order, items: insertedItems }));
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

  const withItems = await Promise.all(
    orders.map(async (order) => {
      const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, order.id));
      return { ...order, items };
    }),
  );

  res.json(GetMyOrdersResponse.parse(withItems));
});

export default router;
