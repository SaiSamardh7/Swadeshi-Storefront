import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Catering leads from the website quote builder. Unlike orders these are
// inquiries, not committed sales — the totals stored here are the estimate the
// customer was shown, and staff confirm the real price when they follow up.
export const CATERING_STATUSES = ["new", "contacted", "quoted", "closed"] as const;
export type CateringStatus = (typeof CATERING_STATUSES)[number];

export const cateringRequestsTable = pgTable("catering_requests", {
  id: serial("id").primaryKey(),
  status: text("status", { enum: CATERING_STATUSES }).notNull().default("new"),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  eventDate: text("event_date").notNull(),
  eventType: text("event_type").notNull(),
  guestCount: integer("guest_count").notNull(),
  note: text("note"),
  // Server-computed from the tray catalog, never trusted from the browser.
  estimateCents: integer("estimate_cents").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const cateringRequestItemsTable = pgTable("catering_request_items", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id")
    .notNull()
    .references(() => cateringRequestsTable.id, { onDelete: "cascade" }),
  trayId: text("tray_id").notNull(),
  name: text("name").notNull(),
  size: text("size", { enum: ["half", "full"] }).notNull(),
  qty: integer("qty").notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(),
});

export type CateringRequest = typeof cateringRequestsTable.$inferSelect;
export type CateringRequestItem = typeof cateringRequestItemsTable.$inferSelect;
