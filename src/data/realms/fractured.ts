// The Fractured Realms: beyond Band V the realms come apart. Each expedition splices two realms at
// a seam, borrows one of their hazards, gathers creatures from both, and calls a great foe from
// anywhere, empowered. The tiers never end.
import { seededRandom } from '../../core/random.ts';
import { RW } from './shared.ts';
import type { Loot, RealmGeometry, RealmTemplate } from './types.ts';

/** Hazards that depend on their own realm's shape (water lines, mire, magma) cannot travel. */
const PORTABLE = new Set([
  'ash',
  'cavein',
  'shards',
  'traps',
  'sun',
  'hymn',
  'fever',
  'stars',
  'curse',
  'seasons',
]);

export const FRACTURED_LOOT: Loot[] = [
  ['fracture_shard', 2, 4, 1],
  ['ascended_ingot', 1, 2, 0.35],
  ['voidsteel_ingot', 2, 4, 0.6],
  ['healing_draught', 3, 5, 1],
  ['life_fruit', 1, 1, 0.3],
];

/** The Atlas entry: what every Fractured expedition shares. */
export const FRACTURED: RealmTemplate = {
  id: 'fractured',
  name: 'Fractured Realms',
  band: 6,
  note: 'Where the realms come apart. Every expedition splices two realms at a seam, borrows a hazard, and calls a great foe from anywhere, empowered. The tiers never end.',
  sky: 'open',
  temp: 12,
  ambient: [0.1, 0.08, 0.14],
  daylight: 0.8,
  wall: 23,
  hazard: {
    id: 'ash',
    name: 'Borrowed',
    text: 'Each Fractured Realm borrows the hazard of one of the realms it is made from.',
    ward: '',
  },
  fragment: 'fracture_shard',
  key: 'fractured_key',
  material: 'fracture_shard',
  relic: 'world_prism',
  boss: 'unmaker',
  elite: 'void_stalker',
  music: 'fractured',
  ores: [],
  nodes: [['stone', 1]],
  nodeCount: 70,
  mobs: [],
  mobCount: 46,
  chests: 6,
  chestLoot: FRACTURED_LOOT,
  biome: {
    id: 'fractured',
    name: 'Fractured Realms',
    x: 19,
    y: 0,
    color: '#8a6aa8',
    shade: '#e0c0ff',
    temp: 12,
    note: 'Where the realms come apart.',
    resources: ['fracture_shard'],
  },
  build: (seed) => fracture(seed, POOL()).build(seed),
};

// The realms it can be made of (set by index.ts, which knows them all).
let POOL: () => RealmTemplate[] = () => [];
export function setFracturePool(pool: () => RealmTemplate[]) {
  POOL = pool;
}

const made = new Map<number, RealmTemplate>();
/** The spliced template for a seed: the left of one realm, the right of another. */
export function fracture(seed: number, pool = POOL()): RealmTemplate {
  const hit = made.get(seed);
  if (hit) return hit;
  const rng = seededRandom(seed ^ 0xf4ac7);
  const portable = pool.filter((r) => PORTABLE.has(r.hazard.id));
  const a = portable[Math.floor(rng() * portable.length)],
    others = pool.filter((r) => r.id !== a.id),
    b = others[Math.floor(rng() * others.length)],
    bosses = pool.map((r) => r.boss),
    boss = bosses[Math.floor(rng() * bosses.length)];
  const mid = Math.round(RW / 2);
  const tpl: RealmTemplate = {
    ...FRACTURED,
    name: `Fractured ${a.name} · ${b.name}`,
    sky: a.sky === 'open' || b.sky === 'open' ? 'open' : 'cavern',
    temp: Math.round((a.temp + b.temp) / 2),
    ambient: a.ambient,
    daylight: Math.max(a.daylight, b.daylight),
    wall: a.wall,
    hazard: a.hazard,
    boss,
    elite: rng() < 0.5 ? a.elite : b.elite,
    music: 'fractured',
    ores: [...a.ores, ...b.ores],
    nodes: [...a.nodes, ...b.nodes, ['fracture_shard', 3]],
    mobs: [...a.mobs, ...b.mobs],
    chestLoot: [...FRACTURED_LOOT, ...a.chestLoot.slice(2, 4), ...b.chestLoot.slice(2, 4)],
    biome: { ...a.biome, id: 'fractured', name: `Fractured ${a.name}` },
    biomeAt: (lx) => (lx < mid ? a.biome : b.biome),
    build(s) {
      const ga = a.build(s),
        gb = b.build(s + 1);
      const pick =
        <T>(fa: (x: number) => T, fb: (x: number) => T) =>
        (x: number) =>
          x < mid ? fa(x) : fb(x);
      const surface = pick(ga.surface, gb.surface),
        main = pick(ga.floors[0], gb.floors[0]),
        low = pick(ga.floors[ga.floors.length - 1], gb.floors[gb.floors.length - 1]);
      // The seam: a shaft cut through both, with a ladder spanning their floors.
      const top = Math.min(ga.floors[0](mid - 60), gb.floors[0](mid + 60)) - 60,
        bottom = Math.max(ga.floors[0](mid - 60), gb.floors[0](mid + 60), low(mid)) + 10;
      const geo: RealmGeometry = {
        ...ga,
        tile: (x, y) => {
          if (Math.abs(x - mid) < 60 && y > top - 200 && y < bottom) return 0;
          if (Math.abs(x - mid) < 60 && y >= bottom && y < bottom + 40) return 23;
          return x < mid ? ga.tile(x, y) : gb.tile(x, y);
        },
        surface,
        floors: [main, main, low],
        ladders: [
          ...ga.ladders.filter((l) => l.x < mid - 100),
          ...gb.ladders.filter((l) => l.x > mid + 100),
          { x: mid, top: top - 4, bottom: bottom - 20 },
        ],
        arrive: ga.arrive,
        arena: gb.arena,
        arenaFloor: gb.arenaFloor,
      };
      return geo;
    },
    extra(geo, ctx) {
      a.extra?.(geo, ctx);
    },
  };
  if (made.size > 8) made.clear();
  made.set(seed, tpl);
  return tpl;
}
