// Pixel sprites for everything the player builds. Sizes are in art pixels (half a world pixel).
import type { Structure } from '../core/types.ts';
import { D } from './art.ts';
import { Painter, blit, cached, clamp, hash, mix, ramp, shade, sprite, type Sprite } from './px.ts';
import type { RenderGame } from './types.ts';

const WOOD = '#8a6440',
  DARKWOOD = '#5e4631',
  STONE = '#8b8f8a',
  IRON = '#6f7375';

/** Horizontal planks with nail heads, the building block of most furniture. */
function planks(p: Painter, x: number, y: number, w: number, h: number, base = WOOD) {
  const [d, , m, l] = ramp(base);
  p.rect(x, y, w, h, m);
  for (let j = 0; j < h; j += 3) {
    p.rect(x, y + j, w, 1, l);
    if (j + 2 < h) p.rect(x, y + j + 2, w, 1, d);
  }
  for (let i = x + 3; i < x + w; i += 7) p.set(i, y + (i % 2), '#3a302a');
}
function stones(p: Painter, x: number, y: number, w: number, h: number, base = STONE) {
  const [d, , m, l] = ramp(base);
  p.rect(x, y, w, h, m);
  for (let j = 0; j < h; j += 4) {
    const off = (j / 4) % 2 ? 3 : 0;
    p.rect(x, y + j, w, 1, d);
    for (let i = x + off; i < x + w; i += 6) {
      p.rect(i, y + j, 1, 4, d);
      p.set(i + 1, y + j + 1, l);
    }
  }
}
/** Three-frame flame; `size` 1 is a candle, 3 a bonfire. */
function flame(frame: number, size: number): Sprite {
  return cached(`flame:${frame}:${size}`, () => {
    const w = 4 + size * 4,
      h = 6 + size * 6;
    return sprite(
      w,
      h,
      w / 2,
      h - 1,
      (p) => {
        const cols = ['#c8401e', '#ee7a2c', '#f8b848', '#fff0b0'];
        for (let layer = 0; layer < 4; layer++) {
          const lw = (w / 2) * (1 - layer * 0.22),
            lh = h * (1 - layer * 0.2);
          for (let y = 0; y < lh; y++) {
            const k = y / lh,
              half = lw * Math.sin(Math.PI * (0.25 + k * 0.75)) * (0.55 + 0.45 * k),
              sway = Math.round(Math.sin(frame * 2.1 + y * 0.6) * (1 - k) * 1.2);
            for (let x = Math.round(w / 2 - half); x < Math.round(w / 2 + half); x++)
              p.set(
                x + sway,
                h - 1 - Math.round(lh - 1 - y) - Math.round(layer * 0.6),
                cols[layer],
              );
          }
        }
      },
      false,
    );
  });
}
const flameAt = (
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  t: number,
  size: number,
  seed: number,
) => blit(c, flame(Math.floor(t * 9 + seed) % 3, size), x, y);

function smoke(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  t: number,
  seed: number,
  amount = 1,
) {
  for (let i = 0; i < 4; i++) {
    const life = (t * 0.35 + i / 4 + seed * 0.13) % 1,
      sx = Math.round(x + Math.sin(life * 5 + i) * 3 + life * 8),
      sy = Math.round(y - life * 36),
      r = Math.round(2 + life * 5);
    c.globalAlpha = 0.28 * (1 - life) * amount;
    c.fillStyle = '#c8c6c0';
    c.fillRect(sx - r, sy - r + 1, r * 2, r * 2 - 2);
    c.fillRect(sx - r + 1, sy - r, r * 2 - 2, r * 2);
  }
  c.globalAlpha = 1;
}

function bossSpec(g: RenderGame) {
  return D.BOSSES[Math.min(D.BOSSES.length - 1, Math.max(0, g.s.altar.level - 1))] ?? D.BOSSES[0];
}

const STATIC: Record<string, () => Sprite> = {
  campfire_base: () =>
    sprite(28, 9, 14, 8, (p) => {
      for (const [x, y, w] of [
        [3, 1, 20],
        [5, 3, 18],
        [2, 4, 22],
      ] as const) {
        p.rect(x, y + 1, w, 3, DARKWOOD);
        p.rect(x, y + 1, w, 1, '#7a5a3c');
        p.rect(x + w - 2, y + 1, 2, 3, '#c9a878');
      }
      for (let i = 0; i < 6; i++) p.ellipse(2 + i * 4.8, 7, 2.6, 2, i % 2 ? '#8d8a80' : '#77746c');
    }),
  shelter: () =>
    sprite(64, 46, 20, 45, (p) => {
      // A lean-to: a post, a sloped hide roof, and a bedding of boughs beneath.
      p.rect(2, 2, 3, 44, DARKWOOD);
      p.rect(2, 2, 1, 44, '#7a5a3c');
      const roof: [number, number][] = [
        [2, 2],
        [8, 0],
        [63, 38],
        [58, 42],
      ];
      p.poly(roof, '#8a6e4e');
      for (let i = 0; i < 9; i++) p.line(6 + i * 6, 3 + i * 4, 3 + i * 6, 6 + i * 4, '#6b5539');
      for (let y = 3; y < 42; y += 5) p.line(4, y, 60, y + 34, '#9e8260');
      p.poly(
        [
          [5, 8],
          [55, 42],
          [5, 42],
        ],
        '#2a221c',
      );
      p.rect(6, 40, 34, 4, '#5a6a44');
      p.rect(6, 40, 34, 1, '#7a8a58');
    }),
  workbench: () =>
    sprite(34, 17, 17, 16, (p) => {
      planks(p, 0, 0, 34, 5);
      p.rect(3, 5, 3, 12, DARKWOOD);
      p.rect(28, 5, 3, 12, DARKWOOD);
      p.rect(3, 11, 28, 2, DARKWOOD);
      p.rect(22, 0, 6, 1, IRON);
      p.rect(7, 0, 2, 1, '#c9a878');
    }),
  apothecary: () =>
    sprite(34, 22, 17, 21, (p) => {
      planks(p, 0, 5, 34, 5, '#7a5f45');
      p.rect(3, 10, 3, 12, DARKWOOD);
      p.rect(28, 10, 3, 12, DARKWOOD);
      for (const [x, c, h] of [
        [4, '#7bc05a', 5],
        [10, '#c85a8a', 4],
        [16, '#5aa0d8', 5],
        [24, '#e8c86a', 3],
      ] as const) {
        p.rect(x, 5 - h, 4, h, c);
        p.rect(x + 1, 4 - h, 2, 1, '#d8d0c0');
        p.set(x, 5 - h, shade(c, 0.4));
      }
      p.line(0, 13, 33, 13, '#6a5040');
    }),
  furnace: () =>
    sprite(28, 30, 14, 29, (p) => {
      stones(p, 1, 4, 26, 26, '#8a8680');
      p.rect(9, 0, 10, 5, '#6d6a64');
      p.rect(8, 15, 12, 10, '#1c1614');
      p.rect(8, 15, 12, 1, '#4a4440');
    }),
  forge: () =>
    sprite(40, 30, 20, 29, (p) => {
      stones(p, 0, 10, 26, 20, '#6a6660');
      p.rect(4, 17, 16, 8, '#1c1614');
      p.rect(3, 0, 8, 10, '#5a5650');
      p.rect(28, 20, 12, 4, '#4a4e52');
      p.rect(30, 18, 9, 2, '#6a7074');
      p.rect(32, 24, 5, 6, '#3a3e42');
      p.set(38, 18, '#b8bec2');
    }),
  bedroll: () =>
    sprite(34, 7, 17, 6, (p) => {
      p.rect(0, 2, 30, 5, '#6a7a5a');
      p.rect(0, 2, 30, 1, '#8a9a70');
      for (let x = 4; x < 30; x += 6) p.rect(x, 3, 1, 4, '#56664a');
      p.ellipse(30, 3.5, 4, 3.5, '#8a7a5a');
      p.rect(2, 1, 8, 3, '#d8ccb0');
    }),
  farm_plot: () =>
    sprite(34, 6, 17, 5, (p) => {
      p.rect(0, 1, 34, 5, '#4a3a2a');
      for (let x = 0; x < 34; x += 5) p.rect(x, 0, 4, 2, '#5e4a36');
      p.rect(0, 5, 34, 1, '#6b5640');
      p.rect(0, 1, 1, 5, DARKWOOD);
      p.rect(33, 1, 1, 5, DARKWOOD);
    }),
  rain_catcher: () =>
    sprite(24, 26, 12, 25, (p) => {
      p.rect(4, 8, 16, 18, '#6a4e36');
      for (let y = 10; y < 26; y += 5) p.rect(4, y, 16, 1, IRON);
      p.rect(4, 8, 1, 18, '#8a6a4a');
      p.poly(
        [
          [0, 0],
          [23, 0],
          [18, 8],
          [5, 8],
        ],
        '#b8a888',
      );
      p.line(0, 0, 23, 0, '#d8ccb0');
    }),
  platform: () =>
    sprite(36, 10, 18, 2, (p) => {
      planks(p, 0, 0, 36, 4, '#8a6b4a');
      p.line(4, 4, 10, 9, DARKWOOD);
      p.line(31, 4, 25, 9, DARKWOOD);
    }),
  chest: () =>
    sprite(22, 16, 11, 15, (p) => {
      planks(p, 0, 5, 22, 11, '#7a5a3c');
      p.rect(0, 0, 22, 6, '#8b683f');
      p.rect(0, 0, 22, 1, '#a88458');
      p.rect(0, 5, 22, 1, '#3a2a1c');
      for (const x of [2, 18]) p.rect(x, 0, 2, 16, '#a88a3a');
      p.rect(9, 4, 4, 4, '#d8b848');
      p.set(10, 6, '#3a2a1c');
    }),
  icebox: () =>
    sprite(24, 16, 12, 15, (p) => {
      p.rect(0, 5, 24, 11, '#9fb8bd');
      p.rect(0, 0, 24, 6, '#c6dadf');
      p.rect(0, 0, 24, 1, '#eaf6f8');
      p.rect(0, 5, 24, 1, '#6a8a90');
      for (let x = 3; x < 24; x += 5) p.rect(x, 7, 1, 8, '#b8d0d4');
      p.rect(10, 3, 4, 3, IRON);
    }),
  drying_rack: () =>
    sprite(34, 26, 17, 25, (p) => {
      p.line(2, 25, 8, 0, DARKWOOD);
      p.line(32, 25, 26, 0, DARKWOOD);
      p.rect(4, 2, 26, 2, WOOD);
    }),
  spike_trap: () =>
    sprite(32, 12, 16, 11, (p) => {
      p.rect(0, 9, 32, 3, '#6b5237');
      for (let i = 0; i < 6; i++) {
        const x = 3 + i * 5;
        p.poly(
          [
            [x - 2, 9],
            [x, 0],
            [x + 2, 9],
          ],
          '#aab0b2',
        );
        p.line(x, 1, x, 8, '#e0e4e4');
      }
    }),
  lantern_post: () =>
    sprite(14, 38, 2, 37, (p) => {
      p.rect(1, 0, 3, 38, DARKWOOD);
      p.rect(1, 0, 1, 38, '#7a5a3c');
      p.rect(1, 2, 12, 2, DARKWOOD);
      p.rect(10, 4, 1, 3, '#3f3a36');
    }),
  torch: () =>
    sprite(4, 12, 2, 11, (p) => {
      p.rect(1, 3, 2, 9, '#7a5a3c');
      p.rect(0, 1, 4, 3, '#5e4631');
      p.set(1, 3, '#a88458');
    }),
  effergy: () =>
    sprite(40, 62, 20, 61, (p) => {
      stones(p, 0, 56, 40, 6, '#46414d');
      stones(p, 5, 50, 30, 6, '#534d5a');
      p.poly(
        [
          [12, 50],
          [16, 6],
          [24, 6],
          [28, 50],
        ],
        '#3e3946',
      );
      for (let y = 8; y < 50; y += 5) p.rect(15, y, 10, 1, '#2e2a34');
      p.rect(14, 4, 12, 3, '#5a5462');
    }),
  rift_gate: () =>
    sprite(56, 70, 28, 69, (p) => {
      // A ring of standing stones cut with sigil sockets, around a hollow the rift fills.
      stones(p, 0, 62, 56, 8, '#3a3642');
      p.ellipse(28, 34, 26, 32, '#4a4454');
      for (let y = 0; y < 70; y++)
        for (let x = 0; x < 56; x++) {
          const dx = (x + 0.5 - 28) / 19,
            dy = (y + 0.5 - 34) / 25;
          if (dx * dx + dy * dy < 1) p.clear(x, y);
        }
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 - Math.PI / 2,
          x = Math.round(28 + Math.cos(a) * 22.5),
          y = Math.round(34 + Math.sin(a) * 28.5);
        p.rect(x - 1, y - 1, 3, 3, '#221e28');
      }
      p.shadeEdges(0.25, -0.3);
    }),
};
Object.assign(STATIC, {
  starforge: () =>
    sprite(40, 30, 20, 29, (p) => {
      stones(p, 0, 12, 40, 18, '#3e3a50');
      p.rect(4, 16, 32, 8, '#140e1c');
      p.rect(6, 4, 28, 8, '#5a4a7a');
      p.rect(6, 4, 28, 1, '#8a7ab0');
      for (let i = 0; i < 5; i++) p.set(9 + i * 6, 7, '#f8e08a');
      p.rect(16, 0, 8, 4, '#6a5a8a');
      p.shadeEdges();
    }),
  trap_spikes: () =>
    sprite(28, 7, 14, 6, (p) => {
      p.rect(0, 5, 28, 2, '#4a4040');
      for (let i = 0; i < 7; i++)
        p.poly(
          [
            [1 + i * 4, 5],
            [2.5 + i * 4, 0],
            [4 + i * 4, 5],
          ],
          '#b8bcc0',
        );
    }),
  trap_dart: () =>
    sprite(8, 10, 4, 5, (p) => {
      p.rect(0, 0, 8, 10, '#5a5448');
      p.rect(0, 0, 8, 1, '#8a8070');
      p.rect(5, 4, 3, 2, '#141010');
      p.set(2, 2, '#a89868');
    }),
  trap_flame: () =>
    sprite(16, 5, 8, 4, (p) => {
      p.rect(0, 1, 16, 4, '#3a2a2a');
      p.rect(2, 0, 12, 2, '#5a3a30');
      for (let x = 4; x < 12; x += 3) p.set(x, 0, '#1a0a0a');
    }),
});
// Furniture for homes.
Object.assign(STATIC, {
  chair: () =>
    sprite(12, 20, 6, 19, (p) => {
      p.rect(1, 0, 3, 20, DARKWOOD);
      p.rect(1, 0, 1, 20, '#7a5a3c');
      p.rect(1, 3, 3, 2, WOOD);
      p.rect(1, 7, 3, 2, WOOD);
      planks(p, 1, 10, 11, 3);
      p.rect(9, 13, 2, 7, DARKWOOD);
      p.rect(2, 13, 2, 7, DARKWOOD);
    }),
  table: () =>
    sprite(30, 16, 15, 15, (p) => {
      planks(p, 0, 0, 30, 4);
      p.rect(0, 4, 30, 1, '#3a2a1c');
      p.rect(3, 4, 3, 12, DARKWOOD);
      p.rect(24, 4, 3, 12, DARKWOOD);
      p.rect(3, 4, 1, 12, '#7a5a3c');
      p.rect(12, 0, 6, 1, '#d8ccb0');
    }),
  bed: () =>
    sprite(36, 16, 18, 15, (p) => {
      p.rect(0, 0, 4, 16, DARKWOOD);
      p.rect(0, 0, 1, 16, '#7a5a3c');
      p.rect(32, 5, 4, 11, DARKWOOD);
      p.rect(4, 7, 28, 5, '#8a3a3a');
      p.rect(4, 7, 28, 1, '#b85a4a');
      for (let x = 10; x < 32; x += 6) p.rect(x, 8, 1, 4, '#6a2a2a');
      p.rect(4, 5, 9, 3, '#e8dcc8');
      p.rect(4, 5, 9, 1, '#fff4e0');
      planks(p, 4, 12, 28, 2);
      p.rect(5, 14, 2, 2, DARKWOOD);
      p.rect(29, 14, 2, 2, DARKWOOD);
    }),
  door_closed: () =>
    sprite(10, 32, 5, 31, (p) => {
      planks(p, 1, 0, 8, 32, '#7a5a3c');
      p.rect(1, 0, 8, 1, '#a88458');
      for (const y of [4, 26]) p.rect(1, y, 8, 2, IRON);
      p.rect(6, 15, 2, 2, '#d8b848');
      p.rect(0, 0, 1, 32, DARKWOOD);
      p.rect(9, 0, 1, 32, DARKWOOD);
    }),
  door_open: () =>
    sprite(16, 32, 5, 31, (p) => {
      p.rect(0, 0, 1, 32, DARKWOOD);
      p.rect(9, 0, 1, 32, DARKWOOD);
      p.poly(
        [
          [1, 0],
          [4, 2],
          [4, 30],
          [1, 32],
        ],
        '#6a4a30',
      );
      p.line(1, 0, 1, 31, '#a88458');
      p.rect(2, 5, 2, 2, IRON);
      p.rect(2, 26, 2, 2, IRON);
    }),
});
// Keeping food: the cold-storage ladder, the salting barrel, the kitchen, and the water filter.
Object.assign(STATIC, {
  // Relics set here glow in their niches.
  relic_shelf: () =>
    sprite(28, 32, 14, 31, (p) => {
      p.rect(0, 0, 28, 32, '#5a3e26');
      p.rect(0, 0, 28, 2, '#8a6440');
      p.rect(2, 2, 24, 28, '#2a1c12');
      for (const y of [11, 21, 30]) {
        p.rect(1, y, 26, 2, '#8a6440');
        p.rect(1, y, 26, 1, '#b08a5a');
      }
      for (const [x, y, c] of [
        [6, 7, '#5ac8c0'],
        [20, 7, '#ff8a3a'],
        [13, 17, '#e8a030'],
      ] as const) {
        p.rect(x - 2, y - 2, 5, 4, c);
        p.set(x - 1, y - 2, '#ffffff');
      }
      p.rect(0, 0, 1, 32, '#3a2818');
      p.rect(27, 0, 1, 32, '#3a2818');
    }),
  cool_pit: () =>
    sprite(26, 10, 13, 9, (p) => {
      stones(p, 0, 2, 26, 8, '#6a6660');
      p.rect(4, 3, 18, 5, '#1c1814');
      p.rect(3, 0, 20, 3, '#7a5a3c');
      p.rect(3, 0, 20, 1, '#9a7a58');
      for (let x = 6; x < 22; x += 5) p.rect(x, 0, 1, 3, '#5a4230');
    }),
  snow_cellar: () =>
    sprite(34, 24, 17, 23, (p) => {
      p.ellipse(17, 16, 16, 12, '#dfeaf2');
      p.rect(1, 16, 32, 8, '#dfeaf2');
      for (let y = 8; y < 24; y += 4) p.line(2, y, 32, y, '#b8c8d4');
      p.rect(12, 12, 10, 12, '#4a5a68');
      p.rect(12, 12, 10, 1, '#7a8a98');
      p.shadeEdges(0.15, -0.2);
    }),
  frost_chest: () =>
    sprite(24, 17, 12, 16, (p) => {
      p.rect(0, 5, 24, 12, '#5a8aa8');
      p.rect(0, 0, 24, 6, '#8fc0d8');
      p.rect(0, 0, 24, 1, '#dff6ff');
      p.rect(0, 5, 24, 1, '#3a5a78');
      for (const x of [2, 20]) p.rect(x, 0, 2, 17, '#dfe3e6');
      p.rect(10, 3, 4, 4, '#bfe8f8');
      p.set(11, 4, '#ffffff');
    }),
  rime_vault: () =>
    sprite(30, 28, 15, 27, (p) => {
      p.rect(2, 4, 26, 24, '#6a7a98');
      p.rect(2, 4, 26, 2, '#dfeaf8');
      p.rect(0, 0, 30, 5, '#f8e08a');
      p.rect(0, 0, 30, 1, '#fff4c0');
      p.rect(9, 10, 12, 14, '#2a3a58');
      p.ellipse(15, 17, 4, 4, '#bfe8f8');
      p.shadeEdges(0.2, -0.3);
    }),
  salting_barrel: () =>
    sprite(18, 20, 9, 19, (p) => {
      p.ellipse(9, 10, 8, 10, '#8a6440');
      for (let x = 3; x < 16; x += 3) p.line(x, 1, x, 19, '#6a4a2c');
      for (const y of [4, 15]) p.rect(1, y, 16, 1, '#a8a4a0');
      p.ellipse(9, 2, 7, 2, '#ece8de');
    }),
  kitchen: () =>
    sprite(40, 32, 20, 31, (p) => {
      stones(p, 0, 8, 40, 24, '#8a7a6a');
      p.rect(6, 16, 16, 10, '#1c1410');
      p.rect(26, 12, 12, 3, '#4a4440');
      p.rect(28, 6, 8, 6, '#6a6460');
      p.rect(28, 6, 8, 1, '#8a8480');
      p.rect(14, 0, 8, 8, '#6a5a4a');
      p.shadeEdges(0.2, -0.3);
    }),
  water_filter: () =>
    sprite(18, 26, 9, 25, (p) => {
      p.rect(2, 0, 14, 16, '#a88458');
      for (const [y, c] of [
        [2, '#dcc38e'],
        [7, '#2c2c30'],
        [12, '#a8a4a0'],
      ] as const)
        p.rect(3, y, 12, 4, c);
      p.rect(7, 16, 4, 4, '#6a4a2c');
      p.rect(3, 20, 12, 6, '#8a6440');
      p.rect(4, 21, 10, 2, '#7ab0c8');
    }),
});
// Realm furnishings.
Object.assign(STATIC, {
  waystone: () =>
    sprite(26, 48, 13, 47, (p) => {
      stones(p, 1, 40, 24, 8, '#5a5a62');
      p.poly(
        [
          [6, 41],
          [9, 4],
          [13, 0],
          [17, 4],
          [20, 41],
        ],
        '#6a6a74',
      );
      p.line(9, 4, 6, 41, '#8a8a96');
      for (const [x, y] of [
        [12, 12],
        [13, 20],
        [12, 28],
      ])
        p.rect(x, y, 2, 3, '#2a2a34');
      p.shadeEdges(0.2, -0.3);
    }),
  shrine: () =>
    sprite(22, 30, 11, 29, (p) => {
      stones(p, 0, 24, 22, 6, '#6a6470');
      p.rect(4, 6, 14, 18, '#7a7484');
      p.rect(4, 6, 14, 1, '#9a94a4');
      p.rect(2, 3, 18, 4, '#5a5462');
      p.rect(8, 12, 6, 7, '#2a2630');
      p.shadeEdges(0.2, -0.3);
    }),
  // Station upgrades.
  tinkers_bench: () =>
    sprite(36, 22, 18, 21, (p) => {
      p.rect(0, 6, 36, 4, '#8a6440');
      p.rect(0, 6, 36, 1, '#b08a5a');
      p.rect(2, 10, 3, 12, '#6a4a30');
      p.rect(31, 10, 3, 12, '#6a4a30');
      p.rect(6, 12, 24, 3, '#6a4a30');
      p.rect(4, 2, 6, 4, '#a8a4a0');
      p.rect(14, 3, 3, 3, '#d0844a');
      p.rect(22, 1, 8, 5, '#5a5e64');
      p.set(25, 2, '#f0c850');
    }),
  artisan_bench: () =>
    sprite(40, 26, 20, 25, (p) => {
      p.rect(0, 8, 40, 5, '#6a3a2a');
      p.rect(0, 8, 40, 1, '#a86a4a');
      for (const x of [2, 35]) p.rect(x, 13, 3, 13, '#4a2a1a');
      p.rect(6, 16, 28, 3, '#4a2a1a');
      p.rect(4, 2, 10, 6, '#f0c850');
      p.rect(5, 3, 8, 1, '#fff0a0');
      p.rect(18, 4, 3, 4, '#8fe3df');
      p.rect(26, 0, 10, 8, '#dfe3e6');
      p.rect(27, 1, 3, 2, '#ffffff');
    }),
  rift_forge: () =>
    sprite(44, 40, 22, 39, (p) => {
      p.rect(2, 12, 40, 28, '#2a1c3a');
      p.rect(2, 12, 40, 2, '#6a4a8a');
      p.rect(12, 20, 20, 14, '#140a22');
      p.ellipse(22, 27, 7, 5, '#ff6ad5');
      p.ellipse(22, 27, 4, 3, '#ffe0f8');
      p.rect(8, 0, 6, 12, '#3a2a4a');
      p.rect(30, 0, 6, 12, '#3a2a4a');
      for (const x of [4, 38]) p.rect(x, 16, 2, 20, '#b36cff');
      p.shadeEdges(0.2, -0.3);
    }),
  laboratory: () =>
    sprite(36, 28, 18, 27, (p) => {
      p.rect(0, 14, 36, 4, '#6a6a70');
      p.rect(2, 18, 3, 10, '#4a4a50');
      p.rect(31, 18, 3, 10, '#4a4a50');
      p.ellipse(8, 9, 4, 5, '#bfe8ff');
      p.rect(7, 2, 2, 4, '#bfe8ff');
      p.rect(6, 9, 5, 4, '#58e0d0');
      p.rect(16, 4, 3, 10, '#dfe3e6');
      p.rect(16, 9, 3, 5, '#e8577a');
      p.ellipse(27, 10, 5, 4, '#bfe8ff');
      p.rect(24, 10, 7, 3, '#e8f070');
    }),
  hearth: () =>
    sprite(38, 34, 19, 33, (p) => {
      p.rect(0, 10, 38, 24, '#8b8f8a');
      for (let y = 12; y < 34; y += 5)
        for (let x = (y % 10 ? 0 : 4) + 1; x < 37; x += 8) p.rect(x, y, 7, 1, '#6a6e6a');
      p.rect(9, 18, 20, 16, '#1c1410');
      p.ellipse(19, 30, 7, 4, '#ff8a3a');
      p.ellipse(19, 30, 4, 2, '#ffe070');
      p.rect(13, 0, 12, 10, '#7a7e7a');
      p.rect(0, 10, 38, 2, '#a8aca8');
    }),
  research_desk: () =>
    sprite(34, 26, 17, 25, (p) => {
      p.rect(0, 10, 34, 4, '#6a4a30');
      p.rect(0, 10, 34, 1, '#8a6440');
      p.rect(2, 14, 3, 12, '#4a3020');
      p.rect(29, 14, 3, 12, '#4a3020');
      p.rect(4, 5, 12, 5, '#e8dcc0');
      p.line(10, 5, 10, 9, '#b8a080');
      p.rect(20, 2, 3, 8, '#b8b0a0');
      p.ellipse(21, 2, 3, 2, '#bfe8ff');
      p.rect(26, 6, 5, 4, '#8fe3df');
    }),
  // Keeping and cleaning: the distiller, the smoking rack, the canning kettle, the ice harvester.
  distiller: () =>
    sprite(28, 30, 14, 29, (p) => {
      p.rect(2, 20, 14, 10, '#6a4a30');
      p.ellipse(9, 16, 7, 7, '#c8804a');
      p.ellipse(8, 14, 3, 3, '#e8a878');
      p.line(14, 10, 24, 6, '#c8804a');
      p.line(24, 6, 24, 22, '#c8804a');
      p.rect(20, 22, 8, 8, '#8fb0c0');
      p.rect(21, 23, 6, 3, '#bfe8ff');
      p.rect(4, 26, 10, 2, '#ff8a3a');
    }),
  smoking_rack: () =>
    sprite(30, 30, 15, 29, (p) => {
      p.rect(2, 2, 2, 28, '#6a4a30');
      p.rect(26, 2, 2, 28, '#6a4a30');
      p.rect(2, 2, 26, 2, '#8a6440');
      for (const x of [7, 13, 19]) {
        p.rect(x, 4, 4, 9, '#9a4a3a');
        p.rect(x, 4, 4, 2, '#c8784a');
      }
      p.rect(6, 24, 18, 4, '#5a5a5e');
      for (let y = 14; y < 24; y += 3) p.set(13 + (y % 2), y, '#b8b0a0');
    }),
  canning_kettle: () =>
    sprite(26, 24, 13, 23, (p) => {
      p.ellipse(13, 14, 11, 9, '#5a5e64');
      p.rect(2, 14, 22, 8, '#5a5e64');
      p.rect(3, 6, 20, 2, '#8a8e94');
      p.rect(9, 1, 8, 5, '#3a3e44');
      p.rect(0, 22, 26, 2, '#3a2a1c');
      for (const x of [6, 12, 18]) p.rect(x, 16, 3, 4, '#c8a060');
    }),
  ice_harvester: () =>
    sprite(30, 28, 15, 27, (p) => {
      p.rect(0, 22, 30, 6, '#6a6660');
      p.rect(4, 2, 3, 20, '#8a6440');
      p.rect(23, 2, 3, 20, '#8a6440');
      p.rect(4, 2, 22, 3, '#a8a4a0');
      p.rect(12, 5, 6, 10, '#c8ccd0');
      p.rect(13, 15, 4, 2, '#e8ecf0');
      p.rect(8, 16, 14, 6, '#bfe3ee');
      p.rect(9, 17, 5, 2, '#ffffff');
    }),
  // A diving bell on the seabed: air for the Undertow.
  diving_bell: () =>
    sprite(34, 40, 17, 39, (p) => {
      p.ellipse(17, 16, 15, 15, '#8a6a3a');
      p.rect(2, 16, 30, 20, '#8a6a3a');
      p.ellipse(17, 16, 12, 12, '#b8883a');
      p.rect(5, 16, 24, 18, '#b8883a');
      p.rect(0, 34, 34, 6, '#5a4028');
      p.rect(10, 12, 14, 12, '#3a5a6a');
      p.rect(11, 13, 5, 4, '#bfe8ff');
      for (const x of [4, 29]) for (let y = 18; y < 34; y += 5) p.set(x, y, '#f0c870');
      p.rect(15, 0, 4, 3, '#5a4028');
    }),
  // A brass grille over a steam pipe (the Clockwork Barrow's traps).
  steam_vent: () =>
    sprite(30, 6, 15, 5, (p) => {
      p.rect(0, 1, 30, 5, '#5a4028');
      p.rect(0, 1, 30, 1, '#d8a048');
      for (let x = 3; x < 28; x += 4) p.rect(x, 2, 2, 3, '#1c140c');
      p.rect(0, 5, 30, 1, '#3a2a14');
    }),
  kiln: () =>
    sprite(40, 34, 20, 33, (p) => {
      p.ellipse(20, 22, 18, 14, '#8a5a44');
      p.rect(2, 22, 36, 12, '#8a5a44');
      for (let y = 12; y < 34; y += 5)
        for (let x = (y % 10 ? 0 : 3) + 2; x < 38; x += 7) p.rect(x, y, 5, 1, '#6a4030');
      p.rect(13, 20, 14, 14, '#1c100c');
      p.rect(16, 0, 8, 10, '#6a4030');
      p.shadeEdges(0.25, -0.3);
    }),
});
const staticSprite = (k: string) => cached('st:' + k, STATIC[k]);

/** A dungeon chest trimmed to match its halls, open once looted. */
function chestSprite(kind: string, open: boolean): Sprite {
  const trim: Record<string, [string, string]> = {
    crypt: ['#5a6a4a', '#9ab88a'],
    frost_keep: ['#6a8aa8', '#dff6ff'],
    tomb: ['#8a6a3a', '#f0c860'],
    citadel: ['#3a2228', '#ff8a3a'],
    mycelia: ['#4a3f5e', '#58e0d0'],
    skyreach: ['#c8c0b0', '#f8e08a'],
    void: ['#2a1c3a', '#b36cff'],
    glasswood: ['#6a88a8', '#bfe8ff'],
    marches: ['#6a6454', '#e6dcc6'],
    barrow: ['#5a4028', '#f0c870'],
    saltflats: ['#b4a48e', '#f0c0c8'],
    choir: ['#5a6a7a', '#dfeaf6'],
    feverlands: ['#4a5a2a', '#e6dcc6'],
    observatory: ['#2a2e50', '#9ab0ff'],
    gutter: ['#5a4a2a', '#f0c850'],
    undertow: ['#2a4a5a', '#bfe8ff'],
    emberheart: ['#3a1a10', '#ff8a3a'],
    garden: ['#4a6a3a', '#f0a0c0'],
  };
  const [body, metal] = trim[kind] ?? ['#7a5a3c', '#d8b848'];
  return cached(`dchest:${kind}:${open}`, () =>
    sprite(22, 16, 11, 15, (p) => {
      const [, d, m, l] = ramp(body);
      p.rect(0, 6, 22, 10, m);
      p.rect(0, 6, 22, 1, l);
      p.rect(0, 15, 22, 1, d);
      if (open) {
        p.rect(0, 0, 22, 3, d);
        p.rect(1, 3, 20, 3, '#141010');
      } else {
        p.rect(0, 1, 22, 5, shade(body, 0.1));
        p.rect(0, 1, 22, 1, l);
        p.rect(9, 5, 4, 4, metal);
        p.set(10, 7, '#141010');
      }
      for (const x of [2, 18]) p.rect(x, open ? 6 : 1, 2, open ? 10 : 15, metal);
    }),
  );
}
/** A boss altar: a dais with the foe's emblem, burning while the fight is on. */
function altarSprite(boss: string, lit: boolean): Sprite {
  const hue: Record<string, string> = {
    hollow_king: '#9ae8c0',
    rime_colossus: '#bfe8f8',
    pharaoh: '#ffd86a',
    archdemon: '#ff6a2a',
    sporemother: '#58e0d0',
    tempest_roc: '#e8f0ff',
    unmaker: '#b36cff',
  };
  const c = hue[boss] ?? '#ffffff';
  return cached(`altar:${boss}:${lit}`, () =>
    sprite(36, 24, 18, 23, (p) => {
      stones(p, 0, 18, 36, 6, '#4a4450');
      stones(p, 5, 12, 26, 6, '#5a5462');
      p.poly(
        [
          [12, 12],
          [14, 2],
          [22, 2],
          [24, 12],
        ],
        '#3e3946',
      );
      p.rect(15, 5, 6, 5, lit ? c : shade(c, -0.55));
      p.set(17, 6, lit ? '#ffffff' : shade(c, -0.3));
      p.shadeEdges();
    }),
  );
}

/** Crop growth: a sprite per crop and stage (0–3). */
function cropSprite(crop: string, stage: number): Sprite {
  return cached(`crop:${crop}:${stage}`, () =>
    sprite(30, 16, 15, 15, (p) => {
      const h = 3 + stage * 4;
      for (let i = 0; i < 5; i++) {
        const x = 3 + i * 6;
        if (crop === 'wheat') {
          p.line(x, 15, x, 15 - h, mix('#7ea05a', '#dcb867', stage / 3));
          if (stage >= 2) p.rect(x - 1, 15 - h, 2, 3, stage === 3 ? '#e8c86a' : '#b8b060');
        } else if (crop === 'potato') {
          p.ellipse(x, 15 - h / 2, 1 + stage, h / 2, '#79a35e');
          if (stage === 3) p.set(x, 14 - h, '#c8a8e8');
        } else {
          p.line(x, 15, x, 15 - h, '#5d8a4c');
          p.set(x - 1, 14 - h / 2, '#79a35e');
          p.set(x + 1, 13 - h / 2, '#79a35e');
          if (stage === 3) p.rect(x - 1, 14 - h, 2, 2, crop === 'berry' ? '#c8324a' : '#e8e0a0');
        }
      }
    }),
  );
}

function portalSwirl(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  t: number,
  rx: number,
  ry: number,
  colors: string[],
) {
  const frame = Math.floor(t * 8) % 8;
  const s = cached(`swirl:${rx}:${ry}:${colors.join()}:${frame}`, () =>
    sprite(
      rx * 2,
      ry * 2,
      rx,
      ry,
      (p) => {
        for (let y = 0; y < ry * 2; y++)
          for (let x = 0; x < rx * 2; x++) {
            const dx = (x + 0.5 - rx) / rx,
              dy = (y + 0.5 - ry) / ry,
              r = Math.sqrt(dx * dx + dy * dy);
            if (r > 1) continue;
            const a = Math.atan2(dy, dx),
              v = Math.sin(a * 3 + r * 9 - (frame / 8) * Math.PI * 2) * 0.5 + 0.5 + (1 - r) * 0.6;
            p.set(x, y, colors[Math.min(colors.length - 1, Math.floor(v * colors.length * 0.7))]);
          }
      },
      false,
    ),
  );
  blit(c, s, x, y);
}

export const DIM_COLORS: Record<string, string[]> = {
  mycelia: ['#1c3a3a', '#2a6a64', '#58e0d0', '#c0fff4'],
  skyreach: ['#3a5a8a', '#6aa0d8', '#bfe4ff', '#ffffff'],
  void: ['#1a0f2a', '#4a2a7a', '#b36cff', '#ffd8ff'],
  home: ['#2a3a1c', '#5a8a3c', '#d8e88a', '#ffffff'],
};

/** Draws a structure with its base at art position (x, y). */
export function drawStructure(
  c: CanvasRenderingContext2D,
  g: RenderGame,
  s: Structure,
  x: number,
  y: number,
  t: number,
) {
  const k = s.type;
  x = Math.round(x);
  y = Math.round(y);
  switch (k) {
    case 'campfire': {
      const lit = s.fuel > 0;
      blit(c, staticSprite('campfire_base'), x, y);
      if (lit) {
        flameAt(c, x, y - 4, t, 3, s.id);
        smoke(c, x + 2, y - 26, t, s.id, 0.8);
        for (let i = 0; i < 4; i++) {
          const life = (t * 0.7 + i * 0.25 + s.id * 0.1) % 1;
          c.fillStyle = life < 0.5 ? '#ffd27a' : '#ff8a3a';
          c.globalAlpha = 1 - life;
          c.fillRect(
            Math.round(x + Math.sin(i * 3 + life * 6) * 5 + life * 3),
            Math.round(y - 12 - life * 28),
            1,
            1,
          );
        }
        c.globalAlpha = 1;
      } else smoke(c, x, y - 6, t * 0.6, s.id, 0.4);
      return;
    }
    case 'furnace':
    case 'forge': {
      blit(c, staticSprite(k), x, y);
      const busy = s.fuel > 0 || k === 'forge';
      if (busy) {
        const [fx, fy] = k === 'furnace' ? [x, y - 5] : [x - 8, y - 5];
        flameAt(c, fx, fy, t, 1, s.id);
        smoke(c, k === 'furnace' ? x : x - 13, y - 32, t, s.id, 0.6);
      }
      return;
    }
    case 'farm_plot': {
      blit(c, staticSprite(k), x, y);
      if (s.crop) {
        const grow = clamp((g.s.elapsed - s.plantedAt) / 240),
          stage = grow >= 1 ? 3 : Math.floor(grow * 3);
        blit(c, cropSprite(s.crop, stage), x, y - 5);
      }
      return;
    }
    case 'rain_catcher': {
      blit(c, staticSprite(k), x, y);
      const level = clamp(s.water / 8);
      if (level > 0) {
        c.fillStyle = '#5a9cbc';
        c.fillRect(x - 7, y - 17 - Math.round(level * 0), 14, 1);
        c.fillStyle = '#8ac6dc';
        c.fillRect(x - 6, y - 18, Math.round(12 * level), 1);
      }
      return;
    }
    case 'lantern':
    case 'crystal_lantern': {
      const crystal = k === 'crystal_lantern',
        lit = crystal || s.fuel > 0;
      blit(c, staticSprite('lantern_post'), x, y);
      const lx = x + 9,
        ly = y - 30;
      c.fillStyle = '#3f3a36';
      c.fillRect(lx - 3, ly, 7, 1);
      c.fillRect(lx - 3, ly + 8, 7, 1);
      c.fillStyle = lit ? (crystal ? '#aef0ec' : '#ffd88a') : '#6d6a5e';
      c.fillRect(lx - 2, ly + 1, 5, 7);
      c.fillStyle = lit ? (crystal ? '#e6fffb' : '#fff4c8') : '#8a8678';
      c.fillRect(lx, ly + 2 + (Math.floor(t * 8) % 2), 1, 4);
      return;
    }
    case 'torch': {
      blit(c, staticSprite('torch'), x, y);
      if (s.kind === 'frost' || s.kind === 'soul') {
        const col =
            s.kind === 'frost'
              ? ['#3a8ad8', '#8ad0ff', '#e8f8ff']
              : ['#2a9a6a', '#7ae8b0', '#e8fff0'],
          f = Math.floor(t * 9 + s.id) % 3;
        c.fillStyle = col[0];
        c.fillRect(x - 2, y - 14 - (f === 1 ? 1 : 0), 4, 5);
        c.fillStyle = col[1];
        c.fillRect(x - 1, y - 15 - (f % 2), 2, 5);
        c.fillStyle = col[2];
        c.fillRect(x, y - 13, 1, 2);
      } else flameAt(c, x, y - 10, t, 1, s.id);
      return;
    }
    case 'waystone': {
      blit(c, staticSprite('waystone'), x, y);
      // Its runes glow while a realm is open, and a thread of light rises from its crown.
      const open = !!g.s.pocket,
        pulse = 0.5 + 0.5 * Math.sin(t * 3 + s.id);
      c.fillStyle = open ? '#9af0ff' : '#6a6a88';
      c.globalAlpha = open ? 0.6 + pulse * 0.4 : 0.5;
      for (const [rx, ry] of [
        [0, -35],
        [1, -27],
        [0, -19],
      ])
        c.fillRect(x + rx - 1, y + ry, 2, 3);
      if (open) {
        c.globalAlpha = 0.35 + pulse * 0.3;
        for (let i = 0; i < 14; i++) c.fillRect(x, y - 50 - i * 2 - Math.floor((t * 10) % 2), 1, 1);
      }
      c.globalAlpha = 1;
      return;
    }
    case 'shrine': {
      blit(c, staticSprite('shrine'), x, y);
      if (s.crop !== 'spent') {
        c.fillStyle = '#fff0a0';
        c.globalAlpha = 0.6 + Math.sin(t * 3 + s.id) * 0.3;
        c.fillRect(x - 1, y - 16, 2, 3);
        c.fillRect(x, y - 26 - Math.round((t * 6) % 6), 1, 1);
        c.globalAlpha = 1;
      }
      return;
    }
    case 'kiln':
      blit(c, staticSprite('kiln'), x, y);
      flameAt(c, x, y - 4, t, 2, s.id);
      smoke(c, x, y - 40, t, s.id, 0.7);
      return;
    case 'kitchen':
      blit(c, staticSprite('kitchen'), x, y);
      flameAt(c, x - 6, y - 7, t, 1, s.id);
      smoke(c, x - 2, y - 34, t, s.id, 0.6);
      return;
    case 'door':
      blit(c, staticSprite(s.crop === 'open' ? 'door_open' : 'door_closed'), x, y);
      return;
    case 'dungeon_chest':
      blit(c, chestSprite(s.kind ?? '', s.crop === 'open'), x, y);
      return;
    case 'boss_altar': {
      const lit = g.bosses.active()?.type === s.kind;
      blit(c, altarSprite(s.kind ?? '', lit), x, y);
      if (!lit && Math.sin(t * 2 + s.id) > 0.6) {
        c.fillStyle = 'rgba(255,255,255,0.6)';
        c.fillRect(x - 1 + Math.round(Math.sin(t * 3) * 3), y - 26 - Math.round((t * 8) % 8), 1, 1);
      }
      return;
    }
    case 'trap_spikes': {
      const hit = g.s.elapsed - s.triggeredAt < 0.4;
      blit(c, staticSprite(k), x, y + (hit ? 0 : 1));
      return;
    }
    case 'trap_dart':
      blit(c, staticSprite(k), x, y, s.kind === '-1');
      return;
    case 'trap_flame': {
      blit(c, staticSprite(k), x, y);
      const since = g.s.elapsed - s.triggeredAt;
      if (since < 0.7) flameAt(c, x, y - 3, t, 2, s.id);
      else if (since > 2.4) {
        c.fillStyle = '#ff8a3a';
        c.fillRect(x - 1 + (Math.floor(t * 12) % 3), y - 5, 1, 1);
      }
      return;
    }
    case 'starforge': {
      blit(c, staticSprite(k), x, y);
      flameAt(c, x, y - 7, t, 1, s.id);
      return;
    }
    case 'drying_rack': {
      blit(c, staticSprite(k), x, y);
      const items = Object.keys(s.store ?? {}).length || 2;
      for (let i = 0; i < Math.min(4, items); i++) {
        const sx = x - 10 + i * 6,
          len = 8 + Math.round(hash(i, s.id) * 5);
        c.fillStyle = i % 2 ? '#a0503a' : '#6a8a44';
        c.fillRect(sx, y - 22, 3, len);
        c.fillStyle = '#3a2a1c';
        c.fillRect(sx + 1, y - 23, 1, 1);
      }
      return;
    }
    case 'spike_trap': {
      const hit = g.s.elapsed - s.triggeredAt < 0.6;
      blit(c, staticSprite(k), x + (hit ? Math.round(Math.sin(t * 60)) : 0), y);
      if (hit) {
        c.fillStyle = '#8e3b30';
        for (let i = 0; i < 6; i++) c.fillRect(x - 13 + i * 5, y - 10, 1, 2);
      }
      return;
    }
    case 'effergy': {
      const spec = bossSpec(g),
        pulse = 0.5 + 0.5 * Math.sin(t * 2.4);
      blit(c, staticSprite(k), x, y);
      const orb = cached(`orb:${spec.glow}:${Math.round(pulse * 3)}`, () =>
        sprite(12, 12, 6, 6, (p) => {
          p.ellipse(6, 6, 5.5, 5.5, shade(spec.glow, -0.3));
          p.ellipse(5, 5, 3.5, 3.5, spec.glow);
          p.rect(4, 3, 2, 2, mix(spec.glow, '#ffffff', 0.6 + pulse * 0.2));
        }),
      );
      blit(c, orb, x, y - 66 - Math.round(Math.sin(t * 1.6) * 2));
      return;
    }
    case 'rift_gate':
    case 'portal': {
      const dest =
        Object.keys(s.store ?? {})
          .filter((key) => key in DIM_COLORS)
          .pop() ?? (k === 'portal' ? 'home' : 'void');
      const colors = k === 'portal' ? DIM_COLORS.home : (DIM_COLORS[dest] ?? DIM_COLORS.void);
      if (k === 'rift_gate') {
        const open = (s.fuel ?? 0) > 0;
        if (open) portalSwirl(c, x, y - 35, t, 18, 24, colors);
        blit(c, staticSprite('rift_gate'), x, y);
        const sigils = Object.keys(s.store ?? {}).filter((n) => n.startsWith('sigil_')).length;
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2 - Math.PI / 2,
            sx = Math.round(x + Math.cos(a) * 22.5),
            sy = Math.round(y - 35 + Math.sin(a) * 28.5);
          c.fillStyle = i < sigils * 2 || open ? colors[2] : '#221e28';
          c.fillRect(sx, sy, 1, 1);
        }
      } else {
        portalSwirl(c, x, y - 26, t, 13, 22, colors);
        const frame = cached('portalframe', () =>
          sprite(34, 52, 17, 51, (p) => {
            stones(p, 0, 46, 34, 6, '#2e2a36');
            p.rect(0, 0, 5, 46, '#3e3946');
            p.rect(29, 0, 5, 46, '#3e3946');
            p.rect(0, 0, 34, 4, '#4a4454');
            p.shadeEdges();
          }),
        );
        blit(c, frame, x, y);
      }
      return;
    }
    default: {
      if (k in STATIC) blit(c, staticSprite(k), x, y);
      else {
        // Unknown structures still show up, as a marked crate.
        c.fillStyle = '#7a5a3c';
        c.fillRect(x - 6, y - 12, 12, 12);
      }
    }
  }
}
