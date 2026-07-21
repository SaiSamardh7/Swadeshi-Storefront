import { Router, type IRouter } from "express";
import { GetMenuStateResponse } from "@workspace/api-zod";
import { getStoreSettings, listMenuOverrides } from "../lib/store-state";

const router: IRouter = Router();

// Public: the storefront merges this over the static catalog so sold-out
// items and repriced items render correctly without a redeploy.
router.get("/menu/state", async (_req, res) => {
  const [settings, overrides] = await Promise.all([getStoreSettings(), listMenuOverrides()]);
  res.json(
    GetMenuStateResponse.parse({
      orderingPaused: settings.orderingPaused,
      overrides: overrides.map((o) => ({
        itemId: o.itemId,
        soldOut: o.soldOut,
        priceCents: o.priceCents,
      })),
    }),
  );
});

export default router;
