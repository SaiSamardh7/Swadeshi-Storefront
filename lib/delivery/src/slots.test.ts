// Self-check for delivery slot generation. Pure — no DB, no network.
// Run it (tsx resolves the workspace's extensionless imports) with:
//   pnpm --filter @workspace/scripts exec node --import tsx --test <path>/slots.test.ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { generateSlots } from "./slots";
import { DELIVERY_CONFIG, STORE_TIMEZONE } from "./config";

// Fixed anchor: Wed 2026-07-15, 09:00 America/Chicago (CDT = UTC-5).
const NOW = new Date("2026-07-15T14:00:00Z");

function localMinutes(ms: number): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: STORE_TIMEZONE,
    hourCycle: "h23",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(new Date(ms));
  const map: Record<string, number> = {};
  for (const p of parts) if (p.type !== "literal") map[p.type] = Number(p.value);
  return map.hour * 60 + map.minute;
}

function localDateKey(ms: number): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: STORE_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(ms));
}

test("every slot is a 30-minute window on a half-hour boundary within hours", () => {
  const slots = generateSlots(NOW);
  assert.ok(slots.length > 0);
  for (const s of slots) {
    assert.equal(s.endMs - s.startMs, DELIVERY_CONFIG.slotWindowMinutes * 60_000);
    const startMin = localMinutes(s.startMs);
    assert.equal(startMin % 30, 0, "starts on a half hour");
    assert.ok(startMin >= 8 * 60, "not before 8:00 open");
    // Latest start finishes by 11:00 PM close at the widest (Fri/Sat).
    assert.ok(startMin <= 23 * 60 - DELIVERY_CONFIG.slotWindowMinutes);
  }
});

test("the first slot respects the lead time", () => {
  const slots = generateSlots(NOW);
  const earliest = NOW.getTime() + DELIVERY_CONFIG.leadTimeMinutes * 60_000;
  assert.ok(Math.min(...slots.map((s) => s.startMs)) >= earliest);
  // 09:00 + 45m lead = 09:45 → first same-day slot is 10:00 local.
  const today = localDateKey(NOW.getTime());
  const todaySlots = slots.filter((s) => localDateKey(s.startMs) === today);
  assert.equal(localMinutes(todaySlots[0].startMs), 10 * 60);
});

test("a full future day opens at 8:00 (lead time doesn't bind)", () => {
  const slots = generateSlots(NOW);
  assert.ok(slots.some((s) => localMinutes(s.startMs) === 8 * 60), "an 8:00 slot exists");
});

test("slots span multiple days out to slotDaysAhead", () => {
  const slots = generateSlots(NOW);
  const days = new Set(slots.map((s) => localDateKey(s.startMs)));
  assert.ok(days.size >= 2, "more than one day offered");
  assert.ok(days.size <= DELIVERY_CONFIG.slotDaysAhead + 1);
});

test("slots are chronologically valid (end after start, no zero-length)", () => {
  for (const s of generateSlots(NOW)) assert.ok(s.endMs > s.startMs);
});
