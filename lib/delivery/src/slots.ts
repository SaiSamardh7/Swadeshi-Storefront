import { DELIVERY_CONFIG, STORE_HOURS, STORE_TIMEZONE } from "./config";

export type SlotWindow = { startMs: number; endMs: number };

const MINUTE_MS = 60_000;
const DAY_MS = 24 * 60 * 60_000;

type YMD = { year: number; month: number; day: number };

// The store timezone's offset (localMs - utcMs) at a given instant. Uses Intl
// so DST is handled without a date library.
function tzOffsetMs(utcMs: number, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const map: Record<string, number> = {};
  for (const p of dtf.formatToParts(new Date(utcMs))) {
    if (p.type !== "literal") map[p.type] = Number(p.value);
  }
  const asUtc = Date.UTC(map.year, map.month - 1, map.day, map.hour, map.minute, map.second);
  return asUtc - utcMs;
}

// Epoch ms for a wall-clock time in `timeZone`. One offset correction is exact
// except inside the ~1hr/year DST-forward gap, which never contains store hours.
function zonedWallTimeToMs(ymd: YMD, minutesIntoDay: number, timeZone: string): number {
  const hour = Math.floor(minutesIntoDay / 60);
  const minute = minutesIntoDay % 60;
  const utcGuess = Date.UTC(ymd.year, ymd.month - 1, ymd.day, hour, minute);
  return utcGuess - tzOffsetMs(utcGuess, timeZone);
}

// The local (store-timezone) calendar date of an instant.
function localYMD(utcMs: number, timeZone: string): YMD {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const map: Record<string, number> = {};
  for (const p of dtf.formatToParts(new Date(utcMs))) {
    if (p.type !== "literal") map[p.type] = Number(p.value);
  }
  return { year: map.year, month: map.month, day: map.day };
}

// The weekday (0=Sun … 6=Sat) of a local date, via a noon anchor so no DST
// edge can push it to the wrong day.
function weekdayOf(ymd: YMD, timeZone: string): number {
  const noonMs = zonedWallTimeToMs(ymd, 12 * 60, timeZone);
  const name = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(
    new Date(noonMs),
  );
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(name);
}

/**
 * Generate candidate delivery slot windows starting from `now`, honoring store
 * hours, the window size, and the lead time. A window must both start after the
 * lead-time cutoff and finish before the store closes. Pure — no DB, no
 * capacity; the caller subtracts already-booked orders.
 */
export function generateSlots(now: Date): SlotWindow[] {
  const daysAhead = DELIVERY_CONFIG.slotDaysAhead;
  const windowMs = DELIVERY_CONFIG.slotWindowMinutes * MINUTE_MS;
  const earliestStartMs = now.getTime() + DELIVERY_CONFIG.leadTimeMinutes * MINUTE_MS;

  const slots: SlotWindow[] = [];
  const seenDates = new Set<string>();

  for (let d = 0; d <= daysAhead; d++) {
    const ymd = localYMD(now.getTime() + d * DAY_MS, STORE_TIMEZONE);
    const key = `${ymd.year}-${ymd.month}-${ymd.day}`;
    if (seenDates.has(key)) continue; // DST days can repeat a local date
    seenDates.add(key);

    const hours = STORE_HOURS[weekdayOf(ymd, STORE_TIMEZONE)];
    if (!hours) continue;

    // Last start that still finishes before close.
    const lastStartMin = hours.closeMin - DELIVERY_CONFIG.slotWindowMinutes;
    for (let m = hours.openMin; m <= lastStartMin; m += DELIVERY_CONFIG.slotWindowMinutes) {
      const startMs = zonedWallTimeToMs(ymd, m, STORE_TIMEZONE);
      if (startMs >= earliestStartMs) slots.push({ startMs, endMs: startMs + windowMs });
    }
  }

  return slots;
}
