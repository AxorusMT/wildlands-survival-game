// Pixel trees, plants, rocks and ores, ponds, and field caches.
import type { FieldCache, ResourceNode } from '../core/types.ts';
import { ART, D, type RegionArt, type TreeStyle } from './art.ts';
import { PX, Painter, blit, cached, hash, ramp, shade, sprite, type Sprite } from './px.ts';

const R = (n: number) => Math.round(n);

// ── Trees ────────────────────────────────────────────────────────────────────────────────────

/** A leafy blob with light from the upper left, shadow at the lower right, and leaf speckle. */
function canopy(
  p: Painter,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  leaves: string[],
  seed: number,
) {
  const [dark, mid, lit] = [leaves[0], leaves[1], leaves[2]];
  p.ellipse(cx, cy, rx, ry, mid);
  for (let y = R(cy - ry); y <= R(cy + ry); y++)
    for (let x = R(cx - rx); x <= R(cx + rx); x++) {
      if (!p.alpha(x, y)) continue;
      const dx = (x - cx) / rx,
        dy = (y - cy) / ry,
        light = -dx * 0.5 - dy * 0.8 + (hash(x, y, seed) - 0.5) * 0.7;
      p.set(x, y, light > 0.45 ? lit : light < -0.35 ? dark : mid);
    }
}
function trunk(
  p: Painter,
  cx: number,
  top: number,
  bottom: number,
  width: number,
  bark: string,
  seed: number,
) {
  const [, d, m, l] = ramp(bark);
  for (let y = top; y <= bottom; y++) {
    const flare = y > bottom - 3 ? (bottom - y === 0 ? 3 : 1) : 0,
      x0 = R(cx - width / 2) - flare,
      x1 = R(cx + width / 2) + flare;
    for (let x = x0; x < x1; x++) {
      const edge =
        x === x0 ? l : x === x1 - 1 ? d : hash(x, Math.floor(y / 3), seed) < 0.18 ? d : m;
      p.set(x, y, edge);
    }
  }
}

function treeSprite(style: TreeStyle, art: RegionArt, variant: number, kind: string): Sprite {
  const seed = variant * 31 + style.length;
  const tall = (a: number, b: number) => R(a + hash(variant, 1, 3) * (b - a));
  const leaves = art.leaves,
    bark = kind === 'resin' ? '#6a4a34' : art.bark;
  switch (style) {
    case 'pine':
    case 'snowpine': {
      const h = tall(58, 78),
        w = 30;
      return sprite(w, h, w / 2, h - 1, (p) => {
        trunk(p, w / 2, h - 18, h - 1, 4, bark, seed);
        const tiers = 4;
        for (let i = 0; i < tiers; i++) {
          const top = 2 + i * ((h - 22) / tiers),
            half = 5 + i * 3 + (i === tiers - 1 ? 2 : 0),
            bottom = top + (h - 22) / tiers + 6;
          p.poly(
            [
              [w / 2, top],
              [w / 2 + half, bottom],
              [w / 2 - half, bottom],
            ],
            leaves[1],
          );
          for (let y = R(top); y < bottom; y++)
            for (let x = 0; x < w; x++) {
              if (!p.alpha(x, y) || y > h - 18) continue;
              const c = p.color(x, y);
              if (c[0] + c[1] + c[2] === 0) continue;
              if (x < w / 2 - 1 && hash(x, y, seed) < 0.35) p.set(x, y, leaves[2]);
              else if (x > w / 2 + 1 && hash(x, y, seed + 1) < 0.45) p.set(x, y, leaves[0]);
            }
          if (style === 'snowpine') {
            for (let x = R(w / 2 - half + 2); x < w / 2 + half - 2; x++)
              p.set(x, R(bottom) - 1, hash(x, i, 9) < 0.7 ? '#f4f8fa' : '#dfeaf2');
            p.set(w / 2, R(top), '#ffffff');
          }
        }
        if (kind === 'resin')
          for (const [x, y] of [
            [w / 2 - 1, h - 12],
            [w / 2 + 1, h - 7],
          ])
            p.rect(x, y, 2, 2, '#e0a040');
      });
    }
    case 'palm': {
      const h = tall(56, 72),
        w = 40;
      return sprite(w, h, 18, h - 1, (p) => {
        const [, d, m, l] = ramp(bark);
        for (let y = 10; y < h; y++) {
          const lean = R(Math.sin((h - y) / 26) * 5),
            x = 18 + lean;
          p.rect(x - 1, y, 3, 1, y % 4 === 0 ? d : m);
          p.set(x - 1, y, l);
        }
        const topX = 18 + R(Math.sin((h - 10) / 26) * 5);
        for (const [dx, dy, len] of [
          [-1, -0.2, 14],
          [1, -0.2, 14],
          [-1, 0.6, 12],
          [1, 0.6, 12],
          [0.3, -1, 8],
          [-0.4, -1, 8],
        ]) {
          for (let i = 0; i < len; i++) {
            const x = topX + dx * i,
              y = 10 + dy * i + (i * i) / 18;
            p.rect(R(x), R(y), 2, 2, i < len / 2 ? leaves[1] : leaves[2]);
            if (i % 2) p.set(R(x), R(y) + 2, leaves[0]);
          }
        }
        p.rect(topX - 1, 11, 2, 2, '#6a4a2a');
        p.rect(topX + 1, 12, 2, 2, '#5a3e22');
      });
    }
    case 'willow': {
      const h = tall(48, 60),
        w = 44;
      return sprite(w, h, w / 2, h - 1, (p) => {
        trunk(p, w / 2, h - 26, h - 1, 7, bark, seed);
        canopy(p, w / 2, 14, 20, 12, leaves, seed);
        for (let x = 4; x < w - 4; x += 2) {
          const len = 10 + R(hash(x, variant, 4) * 16);
          for (let y = 16; y < 16 + len; y++) p.set(x, y, y % 3 ? leaves[1] : leaves[2]);
        }
      });
    }
    case 'cactus': {
      const h = tall(26, 40),
        w = 18;
      return sprite(w, h, w / 2, h - 1, (p) => {
        const g = ['#3f6a3a', '#5a8a48', '#7fae5e'];
        p.rect(7, 2, 5, h - 2, g[1]);
        p.rect(2, R(h * 0.45), 3, 8, g[1]);
        p.rect(2, R(h * 0.45) + 6, 6, 3, g[1]);
        p.rect(14, R(h * 0.3), 3, 9, g[1]);
        p.rect(11, R(h * 0.3) + 7, 5, 3, g[1]);
        for (let y = 2; y < h; y += 2) {
          p.set(8, y, g[2]);
          p.set(10, y, g[0]);
        }
        if (variant % 2) p.rect(8, 0, 3, 2, '#e8637a');
      });
    }
    case 'dead': {
      const h = tall(34, 48),
        w = 30;
      return sprite(w, h, w / 2, h - 1, (p) => {
        trunk(p, w / 2, 10, h - 1, 4, '#7a6250', seed);
        const c = '#6a5444';
        p.line(15, 16, 5, 6, c);
        p.line(5, 6, 3, 2, c);
        p.line(16, 12, 25, 4, c);
        p.line(20, 8, 22, 2, c);
        p.line(15, 24, 23, 18, c);
      });
    }
    case 'shroom': {
      const h = tall(40, 60),
        w = 36;
      return sprite(w, h, w / 2, h - 1, (p) => {
        const stalk = ['#8a7a9a', '#b8a8c8', '#dcd0e8'];
        for (let y = 12; y < h; y++) {
          p.rect(w / 2 - 3, y, 6, 1, stalk[1]);
          p.set(w / 2 - 3, y, stalk[2]);
          p.set(w / 2 + 2, y, stalk[0]);
        }
        p.ellipse(w / 2, 11, 17, 9, leaves[0]);
        p.ellipse(w / 2, 9, 16, 7, leaves[1]);
        p.rect(3, 12, w - 6, 3, shade(leaves[0], -0.3));
        for (let i = 0; i < 7; i++)
          p.rect(
            R(5 + hash(i, variant, 2) * (w - 12)),
            R(4 + hash(i, variant, 3) * 5),
            2,
            2,
            leaves[2],
          );
      });
    }
    case 'skytree':
    case 'voidtree':
    case 'crystal':
    case 'birch':
    case 'oak':
    default: {
      const h = tall(style === 'birch' ? 54 : 58, style === 'birch' ? 70 : 76),
        w = 42;
      return sprite(w, h, w / 2, h - 1, (p) => {
        const trunkTop = 20;
        if (style === 'birch' || style === 'skytree') {
          for (let y = trunkTop; y < h; y++) {
            p.rect(w / 2 - 2, y, 4, 1, style === 'birch' ? '#e8e1cf' : '#f0e8d8');
            if (hash(y, 1, seed) < 0.18)
              p.rect(w / 2 - 2 + R(hash(y, 2, seed) * 2), y, 2, 1, '#3a3430');
          }
        } else trunk(p, w / 2, trunkTop, h - 1, style === 'voidtree' ? 4 : 6, bark, seed);
        // A couple of branches reach into the crown.
        p.line(w / 2, trunkTop + 8, w / 2 - 8, trunkTop - 2, shade(bark, -0.2));
        p.line(w / 2, trunkTop + 4, w / 2 + 9, trunkTop - 4, shade(bark, -0.2));
        const blobs: [number, number, number, number][] = [
          [w / 2, 14, 13, 11],
          [w / 2 - 9, 18, 9, 8],
          [w / 2 + 10, 17, 9, 8],
          [w / 2 - 3, 7, 9, 7],
          [w / 2 + 5, 9, 8, 7],
        ];
        for (const [x, y, rx, ry] of blobs)
          canopy(p, x + R((hash(x, variant, 5) - 0.5) * 3), y, rx, ry, leaves, seed);
        if (kind === 'honey') {
          p.rect(w / 2 + 11, 22, 5, 7, '#dcaa4e');
          p.rect(w / 2 + 11, 24, 5, 1, '#a0742e');
          p.rect(w / 2 + 11, 27, 5, 1, '#a0742e');
          p.set(w / 2 + 13, 28, '#3a2a1c');
        }
        if (style === 'voidtree')
          for (let i = 0; i < 6; i++)
            p.set(R(6 + hash(i, variant) * (w - 12)), R(4 + hash(i, variant, 1) * 20), '#fff0ff');
      });
    }
  }
}

function stumpSprite(bark: string): Sprite {
  return cached('stump' + bark, () =>
    sprite(12, 8, 6, 7, (p) => {
      const [, d, m, l] = ramp(bark);
      p.rect(2, 2, 8, 6, m);
      p.rect(2, 2, 1, 6, l);
      p.rect(9, 2, 1, 6, d);
      p.rect(1, 7, 10, 1, d);
      p.rect(2, 1, 8, 2, '#d8b888');
      p.rect(4, 1, 4, 1, '#b89468');
    }),
  );
}

const FALL = 1.1,
  FADE = 0.45;
export const hitShake = (n: ResourceNode, t: number) => {
  const since = t - (n.hitAt ?? -9);
  return since >= 0 && since < 0.25 ? (Math.floor(since * 40) % 2 ? 1 : -1) : 0;
};
const regionOf = (n: { x: number; y: number }) => D.biomeAt(n.x, n.y).id;
export const TREE_KINDS = new Set(['wood', 'resin', 'honey']);

/** A tree at art position (x, y): standing, toppling after the last chop, or a regrowing stump. */
export function drawTree(
  c: CanvasRenderingContext2D,
  n: ResourceNode,
  x: number,
  y: number,
  t: number,
) {
  const region = regionOf(n),
    art = ART[region] ?? ART.meadow,
    style: TreeStyle = n.kind === 'resin' ? 'pine' : n.kind === 'honey' ? 'oak' : art.tree,
    variant = Math.floor(hash(n.id, 7) * 6),
    tree = cached(`tree:${region}:${style}:${variant}:${n.kind}`, () =>
      treeSprite(style, art, variant, n.kind),
    );
  const since = n.felledAt === undefined ? Infinity : t - n.felledAt;
  if (n.hp > 0) {
    blit(c, tree, x + hitShake(n, t), y, hash(n.id, 9) > 0.5);
    return;
  }
  blit(c, stumpSprite(art.bark), x, y);
  if (since < FALL + FADE) {
    const dir = n.fallDir ?? 1,
      lie = Math.PI / 2 - 0.06,
      p = Math.min(1, since / FALL),
      after = Math.max(0, since - FALL),
      angle =
        since < FALL ? lie * p ** 2.4 : lie - 0.06 * Math.sin(after * 18) * Math.exp(-after * 7);
    c.save();
    c.translate(Math.round(x), Math.round(y) - 5);
    c.rotate(dir * angle);
    c.globalAlpha = after > 0 ? Math.max(0, 1 - after / FADE) : 1;
    c.drawImage(tree.cv, -tree.ox, -tree.oy + 5);
    c.restore();
    return;
  }
  // A sapling sprouts beside the stump and grows back in two stages.
  const window = n.depletedUntil - (n.felledAt ?? n.depletedUntil),
    growth = window > 0 && since < Infinity ? since / window : 0;
  if (growth > 0.45) {
    const big = growth > 0.75;
    const sap = cached(`sapling:${region}:${big}`, () =>
      sprite(big ? 14 : 8, big ? 20 : 11, big ? 7 : 4, big ? 19 : 10, (p) => {
        const hgt = big ? 20 : 11,
          w = big ? 14 : 8;
        p.rect(Math.floor(w / 2), hgt / 2, 1, hgt / 2, art.bark);
        p.ellipse(w / 2, hgt / 2.6, w / 2, hgt / 3, art.leaves[1]);
        p.set(Math.floor(w / 2) - 1, Math.floor(hgt / 3), art.leaves[2]);
      }),
    );
    blit(c, sap, x + 6, y);
  }
}

// ── Plants ───────────────────────────────────────────────────────────────────────────────────

const PLANT_KINDS = new Set([
  'berry',
  'herb',
  'fiber',
  'wheat',
  'reeds',
  'potato',
  'cactus_fruit',
  'willow',
  'mushroom',
  'glowcap',
  'sunbloom',
  'voidlily',
]);
function plantSprite(kind: string, stage: number, art: RegionArt): Sprite {
  const g = art.leaves;
  return sprite(18, 16, 9, 15, (p) => {
    const full = stage === 2,
      bare = stage === 0;
    switch (kind) {
      case 'berry':
        p.ellipse(9, 10, 8, 5.5, g[1]);
        p.ellipse(7, 8, 5, 4, g[2]);
        p.ellipse(12, 11, 4, 3, g[0]);
        if (!bare)
          for (const [x, y] of [
            [5, 9],
            [9, 7],
            [12, 10],
            [7, 12],
            [14, 8],
            [10, 12],
          ].slice(0, full ? 6 : 3))
            p.rect(x, y, 2, 2, '#c8324a');
        break;
      case 'fiber':
        for (let x = 3; x < 15; x += 2) {
          const hgt = bare ? 3 : 8 + R(hash(x, 1) * 6);
          p.line(x, 15, x + (x < 9 ? -1 : 1), 15 - hgt, x % 4 ? g[1] : g[2]);
        }
        break;
      case 'herb':
        for (let i = 0; i < 5; i++)
          p.ellipse(4 + i * 2.5, 10 - (i % 2) * 2, 2.5, 3.5, i % 2 ? g[2] : g[1]);
        if (!bare)
          for (const [x, y] of [
            [5, 5],
            [10, 4],
            [13, 6],
          ])
            p.rect(x, y, 2, 2, '#f4f0e6');
        break;
      case 'wheat':
        for (let x = 3; x < 16; x += 2) {
          p.line(x, 15, x, bare ? 12 : 5, '#b8984e');
          if (!bare) {
            p.rect(x - 1, 2 + (x % 3), 2, 4, '#e8c86a');
            p.set(x, 2 + (x % 3), '#f8e2a0');
          }
        }
        break;
      case 'potato':
        p.ellipse(9, 11, 7, 4, g[1]);
        p.ellipse(6, 9, 3, 3, g[2]);
        p.ellipse(12, 9, 3, 3, g[2]);
        if (!bare) {
          p.set(6, 6, '#b890d8');
          p.set(12, 6, '#b890d8');
          p.rect(3, 14, 3, 2, '#a88458');
        }
        break;
      case 'reeds':
        for (let x = 4; x < 15; x += 3) {
          p.line(x, 15, x + (x % 2), bare ? 10 : 2, '#8a9458');
          if (!bare) p.rect(x - 1 + (x % 2), 2, 2, 5, '#6a4830');
        }
        break;
      case 'cactus_fruit':
        p.ellipse(9, 11, 5, 5, '#5a8a48');
        for (let y = 7; y < 16; y += 2) p.set(9, y, '#7fae5e');
        if (!bare) {
          p.rect(6, 5, 2, 2, '#e8577a');
          p.rect(10, 5, 2, 2, '#e8577a');
        }
        break;
      case 'willow':
        p.line(9, 15, 9, 5, '#6a5440');
        for (let x = 3; x < 16; x += 2)
          p.line(x, 6, x, 6 + (bare ? 2 : 6 + (x % 3)), g[x % 4 ? 1 : 2]);
        break;
      case 'mushroom':
      case 'glowcap':
        for (const [x, s] of [
          [5, 4],
          [11, 5],
          [8, 3],
        ]) {
          const cap = kind === 'glowcap' ? '#58e0d0' : x === 11 ? '#c85a44' : '#b89068';
          p.rect(x, 15 - s, 2, s, '#e8dcc8');
          p.ellipse(x + 1, 15 - s, s * 0.9 + 1, 2, bare ? '#8a7060' : cap);
        }
        break;
      default:
        p.ellipse(9, 11, 6, 4, g[1]);
        p.rect(8, 4, 3, 3, kind === 'voidlily' ? '#ff6ad5' : '#ffd86a');
    }
  });
}

// ── Rock and ore ─────────────────────────────────────────────────────────────────────────────

interface Mineral {
  rock: string;
  fleck?: string;
  shine?: string;
  crystal?: string;
  glow?: boolean;
}
export const MINERALS: Record<string, Mineral> = {
  stone: { rock: '#8b8f8a' },
  flint: { rock: '#d9d2bf', fleck: '#34393d', shine: '#a4b3ba' },
  clay: { rock: '#b06f55', fleck: '#d49a7e' },
  salt: { rock: '#b8b2a4', crystal: '#f4f2ec' },
  copper_ore: { rock: '#7c7a74', fleck: '#d0844a', shine: '#62b08a' },
  iron_ore: { rock: '#7c7a74', fleck: '#a8745a', shine: '#d8c4b0' },
  coal: { rock: '#5a5a5e', fleck: '#1c1c20', shine: '#8a8a96' },
  ice: { rock: '#8fb8d0', crystal: '#dff4ff' },
  obsidian: { rock: '#3a3448', crystal: '#2a2433', shine: '#9a8ac0' },
  sulfur: { rock: '#8a7a5a', crystal: '#e8d44a' },
  crystal: { rock: '#6a7480', crystal: '#8fe3df', glow: true },
  hellstone: { rock: '#4a1c22', fleck: '#ff6a2a', shine: '#ffd27a', glow: true },
  myconite_ore: { rock: '#4a3f5e', crystal: '#58e0d0', glow: true },
  starmetal_ore: { rock: '#8a8aa0', fleck: '#f8e08a', shine: '#ffffff', glow: true },
  voidsteel_ore: { rock: '#2a1c3a', crystal: '#b36cff', glow: true },
};
function mineralSprite(kind: string, size: number, variant: number): Sprite {
  const m = MINERALS[kind] ?? MINERALS.stone,
    w = 10 + size * 4,
    h = 6 + size * 3;
  return sprite(w, h, w / 2, h - 1, (p) => {
    const [d, , mid, l] = ramp(m.rock);
    const lumps = 2 + size;
    for (let i = 0; i < lumps; i++) {
      const cx = 3 + (i / Math.max(1, lumps - 1)) * (w - 6) + (hash(i, variant, 2) - 0.5) * 2,
        r = 2.5 + hash(i, variant, 3) * (1.5 + size);
      p.ellipse(cx, h - r * 0.8, r + 0.5, r * 0.85, mid);
    }
    p.shadeEdges(0.3, -0.3);
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        if (!p.alpha(x, y)) continue;
        if (y === h - 1) p.set(x, y, d);
        if (m.fleck && hash(x, y, variant + 5) < 0.14)
          p.set(x, y, hash(x, y, 1) < 0.3 && m.shine ? m.shine : m.fleck);
        else if (hash(x, y, variant + 9) < 0.04) p.set(x, y, l);
      }
    if (m.crystal)
      for (let i = 0; i < 1 + size; i++) {
        const cx = R(3 + hash(i, variant, 7) * (w - 6)),
          ht = 3 + R(hash(i, variant, 8) * (2 + size * 2));
        p.poly(
          [
            [cx - 1.5, h - 2],
            [cx, h - 2 - ht],
            [cx + 1.5, h - 2],
          ],
          m.crystal,
        );
        p.set(cx, h - 1 - ht, shade(m.crystal, 0.5));
      }
  });
}

function pondSprite(t: number): Sprite {
  const frame = Math.floor(t * 3) % 4;
  return cached('pond' + frame, () =>
    sprite(
      40,
      6,
      20,
      1,
      (p) => {
        p.ellipse(20, 1, 20, 4.5, '#3f7ea0');
        p.ellipse(20, 1, 17, 3.2, '#5a9cbc');
        for (let i = 0; i < 4; i++)
          p.rect(6 + ((i * 9 + frame * 2) % 28), 1 + (i % 2), 3, 1, '#b8e0ee');
        for (let x = 0; x < 40; x++) if (p.alpha(x, 0)) p.set(x, 0, '#8ac6dc');
      },
      false,
    ),
  );
}

/** Any resource node other than trees. */
export function drawNode(
  c: CanvasRenderingContext2D,
  n: ResourceNode,
  x: number,
  y: number,
  t: number,
) {
  const k = n.kind;
  x += hitShake(n, t);
  if (k === 'water') {
    if (n.hp > 0) blit(c, pondSprite(t), x, y);
    return;
  }
  const art = ART[regionOf(n)] ?? ART.meadow;
  if (PLANT_KINDS.has(k)) {
    const max = D.NODES[k]?.hp ?? 2,
      stage = n.hp <= 0 ? 0 : n.hp >= max ? 2 : 1;
    blit(
      c,
      cached(`plant:${k}:${stage}:${regionOf(n)}`, () => plantSprite(k, stage, art)),
      x,
      y,
      hash(n.id, 4) > 0.5,
    );
    return;
  }
  const full = D.NODES[k] ? n.hp / D.NODES[k].hp : 1,
    size = full > 0.67 ? 2 : full > 0.34 ? 1 : 0,
    variant = Math.floor(hash(n.id, 2) * 3);
  blit(
    c,
    cached(`min:${k}:${size}:${variant}`, () => mineralSprite(k, size, variant)),
    x,
    y,
  );
  if (MINERALS[k]?.glow) {
    const pulse = 0.25 + Math.sin(t * 2.5 + n.phase) * 0.12;
    c.fillStyle = MINERALS[k].crystal ?? MINERALS[k].fleck ?? '#ffffff';
    c.globalAlpha = pulse;
    c.fillRect(Math.round(x) - 1, Math.round(y) - 8, 2, 2);
    c.globalAlpha = 1;
  }
}

export function drawCache(c: CanvasRenderingContext2D, cache: FieldCache, x: number, y: number) {
  const deep = !!cache.layer;
  const s = cached('cache' + deep, () =>
    sprite(16, 16, 7, 15, (p) => {
      const [d, , m, l] = ramp(deep ? '#5a5a6a' : '#8a6440');
      p.rect(1, 7, 12, 9, m);
      p.rect(1, 7, 12, 2, l);
      p.rect(1, 11, 12, 1, d);
      p.rect(6, 10, 2, 3, deep ? '#c8a860' : '#d8b870');
      p.line(13, 15, 13, 0, '#5a4430');
      p.rect(14, 0, 3, 3, deep ? '#8a5ad0' : '#c8443a');
    }),
  );
  blit(c, s, x, y);
}

export { PX };
