// Self-check for the delivery geo helpers. No framework — uses node:test.
// Run it (tsx resolves the workspace's extensionless TS imports) with:
//   pnpm --filter @workspace/scripts exec node --import tsx --test <path>/geo.test.ts
// These are pure functions — no DB, no network.
import assert from "node:assert/strict";
import { test } from "node:test";
import { haversineMeters, evaluateDelivery, distanceFromStoreMeters } from "./geo";
import { STORE_ORIGIN, DELIVERY_RADIUS_METERS, MILES_TO_METERS } from "./config";

// One degree of latitude ~ 111.195 km for the sphere radius we use.
const ONE_DEG_METERS = 111_194.9;

test("distance to the same point is zero", () => {
  assert.equal(haversineMeters(STORE_ORIGIN, STORE_ORIGIN), 0);
  assert.equal(distanceFromStoreMeters(STORE_ORIGIN), 0);
});

test("haversine matches a known one-degree span within tolerance", () => {
  const d = haversineMeters({ lat: 0, lng: 0 }, { lat: 0, lng: 1 });
  assert.ok(Math.abs(d - ONE_DEG_METERS) < 50, `got ${d}m, expected ~${ONE_DEG_METERS}m`);
});

test("the radius really is 5 miles", () => {
  assert.ok(Math.abs(DELIVERY_RADIUS_METERS - 5 * MILES_TO_METERS) < 1e-6);
});

test("a point just inside 5 miles is eligible; just outside is not", () => {
  // ~0.05 deg north of the store ≈ 5.56 km (< 8.05 km radius).
  const inside = evaluateDelivery({ lat: STORE_ORIGIN.lat + 0.05, lng: STORE_ORIGIN.lng });
  assert.equal(inside.eligible, true);
  assert.ok(inside.distanceMeters < DELIVERY_RADIUS_METERS);

  // ~0.10 deg north ≈ 11.12 km (> radius).
  const outside = evaluateDelivery({ lat: STORE_ORIGIN.lat + 0.1, lng: STORE_ORIGIN.lng });
  assert.equal(outside.eligible, false);
  assert.ok(outside.distanceMeters > DELIVERY_RADIUS_METERS);
});

test("distance and fee are always returned, fee is a whole number of cents", () => {
  const r = evaluateDelivery({ lat: STORE_ORIGIN.lat + 0.01, lng: STORE_ORIGIN.lng });
  assert.equal(Number.isInteger(r.distanceMeters), true);
  assert.equal(Number.isInteger(r.deliveryFeeCents), true);
});
