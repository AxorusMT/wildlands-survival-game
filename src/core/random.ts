// A small linear congruential generator so a seed always rebuilds the same world.
const RANDOM_GENERATOR = {
  multiplier: 1_664_525,
  increment: 1_013_904_223,
  modulus: 2 ** 32,
} as const;

export type Rng = () => number;

export function seededRandom(seed: number): Rng {
  let s = seed >>> 0;
  return () =>
    (s = (RANDOM_GENERATOR.multiplier * s + RANDOM_GENERATOR.increment) >>> 0) /
    RANDOM_GENERATOR.modulus;
}

export const pick = <T>(r: Rng, a: T[]): T => a[Math.floor(r() * a.length)];
