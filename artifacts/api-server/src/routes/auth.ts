import { Router, type IRouter } from "express";
import {
  RequestCodeBody,
  RequestCodeResponse,
  VerifyCodeBody,
  VerifyCodeResponse,
  GetMeResponse,
  LogoutResponse,
} from "@workspace/api-zod";
import { db, usersTable } from "@workspace/db";
import { issueCode, verifyCode, isResendTooSoon } from "../lib/otp";
import { sendOtpSms } from "../lib/sms";
import {
  createSession,
  setSessionCookie,
  clearSessionCookie,
  getSessionUser,
  destroySession,
} from "../lib/session";

const router: IRouter = Router();

const PHONE_RE = /^\+[1-9]\d{7,14}$/; // E.164

router.post("/auth/request-code", async (req, res) => {
  const parsed = RequestCodeBody.safeParse(req.body);
  if (!parsed.success || !PHONE_RE.test(parsed.data.phone)) {
    res.status(400).json({ error: "Enter a valid phone number, e.g. +14692943500." });
    return;
  }

  const { phone } = parsed.data;
  if (await isResendTooSoon(phone)) {
    res.status(429).json({ error: "We just sent a code. Wait a minute before asking for another." });
    return;
  }

  const code = await issueCode(phone);
  await sendOtpSms(phone, code);
  res.json(RequestCodeResponse.parse({ ok: true }));
});

router.post("/auth/verify-code", async (req, res) => {
  const parsed = VerifyCodeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(401).json({ error: "That code is invalid or expired. Request a new one." });
    return;
  }

  const { phone, code } = parsed.data;
  const ok = await verifyCode(phone, code);
  if (!ok) {
    res.status(401).json({ error: "That code is invalid or expired. Request a new one." });
    return;
  }

  const [user] = await db
    .insert(usersTable)
    .values({ phone })
    .onConflictDoUpdate({ target: usersTable.phone, set: { phone } })
    .returning();

  const token = await createSession(user.id);
  setSessionCookie(res, token);
  res.json(VerifyCodeResponse.parse({ user: { id: user.id, phone: user.phone, name: user.name } }));
});

router.get("/auth/me", async (req, res) => {
  const user = await getSessionUser(req);
  res.json(GetMeResponse.parse({ user: user ? { id: user.id, phone: user.phone, name: user.name } : null }));
});

router.post("/auth/logout", async (req, res) => {
  await destroySession(req);
  clearSessionCookie(res);
  res.json(LogoutResponse.parse({ ok: true }));
});

export default router;
