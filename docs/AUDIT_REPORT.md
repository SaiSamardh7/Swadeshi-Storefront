# Production and security audit

Audit date: July 13, 2026 (America/Chicago)

## Production readiness

**84/100 — launchable with caveats.** The static storefront is ready to deploy, but Phase 1 is not complete until an owner connects AWS Amplify, adds the SPA rewrite, attaches the production domain, and verifies the deployed URL. Phase 2 remains intentionally gated.

### Fixed launch risks

- Removed the orphan browser-only cart. It had no checkout, order submission, payment, or kitchen-routing path.
- Routed food-order actions to the verified Heartland-hosted page and grocery actions to the existing hosted grocery page.
- Removed fabricated sample testimonials and unverified product/tray prices from customer-facing purchase controls.
- Replaced contact and catering fake-success states and PII console logging with explicit email-draft handoffs. The site does not store those form details.
- Removed hard-coded “Open Now” status and other unverified fulfillment/service claims.
- Added honest SEO metadata, accessible mobile ordering, menu control names/states, production-safe Vite defaults, Amplify build configuration, SPA rewrite instructions, and response security headers.
- Split page routes into on-demand bundles and removed unused query, tooltip, and toast runtime providers/packages. Initial JavaScript fell from about 537 kB to 236 kB minified, with no Vite large-chunk warning.
- Produced a GitHub-free Amplify manual-deployment archive at `artifacts/swadeshi/dist/swadeshi-amplify.zip`; `index.html` is at the archive root and the archive includes `customHttp.yml`.
- Fixed the separate mockup build configuration so the repository-wide release command passes.

### Verification evidence

- `pnpm run build`: pass. All library and application typechecks pass; storefront, mockup, and API builds complete.
- Production storefront browser QA at 1440px and 375px: all 9 routes returned 200; no console errors, failed requests, or horizontal overflow.
- Critical handoff checks: Heartland order links present on desktop/mobile; menu search works; contact and catering invalid submissions show 5 and 6 validation errors respectively.
- Basic accessibility DOM audit: no missing image alternative text, unnamed buttons, duplicate IDs, or missing main/navigation landmarks. Radix's hidden select controls were excluded from the actionable result.
- Heartland food ordering URL: HTTP 200 on July 13, 2026.
- Grubhub grocery ordering URL: HTTP 200 on July 13, 2026.
- `pnpm audit --prod --audit-level high`: no known vulnerabilities.

### Remaining production caveats

- No AWS CLI, authenticated Amplify console, deployed preview URL, DNS ownership evidence, or production rollback test was available in this environment.
- Amplify must be configured with the SPA 200 rewrite in `LAUNCH_READINESS.md`; repository files cannot create that console rule for a standard static app.
- Automated Core Web Vitals and a full axe/WCAG engine were not available. Browser smoke, responsive, form, and basic accessibility checks passed.

## Trivy + Ponytail security audit

### Scan scope

- Trivy: 0.72.0.
- Vulnerability database updated: July 14, 2026 00:59 UTC; downloaded July 14, 2026 03:58 UTC.
- Source target: repository root and `pnpm-lock.yaml`.
- Shipped target: `artifacts/swadeshi/dist/public`, the directory configured as the Amplify artifact.
- Scanners: vulnerabilities, supported misconfigurations, secrets, and licenses.
- Exclusions for the source scan: `.git`, `node_modules`, `.local`, `.cache`, and the separately scanned storefront build output.
- HIGH/CRITICAL exit gate: pass, exit code 0.

### Findings

| Target | Vulnerabilities | Supported misconfigurations | Secrets | License findings |
| --- | ---: | ---: | ---: | ---: |
| Source/lockfile | 0 | 0 | 0 | 0 |
| Amplify static artifact | 0 | 0 | 0 | 0 |

Trivy did not recognize Amplify's YAML files as a supported IaC type, so `amplify.yml` and `customHttp.yml` were also parsed as YAML and reviewed against current AWS Amplify Hosting documentation. Zero reported findings do not replace runtime, cloud-account, DNS, or application penetration testing.

### Minimal remediation

- Root cause: the site mixed a Phase 2-looking cart and fake server success states into a Phase 1 static launch with no safe backend path.
- Ponytail choice: remove unused/risky flows and reuse hosted Heartland, Grubhub, phone, email, maps, Vite, and Amplify platform controls. No payment SDK, form backend, cart dependency, security abstraction, or new runtime package was added.
- Complexity removed: one cart provider/hook and all add-to-cart actions; fake review data; fake product purchase controls; fake form receipt states; production runtime-error overlays.

## Phase verdict

- Phase 1: **code complete; deployment/domain verification outstanding**.
- Phase 2: **not started by design; Heartland gateway/HPP, kitchen routing, MID, and exact product confirmation are still missing**.

See `LAUNCH_READINESS.md` for the exact deployment steps and Phase 2 evidence gates.
