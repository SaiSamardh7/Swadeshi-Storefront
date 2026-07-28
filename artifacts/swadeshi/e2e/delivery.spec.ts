import { test, expect, type Page } from "@playwright/test";

// These tests drive the real storefront in a browser but mock every /api call,
// so no API server or database is needed. They validate the delivery checkout
// UI (Slice 5): pickup/delivery toggle, address quote, slot picker, prepay.

const USER = { id: 1, phone: "+14692943500", name: "Test Customer" };

const SLOT = { startsAt: "2026-07-27T20:00:00.000Z", endsAt: "2026-07-27T20:30:00.000Z", remaining: 4 };

const CART = [
  { id: "veg-appetizers-gobi-manchurian", name: "Gobi Manchurian", priceCents: 999, quantity: 3 },
];

const DELIVERY = {
  line1: "123 Main St",
  line2: null,
  city: "Frisco",
  state: "TX",
  zip: "75035",
  distanceMeters: 3000,
  deliveryFeeCents: 499,
  deliveryStatus: "unassigned",
  driverId: null,
  driverName: null,
};

function deliveryOrder(paymentStatus: "pending" | "paid") {
  return {
    id: 42,
    status: "new",
    fulfillmentType: "delivery",
    pickupName: "Test Customer",
    note: null,
    subtotalCents: 2997,
    pickupEta: null,
    scheduledFor: SLOT.startsAt,
    paymentStatus,
    createdAt: new Date().toISOString(),
    items: [{ id: 1, itemId: CART[0].id, name: CART[0].name, unitPriceCents: 999, qty: 3 }],
    delivery: DELIVERY,
  };
}

// Base mocks shared by every test; `quote` is overridable per test.
async function mockApi(page: Page, quote: Record<string, unknown>) {
  await page.route("**/api/auth/me", (r) => r.fulfill({ json: { user: USER } }));
  await page.route("**/api/menu/state", (r) =>
    r.fulfill({ json: { orderingPaused: false, overrides: [] } }),
  );
  await page.route("**/api/delivery/quote", (r) => r.fulfill({ json: quote }));
  await page.route("**/api/delivery/slots", (r) => r.fulfill({ json: [SLOT] }));
  await page.route("**/api/orders/*/pay", (r) => r.fulfill({ json: deliveryOrder("paid") }));
  await page.route("**/api/orders", (r) => r.fulfill({ status: 201, json: deliveryOrder("pending") }));
}

// Seed the cart (localStorage) and switch to the delivery tab.
async function openDeliveryCheckout(page: Page) {
  await page.addInitScript((cart) => {
    window.localStorage.setItem("swadeshi_cart", cart);
  }, JSON.stringify(CART));
  await page.goto("/checkout");
  await page.getByRole("button", { name: "delivery", exact: true }).click();
  await page.getByLabel("Street address").fill("123 Main St");
  await page.getByLabel("City").fill("Frisco");
  await page.getByLabel("State").fill("TX");
  await page.getByLabel("ZIP code").fill("75035");
  await page.getByRole("button", { name: "Check delivery availability" }).click();
}

test("delivery: address → quote → slot → place & pay", async ({ page }) => {
  await mockApi(page, {
    eligible: true,
    distanceMeters: 3000,
    deliveryFeeCents: 499,
    minimumOrderCents: 2000,
  });
  await openDeliveryCheckout(page);

  // Fee appears in the summary once eligible.
  await expect(page.getByText("Delivery fee")).toBeVisible();

  // Pick the first slot (slot buttons contain an en-dash between times).
  await page.getByRole("button", { name: /–/ }).first().click();

  await page.getByLabel("Name for delivery").fill("Test Customer");
  await page.getByRole("button", { name: /Place delivery order/ }).click();

  await expect(page.getByRole("heading", { name: "Delivery scheduled!" })).toBeVisible();
  await expect(page.getByText(/Paid/)).toBeVisible();
});

test("delivery: an out-of-range address is refused", async ({ page }) => {
  await mockApi(page, {
    eligible: false,
    distanceMeters: 20000,
    deliveryFeeCents: 499,
    minimumOrderCents: 2000,
  });
  await openDeliveryCheckout(page);

  await expect(page.getByText(/outside our 5-mile delivery range/)).toBeVisible();
  // No slots offered, so the place button stays disabled.
  await expect(page.getByRole("button", { name: /Place delivery order/ })).toBeDisabled();
});
