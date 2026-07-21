import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Staff-set overrides layered on top of the static menu catalog in
// @workspace/menu. A row exists only while an item differs from the printed
// menu (sold out and/or repriced); resetting an item deletes its row.
export const menuOverridesTable = pgTable("menu_overrides", {
  itemId: text("item_id").primaryKey(),
  soldOut: boolean("sold_out").notNull().default(false),
  priceCents: integer("price_cents"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type MenuOverride = typeof menuOverridesTable.$inferSelect;

// Single-row table (id always 1) for store-wide switches.
export const storeSettingsTable = pgTable("store_settings", {
  id: integer("id").primaryKey(),
  orderingPaused: boolean("ordering_paused").notNull().default(false),
});

export type StoreSettings = typeof storeSettingsTable.$inferSelect;
