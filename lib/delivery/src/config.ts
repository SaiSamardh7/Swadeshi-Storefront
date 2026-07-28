// ===========================================================================
//  DELIVERY RULES — CONFIG, NOT HARD-CODE
// ===========================================================================
//  Single source of truth for the in-house delivery rules. Both the storefront
//  (messaging: "we deliver within 5 miles", fee preview) and the API server
//  (authoritative eligibility + fee) read these, so the two can never drift.
//
//  The delivery RADIUS is a firm business rule: 5 miles from the store.
//
//  `feeCents`, `minimumOrderCents`, and the slot/capacity numbers below are
//  starting values — confirm with the owner before go-live. When ops needs to
//  change them without a redeploy, layer a `delivery_settings` row over these
//  defaults (the same pattern store_settings/menu_overrides use over the static
//  menu). Prices are in CENTS to match the rest of the codebase.
// ===========================================================================

export type LatLng = { lat: number; lng: number };

export const MILES_TO_METERS = 1609.344;

/** Firm business rule: deliver within 5 miles of the store. */
export const DELIVERY_RADIUS_MILES = 5;
export const DELIVERY_RADIUS_METERS = DELIVERY_RADIUS_MILES * MILES_TO_METERS;

// APPROXIMATE store coordinates for Swadeshi Plaza of Frisco
// (14300 State Hwy 121 #100, Frisco, TX 75035). VERIFY before go-live by
// geocoding BUSINESS.address once the Google Maps key is wired — the radius
// check is only as accurate as this origin.
export const STORE_ORIGIN: LatLng = { lat: 33.1035, lng: -96.811 };

export const DELIVERY_CONFIG = {
  origin: STORE_ORIGIN,
  radiusMeters: DELIVERY_RADIUS_METERS,
  // Flat delivery fee for now. PLACEHOLDER — confirm with owner.
  feeCents: 499,
  // Minimum cart subtotal required for delivery. PLACEHOLDER — confirm.
  minimumOrderCents: 2000,
  // Scheduled-slot rules.
  slotWindowMinutes: 30,
  slotCapacity: 4,
  // Earliest a slot may start relative to "now" (kitchen prep + dispatch).
  leadTimeMinutes: 45,
  // How many days ahead of today to offer delivery slots.
  slotDaysAhead: 3,
} as const;

// All slot math is done in the store's wall-clock time.
export const STORE_TIMEZONE = "America/Chicago";

// Machine-readable open/close per weekday, as minutes since local midnight.
// MUST mirror the posted hours in the storefront's business.ts (currently
// Sun–Thu 8:00 AM–10:00 PM, Fri–Sat 8:00 AM–11:00 PM) — that free-text list is
// the source of truth; keep this in sync when hours change.
export type DayHours = { openMin: number; closeMin: number };

const H = (hour: number): number => hour * 60;

// Weekday index matches JS Date.getDay(): 0 = Sunday … 6 = Saturday.
export const STORE_HOURS: Record<number, DayHours> = {
  0: { openMin: H(8), closeMin: H(22) }, // Sunday
  1: { openMin: H(8), closeMin: H(22) }, // Monday
  2: { openMin: H(8), closeMin: H(22) }, // Tuesday
  3: { openMin: H(8), closeMin: H(22) }, // Wednesday
  4: { openMin: H(8), closeMin: H(22) }, // Thursday
  5: { openMin: H(8), closeMin: H(23) }, // Friday
  6: { openMin: H(8), closeMin: H(23) }, // Saturday
};
