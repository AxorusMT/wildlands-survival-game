import type { Point } from './types.ts';

/** Clamps v into [a, b]; with one argument, into [0, 1]. */
export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
/** Smoothstep from a to b. */
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
