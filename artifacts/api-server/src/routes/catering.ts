import { Router, type IRouter } from "express";
import { CreateCateringRequestBody, CreateCateringRequestResponse } from "@workspace/api-zod";
import {
  db,
  cateringRequestsTable,
  cateringRequestItemsTable,
  type CateringRequest,
  type CateringRequestItem,
} from "@workspace/db";
import { getCateringTray, trayPriceCents } from "@workspace/menu";
import { sendBusinessEmail } from "../lib/mailer";
import { rateLimited } from "../lib/rate-limit";

const router: IRouter = Router();

function formatLead(request: CateringRequest, items: CateringRequestItem[]): string {
  const lines = [
    `New catering request #${request.id} — ${request.eventType}`,
    "",
    `Name:    ${request.name}`,
    `Phone:   ${request.phone}`,
    `Email:   ${request.email}`,
    `Date:    ${request.eventDate}`,
    `Guests:  ${request.guestCount}`,
    "",
    "Requested trays:",
    ...items.map(
      (i) =>
        `  ${i.qty}x ${i.name} (${i.size} tray) — $${(i.unitPriceCents / 100).toFixed(2)} each`,
    ),
    "",
    `Estimate shown to customer: $${(request.estimateCents / 100).toFixed(2)}`,
  ];
  if (request.note) lines.push("", `Notes: ${request.note}`);
  lines.push(
    "",
    "This is an estimate from the website quote builder — confirm final pricing,",
    "tray sizes, and lead time with the customer before quoting.",
  );
  return lines.join("\n");
}

router.post("/catering/requests", async (req, res) => {
  // Unauthenticated, and every accepted request writes rows and emails the
  // owner — so cap it well above real demand (a few inquiries a day) but far
  // below what a script would send.
  if (rateLimited(req, res, "catering", 10, 10 * 60 * 1000)) return;

  const parsed = CreateCateringRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Please fill in every required field and pick at least one tray." });
    return;
  }

  const { name, phone, email, eventDate, eventType, guestCount, note, items } = parsed.data;

  // Price from the server-side tray catalog — the browser only sends ids,
  // sizes, and quantities, same rule the food ordering flow follows.
  const priced = items.map((i) => {
    const tray = getCateringTray(i.trayId);
    if (!tray) return null;
    return {
      trayId: i.trayId,
      name: tray.name,
      size: i.size,
      qty: i.qty,
      unitPriceCents: trayPriceCents(tray, i.size),
    };
  });
  if (priced.some((i) => i === null)) {
    res.status(400).json({ error: "One or more trays are no longer offered." });
    return;
  }
  const pricedItems = priced as NonNullable<(typeof priced)[number]>[];

  const estimateCents = pricedItems.reduce((sum, i) => sum + i.unitPriceCents * i.qty, 0);

  const [request] = await db
    .insert(cateringRequestsTable)
    .values({ name, phone, email, eventDate, eventType, guestCount, note, estimateCents })
    .returning();

  const insertedItems = await db
    .insert(cateringRequestItemsTable)
    .values(pricedItems.map((i) => ({ requestId: request.id, ...i })))
    .returning();

  await sendBusinessEmail(
    `Catering request #${request.id} — ${name} (${guestCount} guests)`,
    formatLead(request, insertedItems),
  );

  res.status(201).json(CreateCateringRequestResponse.parse({ ...request, items: insertedItems }));
});

export default router;
