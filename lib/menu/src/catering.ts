// ===========================================================================
//  CATERING TRAY PRICES — EDIT THIS FILE BEFORE GOING LIVE
// ===========================================================================
//  Every number below is a PLACEHOLDER. They were NOT supplied by the
//  restaurant. Replace `halfCents` / `fullCents` / `servesHalf` / `servesFull`
//  on each tray with the real numbers, then delete this warning block.
//
//  Prices are in CENTS (e.g. $85.00 -> 8500) to avoid floating-point rounding,
//  matching how the rest of the codebase stores money.
//
//  This is the single source of truth for catering pricing: the quote builder
//  on the website and the API server both read it, so the server can re-price
//  a submitted quote instead of trusting whatever the browser sends.
// ===========================================================================

export type CateringTray = {
  id: string;
  name: string;
  category: string;
  isVeg: boolean;
  /** Price for a half tray, in cents. */
  halfCents: number;
  /** Price for a full tray, in cents. */
  fullCents: number;
  /** Roughly how many people a half tray feeds. */
  servesHalf: number;
  /** Roughly how many people a full tray feeds. */
  servesFull: number;
};

export type TraySize = "half" | "full";

export const CATERING_TRAYS: CateringTray[] = [
  // --- Appetizers ---------------------------------------------------------
  { id: "veg-samosa", name: "Veg Samosa", category: "Appetizers", isVeg: true, halfCents: 4500, fullCents: 8000, servesHalf: 10, servesFull: 20 },
  { id: "gobi-manchurian", name: "Gobi Manchurian", category: "Appetizers", isVeg: true, halfCents: 5500, fullCents: 9500, servesHalf: 10, servesFull: 20 },
  { id: "chilli-paneer", name: "Chilli Paneer", category: "Appetizers", isVeg: true, halfCents: 6500, fullCents: 11500, servesHalf: 10, servesFull: 20 },
  { id: "chicken-65", name: "Chicken 65", category: "Appetizers", isVeg: false, halfCents: 7000, fullCents: 12500, servesHalf: 10, servesFull: 20 },
  { id: "chicken-pakodi", name: "Ankapur Chicken Pakodi", category: "Appetizers", isVeg: false, halfCents: 7000, fullCents: 12500, servesHalf: 10, servesFull: 20 },

  // --- Biryani & Rice -----------------------------------------------------
  { id: "veg-dum-biryani", name: "Veg Dum Biryani", category: "Biryani & Rice", isVeg: true, halfCents: 6500, fullCents: 11500, servesHalf: 10, servesFull: 20 },
  { id: "chicken-dum-biryani", name: "Chicken Dum Biryani", category: "Biryani & Rice", isVeg: false, halfCents: 7500, fullCents: 13500, servesHalf: 10, servesFull: 20 },
  { id: "goat-dum-biryani", name: "Goat Dum Biryani", category: "Biryani & Rice", isVeg: false, halfCents: 9500, fullCents: 17500, servesHalf: 10, servesFull: 20 },
  { id: "jeera-rice", name: "Jeera Rice", category: "Biryani & Rice", isVeg: true, halfCents: 3500, fullCents: 6000, servesHalf: 12, servesFull: 25 },

  // --- Vegetarian Entrees -------------------------------------------------
  { id: "paneer-butter-masala", name: "Paneer Butter Masala", category: "Veg Entrees", isVeg: true, halfCents: 6500, fullCents: 11500, servesHalf: 10, servesFull: 20 },
  { id: "dal-tadka", name: "Dal Tadka", category: "Veg Entrees", isVeg: true, halfCents: 4500, fullCents: 8000, servesHalf: 12, servesFull: 25 },
  { id: "aloo-gobi", name: "Aloo Gobi", category: "Veg Entrees", isVeg: true, halfCents: 5000, fullCents: 9000, servesHalf: 10, servesFull: 20 },
  { id: "chana-masala", name: "Chana Masala", category: "Veg Entrees", isVeg: true, halfCents: 4500, fullCents: 8000, servesHalf: 12, servesFull: 25 },

  // --- Non-Veg Entrees ----------------------------------------------------
  { id: "butter-chicken", name: "Butter Chicken", category: "Non-Veg Entrees", isVeg: false, halfCents: 7500, fullCents: 13500, servesHalf: 10, servesFull: 20 },
  { id: "andhra-chicken-curry", name: "Andhra Chicken Curry", category: "Non-Veg Entrees", isVeg: false, halfCents: 7500, fullCents: 13500, servesHalf: 10, servesFull: 20 },
  { id: "andhra-goat-curry", name: "Andhra Goat Curry", category: "Non-Veg Entrees", isVeg: false, halfCents: 9500, fullCents: 17500, servesHalf: 10, servesFull: 20 },

  // --- Breads -------------------------------------------------------------
  { id: "butter-naan", name: "Butter Naan", category: "Breads", isVeg: true, halfCents: 3000, fullCents: 5500, servesHalf: 10, servesFull: 20 },
  { id: "roti", name: "Roti", category: "Breads", isVeg: true, halfCents: 2500, fullCents: 4500, servesHalf: 10, servesFull: 20 },

  // --- Desserts -----------------------------------------------------------
  { id: "gulab-jamun", name: "Gulab Jamun", category: "Desserts", isVeg: true, halfCents: 3500, fullCents: 6000, servesHalf: 12, servesFull: 25 },
  { id: "rasmalai", name: "Rasmalai", category: "Desserts", isVeg: true, halfCents: 4500, fullCents: 8000, servesHalf: 12, servesFull: 25 },
];

let trayIndex: Map<string, CateringTray> | null = null;

/** Authoritative tray lookup — the API server prices quotes with this. */
export function getCateringTray(id: string): CateringTray | undefined {
  if (!trayIndex) trayIndex = new Map(CATERING_TRAYS.map((t) => [t.id, t]));
  return trayIndex.get(id);
}

export function trayPriceCents(tray: CateringTray, size: TraySize): number {
  return size === "half" ? tray.halfCents : tray.fullCents;
}

export function trayServes(tray: CateringTray, size: TraySize): number {
  return size === "half" ? tray.servesHalf : tray.servesFull;
}
