import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

// ponytail: no payment/kitchen-routing integration yet — pickup + pay-at-store
// only (see docs/LAUNCH_READINESS.md Phase 2 gates). Status is staff-driven
// from the admin board, not from a payment or POS webhook.
export const ORDER_STATUSES = ["new", "preparing", "ready", "picked_up"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

// Pickup is the original flow; delivery is the in-house delivery feature.
export const FULFILLMENT_TYPES = ["pickup", "delivery"] as const;
export type FulfillmentType = (typeof FULFILLMENT_TYPES)[number];

// Prepay lifecycle. Real charging is gated on a payment gateway (see
// docs/LAUNCH_READINESS.md); until then delivery orders move through this via
// the payment stub. Pickup orders pay at the store, so it stays "pending".
export const PAYMENT_STATUSES = ["pending", "paid", "failed"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  status: text("status", { enum: ORDER_STATUSES }).notNull().default("new"),
  fulfillmentType: text("fulfillment_type", { enum: FULFILLMENT_TYPES }).notNull().default("pickup"),
  // Recipient name — the person picking up or receiving the delivery.
  pickupName: text("pickup_name").notNull(),
  note: text("note"),
  subtotalCents: integer("subtotal_cents").notNull(),
  // Exactly one is set per fulfillmentType: pickup uses pickupEta (ASAP ETA);
  // delivery uses scheduledFor (the chosen slot start).
  pickupEta: timestamp("pickup_eta"),
  scheduledFor: timestamp("scheduled_for"),
  paymentStatus: text("payment_status", { enum: PAYMENT_STATUSES }).notNull().default("pending"),
  paymentRef: text("payment_ref"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({
  id: true,
  status: true,
  paymentStatus: true,
  paymentRef: true,
  createdAt: true,
});
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
