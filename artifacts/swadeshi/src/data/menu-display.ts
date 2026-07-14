import type { FullMenuItem } from "@/data/fullmenu";

type MenuDisplayInput = Pick<FullMenuItem, "name" | "isVeg"> & { category: string };

const has = (value: string, pattern: RegExp) => pattern.test(value.toLowerCase());

/**
 * Returns the closest available studio-food image for a menu item. Every item
 * always receives an image; the order matters because specific dishes should
 * win over broad category matches.
 */
export function getMenuItemPhoto({ name, category }: MenuDisplayInput): string {
  const value = `${name} ${category}`;

  if (has(value, /biryani/)) return "/images/menu/menu-biryani.jpg";
  if (has(value, /pulav/)) return "/images/menu/menu-pulav.jpg";
  if (has(value, /fried rice/)) return "/images/menu/menu-fried-rice.jpg";
  if (has(value, /noodles/)) return "/images/menu/menu-noodles.jpg";
  if (has(value, /soup/)) return "/images/menu/menu-soup.jpg";
  if (has(value, /falooda/)) return "/images/menu/menu-falooda.jpg";
  if (has(value, /juice/)) return "/images/menu/menu-juice.jpg";
  if (has(value, /shake/)) return "/images/menu/menu-milkshake.jpg";
  if (has(value, /tea|chai/)) return "/images/menu/menu-chai.jpg";
  if (has(value, /lassi/)) return "/images/menu/menu-lassi.jpg";
  if (has(value, /sandwich/)) return "/images/menu/menu-sandwich.jpg";
  if (has(value, /burger/)) return "/images/menu/menu-burger.jpg";
  if (has(value, /frankie/)) return "/images/menu/menu-frankie.jpg";
  if (has(value, /kothu/)) return "/images/menu/menu-kothu-paratha.jpg";
  if (has(value, /idly|idli|vada|bonda|pongal|upma/)) return "/images/menu/menu-idli.jpg";
  if (has(value, /dosa|uthappam|pesarattu/)) return "/images/menu/menu-dosa.jpg";
  if (has(value, /poori|bhature/)) return "/images/menu/menu-poori.jpg";
  if (has(value, /naan|roti|paratha/)) return "/images/menu/menu-naan.jpg";
  if (has(value, /pani puri|chaat|pav bhaji|bhel|sev puri|dahi puri|misal/)) return "/images/menu/menu-pani-puri.jpg";
  if (has(value, /tandoori|tikka kabab|tikka kebab|malai tikka/)) return "/images/menu/menu-tandoori.jpg";
  if (has(value, /(fish|shrimp).*(65|555|fry|fried|chilli|crispy|chrispy|apollo)|(65|555|fry|fried|chilli|crispy|chrispy|apollo).*(fish|shrimp)/)) {
    return "/images/menu/menu-seafood-appetizer.jpg";
  }
  if (has(value, /fish pulusu|fish entree|chettinad fish/)) return "/images/menu/menu-fish-curry.jpg";
  if (has(value, /shrimp masala|shrimp entree|chettinad shrimp/)) return "/images/menu/menu-shrimp-curry.jpg";
  if (has(value, /samosa/)) return "/images/menu/menu-samosa.jpg";
  if (has(value, /pakoda|bajji|punugulu|cutlet|puff|manchurian|chilli|\b65\b|555|lollipop|appetizer|snack/)) {
    return "/images/menu/menu-appetizers.jpg";
  }
  if (has(value, /entree|curry|masala|korma|vindaloo|jalfrezi|dal|chana|palak|saag|gobi|baingan|bhindi|colambu|chettinad/)) {
    return "/images/menu/menu-curries.jpg";
  }
  if (has(value, /paneer|koftha|kofta/)) return "/images/menu/menu-curries.jpg";
  return "/images/menu/menu-curries.jpg";
}

/**
 * Conservative menu copy: it describes the dish family and preparation style
 * without inventing allergens, heat levels, accompaniments, or ingredients the
 * restaurant has not supplied.
 */
export function getMenuItemDescription({ name, category, isVeg }: MenuDisplayInput): string {
  const value = `${name} ${category}`;
  const dish = name.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();

  if (has(value, /idly|idli/)) return "Soft, steamed rice-and-lentil cakes with a light, pillowy texture.";
  if (has(value, /vada/)) return "A savory lentil fritter fried until crisp outside and tender within.";
  if (has(value, /bonda|punugulu|bajji|pakoda/)) return `A golden, freshly fried ${dish.toLowerCase()} with a crisp, satisfying bite.`;
  if (has(value, /poori|bhature/)) return "Puffed, golden fried bread served as a hearty Indian comfort-food favorite.";
  if (has(value, /dosa/)) return `A made-to-order South Indian crepe with the signature flavors of ${dish}.`;
  if (has(value, /uthappam/)) return "A soft, savory South Indian rice-and-lentil pancake cooked fresh to order.";
  if (has(value, /pongal/)) return "A warm, comforting South Indian rice-and-lentil preparation finished with ghee.";
  if (has(value, /upma/)) return "A warm and savory South Indian breakfast with a soft, comforting texture.";
  if (has(value, /pesarattu/)) return "A savory green-gram crepe cooked fresh with a delicately crisp finish.";
  if (has(value, /biryani/)) return `Fragrant basmati rice layered with the signature flavors of ${dish}.`;
  if (has(value, /pulav/)) return `Aromatic rice cooked with the distinctive seasonings and flavors of ${dish}.`;
  if (has(value, /soup/)) return `A warming bowl of ${dish.toLowerCase()} with savory Indo-Chinese character.`;
  if (has(value, /noodles/)) return `Wok-tossed ${dish.toLowerCase()} prepared fresh with savory Indo-Chinese flavor.`;
  if (has(value, /fried rice/)) return `Wok-tossed ${dish.toLowerCase()} with a fragrant, savory finish.`;
  if (has(value, /falooda/)) return `A chilled, dessert-style ${dish.toLowerCase()} made for a cool, indulgent finish.`;
  if (has(value, /juice/)) return `A bright, refreshing ${dish.toLowerCase()} served chilled.`;
  if (has(value, /shake/)) return `A creamy, chilled ${dish.toLowerCase()} blended for a smooth finish.`;
  if (has(value, /lassi/)) return `A cool, creamy ${dish.toLowerCase()} inspired by the classic yogurt drink.`;
  if (has(value, /tea|chai/)) return `A warming cup of ${dish.toLowerCase()} brewed fresh and served hot.`;
  if (has(value, /samosa/)) return "A crisp, golden pastry with a savory filling and a flaky shell.";
  if (has(value, /puff/)) return "A flaky, oven-baked pastry wrapped around a warmly seasoned savory filling.";
  if (has(value, /cutlet/)) return "A seasoned patty with a crisp golden crust and a tender center.";
  if (has(value, /manchurian/)) return `An Indo-Chinese favorite featuring ${dish.toLowerCase()} in a bold, savory glaze.`;
  if (has(value, /chilli/)) return `A lively Indo-Chinese ${dish.toLowerCase()} tossed for a savory, aromatic finish.`;
  if (has(value, /\b65\b|555|apollo|pakodi|fry|fried|crispy|chrispy|roast|lollipop/)) {
    return `A boldly seasoned ${dish.toLowerCase()} cooked for a crisp, flavorful finish.`;
  }
  if (has(value, /tandoori|tikka|kabab|kebab/)) return `Aromatic ${dish.toLowerCase()} cooked in classic tandoori style for a smoky finish.`;
  if (has(value, /dal/)) return "Slow-simmered lentils finished as a warming, deeply comforting Indian staple.";
  if (has(value, /sambar/)) return "A comforting South Indian lentil stew with a warm, savory finish.";
  if (has(value, /paneer/)) return `Tender paneer prepared in the distinctive, comforting style of ${dish}.`;
  if (has(value, /korma|koftha|kofta/)) return `A rich, aromatic ${dish.toLowerCase()} with a smooth and comforting finish.`;
  if (has(value, /vindaloo/)) return `A bold, tangy ${dish.toLowerCase()} layered with warming Indian spices.`;
  if (has(value, /curry|masala|jalfrezi|chana|palak|saag|gobi|baingan|bhindi|butter chicken|kadai|methi malai|keema|pulusu/)) {
    return `A freshly prepared ${dish.toLowerCase()} layered with aromatic Indian spices.`;
  }
  if (has(value, /naan|roti|paratha/)) return `Freshly cooked ${dish.toLowerCase()} with a warm, tender, lightly charred finish.`;
  if (has(value, /pani puri/)) return "Crisp, bite-size puris served in the bright, lively style of Indian street food.";
  if (has(value, /chaat|bhel|sev puri|dahi puri|misal|pav bhaji|vada pav|samosa pav/)) {
    return `A colorful street-food favorite balancing crisp, savory, and tangy notes.`;
  }
  if (has(value, /sandwich/)) return `A hot grilled ${dish.toLowerCase()} with a crisp exterior and savory center.`;
  if (has(value, /burger/)) return `A hearty ${dish.toLowerCase()} stacked and prepared fresh for a satisfying bite.`;
  if (has(value, /frankie/)) return `A street-style wrap filled with the bold, savory flavors of ${dish}.`;
  if (has(value, /kothu/)) return "Chopped flaky paratha tossed on the griddle with bold Chettinad-style seasoning.";
  if (has(value, /colambu|chettinad/)) return `A South Indian specialty with the deep, aromatic character of ${dish}.`;
  return `${dish} is a ${isVeg ? "vegetarian " : ""}house-menu favorite prepared fresh to order.`;
}
