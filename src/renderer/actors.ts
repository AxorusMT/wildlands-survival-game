// The player and every creature as animated pixel sprites. Creatures are built from a handful of
// body templates — four-legged, two-legged, winged, crawling, slime, and floating — so a new
// monster is a line in MOBS rather than a new drawing routine.
import type { Animal, Player } from '../core/types.ts';
import { D } from './art.ts';
import { iconSprite, useStyle } from './icons.ts';
import {
  PX,
  Painter,
  blit,
  cached,
  clamp,
  lerp,
  mix,
  ramp,
  shade,
  sprite,
  type Sprite,
} from './px.ts';
import type { Motion, RenderGame } from './types.ts';

// ── Motion tracking (smooths height steps, measures walking) ─────────────────────────────────
export const motion = new Map<number, Motion>();
export function track(id: number, x: number, y: number, hp: number, t: number): Motion {
  let m = motion.get(id);
  if (!m) {
    if (motion.size > 600) motion.clear();
    m = { x, y, sy: y, t, walk: 0, move: 0, hp, hurt: -9 };
    motion.set(id, m);
  }
  const dx = Math.abs(x - m.x);
  if (dx > 60) m.x = x;
  m.walk += Math.min(dx, 12);
  m.move = lerp(m.move, dx > 0.12 ? 1 : 0, 0.22);
  if (hp < m.hp) m.hurt = t;
  m.hp = hp;
  m.x = x;
  // Walkers stand on whole tiles, so their feet jump a tile at each step of a slope; the drawn
  // height glides after them instead. Big moves (respawns) snap.
  const dt = Math.min(0.1, Math.max(0, t - m.t));
  m.t = t;
  m.sy = Math.abs(y - m.sy) > 80 ? y : m.sy + (y - m.sy) * Math.min(1, dt * 16);
  m.y = y;
  return m;
}

// ── Player ───────────────────────────────────────────────────────────────────────────────────

export interface Look {
  skin: string;
  hair: string;
  hat: string | null;
  helmet: string | null;
  shirt: string;
  coat: boolean;
  pants: string;
  boots: string;
  cloak: string | null;
  plate: string | null;
  greaves: string | null;
}
/** Armour colours by set name (the item id's first word). */
export const ARMOR_COLOR: Record<string, string> = {
  hide: '#8a6e4e',
  copper: '#c07a45',
  iron: '#9a9894',
  steel: '#cfd4d8',
  obsidian: '#4a3a64',
  hellstone: '#b8402a',
  crypt: '#6a8a5a',
  frost: '#9fd8ec',
  sun: '#d8b050',
  cinder: '#c85a2a',
  myconite: '#3ab0a4',
  starmetal: '#e8d07a',
  voidsteel: '#7a4ac0',
};
const setColor = (id?: string) => (id ? (ARMOR_COLOR[id.split('_')[0]] ?? '#9a9894') : null);
export function lookOf(p: Player): Look {
  const armor = p.armor ?? {};
  return {
    skin: '#d8a47c',
    hair: '#5a3a26',
    hat: armor.head ? null : '#7d6444',
    helmet: setColor(armor.head),
    shirt: p.coat ? '#8a6e4e' : '#5d7560',
    coat: p.coat,
    pants: '#4a4e4f',
    boots: p.boots ? '#6b5139' : '#3e342c',
    cloak: p.cloak ? '#4b5566' : p.ward ? '#8a3a2a' : null,
    plate: setColor(armor.body),
    greaves: setColor(armor.legs),
  };
}
const lookKey = (l: Look) => Object.values(l).join(',');

const PW = 18,
  PH = 29,
  POX = 9,
  POY = 28;
/** Shoulder position in the player sprite (relative to the anchor). */
const SHOULDER: [number, number] = [0, -17];

type Pose = {
  back: [number, number];
  front: [number, number];
  bob: number;
  backArm: number;
  frontArm: number;
};
function pose(state: string, frame: number): Pose {
  if (state === 'jump')
    return { back: [-3, -1], front: [3, -3], bob: 0, backArm: -2.2, frontArm: 2.2 };
  if (state === 'fall')
    return { back: [-2, 0], front: [2, -1], bob: 0, backArm: -2.6, frontArm: 2.6 };
  if (state === 'climb') {
    const s = frame % 2 ? 1 : -1;
    return {
      back: [-1, -2 * s - 1],
      front: [1, 2 * s - 1],
      bob: 0,
      backArm: 3.0 + s * 0.3,
      frontArm: 2.7 - s * 0.3,
    };
  }
  if (state === 'walk') {
    const a = (frame / 8) * Math.PI * 2,
      s = Math.sin(a);
    return {
      back: [Math.round(-s * 4), -Math.round(Math.max(0, s) * 2)],
      front: [Math.round(s * 4), -Math.round(Math.max(0, -s) * 2)],
      bob: Math.abs(Math.cos(a)) > 0.7 ? 1 : 0,
      backArm: s * 0.8,
      frontArm: -s * 0.8,
    };
  }
  return { back: [-1, 0], front: [1, 0], bob: frame % 2, backArm: 0.08, frontArm: -0.08 };
}
/** Hand position for an arm angle (0 hangs straight down, positive swings forward). */
const handAt = (a: number, len = 7): [number, number] => [
  SHOULDER[0] + Math.sin(a) * len,
  SHOULDER[1] + Math.cos(a) * len,
];

function paintArm(p: Painter, ox: number, oy: number, a: number, sleeve: string, skin: string) {
  const [hx, hy] = handAt(a, 6),
    sx = ox + SHOULDER[0],
    sy = oy + SHOULDER[1];
  const x1 = ox + hx,
    y1 = oy + hy;
  for (let i = 0; i <= 6; i++) {
    const x = Math.round(lerp(sx, x1, i / 6)),
      y = Math.round(lerp(sy, y1, i / 6));
    p.rect(x, y, 2, 2, sleeve);
  }
  p.rect(Math.round(x1), Math.round(y1), 2, 2, skin);
}

function playerSprite(l: Look, state: string, frame: number, armIdx: number): Sprite {
  return cached(`pl:${lookKey(l)}:${state}:${frame}:${armIdx}`, () =>
    sprite(PW, PH, POX, POY, (p) => {
      const ps = pose(state, frame),
        ox = POX,
        oy = POY - ps.bob;
      const shirt = l.plate ?? l.shirt,
        [, shirtD, , shirtL] = ramp(shirt),
        pants = l.greaves ?? l.pants,
        pantsD = shade(pants, -0.3);
      const leg = (foot: [number, number], color: string, bootC: string) => {
        const hx = ox + (foot[0] > 0 ? 0 : -1),
          hy = oy - 9;
        const fx = ox + foot[0],
          fy = POY + foot[1];
        for (let i = 0; i <= 6; i++)
          p.rect(Math.round(lerp(hx, fx, i / 6)), Math.round(lerp(hy, fy - 2, i / 6)), 2, 2, color);
        p.rect(fx - 1, fy - 2, 4, 3, bootC);
        p.rect(fx - 1, fy - 2, 4, 1, shade(bootC, 0.25));
      };
      // Back arm and leg sit behind the body.
      paintArm(p, ox - 1, oy, ps.backArm, shade(shirt, -0.35), shade(l.skin, -0.2));
      leg(ps.back, pantsD, shade(l.boots, -0.25));
      if (l.cloak) {
        const flow =
          state === 'walk' ? (frame % 4) - 1 : state === 'jump' || state === 'fall' ? 3 : 0;
        p.poly(
          [
            [ox - 2, oy - 18],
            [ox + 1, oy - 18],
            [ox - 2, oy - 6],
            [ox - 6 - flow, oy - 4],
            [ox - 4 - flow, oy - 12],
          ],
          l.cloak,
        );
        p.line(ox - 3, oy - 17, ox - 6 - flow, oy - 5, shade(l.cloak, 0.2));
      }
      // Pack with a rolled bedroll.
      p.rect(ox - 6, oy - 18, 4, 9, '#7a6446');
      p.rect(ox - 6, oy - 18, 4, 2, '#8e7552');
      p.rect(ox - 7, oy - 20, 6, 2, '#8a8f6a');
      // Torso.
      const bottom = l.coat || l.plate ? oy - 7 : oy - 9;
      p.rect(ox - 3, oy - 18, 7, bottom - (oy - 18), shirt);
      p.rect(ox - 3, oy - 18, 7, 1, shirtL);
      p.rect(ox + 3, oy - 17, 1, bottom - (oy - 17), shirtD);
      p.rect(ox - 3, oy - 10, 7, 1, l.plate ? shirtD : '#4a3a2a');
      if (!l.plate) p.set(ox + 1, oy - 10, '#c9a24e');
      else p.rect(ox - 1, oy - 16, 3, 2, shirtL);
      leg(ps.front, pants, l.boots);
      // Head.
      const hy = oy - 26;
      p.rect(ox - 3, hy, 7, 7, l.skin);
      p.rect(ox - 3, hy + 6, 7, 1, shade(l.skin, -0.2));
      p.rect(ox - 3, hy, 2, 4, l.hair);
      p.rect(ox - 3, hy, 7, 1, l.hair);
      p.set(ox + 2, hy + 3, '#2a2320');
      p.set(ox + 4, hy + 3, l.skin);
      p.set(ox + 4, hy + 4, shade(l.skin, -0.1));
      p.rect(ox - 2, hy + 7, 6, 2, '#a8553f');
      if (l.helmet) {
        const [, hd, hm, hl] = ramp(l.helmet);
        p.rect(ox - 4, hy - 2, 9, 5, hm);
        p.rect(ox - 4, hy - 2, 9, 1, hl);
        p.rect(ox - 4, hy + 2, 3, 3, hd);
        p.rect(ox + 1, hy + 2, 1, 2, hd);
      } else if (l.hat) {
        p.rect(ox - 5, hy, 11, 1, l.hat);
        p.rect(ox - 3, hy - 3, 7, 3, shade(l.hat, 0.08));
        p.rect(ox - 3, hy - 1, 7, 1, '#4d3b2a');
      }
      // Near arm, drawn at the angle the current action needs.
      const a = armIdx >= 0 ? (armIdx / 16) * Math.PI * 2 : ps.frontArm;
      paintArm(p, ox, oy, a, shirt, l.skin);
    }),
  );
}

/** How the player's swing looks: the arm angle and item angle at progress 0..1. */
function swingAngle(k: number) {
  // From behind the head, over the top, down in front.
  const e = 1 - Math.pow(1 - k, 2.2);
  return lerp(Math.PI * 0.95, Math.PI * 0.1 - 0.4, e);
}

export function drawPlayer(
  c: CanvasRenderingContext2D,
  g: RenderGame,
  p: Player,
  x: number,
  y: number,
  t: number,
) {
  const m = track(-1, p.x, p.y, 0, t),
    facing = Math.cos(p.face) >= 0 ? 1 : -1,
    shaft = D.inShaft(p.x, p.y) && p.y > D.surfaceAt(p.x) + 8,
    climbing = shaft && !p.grounded,
    state = climbing
      ? 'climb'
      : !p.grounded
        ? p.vy < 0
          ? 'jump'
          : 'fall'
        : m.move > 0.3
          ? 'walk'
          : 'idle',
    frame =
      state === 'walk'
        ? Math.floor(m.walk / 7) % 8
        : state === 'climb'
          ? Math.floor(p.y / 14) % 2
          : Math.floor(t * 1.6) % 2;
  const held = g.heldItem(),
    style = climbing ? 'none' : useStyle(held),
    useLen = g.useDuration(held),
    useStart = p.usedAt ?? p.attackAt - 0.52,
    k = clamp((t - useStart) / useLen),
    using = t >= useStart && t < useStart + useLen;
  let armAngle = -1,
    reach = 0;
  const aimAngle = p.aim ?? 0; // radians from level, up is negative
  if (using && style === 'swing') armAngle = swingAngle(k);
  else if (using && style === 'thrust') {
    armAngle = Math.PI / 2;
    reach = Math.round(Math.sin(k * Math.PI) * 5);
  } else if (using && style === 'aim') armAngle = Math.PI / 2 - aimAngle;
  else if (style === 'hold') armAngle = 1.1;
  const armIdx = armAngle < 0 ? -1 : ((Math.round((armAngle / (Math.PI * 2)) * 16) % 16) + 16) % 16;
  const look = lookOf(p);
  const body = playerSprite(look, state, frame, armIdx);
  const sy = Math.round(y + (m.sy - p.y) / PX);
  if (p.invuln > 0 && Math.sin(t * 40) > 0.3) c.globalAlpha = 0.55;
  if (p.grounded) {
    c.fillStyle = 'rgba(10,8,6,0.3)';
    c.fillRect(Math.round(x) - 5, Math.round(y), 11, 1);
  }
  const bob = pose(state, frame).bob;
  // Tools and weapons appear only while used; torches and blocks are carried in view.
  const drawItem = () => {
    if (armIdx < 0 || !held || style === 'none') return;
    const icon = iconSprite(held),
      qa = (armIdx / 16) * Math.PI * 2,
      [hx, hy] = handAt(qa, 7);
    c.save();
    c.translate(Math.round(x + facing * (hx + reach)), Math.round(sy - bob + hy));
    c.scale(facing, 1);
    if (style === 'hold') c.drawImage(icon.cv, -5, -12);
    else {
      // Icons point up and right from a grip near their lower left; line that up with the arm.
      c.rotate(Math.atan2(Math.cos(qa), Math.sin(qa)) + Math.PI / 4);
      c.drawImage(icon.cv, -5, -13);
    }
    c.restore();
  };
  blit(c, body, x, sy, facing < 0);
  drawItem();
  if (using && style === 'swing' && k < 0.8) {
    // A short arc trail behind the swing.
    c.fillStyle = 'rgba(246,238,214,0.5)';
    for (let i = 0; i < 6; i++) {
      const a = swingAngle(Math.max(0, k - i * 0.04));
      const [tx, ty] = handAt(a, 17);
      c.globalAlpha = 0.5 * (1 - i / 6) * (1 - k);
      c.fillRect(Math.round(x + facing * tx), Math.round(sy + ty), 2, 2);
    }
    c.globalAlpha = 1;
  }
  c.globalAlpha = 1;
}

// ── Creatures ────────────────────────────────────────────────────────────────────────────────

type Tpl = 'quad' | 'biped' | 'flyer' | 'crawler' | 'slime' | 'floater' | 'worm';
export interface MobArt {
  tpl: Tpl;
  /** Main, belly/secondary, and eye colours. */
  body: string;
  belly?: string;
  eye?: string;
  /** Body length and height in art pixels (the template scales parts from these). */
  w: number;
  h: number;
  /** Extra parts: antlers, horns, tusks, mane, tail, spines, wings, cap, crown, hood, robe, bones, bandage, shield, sword, staff, stinger, glow. */
  parts?: string[];
  /** Height of the health bar above the feet, in art pixels. */
  top?: number;
  /** Emits light as it moves (for lighting.ts). */
  light?: [number, number, number];
}
export const MOBS: Record<string, MobArt> = {
  deer: {
    tpl: 'quad',
    body: '#a57a52',
    belly: '#ead8b5',
    eye: '#1b1716',
    w: 26,
    h: 20,
    parts: ['antlers', 'tail', 'longlegs'],
    top: 34,
  },
  wolf: {
    tpl: 'quad',
    body: '#7b8284',
    belly: '#c8ccc8',
    eye: '#e8c46a',
    w: 24,
    h: 14,
    parts: ['ears', 'tail', 'snout', 'mane'],
    top: 22,
  },
  boar: {
    tpl: 'quad',
    body: '#5e4636',
    belly: '#7a6250',
    eye: '#1b1716',
    w: 22,
    h: 13,
    parts: ['tusks', 'mane', 'snout'],
    top: 20,
  },
  bat: {
    tpl: 'flyer',
    body: '#4a3e46',
    belly: '#6a5a62',
    eye: '#f0d8a0',
    w: 18,
    h: 8,
    parts: ['ears'],
    top: 14,
  },
  scorpion: {
    tpl: 'crawler',
    body: '#8a5a32',
    belly: '#b07a42',
    eye: '#1b1716',
    w: 22,
    h: 8,
    parts: ['stinger', 'claws'],
    top: 18,
  },
  ember_bat: {
    tpl: 'flyer',
    body: '#3a1a18',
    belly: '#ff7a2a',
    eye: '#ffd27a',
    w: 20,
    h: 9,
    parts: ['ears', 'embers'],
    top: 14,
    light: [0.85, 0.32, 0.12],
  },
  hellhound: {
    tpl: 'quad',
    body: '#4e1e22',
    belly: '#ff7a2a',
    eye: '#ff7a2a',
    w: 30,
    h: 18,
    parts: ['ears', 'tail', 'snout', 'mane', 'horns', 'embers'],
    top: 30,
    light: [0.85, 0.32, 0.12],
  },
};
/** Registers art for new creature types (dungeons and dimensions add theirs at load). */
export function addMobArt(types: Record<string, MobArt>) {
  Object.assign(MOBS, types);
}

function paintQuad(p: Painter, a: MobArt, frame: number, ox: number, oy: number) {
  const [dk, d, m, l] = ramp(a.body),
    belly = a.belly ?? l,
    parts = new Set(a.parts ?? []),
    legH = parts.has('longlegs') ? Math.round(a.h * 0.45) : Math.round(a.h * 0.35),
    bodyH = a.h - legH - (parts.has('antlers') ? 5 : 0),
    bx = ox - Math.round(a.w * 0.4),
    bw = Math.round(a.w * 0.72),
    by = oy - legH - bodyH;
  const s = Math.sin((frame / 6) * Math.PI * 2),
    legs: [number, number, string][] = [
      [bx + 2, -s, d],
      [bx + bw - 4, s, d],
      [bx + 3, s, m],
      [bx + bw - 3, -s, m],
    ];
  // Far legs, body, near legs.
  for (const [lx, sw, c] of legs.slice(0, 2))
    p.line(lx, oy - legH, lx + Math.round(sw * 2), oy - 1, c);
  for (const [lx, sw] of legs.slice(0, 2)) p.set(lx + Math.round(sw * 2), oy - 1, dk);
  if (parts.has('tail')) p.line(bx, by + 2, bx - 3, by + (parts.has('antlers') ? 0 : 4), m);
  p.ellipse(bx + bw / 2, by + bodyH / 2, bw / 2 + 0.5, bodyH / 2 + 0.5, m);
  for (let x = bx; x < bx + bw; x++) {
    const bottom = by + bodyH - 1;
    if (p.alpha(x, bottom)) p.set(x, bottom, belly);
  }
  p.rect(bx + 2, by, bw - 4, 1, l);
  if (parts.has('mane')) for (let x = bx + bw - 7; x < bx + bw; x++) p.set(x, by - 1 + (x % 2), d);
  if (parts.has('embers'))
    for (let i = 0; i < 4; i++) p.set(bx + 3 + i * 4, by + 1 + (i % 2), '#ff9a3a');
  for (const [lx, sw, c] of legs.slice(2)) {
    const x0 = lx,
      x1 = lx + Math.round(sw * 2);
    p.line(x0, oy - legH, x1, oy - 1, c);
    p.line(x0 + 1, oy - legH, x1 + 1, oy - 2, c);
    p.set(x1, oy - 1, dk);
    p.set(x1 + 1, oy - 1, dk);
  }
  // Head on a short neck.
  const hx = bx + bw + 1,
    hy = by - (parts.has('antlers') ? 5 : 2),
    hw = Math.max(5, Math.round(a.w * 0.24)),
    hh = Math.max(4, Math.round(bodyH * 0.7));
  p.poly(
    [
      [bx + bw - 5, by + 1],
      [hx + 1, hy + 1],
      [hx + 2, hy + hh],
      [bx + bw - 3, by + bodyH - 2],
    ],
    m,
  );
  p.rect(hx, hy, hw, hh, m);
  p.rect(hx, hy, hw, 1, l);
  if (parts.has('snout') || parts.has('tusks')) {
    p.rect(hx + hw, hy + Math.round(hh / 2) - 1, 3, Math.ceil(hh / 2) + 1, m);
    p.set(hx + hw + 2, hy + Math.round(hh / 2) - 1, '#1b1716');
  } else p.rect(hx + hw, hy + 1, 2, hh - 1, m);
  p.set(hx + hw - 2, hy + 1 + (hh > 5 ? 1 : 0), a.eye ?? '#1b1716');
  if (parts.has('ears')) {
    p.set(hx + 1, hy - 1, m);
    p.set(hx + 1, hy - 2, d);
    p.set(hx + 3, hy - 1, m);
  }
  if (parts.has('tusks')) {
    p.set(hx + hw + 1, hy + hh, '#ece4d0');
    p.set(hx + hw + 2, hy + hh - 1, '#ece4d0');
  }
  if (parts.has('horns')) {
    p.line(hx + 1, hy - 1, hx - 1, hy - 4, '#2a1a1a');
    p.line(hx + 3, hy - 1, hx + 4, hy - 4, '#2a1a1a');
  }
  if (parts.has('antlers')) {
    const c = '#d8c8a0';
    p.line(hx + 1, hy - 1, hx - 2, hy - 6, c);
    p.line(hx - 1, hy - 4, hx - 4, hy - 5, c);
    p.line(hx + 2, hy - 1, hx + 4, hy - 7, c);
    p.line(hx + 3, hy - 4, hx + 6, hy - 5, c);
  }
}

function paintBiped(p: Painter, a: MobArt, frame: number, ox: number, oy: number) {
  const [dk, d, m, l] = ramp(a.body),
    sec = a.belly ?? d,
    parts = new Set(a.parts ?? []),
    H = a.h,
    W = a.w,
    legH = Math.round(H * 0.32),
    torsoH = Math.round(H * 0.36),
    headH = H - legH - torsoH,
    s = Math.sin((frame / 6) * Math.PI * 2),
    float = parts.has('robe') || parts.has('float');
  const hipY = oy - legH,
    topY = hipY - torsoH,
    tw = Math.max(4, Math.round(W * 0.5)),
    tx = ox - Math.floor(tw / 2);
  if (parts.has('wings')) {
    const flap = Math.round(Math.sin((frame / 6) * Math.PI * 2) * 3);
    p.poly(
      [
        [tx, topY + 2],
        [tx - W * 0.7, topY - 4 + flap],
        [tx - W * 0.6, topY + torsoH + flap],
        [tx, topY + torsoH - 1],
      ],
      shade(sec, -0.2),
    );
  }
  // Back arm and leg.
  p.line(tx, topY + 2, tx - Math.round(s * 2) - 1, topY + torsoH, d);
  if (!float) {
    p.line(ox - 1, hipY, ox - 1 - Math.round(s * 3), oy - 1, d);
    p.line(ox, hipY, ox - Math.round(s * 3), oy - 1, d);
  }
  if (float)
    p.poly(
      [
        [tx - 1, hipY - 2],
        [tx + tw + 1, hipY - 2],
        [tx + tw + 2 + (frame % 2), oy - 2],
        [tx - 2 - (frame % 2), oy - 2],
      ],
      parts.has('robe') ? sec : m,
    );
  // Torso.
  p.rect(tx, topY, tw, torsoH, parts.has('robe') ? sec : m);
  p.rect(tx, topY, tw, 1, l);
  if (parts.has('bones')) for (let y = topY + 1; y < hipY - 1; y += 2) p.rect(tx, y, tw, 1, dk);
  if (parts.has('bandage'))
    for (let y = topY; y < oy - 2; y += 3) p.line(tx - 1, y, tx + tw, y + 1, shade(a.body, 0.3));
  if (parts.has('armor')) {
    p.rect(tx, topY, tw, 2, sec);
    p.rect(tx + 1, topY + 3, tw - 2, torsoH - 4, sec);
  }
  // Front leg.
  if (!float) {
    p.line(ox + 1, hipY, ox + 1 + Math.round(s * 3), oy - 1, m);
    p.line(ox + 2, hipY, ox + 2 + Math.round(s * 3), oy - 1, m);
    p.set(ox + 3 + Math.round(s * 3), oy - 1, dk);
  }
  // Head.
  const hw = Math.max(4, Math.round(headH * 0.95)),
    hx = ox - Math.floor(hw / 2) + 1,
    hy = topY - headH;
  if (parts.has('cap')) {
    p.rect(hx, hy + 2, hw, headH - 2, '#e8dcc8');
    p.ellipse(ox + 1, hy + 2, hw * 0.9, 3, a.belly ?? '#c85a44');
    p.set(ox, hy + 1, shade(a.belly ?? '#c85a44', 0.4));
    p.set(ox + 2, hy + 5, a.eye ?? '#1b1716');
  } else {
    p.rect(hx, hy, hw, headH, parts.has('hood') ? sec : parts.has('bones') ? '#e6dcc6' : m);
    p.rect(hx, hy, hw, 1, l);
    if (parts.has('hood')) p.rect(hx + 2, hy + 2, hw - 2, headH - 3, '#120e14');
    p.set(hx + hw - 2, hy + Math.round(headH * 0.45), a.eye ?? '#1b1716');
    if (hw > 5) p.set(hx + hw - 4, hy + Math.round(headH * 0.45), a.eye ?? '#1b1716');
  }
  if (parts.has('horns')) {
    p.line(hx, hy, hx - 2, hy - 3, '#2a1a1a');
    p.line(hx + hw - 1, hy, hx + hw + 1, hy - 3, '#2a1a1a');
  }
  if (parts.has('crown')) {
    p.rect(hx, hy - 2, hw, 2, '#e8c84a');
    for (let x = hx; x < hx + hw; x += 2) p.set(x, hy - 3, '#e8c84a');
  }
  // Front arm, with whatever it holds.
  const ax = tx + tw,
    ay = topY + torsoH - 1 + Math.round(s);
  p.line(tx + tw - 1, topY + 2, ax + Math.round(s * 2), ay, m);
  if (parts.has('sword')) p.line(ax + 1, ay, ax + 6, ay - 6, '#c8ccd0');
  if (parts.has('staff')) {
    p.line(ax + 1, ay + 4, ax + 1, ay - torsoH - headH, '#6a4a30');
    p.rect(ax, ay - torsoH - headH - 2, 3, 3, a.eye ?? '#b36cff');
  }
  if (parts.has('shield')) p.rect(ax - 1, ay - 4, 3, 7, sec);
  if (parts.has('claws')) {
    p.set(ax + 1, ay + 1, '#ece4d0');
    p.set(ax + 2, ay, '#ece4d0');
  }
}

function paintFlyer(p: Painter, a: MobArt, frame: number, ox: number, oy: number) {
  const [, d, m, l] = ramp(a.body),
    parts = new Set(a.parts ?? []),
    cy = oy - Math.round(a.h / 2),
    flap = [-1, 0, 1, 0][frame % 4],
    span = Math.round(a.w / 2);
  const wing = (dir: number) => {
    const tipY = cy - 3 - flap * 3,
      x0 = ox,
      x1 = ox + dir * span;
    p.poly(
      [
        [x0, cy - 1],
        [x1, tipY],
        [x1 - dir * 2, cy + 2 - flap],
        [x0 + dir * 2, cy + 2],
      ],
      dir < 0 ? d : m,
    );
    for (let i = 1; i < 3; i++)
      p.line(x0, cy, x0 + dir * Math.round((span * i) / 3), tipY + 2, shade(a.body, -0.4));
  };
  wing(-1);
  p.ellipse(ox, cy, Math.max(2.5, a.h * 0.35), a.h * 0.45, a.belly ?? m);
  p.rect(ox - 1, cy - 2, 3, 1, l);
  wing(1);
  p.set(ox + 1, cy - 1, a.eye ?? '#f0d8a0');
  p.set(ox - 1, cy - 1, a.eye ?? '#f0d8a0');
  if (parts.has('ears')) {
    p.set(ox - 2, cy - Math.round(a.h * 0.45) - 1, m);
    p.set(ox + 2, cy - Math.round(a.h * 0.45) - 1, m);
  }
  if (parts.has('beak')) p.rect(ox + 2, cy, 2, 1, '#e8b84a');
  if (parts.has('tail')) p.line(ox - 1, cy + 3, ox - 4, cy + 6, d);
}

function paintCrawler(p: Painter, a: MobArt, frame: number, ox: number, oy: number) {
  const [dk, d, m, l] = ramp(a.body),
    parts = new Set(a.parts ?? []),
    by = oy - a.h,
    bw = Math.round(a.w * 0.55),
    bx = ox - Math.round(bw / 2);
  for (let i = 0; i < 4; i++) {
    const lx = bx + 2 + i * Math.round(bw / 4),
      sw = (i + frame) % 2 ? 1 : -1;
    p.line(lx, oy - 3, lx + sw - 1, oy - 1, d);
  }
  p.ellipse(ox, by + a.h / 2, bw / 2, a.h / 2 - 1, m);
  for (let x = bx; x < bx + bw; x += 3) p.line(x, by + 1, x, by + a.h - 3, d);
  p.rect(bx + 1, by + 1, bw - 2, 1, l);
  if (parts.has('stinger')) {
    const sway = frame % 2;
    p.line(bx, by + 3, bx - 4, by - 2, m);
    p.line(bx - 4, by - 2, bx - 3 + sway, by - 7, m);
    p.line(bx - 3 + sway, by - 7, bx + 1 + sway, by - 8, dk);
    p.set(bx + 2 + sway, by - 7, a.belly ?? '#e0d0a0');
  }
  if (parts.has('claws')) {
    p.line(bx + bw, by + 3, bx + bw + 4, by + 2, m);
    p.rect(bx + bw + 3, by, 3, 2, d);
    p.rect(bx + bw + 3, by + 3, 3, 1, d);
  }
  if (parts.has('shell')) p.ellipse(ox, by + a.h / 2 - 1, bw / 2 - 1, a.h / 2 - 2, a.belly ?? l);
  p.set(bx + bw - 1, by + 2, a.eye ?? '#1b1716');
}

function paintSlime(p: Painter, a: MobArt, frame: number, ox: number, oy: number) {
  const [, d, m, l, ll] = ramp(a.body),
    squash = [0, 1, 2, 1][frame % 4],
    w = a.w / 2 + squash,
    h = a.h - squash * 2;
  p.ellipse(ox, oy - h / 2, w, h / 2, m);
  for (let x = Math.round(ox - w); x <= ox + w; x++) if (p.alpha(x, oy - 1)) p.set(x, oy - 1, d);
  p.rect(Math.round(ox - w / 2), Math.round(oy - h + 2), 2, 1, ll);
  p.set(Math.round(ox - w / 2), Math.round(oy - h + 3), l);
  p.set(ox + 2, Math.round(oy - h / 2), a.eye ?? '#1b1716');
  p.set(ox - 1, Math.round(oy - h / 2), a.eye ?? '#1b1716');
  if (a.parts?.includes('crown')) {
    p.rect(ox - 3, Math.round(oy - h - 2), 7, 2, '#e8c84a');
    p.set(ox - 3, Math.round(oy - h - 3), '#e8c84a');
    p.set(ox, Math.round(oy - h - 3), '#e8c84a');
    p.set(ox + 3, Math.round(oy - h - 3), '#e8c84a');
  }
  if (a.parts?.includes('core'))
    p.rect(ox - 1, Math.round(oy - h / 2) + 1, 2, 2, a.belly ?? '#ffffff');
}

function paintFloater(p: Painter, a: MobArt, frame: number, ox: number, oy: number) {
  const [dk, d, m, l, ll] = ramp(a.body),
    parts = new Set(a.parts ?? []),
    cy = oy - Math.round(a.h * 0.6),
    r = a.w / 2;
  if (parts.has('eye')) {
    p.ellipse(ox, cy, r, r, '#e8e0e0');
    p.ellipse(ox + 1, cy, r * 0.55, r * 0.55, a.belly ?? '#b36cff');
    p.ellipse(ox + 1, cy, r * 0.25, r * 0.35, '#0a0610');
    p.rect(Math.round(ox - r * 0.5), Math.round(cy - r * 0.6), 2, 1, '#ffffff');
    for (let i = 0; i < 4; i++)
      p.line(
        Math.round(ox - r + 1),
        cy + i - 1,
        Math.round(ox - r - 4 - ((i + frame) % 3)),
        cy + i * 2 - 2,
        '#a02a3a',
      );
    return;
  }
  if (parts.has('ghost')) {
    p.ellipse(ox, cy, r, r * 0.9, m);
    p.rect(Math.round(ox - r), cy, Math.round(r * 2) + 1, Math.round(a.h * 0.45), m);
    for (let x = Math.round(ox - r); x <= ox + r; x++) {
      const wave = ((x + frame) % 3) - 1;
      for (let y = oy - 2 + wave; y < oy + 2; y++) p.clear(x, y);
    }
    p.rect(ox - 2, cy - 1, 2, 2, a.eye ?? '#1a1a2a');
    p.rect(ox + 2, cy - 1, 2, 2, a.eye ?? '#1a1a2a');
    p.rect(Math.round(ox - r + 1), cy - Math.round(r * 0.6), 2, 1, l);
    return;
  }
  // A wisp: a bright core with a flickering tail.
  for (let i = 0; i < 5; i++) {
    const tx = ox - i * 2 - (frame % 2),
      ty = cy + Math.round(Math.sin(i + frame) * 1.5);
    p.ellipse(tx, ty, Math.max(1, r - i * 0.7), Math.max(1, r - i * 0.7), i < 2 ? m : d);
  }
  p.ellipse(ox, cy, r * 0.6, r * 0.6, ll);
  p.set(ox, cy, '#ffffff');
  void dk;
}

function paintWorm(p: Painter, a: MobArt, frame: number, ox: number, oy: number) {
  const [, d, m, l] = ramp(a.body),
    n = Math.round(a.w / 4);
  for (let i = n - 1; i >= 0; i--) {
    const x = ox - i * 4,
      y = oy - a.h / 2 + Math.round(Math.sin(i * 0.9 + frame) * 2);
    p.ellipse(x, y, a.h / 2, a.h / 2, i % 2 ? d : m);
    p.set(x, Math.round(y - a.h / 2 + 1), l);
  }
  p.set(ox + 1, oy - a.h / 2 - 1, a.eye ?? '#ff3a3a');
}

const PAINT: Record<Tpl, (p: Painter, a: MobArt, frame: number, ox: number, oy: number) => void> = {
  quad: paintQuad,
  biped: paintBiped,
  flyer: paintFlyer,
  crawler: paintCrawler,
  slime: paintSlime,
  floater: paintFloater,
  worm: paintWorm,
};
function mobSprite(key: string, a: MobArt, frame: number): Sprite {
  return cached(`mob:${key}:${frame}`, () => {
    const W = Math.round(a.w * (a.tpl === 'flyer' ? 1.2 : 1.6)) + 8,
      H = a.h + 14,
      ox = Math.round(W / 2),
      oy = H - 1;
    return sprite(W, H, ox, oy, (p) => PAINT[a.tpl](p, a, frame, ox, oy));
  });
}

function bossArt(g: RenderGame): MobArt {
  const spec =
    D.BOSSES[Math.min(D.BOSSES.length - 1, Math.max(0, g.s.altar.level - 1))] ?? D.BOSSES[0];
  return {
    tpl: 'quad',
    body: mix(spec.color, '#262430', 0.55),
    belly: spec.color,
    eye: spec.glow,
    w: 44,
    h: 28,
    parts: ['ears', 'tail', 'snout', 'mane', 'spines'],
    top: 44,
  };
}
/** The art for a creature: its registered look, or the Direwolf for the current altar level. */
export function mobArt(g: RenderGame, a: Animal): MobArt {
  if (a.type === 'boss') return bossArt(g);
  return MOBS[a.type] ?? MOBS.wolf;
}

export function drawAnimal(
  c: CanvasRenderingContext2D,
  g: RenderGame,
  a: Animal,
  x: number,
  y: number,
  t: number,
) {
  const m = track(a.id, a.x, a.y, a.hp, t),
    art = mobArt(g, a),
    facing = Math.cos(a.angle) >= 0 ? 1 : -1,
    hurt = t - m.hurt < 0.16,
    walks = art.tpl === 'quad' || art.tpl === 'biped' || art.tpl === 'crawler',
    frame = walks
      ? m.move > 0.3
        ? Math.floor(m.walk / 6) % 6
        : 0
      : Math.floor(t * (art.tpl === 'flyer' ? 10 : 6) + a.phase) % 4,
    key = a.type === 'boss' ? 'boss' + g.s.altar.level : a.type;
  const sy = Math.round(y + (m.sy - a.y) / PX);
  const spr = mobSprite(key, art, frame);
  if (walks || art.tpl === 'slime') {
    c.fillStyle = 'rgba(10,8,6,0.28)';
    c.fillRect(Math.round(x - art.w * 0.35), Math.round(y), Math.round(art.w * 0.7), 1);
  }
  blit(c, spr, x + (hurt ? (Math.floor(t * 60) % 2 ? 1 : -1) : 0), sy, facing < 0);
  if (hurt) {
    // A white flash on the hit frame.
    const flash = cached(`flash:${key}:${frame}`, () => {
      const cv = document.createElement('canvas');
      cv.width = spr.cv.width;
      cv.height = spr.cv.height;
      const k = cv.getContext('2d')!;
      k.drawImage(spr.cv, 0, 0);
      k.globalCompositeOperation = 'source-in';
      k.fillStyle = '#ffffff';
      k.fillRect(0, 0, cv.width, cv.height);
      return { cv, ox: spr.ox, oy: spr.oy };
    });
    c.globalAlpha = 0.7;
    blit(c, flash, x, sy, facing < 0);
    c.globalAlpha = 1;
  }
  const top = art.top ?? art.h + 6;
  if (a.type !== 'boss' && a.hp < a.maxHp && a.hp > 0) {
    const by = Math.round(sy - top - 4);
    c.fillStyle = '#1a1614';
    c.fillRect(Math.round(x) - 9, by, 18, 3);
    c.fillStyle = '#c0584a';
    c.fillRect(Math.round(x) - 8, by + 1, Math.round(16 * clamp(a.hp / a.maxHp)), 1);
  }
  if (a.warning > 0) {
    const by = Math.round(sy - top - 12 + Math.sin(t * 12));
    const bang = cached('warn', () =>
      sprite(5, 8, 2, 7, (p) => {
        p.rect(0, 0, 5, 8, '#f1e3c0');
        p.rect(2, 1, 1, 4, '#b2402e');
        p.rect(2, 6, 1, 1, '#b2402e');
      }),
    );
    blit(c, bang, x, by);
  }
}
