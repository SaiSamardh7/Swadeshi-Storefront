import { eq } from "drizzle-orm";
import { db, storeSettingsTable, menuOverridesTable, type MenuOverride } from "@workspace/db";

const SETTINGS_ROW_ID = 1;

export async function getStoreSettings(): Promise<{ orderingPaused: boolean }> {
  const [row] = await db
    .select()
    .from(storeSettingsTable)
    .where(eq(storeSettingsTable.id, SETTINGS_ROW_ID));
  return row ?? { orderingPaused: false };
}

export async function setOrderingPaused(paused: boolean): Promise<{ orderingPaused: boolean }> {
  const [row] = await db
    .insert(storeSettingsTable)
    .values({ id: SETTINGS_ROW_ID, orderingPaused: paused })
    .onConflictDoUpdate({ target: storeSettingsTable.id, set: { orderingPaused: paused } })
    .returning();
  return row;
}

export async function listMenuOverrides(): Promise<MenuOverride[]> {
  return db.select().from(menuOverridesTable);
}

// Full-state upsert; soldOut false + priceCents null means "back to the
// printed menu", so the row is deleted rather than stored as a no-op.
export async function setMenuOverride(
  itemId: string,
  soldOut: boolean,
  priceCents: number | null,
): Promise<{ itemId: string; soldOut: boolean; priceCents: number | null }> {
  if (!soldOut && priceCents === null) {
    await db.delete(menuOverridesTable).where(eq(menuOverridesTable.itemId, itemId));
    return { itemId, soldOut: false, priceCents: null };
  }
  const [row] = await db
    .insert(menuOverridesTable)
    .values({ itemId, soldOut, priceCents })
    .onConflictDoUpdate({
      target: menuOverridesTable.itemId,
      set: { soldOut, priceCents, updatedAt: new Date() },
    })
    .returning();
  return { itemId: row.itemId, soldOut: row.soldOut, priceCents: row.priceCents };
}
