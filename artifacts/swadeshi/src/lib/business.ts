// Single source of truth for business info. Ported from the prior Next.js
// site (lib/business.ts); data confirmed by owner. Keep literals out of pages —
// import from here so address/phone/hours change in one place.

export const BUSINESS = {
  name: "Swadeshi Plaza Of Frisco",
  shortName: "Swadeshi",
  tagline: "Grocery • Halal Meat • Indian Kitchen",
  address: "14300 State Hwy 121 #100, Frisco, TX 75035",
  street: "14300 State Hwy 121 #100",
  city: "Frisco",
  state: "TX",
  zip: "75035",
  phoneDisplay: "(469) 294-3500",
  phoneTel: "tel:+14692943500",
  email: "Spfrisco@gmail.com",
  website: "https://www.swadeshius.com/",
  facebook: "https://www.facebook.com/spfrisco/",
  instagram: "https://www.instagram.com/swadeshi_frisco/",
  instagramHandle: "@swadeshi_frisco",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Swadeshi+Plaza+Of+Frisco%2C+14300+State+Hwy+121+%23100%2C+Frisco%2C+TX+75035",
  mapsEmbed:
    "https://www.google.com/maps?q=Swadeshi+Plaza+Of+Frisco,+14300+State+Hwy+121+%23100,+Frisco,+TX+75035&output=embed",
  // Phase 1 checkout boundary: the store's live Heartland-hosted ordering page.
  // Do not infer gateway API access or kitchen-routing details from this URL;
  // those are separate Phase 2 gates that require written Heartland confirmation.
  orderUrl: "https://swadeshifrisco.hrpos.heartland.us/menu",
  // Marketplace delivery (published on swadeshius.com), kept as alternatives:
  deliveryUrl:
    "https://www.order.store/store/swadeshi-plaza-of-frisco/umRx8vJ7SnuXt6GWeWcNPw",
  groceryOrderUrl:
    "https://www.grubhub.com/restaurant/swadeshi-grocery-frisco-14300-texas-121-ste-100-frisco/5608512",
  // Hours confirmed by owner (July 7, 2026).
  hours: [
    "Sunday – Thursday: 8:00 AM – 10:00 PM",
    "Friday – Saturday: 8:00 AM – 11:00 PM",
  ],
  hoursShort: "Open daily · Sun–Thu 8 AM–10 PM · Fri–Sat 8 AM–11 PM",
} as const;

// Frisco is the primary store. The other four are additional locations, linked
// by their own Google Maps pins. Secondary street addresses are approximate
// from the map pin — confirm exact suites.
export const LOCATIONS = [
  {
    name: "Swadeshi Plaza of Frisco",
    area: "Frisco",
    address: BUSINESS.address,
    mapsUrl: BUSINESS.mapsUrl,
    isPrimary: true,
  },
  {
    name: "Swadeshi Flower Mound",
    area: "Flower Mound",
    address: "2608 Flower Mound Rd, Flower Mound, TX 75028",
    mapsUrl: "https://maps.app.goo.gl/xHBs7FkGFArPRC6a8",
    isPrimary: false,
  },
  {
    name: "Swadeshi Castle Hills",
    area: "Lewisville",
    address: "Castle Hills, Lewisville, TX 75056",
    mapsUrl: "https://maps.app.goo.gl/zMTvbDcA7u3wVkLf9",
    isPrimary: false,
  },
  {
    name: "Swadeshi Indian Cuisine",
    area: "North Dallas",
    address: "McCallum Blvd, Dallas, TX 75252",
    mapsUrl: "https://maps.app.goo.gl/Sa1RtcGySZBkM1Na6",
    isPrimary: false,
  },
  {
    name: "Swadeshi Prosper",
    area: "Prosper",
    address: "16809 S Coit Rd, Frisco, TX 75078",
    mapsUrl: "https://maps.app.goo.gl/3Rh2TpZr6CKh8ueg6",
    isPrimary: false,
  },
] as const;

export const ORDER_HREF = BUSINESS.orderUrl;
export const ORDER_LABEL = "Order Online";
