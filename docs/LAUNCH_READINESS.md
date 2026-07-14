# Swadeshi launch readiness

Last reviewed: July 13, 2026

## Phase 1 — hosted ordering launch

| Requirement | Status | Evidence / remaining action |
| --- | --- | --- |
| Polish the current site and integrate the current UI | Ready in code | Launch CTAs, truthful forms/content, mobile navigation, metadata, and deployment defaults are implemented in the storefront. Build and browser verification must stay green. |
| Keep Heartland-hosted ordering as checkout | Ready | `https://swadeshifrisco.hrpos.heartland.us/menu` returned HTTP 200 on July 13, 2026. Food-order CTAs open that hosted page. No payment data is collected by this application. |
| Prepare AWS Amplify Hosting deployment | Ready | `amplify.yml` supports a future connected build. For the requested GitHub-free path, `artifacts/swadeshi/dist/swadeshi-amplify.zip` contains the built site and `customHttp.yml`, with `index.html` at the ZIP root. |
| Configure SPA routing in Amplify | Console action required | Add the rewrite rule below after creating the Amplify app. |
| Deploy and point the production domain | External action required | Connect the repository/branch in the owner's AWS account, deploy it, add the production domain, and complete Amplify's DNS verification. The repository does not contain AWS account or domain ownership evidence. |

### Required Amplify SPA rewrite

In **Amplify Hosting → Rewrites and redirects**, add:

| Source | Target | Type |
| --- | --- | --- |
| `</^[^.]+$|\.(?!(css|gif|ico|jpg|jpeg|js|png|txt|svg|woff|woff2|ttf|map|json|webp)$)([^.]+$)/>` | `/index.html` | `200 (Rewrite)` |

Then verify direct loads of `/menu`, `/grocery-halal`, `/catering`, `/location`, and `/contact`.

### Deployment checklist

1. Sign in to AWS Amplify Hosting and choose **Create new app → Deploy without Git**.
2. Use app name `Swadeshi Storefront`, branch name `production`, and method **Drag and drop**.
3. Upload `artifacts/swadeshi/dist/swadeshi-amplify.zip`. Its SHA-256 is `a0c92dae300719e8ac656a7c8c9d261056059099f2b12e5b44e7faa982c52736`.
4. Add the SPA rewrite above.
5. Attach the production domain and follow the DNS records shown by Amplify.
6. Verify HTTPS, the custom security headers, all direct page loads, and the Heartland order handoff on desktop and mobile.
7. Keep the Amplify-generated domain until the custom domain is healthy so rollback remains available.

## Phase 2 — native cart, payment, and kitchen routing

Phase 2 is **not approved to start**. The former client-only cart was removed because it had no payment, order submission, or kitchen fulfillment path and could mislead customers.

| Gate | Status | Required evidence |
| --- | --- | --- |
| Heartland Online Ordering / MenuDrive enabled | Confirmed only for Phase 1 | The public Heartland-hosted menu is live. Record the exact Heartland product/account name in writing. |
| Gateway account, API keys, and Hosted Payment Page | Missing | Written confirmation from Heartland plus sandbox credentials delivered through a secret manager—not committed to Git. |
| Website order → kitchen workflow | Missing | Written description of whether orders enter the POS/kitchen automatically or staff must re-enter them, including test procedure and failure handling. |
| Merchant ID (MID) and exact Heartland product | Missing | MID and product name supplied privately by the owner/Heartland representative. Do not place the MID in public client code or documentation. |

Do not implement a native cart, checkout, payment capture, webhook, or kitchen-order API until all four gates have owners and evidence. When unblocked, start in Heartland's sandbox and define payment/webhook idempotency, order state transitions, failure recovery, kitchen acknowledgement, monitoring, and a rollback plan before production work.
