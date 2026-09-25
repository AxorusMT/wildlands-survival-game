// The Training Grounds: a short, hand-laid course a new expedition can start in. It is a
// realm like any other (it fills the pocket strip), but it is never in the Atlas, never
// opened by a key, and has no great foe. Every station is placed, not rolled.
import { STATIONS } from '../tutorial.ts';
import { EDGE } from './shared.ts';
import type { RealmGeometry, RealmTemplate } from './types.ts';

const SOIL = 1,
  STONE = 2,
  BEDROCK = 27;
/** Ground level, the hollow beneath the ledges, and where the course ends. */
export const COURSE_GROUND = 1280;
const G = COURSE_GROUND,
  HOLLOW_TOP = G + 160,
  HOLLOW_FLOOR = G + 256,
  HOLLOW: [number, number] = [900, 1260],
  LADDERS = [940, 1220],
  END = 4520;
/** Where the climbing lesson counts as done: down in the hollow. */
export const COURSE_HOLLOW = { x0: HOLLOW[0], x1: HOLLOW[1], y: HOLLOW_TOP + 20 };
/** The bramble patch that teaches bleeding and bandages. */
export const COURSE_BRAMBLES: [number, number] = [3590, 3700];

/** The walking line: a step, a gap, a rocky outcrop, and a sunken pen. */
function floor(x: number) {
  if (x >= 640 && x < 780) return G - 64;
  if (x >= 780 && x < 860) return G + 64;
  if (x >= 2380 && x < 2720) return G - 64;
  if (x >= 2860 && x < 3200) return G + 96;
  if (x >= 3200 && x < 3260) return G + 32;
  return G;
}

function build(): RealmGeometry {
  const tile = (x: number, y: number) => {
    if (x < EDGE || x > END) return BEDROCK;
    const g = floor(x);
    if (y >= HOLLOW_TOP && y < HOLLOW_FLOOR && x > HOLLOW[0] && x < HOLLOW[1]) return 0;
    if (LADDERS.some((lx) => Math.abs(x - lx) < 40) && y < HOLLOW_FLOOR) return 0;
    if (y < g) return 0;
    if (x >= 2380 && x < 2720 && y < G + 32) return STONE;
    return y < g + 96 ? SOIL : STONE;
  };
  return {
    tile,
    surface: floor,
    floors: [floor, () => HOLLOW_FLOOR],
    ladders: LADDERS.map((x) => ({ x, top: floor(x) - 4, bottom: HOLLOW_FLOOR - 20 })),
    arrive: 300,
    arena: 4420,
    arenaFloor: floor,
  };
}

export const TRAINING: RealmTemplate = {
  id: 'tutorial',
  name: 'The Training Grounds',
  band: 0,
  course: true,
  note: 'A short course that teaches the ways of the wildlands, one station at a time.',
  sky: 'open',
  temp: 16,
  ambient: [0.12, 0.12, 0.1],
  daylight: 1,
  wall: SOIL,
  hazard: { id: 'none', name: '', text: 'Nothing here is out to kill you.', ward: '' },
  fragment: '',
  key: '',
  material: '',
  relic: '',
  boss: '',
  elite: '',
  music: 'meadow',
  ores: [],
  nodes: [],
  nodeCount: 0,
  mobs: [],
  mobCount: 0,
  chests: 0,
  chestLoot: [],
  biome: {
    id: 'tutorial',
    name: 'Training Grounds',
    x: 0,
    y: 0,
    color: '#7ea860',
    shade: '#c8e0a8',
    temp: 16,
    note: 'A gentle meadow laid out for learning.',
    resources: ['wood', 'stone', 'fiber', 'copper_ore'],
  },
  build,
  extra(geo, ctx) {
    const at = (lx: number) => ctx.floorAt(ctx.x0 + lx, geo.surface(lx) - 30);
    const put = (type: string, lx: number, kind?: string) =>
      ctx.furnish(type, ctx.x0 + lx, at(lx), kind);
    STATIONS.forEach((s, i) => put('signpost', s.at, String(i)));
    // The grove: wood, stone and fibre to spare.
    const node = (kind: string, lx: number) => ctx.node(kind, ctx.x0 + lx, at(lx));
    for (let i = 0; i < 5; i++) node('wood', 1420 + i * 100);
    for (const lx of [1470, 1570, 1670, 1770, 1870, 1930]) node('stone', lx);
    for (const lx of [1290, 1375, 1990]) node('fiber', lx);
    // The pond, and ore on the outcrop.
    for (const lx of [2120, 2220]) node('water', lx);
    for (const lx of [2460, 2560, 2660]) node('copper_ore', lx);
    // The pen: one slime to fight, and deer to hunt.
    ctx.mob('slime', ctx.x0 + 2960, at(2960));
    for (const lx of [3060, 3140]) ctx.mob('deer', ctx.x0 + lx, at(lx));
    // Cold storage, stocked with ice.
    put('icebox', 3440);
    // Brambles, and bandages beyond them.
    for (let lx = COURSE_BRAMBLES[0] + 10; lx < COURSE_BRAMBLES[1]; lx += 36) put('bramble', lx);
    ctx.chest(ctx.x0 + 3760, at(3760), [['bandage', 2, 2, 1]]);
    // A coat to wear.
    ctx.chest(ctx.x0 + 3920, at(3920), [['oilskin_coat', 1, 1, 1]]);
    put('waystone', 4110);
    // The way out.
    put('portal', 4420, 'course');
  },
};
