import {
  D,
  T,
  TAU,
  H,
  clamp,
  lerp,
  smooth,
  vnoise,
  fbm,
  rgb,
  mix,
  rgba,
  shade,
  INK,
  polyPath,
  fillPoly,
  ellipse,
  line,
  curve,
  smoothPath,
  blobPath,
  inked,
  glow,
  limb,
} from './graphics.ts';
import {
  ART,
  BIOME_STEP,
  FIRST_CENTER,
  blendAt,
  artAt,
  daylight,
  duskiness,
  overcastOf,
} from './palette.ts';
import { grassBlade } from './terrain.ts';
import type { ArtStyle, Canvas2D } from './types.ts';
import type { FieldCache, ResourceNode } from '../core/types.ts';

export const treeNode = (k: string) => k === 'wood' || k === 'resin' || k === 'honey';
export function drawBroadleaf(c: Canvas2D, s: number, seed: number, art: ArtStyle, sway: number) {
  const th = 74 * s,
    [dk, md, lt] = art.leaves;
  c.beginPath();
  c.moveTo(-12 * s, 0);
  c.quadraticCurveTo(-5 * s, -5 * s, -5 * s, -28 * s);
  c.lineTo(-3.5 * s, -th);
  c.lineTo(3.5 * s, -th);
  c.lineTo(5 * s, -28 * s);
  c.quadraticCurveTo(5 * s, -5 * s, 12 * s, 0);
  c.closePath();
  c.fillStyle = art.bark;
  c.fill();
  c.strokeStyle = INK;
  c.lineWidth = 1.6;
  c.stroke();
  fillPoly(
    c,
    [
      [1 * s, -2],
      [4 * s, -th],
      [3.5 * s, -th],
      [5 * s, -28 * s],
      [10 * s, -1],
    ],
    'rgba(0,0,0,0.18)',
  );
  line(c, 0, -44 * s, -20 * s + sway * 0.4, -66 * s, INK, 5.5 * s);
  line(c, 0, -44 * s, -20 * s + sway * 0.4, -66 * s, art.bark, 3.6 * s);
  line(c, 0, -56 * s, 19 * s + sway * 0.5, -78 * s, INK, 5 * s);
  line(c, 0, -56 * s, 19 * s + sway * 0.5, -78 * s, art.bark, 3.2 * s);
  const cy = -th - 16 * s,
    clumps = [[sway, cy, 25 * s]];
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * TAU + H(i, seed) * 0.6,
      d = 19 * s * (0.7 + 0.3 * H(i, seed, 1));
    clumps.push([
      Math.cos(a) * d * 1.3 + sway * (0.8 + Math.sin(a) * -0.3),
      cy + Math.sin(a) * d * 0.78,
      (14 + H(i, seed, 2) * 7) * s,
    ]);
  }
  inked(
    c,
    clumps.map(
      ([x, y, r], i) =>
        () =>
          blobPath(c, x, y, r, r * 0.9, seed + i, 0.14),
    ),
    dk,
    3.2,
  );
  for (const [x, y, r] of clumps) {
    blobPath(c, x - 3 * s, y - 4 * s, r * 0.78, r * 0.7, seed + x, 0.16);
    c.fillStyle = md;
    c.fill();
  }
  clumps
    .filter(([, y]) => y < cy + 4 * s)
    .forEach(([x, y, r], i) => {
      blobPath(c, x - 7 * s, y - 8 * s, r * 0.42, r * 0.34, seed + i * 3, 0.2);
      c.fillStyle = lt;
      c.fill();
    });
}
export function drawConifer(
  c: Canvas2D,
  s: number,
  seed: number,
  art: ArtStyle,
  sway: number,
  snowy: boolean,
) {
  const [dk, md, lt] = art.leaves;
  c.fillStyle = art.bark;
  c.fillRect(-4 * s, -26 * s, 8 * s, 27 * s);
  c.strokeStyle = INK;
  c.lineWidth = 1.5;
  c.strokeRect(-4 * s, -26 * s, 8 * s, 27 * s);
  const tiers = 5,
    shapes = [];
  for (let i = 0; i < tiers; i++) {
    const bottom = -18 * s - i * 21 * s,
      width = (36 - i * 6) * s * (0.95 + H(i, seed) * 0.1),
      top = bottom - 38 * s,
      sw = sway * ((i + 1) / tiers);
    // Apex, then a drooping saw-tooth hem from left to right.
    const pts = [[sw * 1.2, top]];
    for (let j = 0; j <= 5; j++)
      pts.push([-width + (j / 5) * width * 2 + sw, bottom + (j % 2 ? -5 * s : 0)]);
    shapes.push(pts);
  }
  inked(
    c,
    shapes.map((pts) => () => polyPath(c, pts)),
    md,
    3.2,
  );
  shapes.forEach((pts) => {
    const [tx, ty] = pts[0],
      last = pts[pts.length - 1];
    fillPoly(
      c,
      [
        [tx, ty],
        [last[0], last[1]],
        [tx + (last[0] - tx) * 0.1, last[1] - 4 * s],
      ],
      dk,
    );
    line(c, tx - 1, ty + 6 * s, pts[1][0] * 0.55 + tx * 0.45, lerp(ty, pts[1][1], 0.55), lt, 2 * s);
    if (snowy) {
      c.fillStyle = '#f3f7f6';
      c.beginPath();
      c.moveTo(tx, ty - 1);
      c.lineTo(lerp(tx, pts[1][0], 0.45), lerp(ty, pts[1][1], 0.45));
      c.quadraticCurveTo(
        tx,
        lerp(ty, pts[1][1], 0.3),
        lerp(tx, last[0], 0.35),
        lerp(ty, last[1], 0.35),
      );
      c.closePath();
      c.fill();
      for (let j = 1; j < pts.length - 1; j += 2)
        ellipse(c, pts[j][0], pts[j][1] - 1.5, 4 * s, 2 * s, '#eef4f3');
    }
  });
}
export function drawWillow(
  c: Canvas2D,
  s: number,
  seed: number,
  art: ArtStyle,
  sway: number,
  t: number,
) {
  const [dk, md, lt] = art.leaves;
  c.beginPath();
  c.moveTo(-13 * s, 0);
  c.quadraticCurveTo(-3 * s, -20 * s, -8 * s, -62 * s);
  c.lineTo(4 * s, -64 * s);
  c.quadraticCurveTo(6 * s, -20 * s, 13 * s, 0);
  c.closePath();
  c.fillStyle = art.bark;
  c.fill();
  c.strokeStyle = INK;
  c.lineWidth = 1.6;
  c.stroke();
  const cy = -80 * s;
  const clumps = [];
  for (let i = 0; i < 6; i++)
    clumps.push([(i - 2.5) * 13 * s + sway * 0.6, cy + Math.abs(i - 2.5) * 5 * s, 20 * s]);
  inked(
    c,
    clumps.map(
      ([x, y, r], i) =>
        () =>
          blobPath(c, x, y, r, r * 0.75, seed + i, 0.15),
    ),
    dk,
    3,
  );
  for (let i = 0; i < 16; i++) {
    const sx = (i / 15 - 0.5) * 84 * s + sway * 0.6,
      len = (26 + H(i, seed, 3) * 30) * s,
      st = Math.sin(t * 1.3 + i * 0.7) * 3 + sway;
    curve(
      c,
      sx,
      cy + 6 * s,
      sx + st * 0.5,
      cy + len * 0.5,
      sx + st,
      cy + len,
      i % 3 ? md : lt,
      2.4 * s,
    );
  }
  for (const [x, y, r] of clumps) {
    blobPath(c, x - 2 * s, y - 5 * s, r * 0.6, r * 0.42, seed + x, 0.2);
    c.fillStyle = md;
    c.fill();
  }
}
export function drawPine(c: Canvas2D, s: number, seed: number, art: ArtStyle, sway: number) {
  const [dk, md, lt] = art.leaves,
    lean = (H(seed, 2) - 0.3) * 18 * s;
  c.beginPath();
  c.moveTo(-6 * s, 0);
  c.quadraticCurveTo(-3 * s + lean * 0.2, -60 * s, lean - 2 * s, -112 * s);
  c.lineTo(lean + 2 * s, -112 * s);
  c.quadraticCurveTo(3 * s + lean * 0.2, -60 * s, 6 * s, 0);
  c.closePath();
  c.fillStyle = art.bark;
  c.fill();
  c.strokeStyle = INK;
  c.lineWidth = 1.5;
  c.stroke();
  line(c, lean * 0.6, -80 * s, lean * 0.6 + 22 * s, -96 * s, art.bark, 3 * s);
  const pads = [
    [lean + sway, -118 * s, 34 * s, 11 * s],
    [lean * 0.6 + 24 * s + sway * 0.8, -99 * s, 20 * s, 8 * s],
    [lean - 14 * s + sway, -108 * s, 18 * s, 7 * s],
  ];
  inked(
    c,
    pads.map(
      ([x, y, rx, ry], i) =>
        () =>
          blobPath(c, x, y, rx, ry, seed + i, 0.18),
    ),
    dk,
    3,
  );
  for (const [x, y, rx, ry] of pads) {
    blobPath(c, x - 2, y - 2.5, rx * 0.82, ry * 0.6, seed + x, 0.2);
    c.fillStyle = md;
    c.fill();
    ellipse(c, x - rx * 0.3, y - ry * 0.45, rx * 0.35, ry * 0.25, lt);
  }
}
export function drawTree(c: Canvas2D, n: ResourceNode, x: number, y: number, t: number) {
  const art0 = artAt(n.x, n.y),
    art = art0.trees ? art0 : ART.meadow,
    s = 0.9 + H(n.id, 3) * 0.24,
    sway = Math.sin(t * 0.9 + n.phase + n.x * 0.01) * 2.2,
    seed = n.id * 13;
  c.save();
  c.translate(x, y);
  ellipse(c, 0, 1, 30 * s, 5, 'rgba(20,24,18,0.22)');
  if (n.hp <= 0) {
    // A cut stump waits for regrowth.
    fillPoly(
      c,
      [
        [-11, 1],
        [-8, -13],
        [8, -12],
        [11, 1],
      ],
      art.bark,
      INK,
      1.5,
    );
    ellipse(c, 0, -12.5, 8, 3, '#c9a878', INK, 1.2);
    ellipse(c, 0, -12.5, 4, 1.5, '', '#a8845a', 1);
    c.restore();
    return;
  }
  const kind = n.kind === 'resin' ? 'conifer' : n.kind === 'honey' ? 'broadleaf' : art.trees;
  if (kind === 'conifer') drawConifer(c, s, seed, art, sway, !!art.snowy);
  else if (kind === 'willow') drawWillow(c, s, seed, art, sway, t);
  else if (kind === 'pine') drawPine(c, s, seed, art, sway);
  else drawBroadleaf(c, s, seed, art, sway);
  if (n.kind === 'resin') {
    for (const [dx, dy, r] of [
      [2, -10, 3.2],
      [-2, -19, 2.4],
    ]) {
      blobPath(c, dx * s, dy * s, r, r * 1.5, seed + dy, 0.1);
      c.fillStyle = '#d99a3c';
      c.fill();
      c.strokeStyle = '#8b5a1f';
      c.lineWidth = 1;
      c.stroke();
      ellipse(c, dx * s - 0.8, dy * s - 1.5, 0.9, 1.4, '#f8dc9a');
    }
    glow(c, 0, -14 * s, 18, '#f0b45c', 0.25);
  }
  if (n.kind === 'honey') {
    const hx = 17 * s + sway * 0.5,
      hy = -70 * s;
    line(c, hx, hy - 8, hx, hy, '#4a3a2a', 1.2);
    for (let b = 0; b < 4; b++)
      ellipse(
        c,
        hx,
        hy + 4 + b * 4.5,
        7 - Math.abs(b - 1.3) * 1.6,
        3.2,
        b % 2 ? '#c7902e' : '#dcaa4e',
        INK,
        1,
      );
    ellipse(c, hx, hy + 13, 1.8, 1.8, '#3a2a1c');
    for (let b = 0; b < 3; b++) {
      const a = t * 3 + b * 2.1 + n.phase;
      ellipse(c, hx + Math.cos(a) * 12, hy + 8 + Math.sin(a * 1.3) * 7, 1.4, 1.1, '#2c2418');
    }
  }
  c.restore();
}
// ─── Plants ───────────────────────────────────────────────────────────────
export function leaf(
  c: Canvas2D,
  x: number,
  y: number,
  len: number,
  ang: number,
  wd: number,
  color: string,
) {
  c.save();
  c.translate(x, y);
  c.rotate(ang);
  c.beginPath();
  c.moveTo(0, 0);
  c.quadraticCurveTo(len * 0.5, -wd, len, 0);
  c.quadraticCurveTo(len * 0.5, wd, 0, 0);
  c.fillStyle = color;
  c.fill();
  c.restore();
}
export function drawPlant(c: Canvas2D, n: ResourceNode, x: number, y: number, t: number) {
  const k = n.kind,
    art = artAt(n.x, n.y),
    [gd, gm, gl] = ['#48683f', '#63874f', '#86a863'],
    sway = Math.sin(t * 1.6 + n.phase + n.x * 0.02) * 0.06,
    full = D.NODES[k] ? n.hp / D.NODES[k].hp : 1,
    s = 0.78 + 0.22 * clamp(full) + H(n.id, 4) * 0.1,
    seed = n.id * 7;
  c.save();
  c.translate(x, y);
  ellipse(c, 0, 1, 15 * s, 3, 'rgba(20,24,18,0.2)');
  if (n.hp <= 0) {
    for (let i = 0; i < 4; i++)
      line(c, -6 + i * 4, 1, -6 + i * 4 + (i - 1.5), -3 - H(i, seed) * 3, '#8a8058', 1.3);
    c.restore();
    return;
  }
  c.transform(1, 0, sway, 1, 0, 0);
  c.scale(s, s);
  void art;
  if (k === 'berry') {
    const blobs = [
      [-9, -11, 10],
      [8, -12, 10],
      [0, -19, 11],
      [-2, -8, 10],
    ];
    inked(
      c,
      blobs.map(
        ([bx, by, r], i) =>
          () =>
            blobPath(c, bx, by, r, r * 0.85, seed + i, 0.2),
      ),
      '#3f6139',
      3,
    );
    for (const [bx, by, r] of blobs) {
      blobPath(c, bx - 2, by - 3, r * 0.6, r * 0.5, seed + bx, 0.2);
      c.fillStyle = '#5b824a';
      c.fill();
    }
    for (let i = 0; i < 9; i++) {
      const bx = (H(i, seed, 1) - 0.5) * 26,
        by = -6 - H(i, seed, 2) * 18;
      ellipse(c, bx, by, 2.8, 2.8, '#b8413d', 'rgba(60,20,20,0.6)', 0.8);
      ellipse(c, bx - 0.9, by - 0.9, 0.9, 0.9, '#f3c2b5');
    }
  } else if (k === 'herb') {
    for (let i = 0; i < 5; i++) {
      const sx = (i - 2) * 4,
        top = -16 - H(i, seed) * 10,
        lean = (i - 2) * 2.5;
      curve(c, sx * 0.3, 0, sx, top * 0.5, sx + lean, top, gd, 1.4);
      for (let j = 1; j < 4; j++) {
        const py = (top * j) / 4,
          px = sx * 0.3 + (sx + lean - sx * 0.3) * (j / 4);
        leaf(c, px, py, 7, -0.5, 2.6, j % 2 ? gm : gl);
        leaf(c, px, py, 7, Math.PI + 0.5, 2.6, gm);
      }
      for (let f = 0; f < 3; f++)
        ellipse(c, sx + lean + (f - 1) * 1.8, top - 1 - (f % 2) * 1.5, 1.5, 1.5, '#efe9f2');
    }
  } else if (k === 'fiber') {
    for (let i = 0; i < 11; i++) {
      const bx = (i - 5) * 1.8,
        h = 20 + H(i, seed) * 16,
        lean = (i - 5) * 2.2 + (H(i, seed, 2) - 0.5) * 6;
      grassBlade(c, bx, 1, h, lean, [gd, '#7f9b58', '#a3b86f'][i % 3]);
    }
    for (let i = 0; i < 3; i++) {
      const lean = (i - 1) * 8,
        h = 34 + i * 3;
      curve(c, 0, 0, lean * 0.4, -h * 0.6, lean, -h, '#8c8a55', 1.2);
      ellipse(c, lean, -h - 2, 1.8, 4, '#c3b27a', '', 1, lean * 0.03);
    }
  } else if (k === 'wheat') {
    for (let i = 0; i < 7; i++) {
      const lean = (i - 3) * 2.6,
        h = 30 + H(i, seed) * 10;
      curve(c, (i - 3) * 1.5, 0, lean * 0.4, -h * 0.5, lean, -h, '#b39658', 1.4);
      for (let j = 0; j < 5; j++) {
        ellipse(c, lean - 1.6, -h - j * 2.6, 1.6, 2.4, '#dcb867', '', 1, -0.4);
        ellipse(c, lean + 1.6, -h - j * 2.6 - 1.2, 1.6, 2.4, '#e8c77a', '', 1, 0.4);
      }
      line(c, lean, -h - 12, lean + 1, -h - 20, '#d9c089', 0.7);
    }
    leaf(c, 0, -8, 14, -2.4, 2.2, '#9fa05c');
    leaf(c, 0, -12, 14, -0.8, 2.2, '#8f944f');
  } else if (k === 'reeds') {
    for (let i = 0; i < 6; i++) {
      const lean = (i - 2.5) * 3,
        h = 38 + H(i, seed) * 16;
      grassBlade(c, (i - 2.5) * 2, 1, h * 0.8, lean * 2.2, i % 2 ? '#6d8a4e' : '#8aa35f');
      if (i % 2 === 0) {
        line(c, (i - 2.5) * 2, 0, lean, -h, '#7b8a55', 1.4);
        ellipse(c, lean, -h + 4, 2.6, 7, '#6e4a2e', INK, 1);
        line(c, lean, -h - 3, lean, -h - 9, '#7b8a55', 1);
      }
    }
  } else if (k === 'potato') {
    ellipse(c, 6, -1, 6, 3.5, '#b08a5a', INK, 1);
    const blobs = [
      [-8, -8, 8],
      [6, -9, 8],
      [-1, -14, 9],
    ];
    inked(
      c,
      blobs.map(
        ([bx, by, r], i) =>
          () =>
            blobPath(c, bx, by, r, r * 0.75, seed + i, 0.28),
      ),
      '#46663c',
      2.6,
    );
    for (let i = 0; i < 7; i++)
      leaf(
        c,
        (H(i, seed) - 0.5) * 16,
        -8 - H(i, seed, 2) * 8,
        8,
        -1.6 + H(i, seed, 3) * 3.2,
        3,
        i % 2 ? gm : gl,
      );
    for (let f = 0; f < 3; f++) {
      const fx = -6 + f * 6,
        fy = -21 + (f % 2) * 3;
      for (let p = 0; p < 5; p++)
        ellipse(
          c,
          fx + Math.cos(p * 1.26) * 1.8,
          fy + Math.sin(p * 1.26) * 1.8,
          1.4,
          1.4,
          '#c9b4df',
        );
      ellipse(c, fx, fy, 0.9, 0.9, '#f0d060');
    }
  } else if (k === 'willow') {
    c.lineCap = 'round';
    for (let i = 0; i < 4; i++) {
      const top = -26 - i * 4,
        dir = i % 2 ? 1 : -1,
        ex = dir * (8 + i * 2);
      curve(c, 0, 0, dir * 2, top, ex, top + 2, '#7a6247', 2);
      for (let j = 0; j < 5; j++) {
        const lx = lerp(0, ex, 0.4 + j * 0.13),
          ly = top + 2 + j * 0.5;
        curve(
          c,
          lx,
          ly,
          lx + dir * 1.5,
          ly + 6,
          lx + dir * 0.5,
          ly + 12 + H(j, seed) * 5,
          j % 2 ? gm : '#9ab36f',
          1.6,
        );
      }
    }
  } else if (k === 'cactus_fruit') {
    const col = '#5f8a57',
      dark = '#44683f';
    const shape = () => {
      c.beginPath();
      c.moveTo(-7, 0);
      c.lineTo(-7, -38);
      c.arc(0, -38, 7, Math.PI, 0);
      c.lineTo(7, 0);
      c.closePath();
    };
    const armL = () => {
      c.beginPath();
      c.roundRect(-18, -30, 8, 18, 4);
      c.rect(-12, -17, 8, 6);
    };
    const armR = () => {
      c.beginPath();
      c.roundRect(10, -40, 8, 22, 4);
      c.rect(4, -24, 8, 6);
    };
    inked(c, [shape, armL, armR], col, 2.8);
    for (const xx of [-3.5, 0, 3.5]) line(c, xx, -2, xx, -40 + Math.abs(xx) * 0.6, dark, 1);
    line(c, 14, -38, 14, -21, dark, 1);
    line(c, -14, -28, -14, -13, dark, 1);
    fillPoly(
      c,
      [
        [2.5, -2],
        [6.5, -2],
        [6.5, -38],
        [4, -42],
      ],
      'rgba(0,0,0,0.13)',
    );
    for (let i = 0; i < 12; i++) {
      const sx = (H(i, seed) - 0.5) * 12,
        sy = -4 - H(i, seed, 2) * 36;
      line(c, sx, sy, sx + (sx > 0 ? 2 : -2), sy - 1, '#e9e2c2', 0.7);
    }
    for (const [fx, fy] of [
      [-3, -46],
      [3, -45.5],
      [14, -45],
    ]) {
      ellipse(c, fx, fy, 3.2, 3.6, '#c9506a', INK, 1);
      ellipse(c, fx - 0.8, fy - 1.2, 1, 1, '#f2a7b5');
    }
  } else if (k === 'mushroom') {
    const shrooms = [
      [-7, 0, 0.85],
      [4, 0, 1.1],
      [11, 0, 0.6],
    ];
    for (const [mx, , ms] of shrooms) {
      const sh = 14 * ms,
        cr = 9 * ms;
      c.fillStyle = '#e6dcc0';
      c.beginPath();
      c.moveTo(mx - 2.6 * ms, 0);
      c.quadraticCurveTo(mx - 1.5 * ms, -sh * 0.6, mx - 2 * ms, -sh);
      c.lineTo(mx + 2 * ms, -sh);
      c.quadraticCurveTo(mx + 1.5 * ms, -sh * 0.6, mx + 2.6 * ms, 0);
      c.closePath();
      c.fill();
      c.strokeStyle = INK;
      c.lineWidth = 1.1;
      c.stroke();
      c.beginPath();
      c.moveTo(mx - cr, -sh + 1);
      c.quadraticCurveTo(mx - cr, -sh - cr * 1.05, mx, -sh - cr * 1.05);
      c.quadraticCurveTo(mx + cr, -sh - cr * 1.05, mx + cr, -sh + 1);
      c.quadraticCurveTo(mx, -sh - 2, mx - cr, -sh + 1);
      c.fillStyle = n.underground ? '#6c8fa8' : '#a9533f';
      c.fill();
      c.stroke();
      for (const [dx, dy] of [
        [-0.45, -0.55],
        [0.2, -0.8],
        [0.5, -0.4],
      ])
        ellipse(c, mx + dx * cr, -sh + dy * cr, 1.3 * ms, 1 * ms, '#f1e3cc');
    }
  }
  c.restore();
}
// ─── Water, stone, and ore ────────────────────────────────────────────────
export function drawPond(c: Canvas2D, n: ResourceNode, x: number, y: number, t: number) {
  c.save();
  c.translate(x, y + 1);
  const w = 34;
  c.beginPath();
  c.moveTo(-w - 4, -1);
  c.quadraticCurveTo(-w + 6, 12, 0, 12);
  c.quadraticCurveTo(w - 6, 12, w + 4, -1);
  c.closePath();
  c.fillStyle = '#4a3c2e';
  c.fill();
  c.strokeStyle = INK;
  c.lineWidth = 1.5;
  c.stroke();
  const gr = c.createLinearGradient(0, 0, 0, 10);
  gr.addColorStop(0, '#8fbcbf');
  gr.addColorStop(1, '#3f6f78');
  c.beginPath();
  c.moveTo(-w, 0);
  c.quadraticCurveTo(-w + 7, 9.5, 0, 9.5);
  c.quadraticCurveTo(w - 7, 9.5, w, 0);
  c.closePath();
  c.fillStyle = gr;
  c.fill();
  line(c, -w + 1, 0.3, w - 1, 0.3, 'rgba(236,244,236,0.8)', 1.4);
  for (let i = 0; i < 3; i++) {
    const p = (t * 0.35 + i / 3 + n.phase) % 1,
      rx = -w * 0.6 + i * w * 0.55;
    c.strokeStyle = `rgba(230,242,236,${0.5 * (1 - p)})`;
    c.lineWidth = 1;
    c.beginPath();
    c.ellipse(rx, 3.5, 3 + p * 9, 0.8 + p * 1.6, 0, 0, TAU);
    c.stroke();
  }
  for (const [sx, r] of [
    [-w - 2, 4],
    [w + 1, 3.2],
    [w - 6, 2.4],
  ])
    ellipse(c, sx, -1, r * 1.3, r, '#8d918a', INK, 1);
  for (let i = 0; i < 4; i++) grassBlade(c, -w + 4 + i * 2.5, 0, 10 + i * 3, -2 + i, '#6f8f52');
  c.restore();
}
export function rockPath(c: Canvas2D, w: number, h: number, seed: number) {
  const pts = [[-w / 2, 0]];
  for (let i = 1; i < 7; i++) {
    const a = Math.PI - (i / 7) * Math.PI,
      j = 0.82 + H(i, seed, 9) * 0.3;
    pts.push([Math.cos(a) * (w / 2) * j, -Math.sin(a) * h * j]);
  }
  pts.push([w / 2, 0]);
  polyPath(c, pts);
  return pts;
}
export function drawRock(c: Canvas2D, x: number, w: number, h: number, seed: number, base: string) {
  c.save();
  c.translate(x, 0);
  const pts = rockPath(c, w, h, seed);
  c.fillStyle = base;
  c.fill();
  c.save();
  c.clip();
  ellipse(c, w * 0.32, -h * 0.1, w * 0.45, h * 0.95, shade(base, -0.2));
  fillPoly(
    c,
    [
      [pts[1][0] * 0.9, pts[1][1] * 0.95],
      [pts[2][0], pts[2][1]],
      [pts[3][0], pts[3][1]],
      [pts[3][0] * 0.4, pts[3][1] * 0.55],
      [pts[1][0] * 0.55, pts[1][1] * 0.5],
    ],
    shade(base, 0.2),
  );
  c.fillStyle = 'rgba(0,0,0,0.2)';
  c.fillRect(-w, -3, w * 2, 3);
  c.restore();
  polyPath(c, pts);
  c.strokeStyle = INK;
  c.lineWidth = 1.8;
  c.lineJoin = 'round';
  c.stroke();
  c.restore();
}
export function specks(
  c: Canvas2D,
  seed: number,
  n: number,
  w: number,
  h: number,
  colors: string[],
  size = 2,
) {
  for (let i = 0; i < n; i++) {
    const sx = (H(i, seed, 1) - 0.5) * w * 0.75,
      sy = -h * (0.18 + H(i, seed, 2) * 0.6),
      r = size * (0.7 + H(i, seed, 3) * 0.6);
    fillPoly(
      c,
      [
        [sx - r, sy],
        [sx, sy - r],
        [sx + r, sy],
        [sx, sy + r * 0.8],
      ],
      colors[i % colors.length],
    );
  }
}
export function crystalPrism(
  c: Canvas2D,
  x: number,
  h: number,
  wd: number,
  ang: number,
  a: string,
  b: string,
) {
  c.save();
  c.translate(x, 0);
  c.rotate(ang);
  const gr = c.createLinearGradient(-wd, 0, wd, 0);
  gr.addColorStop(0, a);
  gr.addColorStop(1, b);
  fillPoly(
    c,
    [
      [-wd, 2],
      [-wd, -h + wd * 1.4],
      [0, -h],
      [wd, -h + wd * 1.4],
      [wd, 2],
    ],
    gr,
    INK,
    1.3,
  );
  line(c, 0, -h + 1, 0, 0, 'rgba(255,255,255,0.35)', 1);
  c.restore();
}
export function drawMineral(c: Canvas2D, n: ResourceNode, x: number, y: number, t: number) {
  const k = n.kind,
    seed = n.id * 11,
    full = D.NODES[k] ? clamp(n.hp / D.NODES[k].hp) : 1,
    s = 0.8 + 0.2 * full + H(n.id, 5) * 0.1;
  c.save();
  c.translate(x, y + 1);
  ellipse(c, 0, 0, 20 * s, 3.5, 'rgba(15,18,20,0.25)');
  if (n.hp <= 0) {
    ellipse(c, -5, -1.5, 3.5, 2.2, '#77756e', INK, 1);
    ellipse(c, 4, -1.2, 2.6, 1.8, '#77756e', INK, 1);
    c.restore();
    return;
  }
  c.scale(s, s);
  if (k === 'stone') {
    drawRock(c, 8, 24, 16, seed + 1, '#858a86');
    drawRock(c, -7, 26, 21, seed, '#9a9d97');
    drawRock(c, 14, 10, 7, seed + 2, '#7c817e');
  } else if (k === 'flint') {
    drawRock(c, 0, 32, 21, seed, '#d9d2bf');
    for (const [fx, fy, r] of [
      [-6, -9, 5],
      [6, -12, 4],
      [2, -4, 3],
    ]) {
      blobPath(c, fx, fy, r * 1.2, r, seed + fx, 0.25);
      c.fillStyle = '#34393d';
      c.fill();
      curve(
        c,
        fx - r * 0.7,
        fy - r * 0.2,
        fx - r * 0.2,
        fy - r * 0.9,
        fx + r * 0.6,
        fy - r * 0.4,
        '#a4b3ba',
        1,
      );
    }
  } else if (k === 'clay') {
    c.beginPath();
    c.moveTo(-18, 0);
    c.quadraticCurveTo(-18, -12, -9, -14);
    c.quadraticCurveTo(-2, -20, 7, -15);
    c.quadraticCurveTo(17, -13, 18, 0);
    c.closePath();
    c.fillStyle = '#b06f55';
    c.fill();
    c.strokeStyle = INK;
    c.lineWidth = 1.8;
    c.stroke();
    curve(c, -12, -9, -4, -16, 6, -12, '#d49a7e', 2.2);
    curve(c, -8, -4, 0, -7, 10, -5, '#8e533e', 1.1);
    curve(c, -4, -2, 4, -3, 12, -1.5, '#8e533e', 1);
    ellipse(c, -5, -13, 2.5, 1, 'rgba(255,240,225,0.5)');
  } else if (k === 'copper_ore') {
    drawRock(c, 0, 34, 22, seed, '#6f6a63');
    specks(c, seed, 7, 34, 22, ['#d98a4a', '#f0b070', '#c26d36'], 2.6);
    specks(c, seed + 5, 3, 34, 22, ['#6fb59a'], 1.8);
  } else if (k === 'iron_ore') {
    drawRock(c, 0, 34, 23, seed, '#63605d');
    curve(c, -12, -6, -4, -14, 8, -10, '#a3542f', 2.6);
    curve(c, -4, -18, 4, -9, 12, -6, '#b8663a', 2);
    specks(c, seed, 5, 34, 23, ['#c4773f', '#8f4726'], 2);
  } else if (k === 'coal') {
    drawRock(c, 0, 34, 20, seed, '#56565a');
    for (let i = 0; i < 4; i++) {
      const cx = -10 + i * 7,
        cy = -7 - H(i, seed) * 8,
        r = 4 + H(i, seed, 2) * 3;
      fillPoly(
        c,
        [
          [cx - r, cy + 2],
          [cx - r * 0.4, cy - r],
          [cx + r * 0.8, cy - r * 0.5],
          [cx + r, cy + 2],
        ],
        '#1e1f24',
      );
      line(c, cx - r * 0.3, cy - r * 0.7, cx + r * 0.6, cy - r * 0.4, '#9aa6b4', 1);
    }
  } else if (k === 'ice') {
    for (const [ix, w, h, a] of [
      [-8, 16, 26, -0.15],
      [7, 14, 20, 0.2],
      [0, 12, 14, 0],
    ]) {
      c.save();
      c.translate(ix, 0);
      c.rotate(a);
      fillPoly(
        c,
        [
          [-w / 2, 1],
          [-w / 2, -h * 0.7],
          [-w * 0.1, -h],
          [w / 2, -h * 0.8],
          [w / 2, 1],
        ],
        'rgba(188,226,236,0.92)',
        '#4f7f94',
        1.4,
      );
      fillPoly(
        c,
        [
          [-w / 2, -h * 0.7],
          [-w * 0.1, -h],
          [0, -h * 0.55],
          [-w / 2 + 2, -h * 0.35],
        ],
        'rgba(255,255,255,0.65)',
      );
      fillPoly(
        c,
        [
          [w * 0.15, -h * 0.5],
          [w / 2, -h * 0.8],
          [w / 2, 1],
          [w * 0.15, 1],
        ],
        'rgba(80,140,170,0.3)',
      );
      c.restore();
    }
  } else if (k === 'obsidian') {
    drawRock(c, 0, 30, 12, seed, '#3b3746');
    for (const [ox, h, a] of [
      [-8, 26, -0.25],
      [3, 34, 0.08],
      [11, 20, 0.35],
    ]) {
      c.save();
      c.translate(ox, -4);
      c.rotate(a);
      fillPoly(
        c,
        [
          [-5, 2],
          [-3, -h * 0.6],
          [0, -h],
          [5, -h * 0.4],
          [5, 2],
        ],
        '#1b1922',
        INK,
        1.4,
      );
      line(c, -3, -h * 0.6, 0, -h, '#a07fd0', 1.4);
      line(c, 0, -h, 1, -4, 'rgba(180,150,230,0.35)', 1);
      c.restore();
    }
    glow(c, 0, -14, 30, '#9b77cc', 0.14 + Math.sin(t * 2 + n.phase) * 0.04);
  } else if (k === 'sulfur') {
    drawRock(c, 0, 32, 18, seed, '#8b8472');
    for (let i = 0; i < 9; i++) {
      const sx = (H(i, seed) - 0.5) * 24,
        sy = -4 - H(i, seed, 2) * 14,
        r = 2.5 + H(i, seed, 3) * 2.5;
      fillPoly(
        c,
        [
          [sx - r, sy],
          [sx, sy - r * 1.4],
          [sx + r, sy],
          [sx, sy + r * 0.6],
        ],
        i % 3 ? '#e6cc45' : '#f6e37c',
        '#9a7d1f',
        0.8,
      );
    }
  } else if (k === 'crystal') {
    const pulse = 0.5 + 0.5 * Math.sin(t * 2.2 + n.phase);
    glow(c, 0, -16, 42, '#8fe3df', 0.18 + pulse * 0.12);
    drawRock(c, 0, 30, 10, seed, '#4c4b58');
    crystalPrism(c, -9, 22, 4, -0.35, '#d9fbf7', '#5fb7c0');
    crystalPrism(c, 9, 20, 3.6, 0.4, '#c9f3f0', '#4fa3b0');
    crystalPrism(c, 0, 34, 5, 0.05, '#e6fffb', '#62bcc6');
    crystalPrism(c, 4, 14, 3, 0.7, '#d2f7f3', '#56adb8');
    const sp = (t * 0.8 + n.phase) % 1;
    if (sp < 0.3) {
      const a = (1 - sp / 0.3) * 0.9;
      line(c, -3, -30, 3, -30, rgba('#ffffff', a), 1);
      line(c, 0, -33, 0, -27, rgba('#ffffff', a), 1);
    }
  } else if (k === 'salt') {
    c.beginPath();
    c.moveTo(-18, 0);
    c.quadraticCurveTo(-10, -14, 0, -15);
    c.quadraticCurveTo(12, -14, 18, 0);
    c.closePath();
    c.fillStyle = '#e9e0cc';
    c.fill();
    c.strokeStyle = INK;
    c.lineWidth = 1.6;
    c.stroke();
    for (let i = 0; i < 6; i++) {
      const cx = (H(i, seed) - 0.5) * 22,
        cy = -4 - H(i, seed, 2) * 9,
        r = 2.5 + H(i, seed, 3) * 2;
      c.save();
      c.translate(cx, cy);
      c.rotate(H(i, seed, 4) - 0.5);
      c.fillStyle = '#fbf8f0';
      c.fillRect(-r, -r, r * 2, r * 2);
      c.fillStyle = '#cfc3a9';
      c.fillRect(0, -r, r, r * 2);
      c.strokeStyle = 'rgba(120,105,80,0.6)';
      c.lineWidth = 0.8;
      c.strokeRect(-r, -r, r * 2, r * 2);
      c.restore();
    }
  } else {
    drawRock(c, 0, 30, 20, seed, '#9a8d78');
  }
  c.restore();
}
export function drawNode(c: Canvas2D, n: ResourceNode, x: number, y: number, t: number) {
  const k = n.kind;
  if (k === 'water') drawPond(c, n, x, y, t);
  else if (
    [
      'berry',
      'herb',
      'fiber',
      'wheat',
      'reeds',
      'potato',
      'cactus_fruit',
      'willow',
      'mushroom',
    ].includes(k)
  )
    drawPlant(c, n, x, y, t);
  else drawMineral(c, n, x, y, t);
}
export function drawCache(c: Canvas2D, cache: FieldCache, x: number, y: number, t: number) {
  c.save();
  c.translate(x, y + 1);
  ellipse(c, 0, 0, 16, 3, 'rgba(20,20,15,0.25)');
  const wave = Math.sin(t * 3 + cache.id) * 3;
  line(c, 9, 0, 11, -40, INK, 3.4);
  line(c, 9, 0, 11, -40, '#7a5a3c', 2);
  c.beginPath();
  c.moveTo(11, -40);
  c.quadraticCurveTo(19, -40 + wave * 0.3, 25, -37 + wave);
  c.lineTo(24, -30 + wave);
  c.quadraticCurveTo(18, -31 - wave * 0.3, 11, -30);
  c.closePath();
  c.fillStyle = '#b5523e';
  c.fill();
  c.strokeStyle = INK;
  c.lineWidth = 1.2;
  c.stroke();
  c.beginPath();
  c.moveTo(-13, 0);
  c.quadraticCurveTo(-16, -15, -6, -19);
  c.lineTo(-3, -24);
  c.lineTo(3, -24);
  c.lineTo(5, -19);
  c.quadraticCurveTo(15, -15, 12, 0);
  c.closePath();
  c.fillStyle = '#b89f70';
  c.fill();
  c.strokeStyle = INK;
  c.lineWidth = 1.6;
  c.stroke();
  fillPoly(
    c,
    [
      [2, -18],
      [12, -12],
      [11, -1],
      [3, -1],
    ],
    'rgba(0,0,0,0.15)',
  );
  c.fillStyle = '#9e865c';
  c.fillRect(-9, -11, 7, 6);
  c.strokeStyle = '#6b5236';
  c.lineWidth = 0.8;
  c.setLineDash([1.5, 1.5]);
  c.strokeRect(-9, -11, 7, 6);
  c.setLineDash([]);
  line(c, -5, -20, 5, -20, '#6b4a2c', 2.2);
  curve(c, 5, -20, 9, -18, 7, -14, '#6b4a2c', 1.4);
  const sp = (t * 0.5 + cache.id * 0.37) % 1;
  if (sp < 0.2) {
    const a = 1 - sp / 0.2;
    line(c, -2, -30, 4, -30, rgba('#fff6d8', a), 1.2);
    line(c, 1, -33, 1, -27, rgba('#fff6d8', a), 1.2);
  }
  c.restore();
}
// ─── Structures ───────────────────────────────────────────────────────────
