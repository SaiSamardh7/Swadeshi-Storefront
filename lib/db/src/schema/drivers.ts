import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// In-house delivery drivers. Staff manage these from the admin board and assign
// one to a delivery; there is no separate driver-facing app in v1.
export const driversTable = pgTable("drivers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Driver = typeof driversTable.$inferSelect;
