// Deterministic value noise for world shapes: the same inputs always give the same terrain.

const hash = (i: number, seed: number) => {
  const n = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return n - Math.floor(n);
};
const hash2 = (i: number, j: number, seed: number) => {
  const n = Math.sin(i * 127.1 + j * 269.5 + seed * 113.3) * 43758.5453;
  return n - Math.floor(n);
};
const ease = (t: number) => t * t * (3 - 2 * t);

/** Smooth 1D noise in [-1, 1] with features about one unit apart. */
export function noise1(x: number, seed = 0) {
  const i = Math.floor(x),
    t = ease(x - i);
  return (hash(i, seed) * (1 - t) + hash(i + 1, seed) * t) * 2 - 1;
}

/** Layered 1D noise in roughly [-1, 1]. */
export function fbm1(x: number, seed = 0, octaves = 3) {
  let sum = 0,
    amp = 1,
    norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += noise1(x * 2 ** o, seed + o * 17) * amp;
    norm += amp;
    amp *= 0.5;
  }
  return sum / norm;
}

/** Smooth 2D noise in [0, 1]. */
export function noise2(x: number, y: number, seed = 0) {
  const i = Math.floor(x),
    j = Math.floor(y),
    tx = ease(x - i),
    ty = ease(y - j);
  const a = hash2(i, j, seed),
    b = hash2(i + 1, j, seed),
    c = hash2(i, j + 1, seed),
    d = hash2(i + 1, j + 1, seed);
  return (a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty;
}

/** Layered 2D noise in [0, 1]. */
export function fbm2(x: number, y: number, seed = 0, octaves = 3) {
  let sum = 0,
    amp = 1,
    norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += noise2(x * 2 ** o, y * 2 ** o, seed + o * 29) * amp;
    norm += amp;
    amp *= 0.5;
  }
  return sum / norm;
}
