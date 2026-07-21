import { randomBytes } from "node:crypto";
import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db, sessionsTable, usersTable, type User } from "@workspace/db";

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? "swadeshi_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function cookieOptions() {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}

export async function createSession(userId: number): Promise<string> {
  const token = randomBytes(32).toString("hex");
  await db.insert(sessionsTable).values({
    token,
    userId,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS),
  });
  return token;
}

export function setSessionCookie(res: Response, token: string): void {
  res.cookie(COOKIE_NAME, token, { ...cookieOptions(), maxAge: SESSION_TTL_MS });
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME, cookieOptions());
}

export async function getSessionUser(req: Request): Promise<User | null> {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;

  const [row] = await db
    .select({ user: usersTable, expiresAt: sessionsTable.expiresAt })
    .from(sessionsTable)
    .innerJoin(usersTable, eq(sessionsTable.userId, usersTable.id))
    .where(eq(sessionsTable.token, token))
    .limit(1);

  if (!row) return null;
  if (row.expiresAt < new Date()) {
    await db.delete(sessionsTable).where(eq(sessionsTable.token, token));
    return null;
  }
  return row.user;
}

export async function destroySession(req: Request): Promise<void> {
  const token = req.cookies?.[COOKIE_NAME];
  if (token) await db.delete(sessionsTable).where(eq(sessionsTable.token, token));
}
