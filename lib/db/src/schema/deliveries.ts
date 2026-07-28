import {
  doublePrecision,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { ordersTable } from "./orders";
import { driversTable } from "./drivers";

// Delivery status is separate from the order's kitchen status: an order can be
// "ready" while the delivery is still "assigned".
export const DELIVERY_STATUSES = [
  "unassigned",
  "assigned",
  "out_for_delivery",
  "delivered",
] as const;
export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];

// One row per delivery order (1:1 with an order). Kept out of the orders table
// so pickup orders stay clean and delivery concerns live in one place. The
// address is geocoded server-side; distance and fee are server-computed and
// never trusted from the browser.
export const orderDeliveriesTable = pgTable("order_deliveries", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => ordersTable.id, { onDelete: "cascade" }),
  line1: text("line1").notNull(),
  line2: text("line2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip: text("zip").notNull(),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  distanceMeters: integer("distance_meters").notNull(),
  deliveryFeeCents: integer("delivery_fee_cents").notNull(),
  driverId: integer("driver_id").references(() => driversTable.id, { onDelete: "set null" }),
  deliveryStatus: text("delivery_status", { enum: DELIVERY_STATUSES })
    .notNull()
    .default("unassigned"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type OrderDelivery = typeof orderDeliveriesTable.$inferSelect;
