import { createHash, randomInt } from "node:crypto";
import { eq } from "drizzle-orm";
import { db, otpCodesTable } from "@workspace/db";

const CODE_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
// Every send costs real money, and /auth/request-code is unauthenticated, so
// one phone can only pull a new SMS this often. Keyed by phone rather than IP
// so it holds behind a proxy, where every caller shares one address.
const RESEND_COOLDOWN_MS = 60 * 1000;

function hashCode(phone: string, code: string): string {
  return createHash("sha256").update(`${phone}:${code}`).digest("hex");
}

/** True when this phone asked for a code too recently to send another. */
export async function isResendTooSoon(phone: string): Promise<boolean> {
  const [row] = await db.select().from(otpCodesTable).where(eq(otpCodesTable.phone, phone)).limit(1);
  return row ? row.sentAt.getTime() + RESEND_COOLDOWN_MS > Date.now() : false;
}

export async function issueCode(phone: string): Promise<string> {
  const code = randomInt(100000, 1000000).toString();
  const now = new Date();
  const row = {
    phone,
    codeHash: hashCode(phone, code),
    expiresAt: new Date(now.getTime() + CODE_TTL_MS),
    attempts: 0,
    sentAt: now,
  };
  await db
    .insert(otpCodesTable)
    .values(row)
    .onConflictDoUpdate({ target: otpCodesTable.phone, set: row });
  return code;
}

export async function verifyCode(phone: string, code: string): Promise<boolean> {
  const [row] = await db.select().from(otpCodesTable).where(eq(otpCodesTable.phone, phone)).limit(1);
  if (!row) return false;

  if (row.expiresAt < new Date() || row.attempts >= MAX_ATTEMPTS) {
    await db.delete(otpCodesTable).where(eq(otpCodesTable.phone, phone));
    return false;
  }

  if (row.codeHash !== hashCode(phone, code)) {
    await db
      .update(otpCodesTable)
      .set({ attempts: row.attempts + 1 })
      .where(eq(otpCodesTable.phone, phone));
    return false;
  }

  await db.delete(otpCodesTable).where(eq(otpCodesTable.phone, phone)); // single-use
  return true;
}
