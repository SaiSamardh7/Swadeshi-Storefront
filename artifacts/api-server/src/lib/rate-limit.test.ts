// Self-check for the rate limiter. No framework: run it with
//   node --experimental-strip-types --test src/lib/rate-limit.test.ts
// from artifacts/api-server. rate-limit.ts imports only erased types, so this
// runs without a build step or a database.
import assert from "node:assert/strict";
import { test } from "node:test";
import { allow, resetRateLimits } from "./rate-limit.ts";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

test("lets the first `limit` hits through and blocks the next", () => {
  resetRateLimits();
  assert.equal(allow("a", 3, 60_000), true);
  assert.equal(allow("a", 3, 60_000), true);
  assert.equal(allow("a", 3, 60_000), true);
  assert.equal(allow("a", 3, 60_000), false, "4th hit in the window must be refused");
  assert.equal(allow("a", 3, 60_000), false, "still refused while the window is open");
});

test("keys are independent", () => {
  resetRateLimits();
  assert.equal(allow("x", 1, 60_000), true);
  assert.equal(allow("x", 1, 60_000), false);
  assert.equal(allow("y", 1, 60_000), true, "one caller must not consume another's budget");
});

test("the window reopens once it expires", async () => {
  resetRateLimits();
  assert.equal(allow("z", 1, 20), true);
  assert.equal(allow("z", 1, 20), false);
  await sleep(35);
  assert.equal(allow("z", 1, 20), true, "budget must refill after the window passes");
});
