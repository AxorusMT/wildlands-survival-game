// Art direction data for the pixel renderer: per-region palettes, ground materials, and the
// time-of-day light curves. Colours follow the original field-journal palette: muted, earthy,
// and a little warm, which is what keeps this from looking like any other pixel game.
import * as D from '../data/index.ts';
import { clamp } from './px.ts';
import type { RenderGame } from './types.ts';

export { D };

export type TreeStyle =
  | 'oak'
  | 'birch'
  | 'pine'
  | 'snowpine'
  | 'palm'
  | 'willow'
  | 'cactus'
  | 'dead'
  | 'shroom'
  | 'crystal'
  | 'skytree'
  | 'voidtree';
export interface RegionArt {
  /** Sky top and horizon by day. */
  sky: [string, string];
  /** Four parallax layers, far to near. */
  hills: string[];
  skyline: 'sea' | 'rolling' | 'peaks' | 'dunes' | 'mesa' | 'spires' | 'islands' | 'shards';
  tree: TreeStyle;
  leaves: string[];
  bark: string;
  grass: string[];
  cap: 'grass' | 'snow' | 'sand' | 'dust' | 'moss' | 'mycel' | 'none';
  flowers: string[];
  snowy?: boolean;
  /** An otherworldly sky: no sun, moon, or clouds, and the stars always out. */
  alien?: boolean;
}

export const ART: Record<string, RegionArt> = {
  coast: {
    sky: ['#86b4c8', '#f0e7cf'],
    hills: ['#9dbcbf', '#86a9a7', '#6d918a', '#56766c'],
    skyline: 'sea',
    tree: 'palm',
    leaves: ['#3e6a4d', '#58865b', '#7fa56d'],
    bark: '#8a6a48',
    grass: ['#5e8446', '#7ea35a', '#a3c173'],
    cap: 'grass',
    flowers: ['#f2efe2', '#e7c56a'],
  },
  marsh: {
    sky: ['#9fb3a0', '#e7e0c3'],
    hills: ['#a7b39c', '#8d9d82', '#728668', '#5a6e52'],
    skyline: 'rolling',
    tree: 'willow',
    leaves: ['#4f6a3b', '#6b8549', '#91a862'],
    bark: '#5d4a36',
    grass: ['#566f40', '#728a4f', '#94ab66'],
    cap: 'grass',
    flowers: ['#d9d3ea', '#f1e8c8'],
  },
  forest: {
    sky: ['#97bcaa', '#ece3c6'],
    hills: ['#9fb4a0', '#7d987f', '#5d7a62', '#46624d'],
    skyline: 'rolling',
    tree: 'oak',
    leaves: ['#2f5636', '#46703f', '#6c9453'],
    bark: '#5a4230',
    grass: ['#4b7440', '#65904e', '#88b064'],
    cap: 'grass',
    flowers: ['#f0ead6', '#c9a3c9'],
  },
  meadow: {
    sky: ['#9fc8d6', '#f2e6c5'],
    hills: ['#b7c4a3', '#9cb286', '#7e9b6b', '#657f55'],
    skyline: 'rolling',
    tree: 'birch',
    leaves: ['#4a7043', '#648e4d', '#8cb163'],
    bark: '#e8e1cf',
    grass: ['#65904a', '#86ae5a', '#aacb76'],
    cap: 'grass',
    flowers: ['#f4f0e0', '#f0cf5e', '#c58fc0', '#e0816a'],
  },
  taiga: {
    sky: ['#99b3bf', '#e5e3d4'],
    hills: ['#a3b5b3', '#83999a', '#627c79', '#4a625f'],
    skyline: 'rolling',
    tree: 'pine',
    leaves: ['#26473d', '#365f50', '#52806b'],
    bark: '#57402f',
    grass: ['#4f6b4c', '#66845e', '#84a078'],
    cap: 'grass',
    flowers: ['#eae7dc'],
  },
  tundra: {
    sky: ['#aac2d4', '#eeeee6'],
    hills: ['#d0dadd', '#b4c3c9', '#98abb3', '#7f949d'],
    skyline: 'peaks',
    tree: 'snowpine',
    leaves: ['#35544c', '#476b5e', '#678a7c'],
    bark: '#57402f',
    grass: ['#c9d6d8', '#e4ecec', '#f7faf8'],
    cap: 'snow',
    flowers: [],
    snowy: true,
  },
  alpine: {
    sky: ['#8fb2cf', '#ebe9e1'],
    hills: ['#c3ced6', '#9eafba', '#7d909c', '#63747f'],
    skyline: 'peaks',
    tree: 'snowpine',
    leaves: ['#2f5047', '#426a5a', '#5f8871'],
    bark: '#57402f',
    grass: ['#688060', '#829a74', '#a2b68c'],
    cap: 'grass',
    flowers: ['#eef0f4', '#9fb3dd'],
    snowy: true,
  },
  desert: {
    sky: ['#d9c7a0', '#f6e6c3'],
    hills: ['#e6d3a8', '#d8bb8a', '#c4a171', '#ab8559'],
    skyline: 'dunes',
    tree: 'cactus',
    leaves: ['#5f7a45', '#7a9453', '#9cb26a'],
    bark: '#7a6149',
    grass: ['#b89a64', '#cdb07b', '#e0c895'],
    cap: 'none',
    flowers: ['#e8637a'],
  },
  badlands: {
    sky: ['#d3b49b', '#f2dcc0'],
    hills: ['#d6b39b', '#c09078', '#a4705a', '#855544'],
    skyline: 'mesa',
    tree: 'dead',
    leaves: ['#6f6a45', '#86804f', '#a19a63'],
    bark: '#6a4f3c',
    grass: ['#a06a4f', '#b98262', '#cf9f7d'],
    cap: 'dust',
    flowers: [],
  },
  // ── Dimensions ──
  mycelia: {
    sky: ['#1d1630', '#4a3a66'],
    hills: ['#3a2f55', '#322a4c', '#2a2342', '#221c38'],
    skyline: 'spires',
    tree: 'shroom',
    leaves: ['#4fd1c5', '#7ae8d8', '#b7f5e8'],
    bark: '#b8a8c8',
    grass: ['#3aa39a', '#58c8b8', '#8ce8d6'],
    cap: 'mycel',
    flowers: ['#f08cd0', '#9ef0ff'],
  },
  skyreach: {
    sky: ['#6fa8e8', '#fbe7c0'],
    hills: ['#f4f0e8', '#e6e0d6', '#d8d2c8', '#cac4ba'],
    skyline: 'islands',
    tree: 'skytree',
    leaves: ['#e8b85a', '#f2cf74', '#fbe6a0'],
    bark: '#c8b8a0',
    grass: ['#7cc26a', '#9ad880', '#c0ec9c'],
    cap: 'grass',
    flowers: ['#ffffff', '#ffd86a', '#8ad0ff'],
  },
  // ── Generated realms ──
  orchard: {
    sky: ['#7fb0b8', '#ece6c8'],
    hills: ['#9ab8b0', '#7c9e94', '#5e8478', '#46685e'],
    skyline: 'rolling',
    tree: 'willow',
    leaves: ['#3e6a5a', '#5a8a6a', '#8ab88a'],
    bark: '#5a4a3a',
    grass: ['#4a7a60', '#6a9a70', '#94c088'],
    cap: 'grass',
    flowers: ['#f0a0b0', '#f8e0a0', '#e86a5a'],
  },
  steppe: {
    sky: ['#a88a7a', '#e8c8a0'],
    hills: ['#b8a090', '#9a8070', '#7a6254', '#5a463a'],
    skyline: 'mesa',
    tree: 'dead',
    leaves: ['#6a6254', '#86806a', '#a09a84'],
    bark: '#4a3a30',
    grass: ['#7a6a54', '#948068', '#b09a80'],
    cap: 'dust',
    flowers: ['#ff8a3a'],
  },
  warren: {
    sky: ['#140d06', '#3a2612'],
    hills: ['#3a2a18', '#302214', '#281c10', '#20160c'],
    skyline: 'spires',
    tree: 'shroom',
    leaves: ['#c8882a', '#e8a840', '#ffd070'],
    bark: '#8a6a4a',
    grass: ['#8a6a3a', '#a8844a', '#c8a060'],
    cap: 'none',
    flowers: ['#ffd070'],
    alien: true,
  },
  pocket: {
    sky: ['#0a080c', '#1a1420'],
    hills: ['#1a1420', '#16121c', '#120e18', '#0e0a14'],
    skyline: 'spires',
    tree: 'dead',
    leaves: ['#3a3040', '#4a4050', '#5a5060'],
    bark: '#2a2230',
    grass: ['#2a2230', '#3a3040', '#4a4050'],
    cap: 'none',
    flowers: [],
    alien: true,
  },
  void: {
    sky: ['#07040f', '#2a1440'],
    hills: ['#22123a', '#1c0f30', '#160c26', '#10081c'],
    skyline: 'shards',
    tree: 'voidtree',
    leaves: ['#b36cff', '#d49bff', '#f0d0ff'],
    bark: '#3a2a50',
    grass: ['#6a3fa8', '#8a5ad0', '#b88af0'],
    cap: 'moss',
    flowers: ['#ff6ad5'],
  },
};

export const artAt = (x: number, y: number) => ART[D.biomeAt(x, y).id] ?? ART.meadow;
/** The two regions to blend at x for skies and hills, and how far to lean into the second. */
export function blendAt(x: number): [RegionArt, RegionArt, number] {
  const [a, b, t] = D.biomeBlend(x);
  return [ART[a] ?? ART.meadow, ART[b] ?? ART.meadow, t];
}

// ── Ground materials ─────────────────────────────────────────────────────────────────────────

export type Pattern =
  | 'soil'
  | 'stone'
  | 'sand'
  | 'mud'
  | 'ice'
  | 'strata'
  | 'slate'
  | 'ash'
  | 'hell'
  | 'brick'
  | 'bigbrick'
  | 'planks'
  | 'glass'
  | 'cloud'
  | 'crystal'
  | 'fungal'
  | 'void'
  | 'obsidian';
export interface GroundStyle {
  /** Base colour; the ramp is derived from it. */
  base: string;
  pattern: Pattern;
  /** Accent colour for veins, embers, moss, or glints. */
  accent?: string;
  /** What grows on top where the ground meets open air near the surface. */
  cap?: 'region' | 'snow' | 'moss' | 'mycel' | 'cloud';
  /** Colour of the cave wall behind open ground. */
  wall?: string;
  /** Emits light of this colour (for glowing blocks). */
  glow?: string;
}
export const GROUND: Record<number, GroundStyle> = {
  1: { base: '#8a6a4c', pattern: 'soil', cap: 'region', wall: '#3e3024' },
  2: { base: '#7a7f86', pattern: 'stone', wall: '#2c3036' },
  3: { base: '#dcc38e', pattern: 'sand', wall: '#6a5838' },
  4: { base: '#5f5a44', pattern: 'mud', cap: 'region', wall: '#2e2c22' },
  5: { base: '#b9d3dc', pattern: 'ice', cap: 'snow', wall: '#4a6070' },
  6: { base: '#b0674a', pattern: 'strata', accent: '#d8936a', wall: '#4a2a22' },
  8: { base: '#4f5b72', pattern: 'slate', accent: '#9fb8d8', wall: '#1c2230' },
  9: { base: '#6e4038', pattern: 'ash', accent: '#ff8a3a', wall: '#251210' },
  10: { base: '#5c2230', pattern: 'hell', accent: '#ff6a2a', wall: '#1a0709' },
  11: { base: '#a67a4a', pattern: 'planks', wall: '#4a3420' },
  12: { base: '#8a8e94', pattern: 'brick', wall: '#34383e' },
  13: { base: '#a95e46', pattern: 'brick', wall: '#4a2a20' },
  14: { base: '#bfe4ee', pattern: 'glass' },
  15: { base: '#58705a', pattern: 'bigbrick', accent: '#7fa05a', wall: '#1e281e' },
  16: { base: '#8fb8d8', pattern: 'bigbrick', accent: '#e8f6ff', wall: '#243448' },
  17: { base: '#c8a060', pattern: 'bigbrick', accent: '#f0d080', wall: '#4a3418' },
  18: { base: '#3a2228', pattern: 'bigbrick', accent: '#ff6a2a', wall: '#140608' },
  19: { base: '#5a4a6a', pattern: 'soil', cap: 'mycel', wall: '#221a2e' },
  20: { base: '#4a3f5e', pattern: 'fungal', accent: '#6ae0d0', wall: '#1a1426' },
  21: { base: '#f4f4f8', pattern: 'cloud', cap: 'cloud' },
  22: { base: '#c4ccd8', pattern: 'stone', cap: 'region', wall: '#5a6478' },
  23: { base: '#4a3470', pattern: 'void', accent: '#d8a8ff', wall: '#140a22' },
  24: { base: '#a06cf0', pattern: 'crystal', accent: '#f0d8ff', glow: '#b36cff' },
  25: { base: '#262030', pattern: 'obsidian', accent: '#7a6aa0', wall: '#0e0a14' },
  26: { base: '#e0c890', pattern: 'bigbrick', accent: '#fff0c0', wall: '#6a5a3a' },
  27: { base: '#1e1a22', pattern: 'obsidian', accent: '#3a3440', wall: '#0a080c' },
  28: { base: '#2f7a72', pattern: 'crystal', accent: '#c0fff4', glow: '#58e0d0', wall: '#10302c' },
  // Generated realms.
  30: { base: '#5a6a58', pattern: 'mud', cap: 'region', wall: '#26302a' },
  31: { base: '#6e6258', pattern: 'soil', cap: 'region', wall: '#2a2420' },
  32: { base: '#8a5a44', pattern: 'strata', accent: '#e8884a', wall: '#3a2018' },
  33: { base: '#7a5a36', pattern: 'soil', wall: '#2e2014' },
  34: { base: '#c8882a', pattern: 'crystal', accent: '#ffd070', glow: '#e8a030', wall: '#3a2410' },
  35: { base: '#6a7a6a', pattern: 'planks', wall: '#2a322a' },
};
export const groundOf = (kind: number) => GROUND[kind] ?? GROUND[2];

// ── Time of day ─────────────────────────────────────────────────────────────────────────────

export function daylight(t: number) {
  if (t < 330 || t > 1170) return 0;
  if (t < 480) return (t - 330) / 150;
  if (t > 1020) return 1 - (t - 1020) / 150;
  return 1;
}
export const duskiness = (t: number) =>
  Math.max(0, 1 - Math.abs(t - 405) / 85) + Math.max(0, 1 - Math.abs(t - 1110) / 85);
export const overcastOf = (g: RenderGame) =>
  g.s.weather === 'storm' ? 1 : g.s.weather === 'rain' ? 0.75 : g.s.weather === 'cloudy' ? 0.35 : 0;
/** Sky light colour (0–1 per channel) for the time and weather. */
export function skyLight(g: RenderGame): [number, number, number] {
  const tod = g.timeOfDay(),
    day = daylight(tod),
    dusk = clamp(duskiness(tod)),
    over = overcastOf(g) * 0.3;
  const r = 0.2 + day * 0.8 + dusk * 0.12,
    gg = 0.24 + day * 0.76 - dusk * 0.05,
    b = 0.38 + day * 0.62 - dusk * 0.15;
  return [clamp(r * (1 - over)), clamp(gg * (1 - over)), clamp(b * (1 - over * 0.7))];
}
