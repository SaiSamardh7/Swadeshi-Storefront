import { defineConfig, devices } from "@playwright/test";

// The storefront talks to /api; these E2E tests mock those responses with
// page.route, so no API server or database is needed. vite.config.ts requires
// PORT and BASE_PATH, so we pass them to the dev server here.
const PORT = 5199;

export default defineConfig({
  testDir: "./e2e",
  // Use a self-contained tsconfig for specs; the app's tsconfig uses project
  // references that Playwright's loader can't resolve.
  tsconfig: "./e2e/tsconfig.json",
  timeout: 30_000,
  fullyParallel: true,
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "on-first-retry",
  },
  // Serve the built bundle (vite preview), not the dev server: static serving
  // avoids Vite's on-demand dep optimization. Run `pnpm --filter @workspace/swadeshi build` first.
  webServer: {
    command: "pnpm exec vite preview --config vite.config.ts",
    url: `http://127.0.0.1:${PORT}`,
    env: { PORT: String(PORT), BASE_PATH: "/" },
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
