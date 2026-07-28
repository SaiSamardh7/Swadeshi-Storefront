import { eq, inArray } from "drizzle-orm";
import { db, orderDeliveriesTable, driversTable } from "@workspace/db";

// The delivery shape returned on an Order (matches the OrderDelivery schema).
// Coordinates are intentionally omitted — clients don't need them.
export type OrderDeliveryView = {
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  zip: string;
  distanceMeters: number;
  deliveryFeeCents: number;
  deliveryStatus: string;
  driverId: number | null;
  driverName: string | null;
};

// Batch-fetch delivery details (plus the assigned driver's name) for a set of
// order ids, so list endpoints avoid an N+1 query.
export async function deliveriesByOrderId(
  orderIds: number[],
): Promise<Map<number, OrderDeliveryView>> {
  const map = new Map<number, OrderDeliveryView>();
  if (orderIds.length === 0) return map;

  const rows = await db
    .select({
      orderId: orderDeliveriesTable.orderId,
      line1: orderDeliveriesTable.line1,
      line2: orderDeliveriesTable.line2,
      city: orderDeliveriesTable.city,
      state: orderDeliveriesTable.state,
      zip: orderDeliveriesTable.zip,
      distanceMeters: orderDeliveriesTable.distanceMeters,
      deliveryFeeCents: orderDeliveriesTable.deliveryFeeCents,
      deliveryStatus: orderDeliveriesTable.deliveryStatus,
      driverId: orderDeliveriesTable.driverId,
      driverName: driversTable.name,
    })
    .from(orderDeliveriesTable)
    .leftJoin(driversTable, eq(orderDeliveriesTable.driverId, driversTable.id))
    .where(inArray(orderDeliveriesTable.orderId, orderIds));

  for (const r of rows) {
    map.set(r.orderId, {
      line1: r.line1,
      line2: r.line2,
      city: r.city,
      state: r.state,
      zip: r.zip,
      distanceMeters: r.distanceMeters,
      deliveryFeeCents: r.deliveryFeeCents,
      deliveryStatus: r.deliveryStatus,
      driverId: r.driverId,
      driverName: r.driverName ?? null,
    });
  }
  return map;
}
