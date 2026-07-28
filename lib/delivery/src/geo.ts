import { DELIVERY_CONFIG, type LatLng } from "./config";

const EARTH_RADIUS_METERS = 6_371_000;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Great-circle distance between two points in meters (haversine). Pure — no
 * network. The authoritative straight-line check; road distance (via the Maps
 * Distance Matrix) is a later refinement, but straight-line is the honest,
 * conservative gate for "are you within the radius".
 */
export function haversineMeters(a: LatLng, b: LatLng): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Distance from the store to a destination, in meters. */
export function distanceFromStoreMeters(dest: LatLng): number {
  return haversineMeters(DELIVERY_CONFIG.origin, dest);
}

/** True when the destination is within the 5-mile delivery radius. */
export function isWithinDeliveryRadius(dest: LatLng): boolean {
  return distanceFromStoreMeters(dest) <= DELIVERY_CONFIG.radiusMeters;
}

export type EligibilityResult = {
  eligible: boolean;
  distanceMeters: number;
  deliveryFeeCents: number;
};

/**
 * Server-authoritative eligibility + fee for a geocoded destination. The
 * browser never supplies distance or fee — it sends an address, the server
 * geocodes it, and this decides. Fee is flat today; swap in distance/zone
 * tiers here without touching callers.
 */
export function evaluateDelivery(dest: LatLng): EligibilityResult {
  const distanceMeters = distanceFromStoreMeters(dest);
  const eligible = distanceMeters <= DELIVERY_CONFIG.radiusMeters;
  return {
    eligible,
    distanceMeters: Math.round(distanceMeters),
    deliveryFeeCents: DELIVERY_CONFIG.feeCents,
  };
}
