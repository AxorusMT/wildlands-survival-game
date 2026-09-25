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
import { ART, blendAt, artAt, daylight, duskiness, overcastOf } from './palette.ts';
import { leaf } from './resources.ts';
import type { Canvas2D, Motion, RenderGame } from './types.ts';
import type { Animal, Player } from '../core/types.ts';

export const motion = new Map<number, Motion>();
export function track(id: number, x: number, y: number, hp: number, t: number): Motion {
  let m = motion.get(id);
  if (!m) {
    if (motion.size > 600) motion.clear();
    m = { x, y, walk: 0, move: 0, hp, hurt: -9 };
    motion.set(id, m);
  }
  const dx = Math.abs(x - m.x);
  if (dx > 60) m.x = x;
  m.walk += Math.min(dx, 12);
  m.move = lerp(m.move, dx > 0.12 ? 1 : 0, 0.22);
  if (hp < m.hp) m.hurt = t;
  m.hp = hp;
  m.x = x;
  m.y = y;
  return m;
}
export function drawDeer(c: Canvas2D, m: Motion, t: number, phase: number) {
  const coat = '#a57a52',
    dark = '#6e4f36',
    belly = '#ead8b5',
    ph = m.walk * 0.14,
    sw = Math.sin(ph) * m.move,
    graze = (1 - m.move) * smooth(0.6, 0.9, Math.sin(t * 0.3 + phase));
  const legs = (far: boolean) => {
    const col = far ? shade(coat, -0.25) : coat,
      a = far ? -sw : sw;
    for (const [hx, off, bend] of [
      [-17, -a, -2],
      [15, a, 2],
    ]) {
      const fx = hx + off * 8,
        lift = Math.max(0, -off) * 3;
      limb(c, hx, -30, fx, -lift, bend, 5, 3, col);
      ellipse(c, fx, -0.5 - lift, 2.4, 1.6, '#3a2d24');
    }
  };
  // The neck pivots at the shoulder to graze; the head stays level-ish on its end.
  const pivot = [15, -40],
    na = graze * 1.75,
    rx = 12,
    ry = -24,
    ex = pivot[0] + rx * Math.cos(na) - ry * Math.sin(na),
    ey = pivot[1] + rx * Math.sin(na) + ry * Math.cos(na),
    len = Math.hypot(ex - pivot[0], ey - pivot[1]),
    nx = (-(ey - pivot[1]) / len) * 5,
    ny = ((ex - pivot[0]) / len) * 5,
    headRot = graze * 1.25;
  const head = (fn: () => void) => () => {
    c.save();
    c.translate(ex, ey);
    c.rotate(headRot);
    fn();
    c.restore();
  };
  legs(true);
  inked(
    c,
    [
      () =>
        smoothPath(c, [
          [-27, -37],
          [-22, -45],
          [-4, -44],
          [12, -47],
          [23, -40],
          [20, -29],
          [2, -26],
          [-17, -28],
        ]),
      () =>
        polyPath(c, [
          [pivot[0] - 8, pivot[1] - 3],
          [ex - nx, ey - ny],
          [ex + nx, ey + ny],
          [pivot[0] + 8, pivot[1] + 8],
        ]),
      head(() => blobPath(c, 0, 0, 8, 6, 3, 0.05)),
      head(() =>
        smoothPath(c, [
          [2, -5],
          [13, -1],
          [14, 3],
          [2, 5],
        ]),
      ),
    ],
    coat,
    3,
  );
  c.save();
  smoothPath(c, [
    [-27, -37],
    [-22, -45],
    [-4, -44],
    [12, -47],
    [23, -40],
    [20, -29],
    [2, -26],
    [-17, -28],
  ]);
  c.clip();
  ellipse(c, 0, -25, 21, 5.5, belly);
  ellipse(c, 6, -44, 16, 3, shade(coat, 0.12));
  c.restore();
  fillPoly(
    c,
    [
      [-24, -42],
      [-29, -47],
      [-22, -45],
    ],
    '#f4ecd8',
    INK,
    1,
  );
  c.save();
  c.translate(ex, ey);
  c.rotate(headRot);
  ellipse(c, 13, 1.5, 1.8, 1.6, '#2a2320');
  ellipse(c, 3, -1.5, 1.5, 1.5, '#1d1916');
  ellipse(c, 2.6, -2, 0.5, 0.5, '#ffffff');
  leaf(c, -4, -4, 10, -2.7, 3, dark);
  for (const [ox, col] of [
    [2.5, shade('#d9c8a2', -0.2)],
    [0, '#d9c8a2'],
  ] as [number, string][]) {
    c.strokeStyle = INK;
    c.lineWidth = 3.4;
    c.lineCap = 'round';
    for (const pass of [0, 1]) {
      if (pass) {
        c.strokeStyle = col;
        c.lineWidth = 1.8;
      }
      c.beginPath();
      c.moveTo(-1 + ox, -5);
      c.quadraticCurveTo(-3 + ox, -18, -11 + ox, -26);
      c.moveTo(-3.5 + ox, -15);
      c.lineTo(3 + ox, -22);
      c.moveTo(-7.5 + ox, -22);
      c.lineTo(-4 + ox, -31);
      c.stroke();
    }
  }
  c.restore();
  legs(false);
}
export function drawWolf(c: Canvas2D, m: Motion, t: number, a: Animal, coat: string, eye: string) {
  const dark = shade(coat, -0.3),
    belly = shade(coat, 0.35),
    ph = m.walk * 0.16,
    sw = Math.sin(ph) * m.move,
    crouch = a.warning > 0 ? 3 : 0,
    tailWag = Math.sin(t * 5 + a.phase) * 2 * (1 - m.move);
  const legs = (far: boolean) => {
    const col = far ? shade(coat, -0.28) : shade(coat, -0.05);
    const s = far ? -sw : sw;
    const bx = -16 - s * 8,
      fx = 14 + s * 8,
      by = -Math.max(0, s) * 3,
      fy = -Math.max(0, -s) * 3;
    limb(c, -16, -22 + crouch, bx, by - 1, -4, 7.5, 4, col);
    limb(c, 14, -22 + crouch, fx, fy - 1, 1, 6.5, 4, col);
    ellipse(c, bx + 1.5, by - 0.8, 3.4, 2, col, INK, 1);
    ellipse(c, fx + 1.5, fy - 0.8, 3.4, 2, col, INK, 1);
  };
  legs(true);
  c.save();
  c.translate(0, crouch);
  inked(
    c,
    [
      () => blobPath(c, 0, -26, 22, 9, 1, 0.05),
      () => blobPath(c, 12, -27, 12, 11, 2, 0.08),
      () => blobPath(c, -14, -27, 9, 9, 3, 0.05),
      () =>
        smoothPath(c, [
          [-20, -30],
          [-34, -26 + tailWag],
          [-44, -14 + tailWag],
          [-38, -12 + tailWag],
          [-24, -21],
        ]),
      () => blobPath(c, 26, -34, 8.5, 7.5, 4, 0.05),
      () =>
        polyPath(c, [
          [28, -38],
          [43, -33],
          [43, -28],
          [28, -27],
        ]),
      () =>
        polyPath(c, [
          [21, -40],
          [23, -50],
          [28, -40],
        ]),
      () =>
        polyPath(c, [
          [25, -40],
          [28, -49],
          [31, -39],
        ]),
    ],
    coat,
    3,
  );
  ellipse(c, -40, -13 + tailWag, 4, 2.6, belly);
  c.save();
  c.beginPath();
  c.ellipse(0, -26, 22, 9, 0, 0, TAU);
  c.clip();
  ellipse(c, 2, -18, 20, 4, belly);
  c.restore();
  for (let i = 0; i < 5; i++) leaf(c, 4 + i * 4, -34 + Math.abs(i - 2), 7, -2.2, 2, dark);
  fillPoly(
    c,
    [
      [33, -30],
      [43, -29],
      [43, -28],
      [30, -27],
    ],
    belly,
  );
  ellipse(c, 43, -32, 1.8, 1.6, '#1b1716');
  ellipse(c, 30, -36, 1.6, 1.3, eye);
  if (a.warning > 0) {
    fillPoly(
      c,
      [
        [32, -28],
        [43, -28],
        [40, -23],
        [33, -25],
      ],
      '#3a1c1c',
    );
    for (let i = 0; i < 3; i++) line(c, 35 + i * 3, -28, 35.5 + i * 3, -26.5, '#f4efe2', 1);
  }
  c.restore();
  legs(false);
}
export function drawBoar(c: Canvas2D, m: Motion, t: number, a: Animal) {
  const coat = '#5e4a3b',
    dark = '#3b2e25',
    ph = m.walk * 0.22,
    sw = Math.sin(ph) * m.move;
  void t;
  const legs = (far: boolean) => {
    const col = far ? shade(coat, -0.28) : shade(coat, -0.05),
      s = far ? -sw : sw;
    limb(c, -15, -14, -15 - s * 6, 0, -1, 6, 4, col);
    limb(c, 13, -14, 13 + s * 6, 0, 1, 6, 4, col);
  };
  legs(true);
  inked(
    c,
    [
      () =>
        smoothPath(c, [
          [-28, -14],
          [-26, -30],
          [-8, -38],
          [12, -40],
          [24, -30],
          [22, -11],
          [0, -8],
        ]),
      () =>
        polyPath(c, [
          [16, -34],
          [34, -24],
          [39, -17],
          [35, -11],
          [18, -13],
        ]),
      () =>
        polyPath(c, [
          [18, -34],
          [15, -43],
          [24, -36],
        ]),
    ],
    coat,
    3,
  );
  c.strokeStyle = dark;
  c.lineWidth = 1.3;
  c.beginPath();
  for (let i = 0; i < 12; i++) {
    const bx = -20 + i * 3.4,
      by = -33 - Math.sin((i / 11) * Math.PI) * 6 + (i > 8 ? (i - 8) * 1.5 : 0);
    c.moveTo(bx, by + 3);
    c.lineTo(bx - 1.5, by - 2);
  }
  c.stroke();
  ellipse(c, 38, -14.5, 2.4, 3.6, '#b88a7a', INK, 1);
  ellipse(c, 38.5, -15.5, 0.6, 0.8, '#3a2a24');
  ellipse(c, 38.5, -13.5, 0.6, 0.8, '#3a2a24');
  curve(c, 32, -12, 37, -14, 36, -21, '#efe5cb', 2.4);
  ellipse(c, 26, -27, 1.4, 1.4, a.warning > 0 ? '#e0624a' : '#1b1716');
  curve(c, -27, -20, -32, -22, -30, -26, dark, 1.3);
  legs(false);
}
export function drawBat(c: Canvas2D, t: number, a: Animal) {
  const flap = Math.sin(t * 15 + a.phase);
  c.translate(0, -24);
  for (const dir of [-1, 1]) {
    const tipY = -8 - flap * 13;
    const pts = [
      [dir * 4, -3],
      [dir * 14, -10 - flap * 8],
      [dir * 30, tipY],
      [dir * 26, tipY + 8],
      [dir * 20, 1 - flap * 4],
      [dir * 15, 4 - flap * 2],
      [dir * 9, 2],
      [dir * 4, 4],
    ];
    fillPoly(c, pts, dir > 0 ? '#4b4148' : '#3c3439', INK, 1.4);
    line(c, dir * 4, -3, dir * 30, tipY, '#2e272c', 1);
    line(c, dir * 14, -10 - flap * 8, dir * 20, 1 - flap * 4, '#2e272c', 0.8);
  }
  ellipse(c, 0, 0, 7, 9, '#5a4e52', INK, 1.5);
  ellipse(c, 4, -8, 5.5, 5, '#5a4e52', INK, 1.4);
  fillPoly(
    c,
    [
      [1, -11],
      [1.5, -18],
      [5, -12],
    ],
    '#5a4e52',
    INK,
    1,
  );
  fillPoly(
    c,
    [
      [5, -12],
      [8, -18],
      [9, -10],
    ],
    '#5a4e52',
    INK,
    1,
  );
  ellipse(c, 6.5, -8.5, 1.3, 1.3, '#f0b27a');
  glow(c, 6.5, -8.5, 5, '#f0b27a', 0.4);
}
export function drawScorpion(c: Canvas2D, m: Motion, t: number, a: Animal) {
  const coat = '#8c7355',
    dark = '#5d4a36',
    lite = '#b39570',
    sc = Math.sin(m.walk * 0.5) * m.move,
    raise = a.warning > 0 ? 6 : Math.sin(t * 2 + a.phase) * 1.5;
  for (const far of [true, false]) {
    for (let i = 0; i < 4; i++) {
      const off = (i % 2 ? 1 : -1) * sc * (far ? -3 : 3);
      limb(
        c,
        -8 + i * 6,
        -8,
        -16 + i * 10 + off,
        0,
        far ? -3 : 3,
        2.4,
        1.8,
        far ? dark : shade(coat, -0.1),
      );
    }
    if (far) {
      limb(c, 16, -10, 30, -17, 0, 3, 2.5, dark);
      blobPath(c, 36, -18, 6, 3.5, 8, 0.1);
      c.fillStyle = dark;
      c.fill();
    }
  }
  // The tail arcs up and over the back as one continuous chain of segments.
  const bez = (u: number, p0: number, p1: number, p2: number, p3: number) =>
    (1 - u) ** 3 * p0 + 3 * (1 - u) ** 2 * u * p1 + 3 * (1 - u) * u * u * p2 + u ** 3 * p3;
  const tail = [];
  for (let i = 0; i <= 9; i++) {
    const u = i / 9;
    tail.push([
      bez(u, -15, -36, -38, -12),
      bez(u, -10, -14, -50 - raise, -47 - raise),
      6.2 - u * 2.6,
    ]);
  }
  inked(
    c,
    tail.map(
      ([tx, ty, r]) =>
        () =>
          blobPath(c, tx, ty, r, r * 0.9, 5, 0.02),
    ),
    coat,
    2.8,
  );
  tail.forEach(([tx, ty, r], i) => {
    if (i % 2) ellipse(c, tx - 0.8, ty - r * 0.35, r * 0.55, r * 0.28, lite);
  });
  const [sx, sy] = tail[tail.length - 1];
  fillPoly(
    c,
    [
      [sx + 2, sy - 3],
      [sx + 10, sy + 1],
      [sx + 7, sy + 10],
      [sx + 4, sy + 3],
    ],
    '#3a2c24',
    INK,
    1,
  );
  for (let i = 0; i < 5; i++) ellipse(c, -12 + i * 6, -9, 6.5, 5.5 - i * 0.2, coat, INK, 1.4);
  for (let i = 0; i < 5; i++) ellipse(c, -12 + i * 6, -11, 4, 1.5, lite);
  ellipse(c, 16, -10, 8.5, 5.5, coat, INK, 1.6);
  limb(c, 18, -9, 30, -13, 0, 3.2, 2.6, coat);
  blobPath(c, 36, -14, 7, 4, 9, 0.1);
  c.fillStyle = coat;
  c.fill();
  c.strokeStyle = INK;
  c.lineWidth = 1.3;
  c.stroke();
  line(c, 38, -14, 44, -12, INK, 1.3);
  ellipse(c, 20, -13, 1.2, 1.2, '#1b1716');
}
export function drawAnimal(c: Canvas2D, g: RenderGame, a: Animal, x: number, y: number, t: number) {
  const m = track(a.id, a.x, a.y, a.hp, t),
    facing = Math.cos(a.angle) >= 0 ? 1 : -1,
    boss = a.type === 'boss',
    hurt = t - m.hurt < 0.16;
  c.save();
  c.translate(x + (hurt ? Math.sin(t * 90) * 2 : 0), y + 1);
  if (a.type !== 'bat' && a.type !== 'ember_bat')
    ellipse(
      c,
      0,
      0,
      boss ? 44 : a.type === 'hellhound' ? 32 : 24,
      boss ? 6 : 4,
      'rgba(15,15,12,0.25)',
    );
  c.scale(facing, 1);
  if (hurt) c.filter = 'brightness(1.9) saturate(0.4)';
  if (boss) {
    const spec =
      D.BOSSES[Math.min(D.BOSSES.length - 1, Math.max(0, g.s.altar.level - 1))] || D.BOSSES[0];
    glow(c, 0, -46, 90, spec.glow, 0.22 + Math.sin(t * 3) * 0.06);
    c.scale(1.75, 1.75);
    drawWolf(c, m, t, a, mix(spec.color, '#262430', 0.55), spec.glow);
    for (let i = 0; i < 5; i++)
      fillPoly(
        c,
        [
          [-12 + i * 6, -33],
          [-9 + i * 6, -42 - (i % 2) * 3],
          [-6 + i * 6, -33],
        ],
        mix(spec.glow, '#2a2833', 0.4),
        INK,
        0.8,
      );
    glow(c, 30, -36, 6, spec.glow, 0.8);
  } else if (a.type === 'deer') drawDeer(c, m, t, a.phase);
  else if (a.type === 'wolf')
    drawWolf(c, m, t, a, '#7b8284', a.warning > 0 ? '#e0624a' : '#e8c46a');
  else if (a.type === 'boar') drawBoar(c, m, t, a);
  else if (a.type === 'bat') drawBat(c, t, a);
  else if (a.type === 'ember_bat') {
    // A bat of the upper hell: charred, ember-veined, trailing sparks.
    glow(c, 0, -24, 34, '#ff7a2a', 0.35 + Math.sin(t * 9 + a.phase) * 0.1);
    c.filter = hurt
      ? 'brightness(1.9)'
      : 'sepia(1) saturate(3.2) hue-rotate(-28deg) brightness(0.85)';
    drawBat(c, t, a);
    c.filter = 'none';
    glow(c, 5, -2, 5, '#ffd27a', 0.9);
  } else if (a.type === 'hellhound') {
    // A hound of the underworld: a big, black-red wolf with burning eyes and a smoking back.
    glow(c, 0, -30, 70, '#ff4a1a', 0.18 + Math.sin(t * 4 + a.phase) * 0.05);
    c.scale(1.3, 1.3);
    drawWolf(c, m, t, a, '#5e2428', a.warning > 0 ? '#fff0a0' : '#ff7a2a');
    for (let i = 0; i < 4; i++) {
      const k = (t * 0.9 + i * 0.25 + a.phase) % 1;
      ellipse(c, -10 + i * 7, -40 - k * 26, 3 + k * 5, 2 + k * 4, rgba('#5a4442', 0.35 * (1 - k)));
    }
  } else if (a.type === 'scorpion') drawScorpion(c, m, t, a);
  c.filter = 'none';
  c.restore();
  const top: Record<string, number> = {
    deer: 100,
    wolf: 56,
    boar: 50,
    bat: 50,
    scorpion: 60,
    ember_bat: 50,
    hellhound: 76,
  };
  if (!boss && a.hp < a.maxHp && a.hp > 0) {
    const by = y - (top[a.type] || 60) - 6;
    c.fillStyle = 'rgba(30,25,20,0.65)';
    c.fillRect(x - 17, by, 34, 4);
    c.fillStyle = '#c0584a';
    c.fillRect(x - 16, by + 1, 32 * clamp(a.hp / a.maxHp), 2);
  }
  if (a.warning > 0) {
    const by = y - (boss ? 118 : (top[a.type] || 60) + 16) + Math.sin(t * 12) * 1.5;
    ellipse(c, x, by, 7.5, 7.5, '#f1e3c0', INK, 1.6);
    c.fillStyle = '#b2402e';
    c.fillRect(x - 1.2, by - 4.5, 2.4, 6);
    c.fillRect(x - 1.2, by + 2.5, 2.4, 2.2);
  }
}
// ─── Player ───────────────────────────────────────────────────────────────
export function drawWeapon(c: Canvas2D, weapon: string, t: number) {
  if (weapon === 'fists') return;
  if (weapon.includes('spear')) {
    line(c, -16, 0, 34, 0, INK, 4.4);
    line(c, -16, 0, 34, 0, '#7a5a3c', 2.6);
    const head = weapon.startsWith('copper') ? '#c07a45' : '#5d6468';
    fillPoly(
      c,
      [
        [33, -3.5],
        [46, 0],
        [33, 3.5],
        [30, 0],
      ],
      head,
      INK,
      1.2,
    );
    line(c, 28, -2, 31, 2, '#d8c79a', 1.2);
    return;
  }
  const dark = weapon === 'obsidian_blade' || weapon === 'eclipse_blade',
    blade = weapon === 'steel_sword' ? '#dfe3e6' : dark ? '#221f2a' : '#c3c7ca',
    edge =
      weapon === 'eclipse_blade' ? '#9fe8f0' : weapon === 'obsidian_blade' ? '#a07fd0' : '#ffffff';
  line(c, -6, 0, 3, 0, INK, 4.5);
  line(c, -6, 0, 3, 0, '#5a3f2a', 2.8);
  line(c, 3, -5, 3, 5, INK, 4);
  line(c, 3, -5, 3, 5, dark ? '#4a4252' : '#9a8a60', 2.4);
  fillPoly(
    c,
    [
      [4, -2.6],
      [30, -1.6],
      [36, 0],
      [30, 1.6],
      [4, 2.6],
    ],
    blade,
    INK,
    1.2,
  );
  line(c, 5, -1.2, 32, -0.6, edge, 1);
  if (weapon === 'eclipse_blade') glow(c, 22, 0, 18, '#9fe8f0', 0.35 + Math.sin(t * 5) * 0.1);
}
export function drawPlayer(c: Canvas2D, p: Player, x: number, y: number, t: number) {
  const m = track(-1, p.x, p.y, 0, t),
    facing = Math.cos(p.face) >= 0 ? 1 : -1,
    shaft = D.inShaft(p.x, p.y) && p.y > D.surfaceAt(p.x) + 8,
    climbing = shaft && !p.grounded,
    air = !p.grounded && !climbing,
    walking = p.grounded ? m.move : 0,
    ph = m.walk * 0.12,
    sw = Math.sin(ph) * walking,
    bob = Math.abs(Math.cos(ph)) * walking * 1.6,
    breath = Math.sin(t * 2.2) * 0.5 * (1 - walking);
  const coat = p.coat ? '#8a6e4e' : '#5d7560',
    coatDark = shade(coat, -0.25),
    pants = '#4a4e4f',
    boot = p.boots ? '#6b5139' : '#3e342c',
    skin = '#d0a17c';
  const attackStart = p.attackAt - 0.52,
    prog = clamp((t - attackStart) / 0.3),
    attacking = t >= attackStart && t < attackStart + 0.3,
    spear = p.weapon.includes('spear');
  c.save();
  if (p.invuln > 0 && Math.sin(t * 40) > 0.3) c.globalAlpha = 0.55;
  c.translate(x, y);
  if (p.grounded) ellipse(c, 0, 1, 16, 3.5, 'rgba(15,15,12,0.28)');
  c.scale(facing, 1);
  c.translate(0, -bob + (climbing ? 0 : 0));
  const climbPh = climbing ? Math.sin(p.y * 0.12) : 0;
  const legFoot = (front: boolean) => {
    if (air) return front ? [8, -8] : [-5, -1];
    if (climbing) return [front ? 4 : -4, (front ? climbPh : -climbPh) * 4 - 2];
    const s = front ? sw : -sw;
    return [s * 10, -Math.max(0, -s) * 4];
  };
  const drawLeg = (front: boolean) => {
    const [fx, fy] = legFoot(front),
      hx = front ? 3 : -3;
    limb(c, hx, -23, fx, fy - 3, front ? 3 : 2, 6.5, 5.5, front ? pants : shade(pants, -0.2));
    c.fillStyle = front ? boot : shade(boot, -0.15);
    c.beginPath();
    c.roundRect(fx - 4, fy - (p.boots ? 7 : 5), 10, p.boots ? 8 : 6, 2.5);
    c.fill();
    c.strokeStyle = INK;
    c.lineWidth = 1.3;
    c.stroke();
  };
  // Far arm swings opposite the near arm.
  const shoulder = [1, -42 + breath];
  const armAngle = (front: boolean) => {
    if (climbing) return front ? 2.15 + climbPh * 0.35 : 2.5 - climbPh * 0.35;
    if (air) return front ? 1.9 : -0.6;
    return (front ? -sw : sw) * 0.7 + 0.1;
  };
  const drawArm = (front: boolean, a: number, reach = 0) => {
    const L = 9.5,
      ex = shoulder[0] + Math.sin(a) * L,
      ey = shoulder[1] + Math.cos(a) * L,
      a2 = a + (front ? 0.5 : 0.35),
      hx = ex + Math.sin(a2) * (L + reach),
      hy = ey + Math.cos(a2) * (L + reach);
    const col = front ? coat : coatDark;
    limb(c, shoulder[0], shoulder[1], hx, hy, 0, 6, 5, col);
    void ex;
    void ey;
    ellipse(c, hx, hy, 2.9, 2.9, front ? skin : shade(skin, -0.15), INK, 1.1);
    return [hx, hy, a2];
  };
  drawArm(false, armAngle(false));
  drawLeg(false);
  // Pack and bedroll ride on the back.
  c.fillStyle = '#7a6446';
  c.beginPath();
  c.roundRect(-18, -46 + breath, 11, 22, 3);
  c.fill();
  c.strokeStyle = INK;
  c.lineWidth = 1.5;
  c.stroke();
  c.fillStyle = '#8e7552';
  c.fillRect(-18, -46 + breath, 11, 7);
  ellipse(c, -12.5, -48 + breath, 7.5, 3.6, '#8a8f6a', INK, 1.3);
  line(c, -15, -51 + breath, -15, -44.5 + breath, '#5a4a32', 1);
  line(c, -10, -51 + breath, -10, -44.5 + breath, '#5a4a32', 1);
  if (p.cloak) {
    const flow = walking * (4 + Math.sin(t * 8) * 2) + (air ? 6 : 0);
    fillPoly(
      c,
      [
        [-4, -45 + breath],
        [-18 - flow, -12],
        [-12 - flow * 0.6, -9],
        [-2, -18],
      ],
      '#4b5566',
      INK,
      1.5,
    );
  }
  drawLeg(true);
  // Torso.
  c.beginPath();
  c.moveTo(-7, -45 + breath);
  c.lineTo(8, -45 + breath);
  c.lineTo(9.5, p.coat ? -18 : -22);
  c.lineTo(-8.5, p.coat ? -18 : -22);
  c.closePath();
  c.fillStyle = coat;
  c.fill();
  c.strokeStyle = INK;
  c.lineWidth = 1.6;
  c.stroke();
  fillPoly(
    c,
    [
      [3, -45 + breath],
      [8, -45 + breath],
      [9.5, p.coat ? -18 : -22],
      [4, p.coat ? -18 : -22],
    ],
    'rgba(0,0,0,0.12)',
  );
  c.fillStyle = '#4a3a2a';
  c.fillRect(-8.5, -27, 18, 3.2);
  c.fillStyle = '#c9a24e';
  c.fillRect(3, -27, 3, 3.2);
  if (p.coat) {
    ellipse(c, 0, -45 + breath, 9, 3.5, '#d9ccb0', INK, 1.2);
    line(c, 1, -42, 1, -19, 'rgba(60,40,25,0.5)', 1);
  }
  // Head, scarf, and hat.
  const hy = -54 + breath;
  ellipse(c, -6, hy + 1, 4, 5, '#4a372b');
  ellipse(c, 1, hy, 8.5, 8.8, skin, INK, 1.5);
  ellipse(c, -3.5, hy + 0.5, 2.2, 2.8, shade(skin, -0.12), INK, 0.9);
  ellipse(c, 5, hy - 0.5, 1.2, 1.5, '#2a2320');
  ellipse(c, 5.4, hy - 1, 0.4, 0.4, '#ffffff');
  fillPoly(
    c,
    [
      [8.5, hy - 0.5],
      [11, hy + 2.5],
      [8.5, hy + 3],
    ],
    skin,
  );
  ellipse(c, 5.5, hy + 3.5, 1.8, 1, 'rgba(200,110,90,0.35)');
  line(c, 5.8, hy + 5.4, 8, hy + 5, '#7a4f3e', 0.9);
  c.fillStyle = '#a8553f';
  c.beginPath();
  c.roundRect(-6, hy + 7, 13, 5, 2);
  c.fill();
  c.strokeStyle = INK;
  c.lineWidth = 1.2;
  c.stroke();
  const flutter = Math.sin(t * 9) * 2 * (walking + (air ? 1 : 0)) + walking * 3;
  fillPoly(
    c,
    [
      [-5, hy + 8],
      [-12 - flutter, hy + 10 + flutter * 0.2],
      [-11 - flutter, hy + 14],
      [-4, hy + 11],
    ],
    '#984a36',
    INK,
    1,
  );
  ellipse(c, 1, hy - 6.5, 14, 2.8, '#6b5539', INK, 1.4);
  c.beginPath();
  c.moveTo(-7, hy - 6.5);
  c.lineTo(-6, hy - 13);
  c.quadraticCurveTo(1, hy - 17, 8, hy - 13);
  c.lineTo(8.5, hy - 6.5);
  c.closePath();
  c.fillStyle = '#7d6444';
  c.fill();
  c.strokeStyle = INK;
  c.lineWidth = 1.4;
  c.stroke();
  c.fillStyle = '#4d3b2a';
  c.fillRect(-6.8, hy - 9.5, 15, 2.4);
  // Near arm, weapon, and swing.
  if (attacking && !spear) {
    const eased = 1 - Math.pow(1 - prog, 3),
      a = lerp(2.7, 0.35, eased);
    const [hx2, hy2, a2] = drawArm(true, a);
    const wa = Math.atan2(Math.cos(a2), Math.sin(a2)) - Math.PI / 2 - 0.2;
    c.strokeStyle = `rgba(246,238,214,${0.55 * (1 - prog)})`;
    c.lineWidth = 7;
    c.lineCap = 'round';
    c.beginPath();
    c.arc(shoulder[0], shoulder[1], 34, -2.2, lerp(-2.2, 1.0, eased));
    c.stroke();
    c.strokeStyle = `rgba(255,255,255,${0.7 * (1 - prog)})`;
    c.lineWidth = 1.5;
    c.stroke();
    c.save();
    c.translate(hx2, hy2);
    c.rotate(wa);
    drawWeapon(c, p.weapon, t);
    c.restore();
  } else {
    const thrust = attacking && spear ? Math.sin(prog * Math.PI) * 9 : 0;
    const a = attacking && spear ? 1.35 : armAngle(true);
    const [hx2, hy2, a2] = drawArm(true, a, thrust * 0.4);
    c.save();
    c.translate(hx2 + thrust * 0.6, hy2);
    c.rotate(
      spear
        ? attacking
          ? -0.05
          : -0.35
        : Math.atan2(Math.cos(a2), Math.sin(a2)) - Math.PI / 2 - 0.45,
    );
    // The weapon is stowed while both hands are on the ladder.
    if (!climbing) drawWeapon(c, p.weapon, t);
    c.restore();
    if (attacking && (spear || p.weapon === 'fists')) {
      const a3 = 0.6 * (1 - prog);
      line(c, 16 + thrust, -36, 34 + thrust * 2, -36, `rgba(246,238,214,${a3})`, 3);
      line(c, 18 + thrust, -40, 30 + thrust * 2, -42, `rgba(246,238,214,${a3 * 0.7})`, 2);
    }
  }
  c.restore();
}
// ─── Light and weather ────────────────────────────────────────────────────
