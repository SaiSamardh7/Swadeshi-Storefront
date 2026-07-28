// Self-check for the zip-based dev geocoder + eligibility, with no Maps key set.
// Run it (tsx resolves the workspace's extensionless imports) with:
//   pnpm --filter @workspace/scripts exec node --import tsx --test <path>/geocode.test.ts
import assert from "node:assert/strict";
import { test, before } from "node:test";
import { evaluateDelivery } from "@workspace/delivery";
import { geocodeAddress } from "./geocode";

before(() => {
  // Force the dev fallback regardless of the caller's environment.
  delete process.env.GOOGLE_MAPS_API_KEY;
});

const addr = (zip: string) => ({
  line1: "1 Test St",
  city: "Frisco",
  state: "TX",
  zip,
});

test("the store's own zip geocodes and is eligible", async () => {
  const coords = await geocodeAddress(addr("75035"));
  assert.ok(coords, "store zip should resolve");
  assert.equal(evaluateDelivery(coords!).eligible, true);
});

test("a far zip resolves but is outside the 5-mile radius", async () => {
  const coords = await geocodeAddress(addr("75078")); // Prosper
  assert.ok(coords, "known far zip should still resolve");
  assert.equal(evaluateDelivery(coords!).eligible, false);
});

test("an unknown zip fails closed (null)", async () => {
  const coords = await geocodeAddress(addr("99999"));
  assert.equal(coords, null);
});

test("a zip+4 is handled by its 5-digit prefix", async () => {
  const coords = await geocodeAddress(addr("75035-1234"));
  assert.ok(coords);
});
