import type { Request, Response } from "express";

// ponytail: in-memory fixed window, per process. Two ceilings worth knowing:
// a restart clears the counters, and a second server instance keeps its own.
// The app also does not set `trust proxy`, so behind a load balancer req.ip is
// the balancer and every caller shares one bucket — limits here are chosen to
// be unreachable by honest traffic even in that shared case. Upgrade path if
// this ever matters: set `trust proxy` to the real hop count and move counters
// to the database.
const windows = new Map<string, { count: number; resetAt: number }>();

// Counters are only kept while their window is open; sweep the dead ones so a
// stream of distinct keys can't grow the map without bound.
function sweep(now: number): void {
  for (const [key, w] of windows) {
    if (w.resetAt <= now) windows.delete(key);
  }
}

/** Records a hit. Returns false once the caller is over `limit` in `windowMs`. */
export function allow(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (windows.size > 5000) sweep(now);

  const w = windows.get(key);
  if (!w || w.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (w.count >= limit) return false;
  w.count += 1;
  return true;
}

/**
 * Express helper: sends a 429 and returns true when the caller is over budget,
 * so a route can `if (rateLimited(...)) return;`.
 */
export function rateLimited(
  req: Request,
  res: Response,
  bucket: string,
  limit: number,
  windowMs: number,
): boolean {
  if (allow(`${bucket}:${req.ip ?? "unknown"}`, limit, windowMs)) return false;
  res.status(429).json({ error: "Too many requests. Please try again shortly, or call the store." });
  return true;
}

/** Test seam — lets the self-check start from a clean slate. */
export function resetRateLimits(): void {
  windows.clear();
}
