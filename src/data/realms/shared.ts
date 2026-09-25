// Shared terrain helpers for realm templates.
import { DIM_WIDTH } from '../dimensions.ts';

/** Width of a realm's strip, in world pixels. */
export const RW = DIM_WIDTH;
/** Bedrock walls at either end of the strip. */
export const EDGE = 64;

/** A seed-specific offset for one noise channel. */
export const seedOf = (seed: number, k: number) => (seed % 9973) + k * 131;

/**
 * Samples a height function and limits slopes so every hill can be walked: the low side of
 * anything steeper than `rise` per 16 px is raised, leaving scree below cliffs.
 */
export function walkable(fn: (x: number) => number, rise = 14) {
  const step = 16,
    n = Math.ceil(RW / step) + 1,
    h = new Float32Array(n);
  for (let i = 0; i < n; i++) h[i] = fn(i * step);
  for (let i = 1; i < n; i++) h[i] = Math.min(h[i], h[i - 1] + rise);
  for (let i = n - 2; i >= 0; i--) h[i] = Math.min(h[i], h[i + 1] + rise);
  return (x: number) => {
    const f = Math.max(0, Math.min(RW, x)) / step,
      i = Math.min(n - 2, Math.floor(f)),
      t = f - i;
    return h[i] * (1 - t) + h[i + 1] * t;
  };
}

/** Eases a height function toward a flat level across [x0, x1], for arenas and arrivals. */
export function flatten(fn: (x: number) => number, x0: number, x1: number, level?: number) {
  const mid = (x0 + x1) / 2,
    at = level ?? fn(mid),
    fade = 260;
  return (x: number) => {
    const d = x < x0 ? x0 - x : x > x1 ? x - x1 : 0,
      k = d >= fade ? 0 : 1 - d / fade,
      s = k * k * (3 - 2 * k);
    return fn(x) * (1 - s) + at * s;
  };
}

/** Picks from weighted entries. */
export function weighted<T>(rng: () => number, list: [T, number][]): T {
  const total = list.reduce((n, [, w]) => n + w, 0);
  let r = rng() * total;
  for (const [v, w] of list) if ((r -= w) <= 0) return v;
  return list[list.length - 1][0];
}
