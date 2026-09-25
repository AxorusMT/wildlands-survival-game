// The Frozen Choir (Band III): a mountain cathedral lost to the ice. Nothing rots here, and nothing
// is warm; when the choir sings, the cold deepens and the air itself holds you back.
import { fbm1, fbm2, noise1 } from '../../core/noise.ts';
import { EDGE, RW, flatten, seedOf, walkable } from './shared.ts';
import type { RealmGeometry, RealmTemplate } from './types.ts';

export const RIMESNOW = 44,
  CHOIRSTONE = 45;

/** How loud the hymn is at a moment: it swells every minute and a half and lasts ~18 seconds. */
export function hymnAt(t: number, seed = 0) {
  const cycle = 90,
    phase = (t + (seed % 83)) % cycle;
  return phase > cycle - 18 ? Math.min(1, (phase - (cycle - 18)) / 4, (cycle - phase) / 4) : 0;
}

function build(seed: number): RealmGeometry {
  const s = (k: number) => seedOf(seed, k);
  const arrive = 520,
    arena = RW - 1050;
  let ground = walkable((x) => {
    const peaks = fbm1(x / 1100, s(1), 3) * 320;
    return 1450 - peaks + 30 * noise1(x / 180, s(2));
  }, 16);
  ground = flatten(ground, arrive - 240, arrive + 240);
  ground = flatten(ground, arena - 520, arena + 520);
  const floor = walkable(ground);
  const arenaY = floor(arena);
  // An ice cave threads the mountain.
  const cave = walkable((x) => 2050 + 120 * fbm1(x / 1200, s(3)) + 24 * Math.sin(x / 200));
  const ladderXs = [0.15, 0.38, 0.6, 0.8].map((f) => Math.round(RW * f));
  const tile = (x: number, y: number) => {
    if (x < EDGE || x > RW - EDGE) return 27;
    const g = floor(x);
    // The cathedral: a vaulted roof over the arena.
    const ax = x - arena;
    if (Math.abs(ax) < 480 && y < g) {
      const roof = arenaY - 360 - 60 * Math.cos((ax / 480) * Math.PI * 0.5);
      if (y > roof - 40 && y < roof) return CHOIRSTONE;
      // Buttresses hang from the vault, leaving the nave floor clear for the fight.
      if (y > roof && y < roof + 150 && Math.abs(ax) % 240 < 28 && Math.abs(ax) > 100)
        return CHOIRSTONE;
      return 0;
    }
    if (y < g) return 0;
    const c = cave(x);
    if (y > c - 120 - 20 * Math.sin(x / 110) && y < c && x > 200 && x < RW - 200) return 0;
    if (ladderXs.some((lx) => Math.abs(x - lx) < 44) && y < c) return 0;
    if (y < g + 60) return RIMESNOW;
    return fbm2(x / 180, y / 140, s(4)) > 0.5 ? RIMESNOW : CHOIRSTONE;
  };
  return {
    tile,
    surface: floor,
    floors: [floor, floor, cave],
    ladders: ladderXs.map((x) => ({ x, top: floor(x) - 4, bottom: cave(x) - 20 })),
    arrive,
    arena,
    arenaFloor: floor,
  };
}

export const CHOIR: RealmTemplate = {
  id: 'choir',
  name: 'Frozen Choir',
  band: 3,
  note: 'A cathedral lost to the ice. Food never spoils here, but you freeze; when the choir sings, the cold bites deeper and holds you back.',
  sky: 'open',
  temp: -22,
  ambient: [0.1, 0.12, 0.16],
  daylight: 0.8,
  wall: CHOIRSTONE,
  hazard: {
    id: 'hymn',
    name: 'The hymn',
    text: 'Every minute and a half the choir sings. While it sings you move slowly and the cold deepens, unless you stand by a fire.',
    ward: 'hymnward',
  },
  fragment: 'choir_fragment',
  key: 'choir_key',
  material: 'rime_silver_ore',
  relic: 'hymnal_bell',
  boss: 'the_hymnal',
  elite: 'grand_cantor',
  music: 'choir',
  ores: ['rime_silver_ore', 'silver_ore', 'sapphire'],
  nodes: [
    ['rime_silver_ore', 5],
    ['ice', 4],
    ['frost_lily', 3],
    ['wood', 2],
    ['silver_ore', 2],
    ['sapphire', 1],
    ['crystal', 2],
  ],
  nodeCount: 68,
  mobs: [
    { type: 'rime_wolf', weight: 4 },
    { type: 'bell_golem', weight: 2 },
    { type: 'cantor', weight: 3 },
    { type: 'choir_wraith', weight: 3, air: true },
    { type: 'frost_moth', weight: 2, air: true },
  ],
  mobCount: 38,
  chests: 5,
  chestLoot: [
    ['choir_fragment', 1, 2, 0.6],
    ['barrow_fragment', 1, 1, 0.3],
    ['rime_silver', 3, 5, 0.8],
    ['frost_shard', 3, 6, 0.8],
    ['healing_draught', 2, 4, 1],
    ['starmetal_ingot', 1, 3, 0.4],
    ['life_fruit', 1, 1, 0.2],
  ],
  biome: {
    id: 'choir',
    name: 'Frozen Choir',
    x: 12,
    y: 0,
    color: '#a8c0d8',
    shade: '#e8f4ff',
    temp: -22,
    note: 'A mountain cathedral lost to the ice.',
    resources: ['rime_silver_ore', 'ice', 'frost_lily'],
  },
  build,
  extra(geo, ctx) {
    // Braziers along the way: the only warmth when the hymn begins.
    for (const f of [0.22, 0.45, 0.66]) {
      const lx = RW * f + 120,
        x = ctx.x0 + lx;
      ctx.furnish('kiln', x, ctx.floorAt(x, geo.floors[0](lx) - 30));
    }
  },
};
