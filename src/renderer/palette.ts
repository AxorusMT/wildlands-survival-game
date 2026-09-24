import { D, clamp, smooth } from './graphics.ts';
import type { ArtStyle, RenderGame } from './types.ts';

export const ART: Record<string, ArtStyle> = {
  coast: {
    sky: ['#9fc2cc', '#f0e7cf'],
    hills: ['#9dbcbf', '#86a9a7', '#6d918a', '#56766c'],
    skyline: 'sea',
    trees: 'pine',
    leaves: ['#3e5f4d', '#56785b', '#789770'],
    bark: '#6e5540',
    grass: ['#6f8c56', '#8ca868', '#aac27e'],
    cap: 'grass',
    flowers: ['#f2efe2', '#e7c56a'],
  },
  marsh: {
    sky: ['#adbca8', '#e7e0c3'],
    hills: ['#a7b39c', '#8d9d82', '#728668', '#5a6e52'],
    skyline: 'rolling',
    trees: 'willow',
    leaves: ['#4f6a3b', '#6b8549', '#91a862'],
    bark: '#5d4a36',
    grass: ['#5f7a4b', '#7a955a', '#9bb070'],
    cap: 'grass',
    flowers: ['#d9d3ea', '#f1e8c8'],
  },
  forest: {
    sky: ['#a9c3b3', '#ece3c6'],
    hills: ['#9fb4a0', '#7d987f', '#5d7a62', '#46624d'],
    skyline: 'rolling',
    trees: 'broadleaf',
    leaves: ['#365a3c', '#4f7645', '#73965a'],
    bark: '#5a4230',
    grass: ['#557a45', '#6e9454', '#8fb26a'],
    cap: 'grass',
    flowers: ['#f0ead6', '#c9a3c9'],
  },
  meadow: {
    sky: ['#b5d0d3', '#f2e6c5'],
    hills: ['#b7c4a3', '#9cb286', '#7e9b6b', '#657f55'],
    skyline: 'rolling',
    trees: 'broadleaf',
    leaves: ['#4a7043', '#648e4d', '#8cb163'],
    bark: '#6b5039',
    grass: ['#6f9450', '#8cb061', '#abc97b'],
    cap: 'grass',
    flowers: ['#f4f0e0', '#f0cf5e', '#c58fc0', '#e0816a'],
  },
  taiga: {
    sky: ['#a9bec4', '#e5e3d4'],
    hills: ['#a3b5b3', '#83999a', '#627c79', '#4a625f'],
    skyline: 'rolling',
    trees: 'conifer',
    leaves: ['#2c4d43', '#3d6656', '#5a8470'],
    bark: '#57402f',
    grass: ['#566f52', '#6d8864', '#8aa27c'],
    cap: 'grass',
    flowers: ['#eae7dc'],
  },
  tundra: {
    sky: ['#bccdd8', '#eeeee6'],
    hills: ['#d0dadd', '#b4c3c9', '#98abb3', '#7f949d'],
    skyline: 'peaks',
    trees: 'conifer',
    leaves: ['#3a5850', '#4c6e62', '#6b8d7e'],
    bark: '#57402f',
    grass: ['#c9d6d8', '#e4ecec', '#f7faf8'],
    cap: 'snow',
    flowers: [],
    snowy: true,
  },
  alpine: {
    sky: ['#a2bcd0', '#ebe9e1'],
    hills: ['#c3ced6', '#9eafba', '#7d909c', '#63747f'],
    skyline: 'peaks',
    trees: 'conifer',
    leaves: ['#32534a', '#456d5d', '#628a74'],
    bark: '#57402f',
    grass: ['#6f8466', '#889c7a', '#a6b690'],
    cap: 'alpine',
    flowers: ['#eef0f4', '#9fb3dd'],
    snowy: true,
  },
  desert: {
    sky: ['#d6cba8', '#f6e6c3'],
    hills: ['#e6d3a8', '#d8bb8a', '#c4a171', '#ab8559'],
    skyline: 'dunes',
    trees: '',
    leaves: ['#6f7a4c', '#8a9459', '#a8ad6d'],
    bark: '#7a6149',
    grass: ['#b89a64', '#cdb07b', '#e0c895'],
    cap: 'sand',
    flowers: [],
  },
  badlands: {
    sky: ['#d5bca5', '#f2dcc0'],
    hills: ['#d6b39b', '#c09078', '#a4705a', '#855544'],
    skyline: 'mesa',
    trees: '',
    leaves: ['#6f6a45', '#86804f', '#a19a63'],
    bark: '#6a4f3c',
    grass: ['#a06a4f', '#b98262', '#cf9f7d'],
    cap: 'dust',
    flowers: [],
  },
};
export const BIOME_STEP = D.BIOME_CENTERS[D.SIDE_ORDER[1]][0] - D.BIOME_CENTERS[D.SIDE_ORDER[0]][0];
export const FIRST_CENTER = D.BIOME_CENTERS[D.SIDE_ORDER[0]][0];
// Neighbouring regions blend their skies and hills across a band around each border.
export function blendAt(x: number): [ArtStyle, ArtStyle, number] {
  const f = clamp((x - FIRST_CENTER) / BIOME_STEP, 0, D.SIDE_ORDER.length - 1),
    i = Math.min(Math.floor(f), D.SIDE_ORDER.length - 2);
  return [ART[D.SIDE_ORDER[i]], ART[D.SIDE_ORDER[i + 1]], smooth(0.3, 0.7, f - i)];
}
export const artAt = (x: number, y: number) => ART[D.biomeAt(x, y).id];
// ─── Time of day ──────────────────────────────────────────────────────────
export function daylight(t: number) {
  if (t < 330 || t > 1170) return 0;
  if (t < 480) return smooth(330, 480, t);
  if (t > 1020) return 1 - smooth(1020, 1170, t);
  return 1;
}
export const duskiness = (t: number) =>
  Math.max(0, 1 - Math.abs(t - 405) / 85) + Math.max(0, 1 - Math.abs(t - 1110) / 85);
// ─── Sky and parallax ─────────────────────────────────────────────────────
export const overcastOf = (g: RenderGame) =>
  g.s.weather === 'storm' ? 1 : g.s.weather === 'rain' ? 0.75 : g.s.weather === 'cloudy' ? 0.35 : 0;
