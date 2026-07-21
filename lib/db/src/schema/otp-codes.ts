import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// One pending code per phone at a time — a new request overwrites the old one.
export const otpCodesTable = pgTable("otp_codes", {
  phone: text("phone").primaryKey(),
  codeHash: text("code_hash").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  attempts: integer("attempts").notNull().default(0),
  sentAt: timestamp("sent_at").notNull(),
});

export type OtpCode = typeof otpCodesTable.$inferSelect;
