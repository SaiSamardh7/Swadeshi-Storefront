// ponytail: swappable payment boundary, mirroring sms.ts / mailer.ts. No
// gateway is wired yet (prepay is a gated Phase 2 requirement — see
// docs/LAUNCH_READINESS.md), so this stub "captures" instantly. Replace
// chargeOrder() with a real gateway (Heartland Hosted Payment Page, Stripe, …)
// when credentials exist; the route and the DB payment lifecycle don't change.
//
// Idempotency: callers pass the orderId, which a real gateway should use as its
// idempotency key so a retried charge never bills twice.

export type PaymentResult = { status: "paid"; ref: string } | { status: "failed"; reason: string };

function paymentConfigured(): boolean {
  return Boolean(process.env.PAYMENT_GATEWAY_KEY);
}

export async function chargeOrder(params: {
  orderId: number;
  amountCents: number;
}): Promise<PaymentResult> {
  if (!paymentConfigured()) {
    // Stub mode: auto-succeed so the flow is exercisable without a gateway.
    console.log(
      `[payment:stub] order #${params.orderId} amount=${(params.amountCents / 100).toFixed(2)} — auto-captured (no gateway configured)`,
    );
    return { status: "paid", ref: `stub_${params.orderId}_${Date.now()}` };
  }

  // TODO: real gateway integration goes here, keyed by params.orderId.
  return { status: "failed", reason: "Payment gateway not implemented." };
}
