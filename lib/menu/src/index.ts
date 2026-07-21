// GENERATED from swadeshius.com menu data (extracted July 4, 2026).
// Prices as published by the restaurant's own site — confirm before major promos.
// ponytail: isVeg was inferred from category + dish-name keywords, not source
// data (the site doesn't publish veg flags). Ambiguous names were biased
// toward non-veg so the Veg filter never shows a meat dish. Owner should
// spot-check; upgrade path is a hand-verified flag per item.
//
// Shared between the storefront (display) and the API server (authoritative
// pricing for orders) — this is the one place prices live.

export type FullMenuItem = { name: string; price: number; isVeg: boolean };
export type FullMenuCategory = { category: string; items: FullMenuItem[] };
export type FullMenuSection = { section: string; categories: FullMenuCategory[] };

export const FULL_MENU: FullMenuSection[] = [
  { section: "Tiffins & Breakfast", categories: [
    { category: "Tiffins", items: [
      { name: "Idly (3Pcs)", price: 5.99, isVeg: true },
      { name: "Mysore Bonda (4Pcs)", price: 7.49, isVeg: true },
      { name: "Medu Vada (4Pcs)", price: 7.49, isVeg: true },
      { name: "Idly + Vada (2+2)", price: 7.49, isVeg: true },
      { name: "Idly + Bonda (2+2)", price: 7.49, isVeg: true },
      { name: "Sambar Idly (3Pcs)", price: 7.49, isVeg: true },
      { name: "Sambar Vada (3Pcs)", price: 7.99, isVeg: true },
    ] },
    { category: "Poori", items: [
      { name: "Poori Masala (2Pcs)", price: 9.99, isVeg: true },
      { name: "Poori Chana (2Pcs)", price: 10.99, isVeg: true },
      { name: "Poori With Chicken Curry (2Pcs)", price: 11.99, isVeg: false },
      { name: "Poori With Goat Curry (2Pcs)", price: 12.99, isVeg: false },
      { name: "Xtra Poori", price: 2.99, isVeg: true },
      { name: "Chole Bhature (1Pc)", price: 9.99, isVeg: true },
    ] },
    { category: "Dosa", items: [
      { name: "Swadeshi Spl Dosa", price: 10.99, isVeg: true },
      { name: "Plain Dosa", price: 8.99, isVeg: true },
      { name: "Onion Dosa", price: 9.99, isVeg: true },
      { name: "Masala Dosa", price: 9.99, isVeg: true },
      { name: "Mysore Masala Dosa", price: 9.99, isVeg: true },
      { name: "Guntur Karam Dosa", price: 9.99, isVeg: true },
      { name: "Ghee Roast Dosa", price: 9.99, isVeg: true },
      { name: "Cheese Dosa", price: 9.99, isVeg: true },
      { name: "Paneer Dosa", price: 10.99, isVeg: true },
      { name: "Ghee Masala Dosa", price: 9.99, isVeg: true },
      { name: "Ghee Onion Dosa", price: 9.99, isVeg: true },
      { name: "Ghee Guntur Karam Dosa", price: 9.99, isVeg: true },
      { name: "Rava Dosa", price: 8.99, isVeg: true },
      { name: "Onion Rava Dosa", price: 9.99, isVeg: true },
      { name: "Masala Rava Dosa", price: 9.99, isVeg: true },
      { name: "Set Dosa", price: 8.99, isVeg: true },
    ] },
    { category: "Uthappam", items: [
      { name: "Uthappam", price: 8.99, isVeg: true },
      { name: "Onion Uthappam", price: 9.99, isVeg: true },
      { name: "Veg Uthappam", price: 9.99, isVeg: true },
      { name: "Masala Uthappam", price: 9.99, isVeg: true },
    ] },
    { category: "Dosa (Non-Veg)", items: [
      { name: "Egg Dosa", price: 9.99, isVeg: false },
      { name: "Chicken Dosa", price: 10.99, isVeg: false },
      { name: "Chicken Keema Dosa", price: 10.99, isVeg: false },
      { name: "Chicken 65 Dosa", price: 10.99, isVeg: false },
      { name: "Mutton Keema Dosa", price: 12.99, isVeg: false },
    ] },
    { category: "Weekend Specials", items: [
      { name: "Ghee Pongal (16oz)", price: 6.99, isVeg: true },
      { name: "Ghee Upma (16oz)", price: 6.49, isVeg: true },
      { name: "Pesarattu", price: 8.99, isVeg: true },
      { name: "Onion Pesarattu", price: 9.99, isVeg: true },
      { name: "Masala Pesarattu", price: 9.99, isVeg: true },
      { name: "Upma Pesarattu", price: 10.99, isVeg: true },
    ] },
  ] },
  { section: "Appetizers & Snacks", categories: [
    { category: "Veg Appetizers", items: [
      { name: "Gobi Manchurian", price: 9.99, isVeg: true },
      { name: "Veg Manchurian", price: 9.99, isVeg: true },
      { name: "Baby Corn Manchurian", price: 9.99, isVeg: true },
      { name: "Gobi 65", price: 10.99, isVeg: true },
      { name: "Chilli Paneer", price: 10.99, isVeg: true },
      { name: "Paneer 65", price: 10.99, isVeg: true },
      { name: "Crispy Fried Baby Corn S&P", price: 10.99, isVeg: true },
      { name: "Chilli Gobi", price: 10.99, isVeg: true },
      { name: "Chilli Baby Corn", price: 10.99, isVeg: true },
      { name: "Mushroom Manchurian", price: 10.99, isVeg: true },
      { name: "Chilli Mashroom", price: 10.99, isVeg: true },
      { name: "Paneer Manchurian", price: 10.99, isVeg: true },
      { name: "Paneer Tikka Kabab", price: 10.99, isVeg: true },
    ] },
    { category: "Veg Snacks", items: [
      { name: "Mirchi Bajji (4 Pc)", price: 5.99, isVeg: true },
      { name: "Stuffed Mirci Bajji (3Pc)", price: 5.99, isVeg: true },
      { name: "Punugulu (8Pcs)", price: 5.99, isVeg: true },
      { name: "Masala Vada (4Pcs)", price: 5.99, isVeg: true },
      { name: "Onion Pakoda (0.75 Lb Plus)", price: 4.99, isVeg: true },
      { name: "Onion Samosa (3Pc)", price: 1.99, isVeg: true },
      { name: "Aloo Samosa (1Pc)", price: 1.49, isVeg: true },
      { name: "Veg Puff", price: 2.49, isVeg: true },
      { name: "Paneer Puff", price: 2.99, isVeg: true },
      { name: "Veg Cutlet (2Pc) (Weekend Special)", price: 5.99, isVeg: true },
    ] },
    { category: "Non-Veg Snacks", items: [
      { name: "Egg Puff", price: 2.99, isVeg: false },
      { name: "Chicken Puff", price: 2.99, isVeg: false },
      { name: "Chicken Cutlet (2 Pcs) (Weekend Special)", price: 5.99, isVeg: false },
      { name: "Chicken 65", price: 9.99, isVeg: false },
      { name: "Chilli Chicken", price: 9.99, isVeg: false },
      { name: "Chicken 555", price: 9.99, isVeg: false },
      { name: "Pepper Chicken Fry", price: 9.99, isVeg: false },
      { name: "Spicy Chicken Fry", price: 9.99, isVeg: false },
      { name: "Chicken Pakodi", price: 9.99, isVeg: false },
      { name: "Andhra Chicken Fry", price: 9.99, isVeg: false },
      { name: "Chicken Manchurian", price: 10.99, isVeg: false },
      { name: "Ankapur Chicken Pakodi (Weekend Special)", price: 9.99, isVeg: false },
      { name: "Chicken Lollipop (4Pcs) (Weekend Special)", price: 10.99, isVeg: false },
      { name: "Mutton Roast Bone", price: 11.99, isVeg: false },
      { name: "Mutton Roast Boneless", price: 14.99, isVeg: false },
      { name: "Pepper Goat Fry Bone", price: 11.99, isVeg: false },
      { name: "Pepper Goat Fry Boneless", price: 14.99, isVeg: false },
      { name: "Fish 555", price: 10.99, isVeg: false },
      { name: "Apollo Fish", price: 10.99, isVeg: false },
      { name: "Chilli Fish", price: 10.99, isVeg: false },
      { name: "Fish Fry", price: 10.99, isVeg: false },
      { name: "Shrimp 65", price: 11.99, isVeg: false },
      { name: "Shrimp Fry", price: 11.99, isVeg: false },
      { name: "Chilli Shrimp", price: 11.99, isVeg: false },
    ] },
    { category: "Tandoori", items: [
      { name: "Tandoori Chicken Whole (8Pcs)", price: 17.99, isVeg: false },
      { name: "Tandoori Chicken (4Pcs)", price: 11.99, isVeg: false },
      { name: "Tandoori Chicken (2Pcs)", price: 7.99, isVeg: false },
      { name: "Malai Tikka Kabab (7Pcs)", price: 10.99, isVeg: false },
      { name: "Chicken Tikka Kabab (7Pcs)", price: 10.99, isVeg: false },
      { name: "Tandoori Silver Pomfret Fish (2Pcs) (Weekend Special)", price: 13.99, isVeg: false },
      { name: "Tandoori Silver Pomfret Fish (1Pc) (Weekend Special)", price: 7.99, isVeg: false },
    ] },
  ] },
  { section: "Curries & Breads", categories: [
    { category: "Veg Entrees", items: [
      { name: "Yellow Dal Tadka", price: 11.99, isVeg: true },
      { name: "Veg Jalfrezi", price: 12.99, isVeg: true },
      { name: "Gutti Vankaya Curry", price: 12.99, isVeg: true },
      { name: "Aloo Gobi", price: 12.99, isVeg: true },
      { name: "Bagara Baingan", price: 12.99, isVeg: true },
      { name: "Palak Chana", price: 12.99, isVeg: true },
      { name: "Chana Masala", price: 12.99, isVeg: true },
      { name: "Bhindi Masala", price: 12.99, isVeg: true },
      { name: "Navrattan Korma", price: 13.99, isVeg: true },
      { name: "Malai Koftha", price: 13.99, isVeg: true },
      { name: "Paneer Butter Masala", price: 13.99, isVeg: true },
      { name: "Paneer Tikka Masala", price: 13.99, isVeg: true },
      { name: "Palak Paneer", price: 13.99, isVeg: true },
      { name: "Kadai Paneer", price: 13.99, isVeg: true },
      { name: "Mutter Paneer", price: 13.99, isVeg: true },
      { name: "Methi Malai Paneer", price: 13.99, isVeg: true },
      { name: "Saag Paneer", price: 13.99, isVeg: true },
      { name: "Shahi Paneer", price: 13.99, isVeg: true },
      { name: "Ulavacharu Paneer Curry", price: 13.99, isVeg: true },
      { name: "Mushroom Paneer", price: 13.99, isVeg: true },
      { name: "Sambar (16 oz)", price: 5.99, isVeg: true },
      { name: "Sambar (32 oz)", price: 9.99, isVeg: true },
    ] },
    { category: "Egg Entrees", items: [
      { name: "Egg Masala", price: 12.99, isVeg: false },
      { name: "Egg Korma", price: 12.99, isVeg: false },
      { name: "Hyderabad Egg Curry", price: 12.99, isVeg: false },
      { name: "Shahi Egg Masala", price: 13.99, isVeg: false },
    ] },
    { category: "Chicken Entrees", items: [
      { name: "Andhra Chicken Curry", price: 13.99, isVeg: false },
      { name: "Hyderabad Chicken Curry", price: 13.99, isVeg: false },
      { name: "Chettinad Chicken", price: 13.99, isVeg: false },
      { name: "Chicken Tikka Masala", price: 13.99, isVeg: false },
      { name: "Butter Chicken", price: 13.99, isVeg: false },
      { name: "Palak Chicken", price: 13.99, isVeg: false },
      { name: "Pepper Chicken Curry", price: 13.99, isVeg: false },
      { name: "Chicken Vindaloo", price: 13.99, isVeg: false },
      { name: "Kadai Chicken", price: 13.99, isVeg: false },
      { name: "Ginger Chicken Curry", price: 13.99, isVeg: false },
      { name: "Methi Malai Chicken", price: 13.99, isVeg: false },
      { name: "Chicken Jalfrezi", price: 13.99, isVeg: false },
      { name: "Chicken Keema", price: 13.99, isVeg: false },
      { name: "Chicken Korma", price: 14.99, isVeg: false },
      { name: "Gongura Chicken Curry", price: 14.99, isVeg: false },
      { name: "Ulavacharu Chicken Curry", price: 14.99, isVeg: false },
      { name: "Chinta Chiguru Chicken Curry", price: 14.99, isVeg: false },
    ] },
    { category: "Goat Entrees", items: [
      { name: "Andhra Goat Curry", price: 15.99, isVeg: false },
      { name: "Hyderabad Mutton Curry", price: 15.99, isVeg: false },
      { name: "Chettinad Goat Curry", price: 15.99, isVeg: false },
      { name: "Kadai Goat Curry", price: 15.99, isVeg: false },
      { name: "Pepper Goat Curry", price: 15.99, isVeg: false },
      { name: "Palak Goat Curry", price: 15.99, isVeg: false },
      { name: "Goat Korma", price: 15.99, isVeg: false },
      { name: "Ginger Goat Curry", price: 15.99, isVeg: false },
      { name: "Goat Vindaloo", price: 15.99, isVeg: false },
      { name: "Goat Masala", price: 15.99, isVeg: false },
      { name: "Goat Fry (12 oz)", price: 16.99, isVeg: false },
      { name: "Goat Keema", price: 16.99, isVeg: false },
      { name: "Gongura Goat Curry", price: 17.99, isVeg: false },
      { name: "Ulavacharu Mutton Curry", price: 17.99, isVeg: false },
      { name: "Chinta Chiguru Goat Curry", price: 17.99, isVeg: false },
      { name: "Ginger Goat Keema", price: 17.99, isVeg: false },
      { name: "Ginger Goat Keema", price: 17.99, isVeg: false },
    ] },
    { category: "Fish Entrees", items: [
      { name: "Fish Pulusu", price: 15.99, isVeg: false },
    ] },
    { category: "Shrimp Entrees", items: [
      { name: "Shrimp Masala", price: 15.99, isVeg: false },
    ] },
    { category: "Breads", items: [
      { name: "Garlic Naan", price: 3.29, isVeg: true },
      { name: "Butter Naan", price: 2.49, isVeg: true },
      { name: "Tandoori Roti", price: 2.29, isVeg: true },
      { name: "Butter Roti", price: 2.49, isVeg: true },
      { name: "Plain Naan", price: 2.29, isVeg: true },
      { name: "Chilli Naan", price: 2.99, isVeg: true },
    ] },
  ] },
  { section: "Biryanis", categories: [
    { category: "Veg Biryanis", items: [
      { name: "Veg Dum Biryani", price: 13.99, isVeg: true },
      { name: "Gongura Veg Biryani", price: 14.99, isVeg: true },
      { name: "Ulavacharu Veg Biryani", price: 14.99, isVeg: true },
      { name: "Chinta Chiguru Veg Biryani", price: 14.99, isVeg: true },
      { name: "Vijayawada Spl Veg Biryani", price: 14.99, isVeg: true },
    ] },
    { category: "Paneer Biryanis", items: [
      { name: "Paneer Biryani", price: 14.99, isVeg: true },
      { name: "Paneer Tikka Biryani", price: 14.99, isVeg: true },
      { name: "Paneer 65 Biryani", price: 14.99, isVeg: true },
      { name: "Gongura Paneer Biryani", price: 15.99, isVeg: true },
      { name: "Ulavacharu Paneer Biryani", price: 15.99, isVeg: true },
      { name: "Chintachiguru Paneer Biryani", price: 15.99, isVeg: true },
      { name: "Vijayawada Spl Paneer Biryani", price: 15.99, isVeg: true },
    ] },
    { category: "Egg Biryanis", items: [
      { name: "Egg Biryani", price: 13.99, isVeg: false },
      { name: "Gongura Egg Biryani", price: 14.99, isVeg: false },
      { name: "Ulavacharu Egg Biryani", price: 14.99, isVeg: false },
      { name: "Chinta Chiguru Egg Biryani", price: 14.99, isVeg: false },
      { name: "Vijayawada Spl Egg Biryani", price: 14.99, isVeg: false },
    ] },
    { category: "Chicken Biryanis", items: [
      { name: "Chicken Dum Biryani", price: 14.99, isVeg: false },
      { name: "Chicken Tikka Biryani", price: 14.99, isVeg: false },
      { name: "Chicken 65 Biryani", price: 14.99, isVeg: false },
      { name: "Chicken Fry Biryani", price: 14.99, isVeg: false },
      { name: "Gongura Chicken Biryani (BLS)", price: 15.99, isVeg: false },
      { name: "Ulavacharu Chicken Biryani", price: 15.99, isVeg: false },
      { name: "Chintachiguru Chicken Biryani", price: 15.99, isVeg: false },
      { name: "Vijayawada Spl Chicken Biryani (BLS)", price: 15.99, isVeg: false },
      { name: "Chicken Keema Biryani", price: 15.99, isVeg: false },
      { name: "Boneless Chicken Dum Biryani", price: 15.99, isVeg: false },
      { name: "Gongura Chicken Keema Biryani", price: 16.99, isVeg: false },
    ] },
    { category: "Goat/Mutton Biryanis", items: [
      { name: "Mutton Dum Biryani", price: 16.99, isVeg: false },
      { name: "Goat Fry Biryani", price: 16.99, isVeg: false },
      { name: "Gongura Goat Biryani", price: 17.99, isVeg: false },
      { name: "Ulavacharu Goat Biryani", price: 17.99, isVeg: false },
      { name: "Chintachiguru Mutton Biryani", price: 17.99, isVeg: false },
      { name: "Vijayawada Spl Mutton Biryani(Bone In)", price: 17.99, isVeg: false },
      { name: "Goat Keema Biryani", price: 17.99, isVeg: false },
      { name: "Gongura Mutton Keema Biryani", price: 18.99, isVeg: false },
      { name: "Boneless Goat Biryani", price: 18.99, isVeg: false },
    ] },
    { category: "Fish Biryanis", items: [
      { name: "Fish Biryani", price: 15.99, isVeg: false },
    ] },
    { category: "Shrimp Biryanis", items: [
      { name: "Shrimp Biryani", price: 15.99, isVeg: false },
      { name: "Shrimp Tikka Biryani", price: 16.49, isVeg: false },
      { name: "Shrimp 65 Biryani", price: 16.49, isVeg: false },
      { name: "Shrimp Fry Biryani", price: 16.49, isVeg: false },
      { name: "Gongura Shrimp Biryani", price: 16.99, isVeg: false },
      { name: "Ulavacharu Shrimp Biryani", price: 16.99, isVeg: false },
      { name: "Chintachiguru Shrimp Biryani", price: 16.99, isVeg: false },
      { name: "Vijayawada Spl Shrimp Biryani", price: 16.99, isVeg: false },
    ] },
  ] },
  { section: "Pulavs", categories: [
    { category: "Veg Pulavs", items: [
      { name: "Veg Pulav", price: 13.99, isVeg: true },
      { name: "Gongura Veg Pulav", price: 14.99, isVeg: true },
      { name: "Ulavacharu Veg Pulav", price: 14.99, isVeg: true },
      { name: "Chinta Chiguru Veg Pulav", price: 14.99, isVeg: true },
      { name: "Vijayawada Spl Veg Pulav", price: 14.99, isVeg: true },
    ] },
    { category: "Paneer Pulavs", items: [
      { name: "Paneer Pulav", price: 14.99, isVeg: true },
      { name: "Paneer Tikka Pulav", price: 14.99, isVeg: true },
      { name: "Paneer 65 Pulav", price: 14.99, isVeg: true },
      { name: "Gongura Paneer Pulav", price: 15.99, isVeg: true },
      { name: "Ulavacharu Paneer Pulav", price: 15.99, isVeg: true },
      { name: "Chintachiguru Paneer Pulav", price: 15.99, isVeg: true },
      { name: "Vijayawada Spl Paneer Pulav", price: 15.99, isVeg: true },
    ] },
    { category: "Egg Pulavs", items: [
      { name: "Egg Pulav", price: 13.99, isVeg: false },
      { name: "Gongura Egg Pulav", price: 14.99, isVeg: false },
      { name: "Ulavacharu Egg Pulav", price: 14.99, isVeg: false },
      { name: "Chintachiguru Egg Pulav", price: 14.99, isVeg: false },
      { name: "Vijayawada Spl Egg Pulav", price: 14.99, isVeg: false },
    ] },
    { category: "Chicken Pulavs", items: [
      { name: "Chicken Pulav (BLS)", price: 13.99, isVeg: false },
      { name: "Chicken Tikka Pulav (BLS)", price: 14.99, isVeg: false },
      { name: "Chicken 65 Pulav (BLS)", price: 14.99, isVeg: false },
      { name: "Chicken Fry Pulav (BLS)", price: 14.99, isVeg: false },
      { name: "Gongura Chicken Pulav (BLS)", price: 14.99, isVeg: false },
      { name: "Ulavacharu Chicken Pulav (BLS)", price: 15.99, isVeg: false },
      { name: "Chintachiguru Chicken Pulav (BLS)", price: 15.99, isVeg: false },
      { name: "Vijayawada Spl Chicken Pulav (BLS)", price: 15.99, isVeg: false },
      { name: "Chicken Keema Pulav", price: 14.99, isVeg: false },
      { name: "Gongura Chicken Keema Pulav", price: 15.99, isVeg: false },
    ] },
    { category: "Goat/Mutton Pulavs", items: [
      { name: "Goat Pulav", price: 16.99, isVeg: false },
      { name: "Goat Fry Pulav", price: 17.99, isVeg: false },
      { name: "Gongura Goat Pulav", price: 17.99, isVeg: false },
      { name: "Ulavacharu Goat Pulav", price: 17.99, isVeg: false },
      { name: "Chintachiguru Goat Pulav (Bone In)", price: 17.99, isVeg: false },
      { name: "Vijayawada Spl Mutton Pulav (Bone In )", price: 17.99, isVeg: false },
      { name: "Goat Keema Pulav", price: 17.99, isVeg: false },
      { name: "Spl Mutton Pulav (BLS)", price: 18.99, isVeg: false },
      { name: "Gongura Mutton Keema Pulav", price: 17.99, isVeg: false },
    ] },
    { category: "Fish Pulavs", items: [
      { name: "Fish Pulav (BLS)", price: 15.99, isVeg: false },
    ] },
    { category: "Shrimp Pulavs", items: [
      { name: "Shrimp Pulav", price: 15.99, isVeg: false },
      { name: "Shrimp Tikka Pulav", price: 16.49, isVeg: false },
      { name: "Shrimp 65 Pulav", price: 16.49, isVeg: false },
      { name: "Shrimp Fry Pulav", price: 16.49, isVeg: false },
      { name: "Gongura Shrimp Pulav", price: 16.99, isVeg: false },
      { name: "Ulavacharu Shrimp Pulav", price: 16.99, isVeg: false },
      { name: "Chintachiguru Shrimp Pulav", price: 16.99, isVeg: false },
      { name: "Vijayawada Spl Shrimp Pulav", price: 16.99, isVeg: false },
    ] },
  ] },
  { section: "Chaat & Street Food", categories: [
    { category: "Chaats (After 3PM)", items: [
      { name: "Pani Puri (6Pcs)", price: 5.99, isVeg: true },
      { name: "Masala Puri", price: 5.99, isVeg: true },
      { name: "Bhel Puri", price: 5.99, isVeg: true },
      { name: "Sev Puri", price: 5.99, isVeg: true },
      { name: "Dahi Puri", price: 5.99, isVeg: true },
      { name: "Samosa Chaat", price: 5.99, isVeg: true },
      { name: "Papdi Chaat", price: 5.99, isVeg: true },
      { name: "Aloo Chaat", price: 5.99, isVeg: true },
      { name: "Guava Chaat", price: 5.99, isVeg: true },
      { name: "Aloo Tikki Chaat", price: 5.99, isVeg: true },
      { name: "Mixed Fruit Chaat", price: 5.99, isVeg: true },
      { name: "Dahi Bhalla Chaat", price: 5.99, isVeg: true },
      { name: "Vada Pav (1Pc)", price: 5.99, isVeg: true },
      { name: "Samosa Pav", price: 5.99, isVeg: true },
      { name: "Misal Pav", price: 5.99, isVeg: true },
      { name: "Pav Bhaji (2Pcs)", price: 7.99, isVeg: true },
    ] },
    { category: "Grilled Sandwiches", items: [
      { name: "Veg Sandwich", price: 4.99, isVeg: true },
      { name: "Paneer Sandwich", price: 5.99, isVeg: true },
      { name: "Egg Sandwich", price: 4.99, isVeg: false },
      { name: "Chicken Sandwich", price: 5.99, isVeg: false },
    ] },
    { category: "Burgers", items: [
      { name: "Veg Burger", price: 7.99, isVeg: true },
      { name: "Chicken Burger", price: 8.99, isVeg: false },
      { name: "Mutton Burger", price: 9.99, isVeg: false },
    ] },
    { category: "Frankies", items: [
      { name: "Veg Frankie", price: 8.99, isVeg: true },
      { name: "Veg Manchurian Frankie", price: 9.99, isVeg: true },
      { name: "Paneer Frankie", price: 9.99, isVeg: true },
      { name: "Egg Frankie", price: 8.99, isVeg: false },
      { name: "Chicken Frankie", price: 9.99, isVeg: false },
      { name: "Chicken Tikka Frankie", price: 9.99, isVeg: false },
      { name: "Chicken 65 Frankie", price: 9.99, isVeg: false },
      { name: "Chicken Keema Frankie", price: 10.99, isVeg: false },
      { name: "Mutton Keema Frankie", price: 11.99, isVeg: false },
    ] },
  ] },
  { section: "Chettinad Specials", categories: [
    { category: "Chettinad Menu", items: [
      { name: "Thalapakattu Mutton Biryani", price: 17.99, isVeg: false },
      { name: "Chettinad Chicken Biryani", price: 15.99, isVeg: false },
      { name: "Chettinad Chicken", price: 13.99, isVeg: false },
      { name: "Chettinad Goat", price: 15.99, isVeg: false },
      { name: "Chettinad Fish", price: 14.99, isVeg: false },
      { name: "Chettinad Shrimp", price: 15.99, isVeg: false },
      { name: "Tandoori Silver Pompret (2Pcs)", price: 12.99, isVeg: false },
      { name: "Tandoori Silver Pompret (1Pc)", price: 7.99, isVeg: false },
      { name: "Fish Fry", price: 10.99, isVeg: false },
      { name: "Ceylon Paratha Egg", price: 10.99, isVeg: false },
      { name: "Ceylon Paratha Chicken", price: 11.99, isVeg: false },
      { name: "Veg Kothu Paratha", price: 10.99, isVeg: true },
      { name: "Egg Kothu Paratha", price: 11.99, isVeg: false },
      { name: "Chicken Kothu Paratha", price: 12.99, isVeg: false },
      { name: "Mutton Kothu Paratha", price: 13.99, isVeg: false },
      { name: "With Veg Colambu", price: 10.99, isVeg: true },
      { name: "With Chicken Colambu", price: 11.99, isVeg: false },
      { name: "With Goat Colambu", price: 12.99, isVeg: false },
      { name: "Extra Malabar Paratha", price: 2.99, isVeg: true },
      { name: "With Veg Colambu", price: 9.99, isVeg: true },
      { name: "With Chicken Colambu", price: 10.99, isVeg: false },
      { name: "With Goat Colambu", price: 11.99, isVeg: false },
    ] },
  ] },
  { section: "Indo-Chinese", categories: [
    { category: "Soups", items: [
      { name: "Sweet Corn Soup (16oz)", price: 4.99, isVeg: true },
      { name: "Manchow Soup (16oz)", price: 4.99, isVeg: true },
      { name: "Hot & Sour Soup (16oz)", price: 4.99, isVeg: true },
      { name: "Chicken Sweet Corn Soup (16oz)", price: 5.99, isVeg: false },
      { name: "Chicken Manchow Soup (16oz)", price: 5.99, isVeg: false },
      { name: "Chicken Hot & Sour Soup (16oz)", price: 5.99, isVeg: false },
      { name: "Shrimp Sweet Corn Soup (16oz)", price: 6.99, isVeg: false },
      { name: "Shrimp Manchow Soup (16oz)", price: 6.99, isVeg: false },
      { name: "Shrimp Hot & Sour Soup (16oz)", price: 6.99, isVeg: false },
    ] },
    { category: "Appetizers", items: [
      { name: "Chrispy Fried Baby Corn Salt & Pepper", price: 10.99, isVeg: true },
      { name: "Veg Manchurian", price: 9.99, isVeg: true },
      { name: "Gobi Manchurian", price: 9.99, isVeg: true },
      { name: "Paneer Manchurian", price: 10.99, isVeg: true },
      { name: "Baby Corn Manchurian", price: 9.99, isVeg: true },
      { name: "Chilli Baby Corn", price: 9.99, isVeg: true },
      { name: "Chilli Gobi", price: 9.99, isVeg: true },
      { name: "Chilli Paneer", price: 10.99, isVeg: true },
      { name: "Chrispy Chicken Salt & Pepper", price: 10.99, isVeg: false },
      { name: "Chicken Manchurian", price: 9.99, isVeg: false },
      { name: "Chilli Chicken", price: 9.99, isVeg: false },
      { name: "Chicken Lollipop (4Pcs) (Weekend)", price: 10.99, isVeg: false },
      { name: "Chilli Fish", price: 10.99, isVeg: false },
      { name: "Chrispy Shrimp Salt & Pepper", price: 10.99, isVeg: false },
    ] },
    { category: "Noodles", items: [
      { name: "Veg Soft Noodles", price: 11.99, isVeg: true },
      { name: "Veg Burnt Garlic Noodles", price: 12.99, isVeg: true },
      { name: "Veg Street Noodles", price: 12.99, isVeg: true },
      { name: "Veg Chilli Garlic Noodles", price: 12.99, isVeg: true },
      { name: "Veg Hongkong Style Noodles", price: 12.99, isVeg: true },
      { name: "Veg Manchurian Noodles", price: 12.99, isVeg: true },
      { name: "Mushroom Soft Noodles", price: 12.99, isVeg: true },
      { name: "Paneer Soft Noodles", price: 12.99, isVeg: true },
      { name: "Egg Soft Noodles", price: 11.99, isVeg: false },
      { name: "Egg Burnt Garlic Noodles", price: 12.99, isVeg: false },
      { name: "Egg Street Noodles", price: 12.99, isVeg: false },
      { name: "Egg Chilli Garlic Noodles", price: 12.99, isVeg: false },
      { name: "Egg Hongkong Style Noodles", price: 12.99, isVeg: false },
      { name: "Chicken Soft Noodles", price: 12.99, isVeg: false },
      { name: "Chicken Burnt Garlic Noodles", price: 13.99, isVeg: false },
      { name: "Chicken Street Noodles", price: 13.99, isVeg: false },
      { name: "Chicken Chilli Garlic Noodles", price: 13.99, isVeg: false },
      { name: "Chicken Hongkong Style Noodles", price: 13.99, isVeg: false },
      { name: "Chicken 65 Schezwan Noodles", price: 13.99, isVeg: false },
      { name: "Schezwan Chicken Manchuria Noodles", price: 13.99, isVeg: false },
      { name: "Shrimp Soft Noodles", price: 14.99, isVeg: false },
      { name: "Shrimp Burnt Garlic Noodles", price: 13.99, isVeg: false },
      { name: "Shrimp Street Noodles", price: 14.99, isVeg: false },
      { name: "Shrimp Chilli Garlic Noodles", price: 14.99, isVeg: false },
      { name: "Chilli Shrimp Hongkong Style Noodles", price: 14.99, isVeg: false },
      { name: "Spl Swadeshi Noodles (Egg,Chicken,Shrimp)", price: 14.99, isVeg: false },
    ] },
    { category: "Fried Rice", items: [
      { name: "Veg Fried Rice", price: 11.99, isVeg: true },
      { name: "Veg Burnt Garlic Fried Rice", price: 12.99, isVeg: true },
      { name: "Veg Street Fried Rice", price: 12.99, isVeg: true },
      { name: "Veg Chilli Garlic Fried Rice", price: 12.99, isVeg: true },
      { name: "Veg Chilli Hongkong Fried Rice", price: 12.99, isVeg: true },
      { name: "Schezwan Veg Manchuria Fried Rice", price: 12.99, isVeg: true },
      { name: "Mushroom Fried Rice", price: 12.99, isVeg: true },
      { name: "Paneer Fried Rice", price: 13.99, isVeg: true },
      { name: "Egg Fried Rice", price: 11.99, isVeg: false },
      { name: "Egg Burnt Garlic Fried Rice", price: 12.99, isVeg: false },
      { name: "Egg Street Fried Rice", price: 12.99, isVeg: false },
      { name: "Egg Chilli Garlic Rice", price: 12.99, isVeg: false },
      { name: "Egg Chilli Hongkong Fried Rice", price: 12.99, isVeg: false },
      { name: "Schezwan Egg Fried Rice", price: 12.99, isVeg: false },
      { name: "Chicken Fried Rice", price: 12.99, isVeg: false },
      { name: "Chicken Burnt Garlic Fried Rice", price: 13.99, isVeg: false },
      { name: "Chicken Street Fried Rice", price: 13.99, isVeg: false },
      { name: "Chicken Chilli Garlic Fried Rice", price: 13.99, isVeg: false },
      { name: "Chicken Chilli Hongkong Fried Rice", price: 13.99, isVeg: false },
      { name: "Chicken Manchurian Fried Rice", price: 13.99, isVeg: false },
      { name: "Chicken 65 Fried Rice", price: 13.99, isVeg: false },
      { name: "Shrimp Fried Rice", price: 13.99, isVeg: false },
      { name: "Shrimp Burnt Garlic Fried Rice", price: 14.99, isVeg: false },
      { name: "Shrimp Street Fried Rice", price: 14.99, isVeg: false },
      { name: "Shrimp Chilli Garlic Fried Rice", price: 14.99, isVeg: false },
      { name: "Shrimp Chilli Hongkong Fried Rice", price: 14.99, isVeg: false },
      { name: "Spl Swadeshi Fried Rice (Egg,Chicken,Shrimp)", price: 14.99, isVeg: false },
    ] },
  ] },
  { section: "Drinks & Desserts", categories: [
    { category: "Falooda", items: [
      { name: "Royal Falooda", price: 7.99, isVeg: true },
      { name: "Tutti - Frutti Falooda", price: 7.99, isVeg: true },
      { name: "Strawberry Falooda", price: 7.99, isVeg: true },
      { name: "Original Falooda", price: 7.99, isVeg: true },
      { name: "Mango Falooda", price: 7.99, isVeg: true },
      { name: "Jelly Falooda", price: 7.99, isVeg: true },
      { name: "Dry Fruit Falooda", price: 7.99, isVeg: true },
      { name: "Butterscotch Falooda", price: 7.99, isVeg: true },
      { name: "Meetha Paan Kulfi Falooda", price: 7.99, isVeg: true },
      { name: "Malai Kulfi Falooda", price: 7.99, isVeg: true },
      { name: "Kesar Pista Falooda", price: 7.99, isVeg: true },
      { name: "Chocolate Falooda", price: 7.99, isVeg: true },
    ] },
    { category: "Juices", items: [
      { name: "Pineapple Juice", price: 4.99, isVeg: true },
      { name: "Orange Juice", price: 5.99, isVeg: true },
      { name: "Sugar Cane Juice", price: 5.99, isVeg: true },
      { name: "Watermelon Juice", price: 4.99, isVeg: true },
      { name: "Pomegranate Juice", price: 6.99, isVeg: true },
    ] },
    { category: "Milk Shake", items: [
      { name: "Mango Milk Shake", price: 4.99, isVeg: true },
      { name: "Chiku Milk Shake", price: 4.99, isVeg: true },
      { name: "Gulkand Milk Shake", price: 4.99, isVeg: true },
      { name: "Banana Milk Shake", price: 4.99, isVeg: true },
      { name: "Sitafal Milk Shake", price: 4.99, isVeg: true },
      { name: "Masala Butter Milk", price: 3.99, isVeg: true },
    ] },
    { category: "Lassi", items: [
      { name: "Sweet Lassi", price: 3.99, isVeg: true },
      { name: "Salt Lassi", price: 3.99, isVeg: true },
      { name: "Mango Lassi", price: 4.99, isVeg: true },
      { name: "Gulkand Lassi", price: 4.99, isVeg: true },
    ] },
    { category: "Tea/Chai", items: [
      { name: "Masala Tea (Chai)", price: 0.99, isVeg: true },
      { name: "Irani Tea (Chai)", price: 1.99, isVeg: true },
    ] },
  ] },
];

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Stable id from category + name so identical dish names in different
// categories stay distinct. Shared by the storefront (add-to-cart) and the
// API server (price lookup) so both compute the exact same id.
export function menuItemId(category: string, name: string): string {
  return `${slug(category)}-${slug(name)}`;
}

export type CatalogEntry = {
  id: string;
  name: string;
  priceCents: number;
  isVeg: boolean;
  category: string;
};

let catalog: Map<string, CatalogEntry> | null = null;

function buildCatalog(): Map<string, CatalogEntry> {
  const map = new Map<string, CatalogEntry>();
  for (const section of FULL_MENU) {
    for (const cat of section.categories) {
      for (const item of cat.items) {
        const id = menuItemId(cat.category, item.name);
        // A few dish names repeat verbatim within the same category (source
        // data has real duplicates) — first occurrence wins, same price either way.
        if (!map.has(id)) {
          map.set(id, {
            id,
            name: item.name,
            priceCents: Math.round(item.price * 100),
            isVeg: item.isVeg,
            category: cat.category,
          });
        }
      }
    }
  }
  return map;
}

// The authoritative price/name lookup for a cart item id — the API server
// uses this to price orders instead of trusting whatever the client sends.
export function getMenuItem(id: string): CatalogEntry | undefined {
  if (!catalog) catalog = buildCatalog();
  return catalog.get(id);
}

export * from "./catering";
