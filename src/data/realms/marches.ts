// The Bone Marches (Band II): a grey fen where giants died. Their ribs arch over the mire, their
// marrow has turned the mud to poison, and a catacomb of old bone runs underneath.
import { fbm1, fbm2, noise1 } from '../../core/noise.ts';
import { EDGE, RW, flatten, seedOf, walkable } from './shared.ts';
import type { RealmGeometry, RealmTemplate } from './types.ts';

export const MARROW_MUD = 38,
  BONEROCK = 39;

export interface MarchesGeometry extends RealmGeometry {
  /** The mire's surface: below it, in the basins, you wade through poisoned mud. */
  mire: number;
}

function build(seed: number): MarchesGeometry {
  const s = (k: number) => seedOf(seed, k);
  const arrive = 520,
    arena = RW - 1000,
    base = 1500;
  let ground = walkable((x) => {
    // Low hummocks between wide basins.
    const basin = Math.max(0, fbm1(x / 900, s(1), 2)) * 140;
    return base - 40 * fbm1(x / 300, s(2)) + basin;
  }, 10);
  ground = flatten(ground, arrive - 240, arrive + 240, base - 40);
  ground = flatten(ground, arena - 440, arena + 440, base - 30);
  const floor = walkable(ground);
  const mire = base + 20;
  const crypt = walkable((x) => 2050 + 80 * fbm1(x / 1000, s(3)) + 20 * Math.sin(x / 150));
  // Great ribcages: pairs of curved bones arching over the fen.
  const ribs = Array.from({ length: 9 }, (_, i) => ({
    x: 900 + i * ((RW - 1800) / 9) + 200 * noise1(i * 3.7, s(4)),
    r: 150 + 60 * Math.abs(noise1(i * 1.1, s(5))),
  })).filter((r) => Math.abs(r.x - arrive) > 360 && Math.abs(r.x - arena) > 600);
  const ladderXs = [0.15, 0.37, 0.6, 0.84].map((f) => Math.round(RW * f));
  const tile = (x: number, y: number) => {
    if (x < EDGE || x > RW - EDGE) return 27;
    const g = floor(x);
    if (y < g) {
      // A rib: a thin arc of bone, open beneath.
      for (const r of ribs) {
        const d = Math.hypot((x - r.x) / 1.4, y - floor(r.x) - 10);
        if (d > r.r - 14 && d < r.r && y < floor(r.x) - 20) return BONEROCK;
      }
      return 0;
    }
    const c = crypt(x);
    if (y > c - 110 - 12 * Math.sin(x / 70) && y < c && x > 200 && x < RW - 200) return 0;
    if (ladderXs.some((lx) => Math.abs(x - lx) < 44) && y < c) return 0;
    if (y > g + 80 && fbm2(x / 170, y / 120, s(6)) > 0.7) return BONEROCK;
    return y < g + 110 ? MARROW_MUD : BONEROCK;
  };
  return {
    tile,
    surface: floor,
    floors: [floor, floor, crypt],
    ladders: ladderXs.map((x) => ({ x, top: floor(x) - 4, bottom: crypt(x) - 20 })),
    arrive,
    arena,
    arenaFloor: floor,
    mire,
  };
}

export const MARCHES: RealmTemplate = {
  id: 'marches',
  name: 'Bone Marches',
  band: 2,
  note: 'A grey fen of giant bones. Marrow poisons the mire; wading through it slows you and festers in the blood.',
  sky: 'open',
  temp: 9,
  ambient: [0.08, 0.08, 0.07],
  daylight: 0.7,
  wall: MARROW_MUD,
  hazard: {
    id: 'mire',
    name: 'Marrow mire',
    text: 'The basins are full of poisoned mud. Wading slows you to a crawl, soaks and chills you, and can bring on marrow rot.',
    ward: 'mirewalk',
  },
  fragment: 'marches_fragment',
  key: 'marches_key',
  material: 'marrow_iron_ore',
  relic: 'hydra_tooth',
  boss: 'ossuary_hydra',
  elite: 'bone_colossus',
  music: 'marches',
  ores: ['marrow_iron_ore', 'iron_ore', 'gold_ore'],
  nodes: [
    ['marrow_iron_ore', 5],
    ['reeds', 4],
    ['herb', 3],
    ['wood', 2],
    ['clay', 2],
    ['gold_ore', 1],
    ['onyx', 1],
    ['water', 1],
  ],
  nodeCount: 72,
  mobs: [
    { type: 'bone_hound', weight: 4 },
    { type: 'mire_leech', weight: 3 },
    { type: 'ossuary_knight', weight: 2 },
    { type: 'marsh_ghoul', weight: 3 },
    { type: 'carrion_crow', weight: 3, air: true },
  ],
  mobCount: 38,
  chests: 4,
  chestLoot: [
    ['marches_fragment', 1, 2, 0.6],
    ['glasswood_fragment', 1, 1, 0.3],
    ['marrow_ingot', 2, 4, 0.7],
    ['antibiotic', 1, 2, 0.6],
    ['healing_draught', 2, 3, 1],
    ['bone', 6, 12, 0.8],
    ['life_crystal', 1, 1, 0.2],
  ],
  biome: {
    id: 'marches',
    name: 'Bone Marches',
    x: 9,
    y: 0,
    color: '#6a6a5a',
    shade: '#b0aa98',
    temp: 9,
    note: 'A grey fen where giants died.',
    resources: ['marrow_iron_ore', 'reeds', 'herb', 'bone'],
  },
  build,
};
