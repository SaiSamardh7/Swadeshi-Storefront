import { Router, type IRouter } from "express";
import { and, eq, gte } from "drizzle-orm";
import {
  QuoteDeliveryBody,
  QuoteDeliveryResponse,
  GetDeliverySlotsResponse,
} from "@workspace/api-zod";
import { evaluateDelivery, generateSlots, DELIVERY_CONFIG } from "@workspace/delivery";
import { db, ordersTable } from "@workspace/db";
import { geocodeAddress } from "../lib/geocode";
import { rateLimited } from "../lib/rate-limit";
import { getStoreSettings } from "../lib/store-state";

const router: IRouter = Router();

router.post("/delivery/quote", async (req, res) => {
  // Unauthenticated, and every call may hit the paid geocoding API — cap it
  // well above real use but below scripted abuse.
  if (rateLimited(req, res, "delivery-quote", 30, 10 * 60 * 1000)) return;

  const parsed = QuoteDeliveryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Enter your full delivery address." });
    return;
  }

  // Geocode server-side; fail closed if the address can't be verified so we
  // never quote delivery to a place we couldn't locate.
  const coords = await geocodeAddress(parsed.data);
  if (!coords) {
    res.status(422).json({ error: "We couldn't verify that address. Check it, or choose pickup." });
    return;
  }

  const { eligible, distanceMeters, deliveryFeeCents } = evaluateDelivery(coords);
  res.json(
    QuoteDeliveryResponse.parse({
      eligible,
      distanceMeters,
      deliveryFeeCents,
      minimumOrderCents: DELIVERY_CONFIG.minimumOrderCents,
    }),
  );
});

router.get("/delivery/slots", async (_req, res) => {
  // No slots while ordering is paused, same switch pickup honors.
  const settings = await getStoreSettings();
  if (settings.orderingPaused) {
    res.json(GetDeliverySlotsResponse.parse([]));
    return;
  }

  const slots = generateSlots(new Date());
  if (slots.length === 0) {
    res.json(GetDeliverySlotsResponse.parse([]));
    return;
  }

  // Count committed delivery orders per window start. Orders snap scheduledFor
  // to a slot start (enforced when an order is created), so an exact-timestamp
  // match buckets them correctly.
  const earliest = new Date(Math.min(...slots.map((s) => s.startMs)));
  const booked = await db
    .select({ scheduledFor: ordersTable.scheduledFor })
    .from(ordersTable)
    .where(and(eq(ordersTable.fulfillmentType, "delivery"), gte(ordersTable.scheduledFor, earliest)));

  const counts = new Map<number, number>();
  for (const row of booked) {
    if (!row.scheduledFor) continue;
    const t = row.scheduledFor.getTime();
    counts.set(t, (counts.get(t) ?? 0) + 1);
  }

  const available = slots
    .map((s) => ({
      startsAt: new Date(s.startMs),
      endsAt: new Date(s.endMs),
      remaining: DELIVERY_CONFIG.slotCapacity - (counts.get(s.startMs) ?? 0),
    }))
    .filter((s) => s.remaining > 0);

  res.json(GetDeliverySlotsResponse.parse(available));
});

export default router;
