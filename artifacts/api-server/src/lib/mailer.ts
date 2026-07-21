// Plain fetch, no SDK. Unconfigured or failed sends are logged to the server
// console instead — an order/lead should never fail because email is down.
export async function sendBusinessEmail(subject: string, text: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BUSINESS_EMAIL;

  if (!apiKey || !to) {
    console.log(`[email:dev] to=${to ?? "<BUSINESS_EMAIL unset>"} ${subject}\n${text}`);
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Swadeshi Website <onboarding@resend.dev>",
        to: [to],
        subject,
        text,
      }),
    });
    if (!res.ok) {
      console.error("Resend error:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("Resend send failed:", e);
    return false;
  }
}
