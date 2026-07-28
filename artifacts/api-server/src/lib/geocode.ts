import type { LatLng } from "@workspace/delivery";

export type Address = {
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  zip: string;
};

// ponytail: swappable geocoder, mirroring sms.ts / mailer.ts. Uses Google Maps
// when GOOGLE_MAPS_API_KEY is set; otherwise a tiny zip table so the delivery
// flow runs in dev without a key. Returns null when an address can't be
// resolved — callers MUST fail closed (no coordinates ⇒ not eligible), never
// guess a location for something a customer will pay to have delivered.
export async function geocodeAddress(addr: Address): Promise<LatLng | null> {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  return key ? geocodeGoogle(addr, key) : geocodeDevFallback(addr);
}

function formatQuery(addr: Address): string {
  return [addr.line1, addr.line2, `${addr.city}, ${addr.state} ${addr.zip}`]
    .filter((part) => part && part.trim())
    .join(", ");
}

type GoogleGeocodeResponse = {
  status: string;
  results: Array<{ geometry: { location: { lat: number; lng: number } } }>;
};

async function geocodeGoogle(addr: Address, key: string): Promise<LatLng | null> {
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", formatQuery(addr));
  url.searchParams.set("region", "us");
  url.searchParams.set("key", key);

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error("Geocode HTTP error:", res.status);
      return null;
    }
    const data = (await res.json()) as GoogleGeocodeResponse;
    if (data.status !== "OK" || data.results.length === 0) return null;
    const { lat, lng } = data.results[0].geometry.location;
    return { lat, lng };
  } catch (e) {
    console.error("Geocode request failed:", e);
    return null;
  }
}

// Approximate centroids for the local zips, so the flow is exercisable without
// a Maps key. Unknown zips return null (fail closed), same as a real miss.
const ZIP_COORDS: Record<string, LatLng> = {
  "75035": { lat: 33.1035, lng: -96.811 }, // Frisco — store zip
  "75033": { lat: 33.115, lng: -96.85 }, // Frisco
  "75034": { lat: 33.14, lng: -96.86 }, // Frisco
  "75036": { lat: 33.13, lng: -96.9 }, // Frisco
  "75023": { lat: 33.05, lng: -96.75 }, // Plano
  "75024": { lat: 33.08, lng: -96.79 }, // Plano
  "75025": { lat: 33.09, lng: -96.75 }, // Plano
  "75078": { lat: 33.24, lng: -96.79 }, // Prosper (far)
  "75028": { lat: 33.03, lng: -97.07 }, // Flower Mound (far)
};

function geocodeDevFallback(addr: Address): LatLng | null {
  const zip5 = addr.zip.trim().slice(0, 5);
  return ZIP_COORDS[zip5] ?? null;
}
