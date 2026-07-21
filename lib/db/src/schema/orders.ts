import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

// ponytail: no payment/kitchen-routing integration yet — pickup + pay-at-store
// only (see docs/LAUNCH_READINESS.md Phase 2 gates). Status is staff-driven
// from the admin board, not from a payment or POS webhook.
export const ORDER_STATUSES = ["new", "preparing", "ready", "picked_up"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  status: text("status", { enum: ORDER_STATUSES }).notNull().default("new"),
  pickupName: text("pickup_name").notNull(),
  note: text("note"),
  subtotalCents: integer("subtotal_cents").notNull(),
  pickupEta: timestamp("pickup_eta").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({
  id: true,
  status: true,
  createdAt: true,
});
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
