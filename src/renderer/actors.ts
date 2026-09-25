// The player and every creature as animated pixel sprites. Creatures are built from a handful of
// body templates — four-legged, two-legged, winged, crawling, slime, and floating — so a new
// monster is a line in MOBS rather than a new drawing routine.
import type { Animal, Player } from '../core/types.ts';
import { D } from './art.ts';
import { BLOCKS } from '../data/gear.ts';
import { iconSprite, miniIcon, useStyle } from './icons.ts';
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
    if (style === 'hold') {
      const small = BLOCKS[held] !== undefined ? miniIcon(held) : icon;
      c.drawImage(small.cv, small === icon ? -5 : -2, small === icon ? -12 : -7);
    } else {
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
Object.assign(MOBS, {
  slime: { tpl: 'slime', body: '#5ab84a', eye: '#10240c', w: 14, h: 10, top: 16 },
  cave_spider: {
    tpl: 'crawler',
    body: '#4a3a44',
    belly: '#8a6a7a',
    eye: '#ff5a5a',
    w: 22,
    h: 8,
    parts: ['claws'],
    top: 16,
  },
  // The Mossy Crypt.
  skeleton: {
    tpl: 'biped',
    body: '#e6dcc6',
    belly: '#8a8070',
    eye: '#ff6a4a',
    w: 12,
    h: 28,
    parts: ['bones', 'sword'],
    top: 34,
  },
  skeleton_archer: {
    tpl: 'biped',
    body: '#e6dcc6',
    belly: '#6a7a5a',
    eye: '#9aff6a',
    w: 12,
    h: 28,
    parts: ['bones', 'hood'],
    top: 34,
  },
  bone_bat: {
    tpl: 'flyer',
    body: '#d8ccb0',
    belly: '#a89878',
    eye: '#ff6a4a',
    w: 20,
    h: 9,
    parts: ['ears'],
    top: 16,
  },
  crypt_ghoul: {
    tpl: 'biped',
    body: '#6a8a5a',
    belly: '#4a5a3a',
    eye: '#f0e060',
    w: 14,
    h: 28,
    parts: ['claws'],
    top: 34,
  },
  // The Frost Keep.
  frost_wraith: {
    tpl: 'floater',
    body: '#bfe4f4',
    belly: '#6aa8c8',
    eye: '#1a3a5a',
    w: 18,
    h: 24,
    parts: ['ghost'],
    top: 30,
    light: [0.3, 0.55, 0.8],
  },
  ice_golem: {
    tpl: 'biped',
    body: '#8fc0d8',
    belly: '#5a8aa8',
    eye: '#e8fbff',
    w: 22,
    h: 36,
    parts: ['armor'],
    top: 44,
  },
  snow_slime: { tpl: 'slime', body: '#e8f4fa', eye: '#3a5a7a', w: 16, h: 12, top: 18 },
  // The Sunken Tomb.
  mummy: {
    tpl: 'biped',
    body: '#c8b890',
    belly: '#8a7a5a',
    eye: '#ff4a2a',
    w: 14,
    h: 30,
    parts: ['bandage'],
    top: 36,
  },
  scarab: {
    tpl: 'crawler',
    body: '#2a5a6a',
    belly: '#e8c040',
    eye: '#e8c040',
    w: 18,
    h: 9,
    parts: ['shell'],
    top: 16,
  },
  tomb_serpent: { tpl: 'worm', body: '#c8a040', eye: '#2a1a1a', w: 34, h: 8, top: 16 },
  // The Cinder Citadel.
  imp: {
    tpl: 'biped',
    body: '#b8402a',
    belly: '#4a1a1a',
    eye: '#ffd27a',
    w: 10,
    h: 18,
    parts: ['wings', 'horns', 'float'],
    top: 24,
    light: [0.8, 0.35, 0.12],
  },
  cinder_knight: {
    tpl: 'biped',
    body: '#3a2a2e',
    belly: '#8a3a2a',
    eye: '#ff8a3a',
    w: 16,
    h: 34,
    parts: ['armor', 'shield', 'sword', 'horns'],
    top: 40,
    light: [0.5, 0.2, 0.08],
  },
  magma_slime: {
    tpl: 'slime',
    body: '#e05a2a',
    belly: '#ffd27a',
    eye: '#3a0a0a',
    w: 16,
    h: 12,
    parts: ['core'],
    top: 18,
    light: [0.9, 0.4, 0.12],
  },
  // The Mycelial Deep.
  shroomling: {
    tpl: 'biped',
    body: '#b8a8c8',
    belly: '#58e0d0',
    eye: '#1a1414',
    w: 12,
    h: 22,
    parts: ['cap'],
    top: 28,
    light: [0.2, 0.6, 0.55],
  },
  spore_bat: {
    tpl: 'flyer',
    body: '#3a5a5a',
    belly: '#58e0d0',
    eye: '#e8fff8',
    w: 20,
    h: 9,
    parts: ['ears'],
    top: 16,
    light: [0.2, 0.6, 0.55],
  },
  spore_slime: {
    tpl: 'slime',
    body: '#3ab0a4',
    belly: '#c0fff4',
    eye: '#0a2a28',
    w: 18,
    h: 13,
    parts: ['core'],
    top: 20,
    light: [0.2, 0.55, 0.5],
  },
  mycelid: {
    tpl: 'quad',
    body: '#6a5a8a',
    belly: '#58e0d0',
    eye: '#58e0d0',
    w: 28,
    h: 18,
    parts: ['spines', 'tail', 'snout'],
    top: 30,
    light: [0.15, 0.45, 0.4],
  },
  // Skyreach.
  harpy: {
    tpl: 'flyer',
    body: '#c89a6a',
    belly: '#f0e0c8',
    eye: '#3a2a1a',
    w: 26,
    h: 12,
    parts: ['beak', 'tail'],
    top: 20,
  },
  cloud_slime: {
    tpl: 'slime',
    body: '#f0f4ff',
    belly: '#bfe4ff',
    eye: '#6a8ab8',
    w: 18,
    h: 13,
    top: 20,
  },
  wind_wisp: {
    tpl: 'floater',
    body: '#dff6ff',
    eye: '#ffffff',
    w: 10,
    h: 12,
    top: 18,
    light: [0.5, 0.6, 0.7],
  },
  sky_ram: {
    tpl: 'quad',
    body: '#f0ece0',
    belly: '#c8c0b0',
    eye: '#2a2020',
    w: 28,
    h: 20,
    parts: ['horns', 'mane', 'tail'],
    top: 32,
  },
  // The Hollow Void.
  void_wisp: {
    tpl: 'floater',
    body: '#b36cff',
    eye: '#ffffff',
    w: 10,
    h: 12,
    top: 18,
    light: [0.5, 0.25, 0.85],
  },
  void_stalker: {
    tpl: 'quad',
    body: '#2a1c3a',
    belly: '#b36cff',
    eye: '#ff6ad5',
    w: 32,
    h: 18,
    parts: ['ears', 'tail', 'snout', 'spines'],
    top: 30,
    light: [0.3, 0.12, 0.5],
  },
  watcher: {
    tpl: 'floater',
    body: '#4a2a5a',
    belly: '#b36cff',
    eye: '#0a0610',
    w: 18,
    h: 18,
    parts: ['eye'],
    top: 24,
    light: [0.4, 0.15, 0.55],
  },
  // Bosses.
  hollow_king: {
    tpl: 'biped',
    body: '#e6dcc6',
    belly: '#2a3a2a',
    eye: '#9ae8c0',
    w: 26,
    h: 56,
    parts: ['robe', 'crown', 'staff', 'bones'],
    top: 66,
    light: [0.35, 0.8, 0.6],
  },
  rime_colossus: {
    tpl: 'biped',
    body: '#9fd0e8',
    belly: '#4a7a98',
    eye: '#ffffff',
    w: 44,
    h: 64,
    parts: ['armor', 'horns'],
    top: 72,
    light: [0.3, 0.5, 0.7],
  },
  pharaoh: {
    tpl: 'biped',
    body: '#d8b870',
    belly: '#2a5a8a',
    eye: '#ffd86a',
    w: 24,
    h: 52,
    parts: ['robe', 'crown', 'staff', 'bandage'],
    top: 62,
    light: [0.8, 0.65, 0.3],
  },
  archdemon: {
    tpl: 'biped',
    body: '#8a2a2a',
    belly: '#2a0a0a',
    eye: '#ffd27a',
    w: 34,
    h: 60,
    parts: ['wings', 'horns', 'armor', 'float', 'sword'],
    top: 70,
    light: [0.9, 0.35, 0.12],
  },
  sporemother: {
    tpl: 'slime',
    body: '#6a4a8a',
    belly: '#58e0d0',
    eye: '#e8fff8',
    w: 70,
    h: 46,
    parts: ['core', 'crown'],
    top: 56,
    light: [0.3, 0.7, 0.65],
  },
  tempest_roc: {
    tpl: 'flyer',
    body: '#5a6a8a',
    belly: '#e8f0ff',
    eye: '#fff0a0',
    w: 90,
    h: 30,
    parts: ['beak', 'tail'],
    top: 36,
    light: [0.4, 0.45, 0.6],
  },
  unmaker: {
    tpl: 'floater',
    body: '#6a4a8a',
    belly: '#ff5a8a',
    eye: '#0a0610',
    w: 64,
    h: 64,
    parts: ['eye'],
    top: 76,
    light: [0.7, 0.25, 0.6],
  },
} satisfies Record<string, MobArt>);
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
    [sd, , sm, sl] = ramp(sec),
    parts = new Set(a.parts ?? []),
    H = a.h,
    W = a.w,
    headH = Math.max(4, Math.round(H * 0.22)),
    torsoH = Math.round(H * 0.4),
    legH = H - headH - torsoH,
    s = Math.sin((frame / 6) * Math.PI * 2),
    robe = parts.has('robe'),
    float = robe || parts.has('float');
  const hipY = oy - legH - (float && !robe ? 3 : 0),
    topY = hipY - torsoH,
    tw = Math.max(4, Math.round(W * 0.5)),
    tx = ox - Math.floor(tw / 2);
  // Limbs thicken with size, so a colossus is not drawn on stilts.
  const t = Math.max(1, Math.round(W / 9)),
    stride = Math.round(s * Math.max(3, W / 6));
  const limb = (x0: number, y0: number, x1: number, y1: number, c: string) => {
    for (let k = 0; k < t; k++) p.line(x0 + k, y0, x1 + k, y1, c);
  };
  if (parts.has('wings')) {
    const flap = Math.round(s * Math.max(3, H / 12)),
      span = W * 0.9;
    const wing: [number, number][] = [
      [tx + 1, topY + 2],
      [tx - span, topY - H * 0.12 + flap],
      [tx - span * 0.8, topY + torsoH * 0.6 + flap],
      [tx - span * 0.45, topY + torsoH * 0.45 + flap],
      [tx - span * 0.3, topY + torsoH + flap],
      [tx + 1, topY + torsoH - 1],
    ];
    p.poly(wing, shade(sec, -0.15));
    for (let i = 1; i < 4; i++)
      p.line(
        tx,
        topY + 2,
        Math.round(tx - span * (1 - i * 0.2)),
        Math.round(topY + torsoH * 0.2 * i + flap),
        shade(sec, -0.45),
      );
  }
  // Back arm and leg.
  limb(tx - t + 1, topY + 2, tx - t - Math.round(s * 2), topY + torsoH, d);
  if (!float) limb(ox - t, hipY, ox - t - stride, oy - 1, d);
  if (robe) {
    // A long robe, flaring to a ragged hem that sways as it drifts.
    const hem = oy - 2,
      sway = frame % 2;
    p.poly(
      [
        [tx, topY],
        [tx + tw, topY],
        [tx + tw + Math.round(W * 0.18) + sway, hem],
        [tx - Math.round(W * 0.18) - sway, hem],
      ],
      sm,
    );
    for (let x = tx - Math.round(W * 0.18) - 1; x < tx + tw + Math.round(W * 0.18) + 2; x++)
      if ((x + frame) % 3 === 0) p.clear(x, hem);
    for (let k = 1; k < 4; k++)
      p.line(
        tx + Math.round((tw * k) / 4),
        topY + 3,
        tx + Math.round((tw * k) / 4) + (k - 2) * 2,
        hem - 1,
        sd,
      );
    p.line(tx + 1, topY + 1, tx - Math.round(W * 0.16), hem - 1, sl);
  } else if (float) {
    p.poly(
      [
        [tx, hipY - 1],
        [tx + tw, hipY - 1],
        [ox + 1, oy - 2],
      ],
      m,
    );
  }
  // Torso, lit from the upper left.
  if (!robe) {
    p.rect(tx, topY, tw, torsoH, m);
    p.rect(tx, topY, 1, torsoH, l);
    p.rect(tx + tw - 1, topY, 1, torsoH, d);
    p.rect(tx, topY, tw, 1, l);
  } else {
    p.rect(tx, topY, tw, Math.round(torsoH * 0.35), sec);
    p.rect(tx, topY, tw, 1, sl);
  }
  if (parts.has('bones'))
    for (let y = topY + 2; y < topY + Math.min(torsoH, 12) - 1; y += 2) {
      p.rect(tx + 1, y, tw - 2, 1, '#e6dcc6');
      p.set(ox, y + 1, '#e6dcc6');
    }
  if (parts.has('bandage'))
    for (let y = topY; y < (robe ? oy - 4 : hipY); y += 3)
      p.line(tx - 1, y, tx + tw, y + 1, shade(a.body, 0.3));
  if (parts.has('armor')) {
    p.rect(tx - 1, topY, tw + 2, Math.max(2, Math.round(torsoH * 0.2)), sm);
    p.rect(tx - 1, topY, tw + 2, 1, sl);
    p.rect(tx + 1, topY + Math.round(torsoH * 0.3), tw - 2, Math.round(torsoH * 0.55), sm);
    p.rect(tx + 1, topY + Math.round(torsoH * 0.3), 1, Math.round(torsoH * 0.55), sl);
    p.rect(ox, topY + Math.round(torsoH * 0.3), 1, Math.round(torsoH * 0.55), sd);
  }
  // Front leg.
  if (!float) {
    limb(ox + 1, hipY, ox + 1 + stride, oy - 1, m);
    p.rect(ox + 1 + stride, oy - 1, t + 1, 1, dk);
  }
  // Head.
  const hw = Math.max(4, Math.round(Math.min(headH * 1.05, tw * 0.9))),
    hx = ox - Math.floor(hw / 2) + 1,
    hy = topY - headH,
    eyeY = hy + Math.round(headH * 0.45),
    eye = a.eye ?? '#1b1716';
  if (parts.has('cap')) {
    p.rect(hx, hy + 2, hw, headH - 2, '#e8dcc8');
    p.ellipse(ox + 1, hy + 2, hw * 0.9, 3, a.belly ?? '#c85a44');
    p.set(ox, hy + 1, shade(a.belly ?? '#c85a44', 0.4));
    p.set(ox + 2, hy + 5, eye);
  } else if (parts.has('bones')) {
    // A skull: a rounded cranium, dark sockets with a spark in each, and a jaw.
    p.ellipse(hx + hw / 2, hy + headH * 0.42, hw / 2 + 0.5, headH * 0.45, '#e6dcc6');
    p.rect(
      hx + 1,
      hy + Math.round(headH * 0.6),
      hw - 2,
      Math.max(1, Math.round(headH * 0.35)),
      '#d8ccb0',
    );
    const sock = Math.max(1, Math.round(hw / 5));
    for (const ex of [hx + Math.round(hw * 0.2), hx + hw - Math.round(hw * 0.2) - sock]) {
      p.rect(ex, eyeY - 1, sock, sock + 1, '#141010');
      p.set(ex + Math.floor(sock / 2), eyeY, eye);
    }
    for (let x = hx + 2; x < hx + hw - 2; x += 2) p.set(x, hy + headH - 2, '#141010');
  } else {
    p.rect(hx, hy, hw, headH, parts.has('hood') ? sec : m);
    p.rect(hx, hy, hw, 1, l);
    p.rect(hx, hy, 1, headH, l);
    if (parts.has('hood')) p.rect(hx + 2, hy + 2, hw - 2, headH - 3, '#120e14');
    p.set(hx + hw - 2, eyeY, eye);
    if (hw > 5) p.set(hx + hw - 4, eyeY, eye);
    if (hw > 9) {
      p.set(hx + hw - 3, eyeY, eye);
      p.set(hx + hw - 5, eyeY, eye);
    }
  }
  if (parts.has('horns')) {
    const hl = Math.max(3, Math.round(headH * 0.6));
    p.line(hx, hy + 1, hx - Math.round(hl / 2), hy - hl, '#2a1a1a');
    p.line(hx + hw - 1, hy + 1, hx + hw - 1 + Math.round(hl / 2), hy - hl, '#2a1a1a');
    p.set(hx - Math.round(hl / 2), hy - hl, '#d8c8a0');
    p.set(hx + hw - 1 + Math.round(hl / 2), hy - hl, '#d8c8a0');
  }
  if (parts.has('crown')) {
    const ch = Math.max(2, Math.round(headH * 0.3));
    p.rect(hx - 1, hy - 1, hw + 2, 2, '#e8c84a');
    for (let x = hx - 1; x < hx + hw + 1; x += Math.max(2, Math.round(hw / 4)))
      p.rect(x, hy - ch, 1, ch, '#e8c84a');
    p.set(ox, hy, '#ff5a5a');
  }
  // Front arm, with whatever it holds.
  const ax = tx + tw,
    ay = topY + torsoH - 1 + Math.round(s);
  limb(tx + tw - t, topY + 2, ax + Math.round(s * 2) - t + 1, ay, robe ? sm : m);
  if (parts.has('sword')) {
    const len = Math.max(6, Math.round(H / 4));
    for (let k = 0; k < Math.ceil(t / 2); k++)
      p.line(ax + 1 + k, ay, ax + len + k, ay - len, '#c8ccd0');
    p.rect(ax - 1, ay, 3, 1, '#8a7040');
  }
  if (parts.has('staff')) {
    p.line(ax + 1, oy - 2, ax + 1, hy - 2, '#6a4a30');
    p.ellipse(ax + 1, hy - 4, 2.5, 2.5, eye);
    p.set(ax, hy - 5, '#ffffff');
  }
  if (parts.has('shield'))
    p.rect(
      ax - 1,
      ay - Math.round(torsoH * 0.4),
      Math.max(3, t + 1),
      Math.round(torsoH * 0.7),
      sec,
    );
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
  const [dk, d, m, l, ll] = ramp(a.body),
    squash = [0, 1, 2, 1][frame % 4] * Math.max(1, Math.round(a.h / 14)),
    w = a.w / 2 + squash,
    h = a.h - squash * 2,
    cy = oy - h / 2,
    big = a.w > 30;
  p.ellipse(ox, cy, w, h / 2, m);
  // Light from the upper left, a darker belly, and a shine.
  for (let y = Math.round(oy - h); y < oy; y++)
    for (let x = Math.round(ox - w); x <= ox + w; x++) {
      if (!p.alpha(x, y)) continue;
      const dx = (x - ox) / w,
        dy = (y - cy) / (h / 2);
      if (dx * 0.6 + dy * 0.9 > 0.75) p.set(x, y, d);
      else if (dx * 0.5 + dy * 0.8 < -0.7) p.set(x, y, l);
    }
  for (let x = Math.round(ox - w); x <= ox + w; x++) if (p.alpha(x, oy - 1)) p.set(x, oy - 1, dk);
  const shine = Math.max(1, Math.round(w / 6));
  p.rect(
    Math.round(ox - w * 0.55),
    Math.round(oy - h * 0.8),
    shine + 1,
    Math.max(1, Math.round(shine / 2)),
    ll,
  );
  // Eyes grow with the body; big slimes get pupils and a mouth.
  const e = Math.max(1, Math.round(w / 7)),
    ey = Math.round(cy - h * 0.08),
    eye = a.eye ?? '#1b1716';
  for (const ex of [ox - Math.round(w * 0.3), ox + Math.round(w * 0.3)]) {
    if (big) {
      p.ellipse(ex, ey, e * 1.2, e * 1.3, '#f4f0e8');
      p.ellipse(ex + Math.ceil(e / 3), ey + 1, e * 0.6, e * 0.8, eye);
      p.set(ex - Math.floor(e / 2), ey - Math.floor(e / 2), '#ffffff');
    } else p.rect(ex, ey, e, e, eye);
  }
  if (big)
    p.rect(
      ox - Math.round(w * 0.2),
      ey + e * 2,
      Math.round(w * 0.4),
      Math.max(1, Math.round(e / 2)),
      dk,
    );
  if (a.parts?.includes('core')) {
    const cr = Math.max(1, Math.round(w / 8));
    p.ellipse(ox + Math.round(w * 0.1), Math.round(cy + h * 0.2), cr, cr, a.belly ?? '#ffffff');
  }
  if (big)
    // Mushroom caps sprout from a great slime's back, and spores freckle its skin.
    for (let k = 0; k < 5; k++) {
      const cx = Math.round(ox - w * 0.6 + k * w * 0.3),
        top = Math.round(
          oy - h * (0.85 + 0.12 * Math.sin(k * 1.7)) + Math.abs(cx - ox) * (h / w) * 0.35,
        );
      p.rect(cx, top - 3, 2, 4, '#e8dcc8');
      p.ellipse(cx + 1, top - 4, 4, 2.2, a.belly ?? '#58e0d0');
      p.set(cx, top - 5, '#ffffff');
    }
  if (a.parts?.includes('crown')) {
    const cw = Math.max(7, Math.round(w * 0.5)),
      top = Math.round(oy - h - 2);
    p.rect(ox - Math.floor(cw / 2), top, cw, 2, '#e8c84a');
    for (let x = ox - Math.floor(cw / 2); x < ox + cw / 2; x += 3) p.set(x, top - 1, '#e8c84a');
  }
}

function paintFloater(p: Painter, a: MobArt, frame: number, ox: number, oy: number) {
  const [dk, d, m, l, ll] = ramp(a.body),
    parts = new Set(a.parts ?? []),
    cy = oy - Math.round(a.h * 0.6),
    r = a.w / 2;
  if (parts.has('eye')) {
    if (r > 20)
      // The Unmaker trails tentacles of void, swaying as it drifts.
      for (let k = 0; k < 6; k++) {
        let x = ox - r * 0.6 + k * r * 0.24,
          y = cy + r * 0.7;
        for (let j = 0; j < 16; j++) {
          x += Math.sin(j * 0.6 + k * 1.3 + frame * 0.8) * 1.4;
          y += 1.7;
          const t = Math.max(1, Math.round(3.5 - j / 5));
          p.rect(
            Math.round(x),
            Math.round(y),
            t,
            t,
            j % 4 === 3 ? (a.belly ?? '#ff5a8a') : j % 2 ? m : d,
          );
        }
      }
    // Sclera shaded toward the lower right, a ringed iris, a slit pupil, and a wet highlight.
    p.ellipse(ox, cy, r, r, '#e8e0e0');
    for (let y = Math.round(cy - r); y <= cy + r; y++)
      for (let x = Math.round(ox - r); x <= ox + r; x++)
        if (p.alpha(x, y) && (x - ox) * 0.6 + (y - cy) * 0.8 > r * 0.55) p.set(x, y, '#b8a8b0');
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2 + 0.4;
      p.line(
        Math.round(ox + Math.cos(ang) * r * 0.95),
        Math.round(cy + Math.sin(ang) * r * 0.95),
        Math.round(ox + Math.cos(ang + 0.2) * r * 0.6),
        Math.round(cy + Math.sin(ang + 0.2) * r * 0.6),
        '#c84a5a',
      );
    }
    const iris = a.belly ?? '#b36cff';
    p.ellipse(ox + 1, cy, r * 0.58, r * 0.58, shade(iris, -0.35));
    p.ellipse(ox + 1, cy, r * 0.5, r * 0.5, iris);
    p.ellipse(ox + 1, cy, r * 0.12 + 0.5, r * 0.36, a.eye ?? '#0a0610');
    p.rect(
      Math.round(ox - r * 0.45),
      Math.round(cy - r * 0.55),
      Math.max(2, Math.round(r / 8)),
      Math.max(1, Math.round(r / 16)),
      '#ffffff',
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
    // Floaters trail tentacles or tails below their anchor, so they get room underneath.
    const below = a.tpl === 'floater' ? Math.round(a.h * 0.5) : 0,
      W = Math.round(a.w * (a.tpl === 'flyer' ? 1.2 : 1.6)) + 8,
      H = a.h + 14 + below,
      ox = Math.round(W / 2),
      oy = H - 1 - below;
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

const portraits = new Map<string, string>();
/** A creature's first frame as a data URL, for the journal's bestiary. */
export function mobPortrait(type: string): string {
  let url = portraits.get(type);
  if (!url) {
    const art = MOBS[type] ?? MOBS.wolf;
    url = mobSprite(type, art, 0).cv.toDataURL();
    portraits.set(type, url);
  }
  return url;
}
