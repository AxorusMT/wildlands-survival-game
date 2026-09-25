// Tile lighting in the manner of Terraria: a colour light value per tile, seeded by open sky
// and by glowing things, spread through air (and, more weakly, through rock), then laid over the
// scene with multiply blending so caves are dark and every torch matters.
import { MOBS } from './actors.ts';
import { D, GROUND, skyLight } from './art.ts';
import { TA, makeCanvas } from './px.ts';
import type { RenderGame } from './types.ts';

const T = D.TILE;
/** How much light survives each tile it crosses. */
const AIR_KEEP = 0.9,
  SOLID_KEEP = 0.55;
const MARGIN = 12;

export type Light = [x: number, y: number, r: number, g: number, b: number];
/** Light sources in world coordinates, gathered fresh each frame by the renderer. */
export function gatherLights(g: RenderGame, t: number, menu = false): Light[] {
  const out: Light[] = [];
  const p = g.s.player;
  if (!menu) out.push([p.x, p.y - 24, 0.78, 0.72, 0.62]);
  for (const s of g.s.structures) {
    const f = 0.92 + Math.sin(t * 11 + s.id) * 0.05;
    if (s.type === 'campfire' && s.fuel > 0) out.push([s.x, s.y - 20, 1.25 * f, 0.85 * f, 0.5 * f]);
    else if (s.type === 'lantern' && s.fuel > 0) out.push([s.x, s.y - 40, 1.1, 0.95, 0.62]);
    else if (s.type === 'crystal_lantern') out.push([s.x, s.y - 40, 0.62, 1.05, 1.1]);
    else if (s.type === 'torch') out.push([s.x, s.y - 20, 1.15 * f, 0.9 * f, 0.55 * f]);
    else if (s.type === 'furnace' || s.type === 'forge') out.push([s.x, s.y - 20, 1.0, 0.6, 0.3]);
    else if (s.type === 'effergy') out.push([s.x, s.y - 60, 0.85, 0.72, 1.0]);
    else if (s.type === 'rift_gate' || s.type === 'portal')
      out.push([s.x, s.y - 50, 0.8, 0.5, 1.1]);
  }
  for (const n of g.s.nodes) {
    if (n.hp <= 0) continue;
    if (n.kind === 'crystal') out.push([n.x, n.y - 14, 0.35, 0.8, 0.85]);
    else if (n.kind === 'hellstone') out.push([n.x, n.y - 12, 0.95, 0.38, 0.14]);
    else if (n.kind.includes('myconite') || n.kind === 'glowcap')
      out.push([n.x, n.y - 12, 0.25, 0.85, 0.8]);
    else if (n.kind.includes('starmetal')) out.push([n.x, n.y - 12, 0.95, 0.85, 0.45]);
    else if (n.kind.includes('voidsteel')) out.push([n.x, n.y - 12, 0.6, 0.3, 0.95]);
  }
  for (const a of g.s.animals) {
    if (a.deadUntil) continue;
    const light = MOBS[a.type]?.light;
    if (light) out.push([a.x, a.y - 24, ...light]);
  }
  return out;
}

let grid: HTMLCanvasElement | null = null;
let buf: {
  r: Float32Array;
  g: Float32Array;
  b: Float32Array;
  solid: Uint8Array;
  size: number;
} | null = null;

/** Computes the light over the view and multiplies it onto the art canvas. */
export function drawLighting(
  c: CanvasRenderingContext2D,
  g: RenderGame,
  ax: number,
  ay: number,
  w: number,
  h: number,
  lights: Light[],
) {
  const tx0 = Math.floor(ax / TA) - MARGIN,
    ty0 = Math.floor(ay / TA) - MARGIN,
    gw = Math.ceil(w / TA) + 2 * MARGIN + 1,
    gh = Math.ceil(h / TA) + 2 * MARGIN + 1,
    size = gw * gh;
  if (!buf || buf.size < size)
    buf = {
      r: new Float32Array(size),
      g: new Float32Array(size),
      b: new Float32Array(size),
      solid: new Uint8Array(size),
      size,
    };
  const R = buf.r,
    G = buf.g,
    B = buf.b,
    S = buf.solid;
  const [sr, sg, sb] = skyLight(g);
  // Deep layers keep a faint ambient: cold in the mines, a sullen red glow in hell.
  const layerAmbient = (y: number): [number, number, number] =>
    y >= D.LAYERS[4].top
      ? [0.3, 0.1, 0.07]
      : y >= D.LAYERS[3].top
        ? [0.22, 0.09, 0.07]
        : y >= D.LAYERS[2].top
          ? [0.05, 0.055, 0.08]
          : [0.06, 0.06, 0.07];
  const dim = D.biomeAt(g.s.player.x, 0).id;
  // In the sky dimension open air is always lit; in the void only the stars glimmer.
  const skyFactor = dim === 'void' ? 0.22 : dim === 'mycelia' ? 0.3 : 1;
  for (let j = 0; j < gh; j++)
    for (let i = 0; i < gw; i++) {
      const tx = tx0 + i,
        ty = ty0 + j,
        k = j * gw + i,
        kind = g.tileAt(tx, ty),
        x = tx * T + T / 2,
        y = ty * T + T / 2;
      S[k] = kind ? 1 : 0;
      let [r, gg, b] = !kind && y > D.surfaceAt(x) + 64 ? layerAmbient(y) : [0, 0, 0];
      if (!kind) {
        if (y < D.surfaceAt(x) || dim === 'skyreach') {
          r = sr * skyFactor;
          gg = sg * skyFactor;
          b = sb * skyFactor;
        } else if (y > 3300 && D.lavaAt(x, y)) {
          r = 1.2;
          gg = 0.55;
          b = 0.18;
        }
      } else {
        const glow = GROUND[kind]?.glow;
        if (glow) {
          r = 0.55;
          gg = 0.3;
          b = 0.9;
        }
      }
      R[k] = r;
      G[k] = gg;
      B[k] = b;
    }
  for (const [lx, ly, r, gg, b] of lights) {
    const i = Math.floor(lx / T) - tx0,
      j = Math.floor(ly / T) - ty0;
    if (i < 0 || j < 0 || i >= gw || j >= gh) continue;
    const k = j * gw + i;
    R[k] = Math.max(R[k], r);
    G[k] = Math.max(G[k], gg);
    B[k] = Math.max(B[k], b);
  }
  // Spread: sweeps in all four directions, twice, approximate light flooding outward.
  const step = (k: number, from: number) => {
    // Light reaches the face of a block almost undimmed, then fades fast into the rock.
    const keep = !S[k] ? AIR_KEEP : S[from] ? SOLID_KEEP : 0.88,
      r = R[from] * keep,
      gg = G[from] * keep,
      b = B[from] * keep;
    if (r > R[k]) R[k] = r;
    if (gg > G[k]) G[k] = gg;
    if (b > B[k]) B[k] = b;
  };
  for (let pass = 0; pass < 2; pass++) {
    for (let j = 0; j < gh; j++) {
      const row = j * gw;
      for (let i = 1; i < gw; i++) step(row + i, row + i - 1);
      for (let i = gw - 2; i >= 0; i--) step(row + i, row + i + 1);
    }
    for (let i = 0; i < gw; i++) {
      for (let j = 1; j < gh; j++) step(j * gw + i, (j - 1) * gw + i);
      for (let j = gh - 2; j >= 0; j--) step(j * gw + i, (j + 1) * gw + i);
    }
  }
  if (!grid || grid.width !== gw || grid.height !== gh) grid = makeCanvas(gw, gh);
  const k2 = grid.getContext('2d')!,
    img = k2.createImageData(gw, gh),
    d = img.data;
  for (let k = 0; k < size; k++) {
    // A faint floor keeps the deepest dark readable rather than a flat black.
    d[k * 4] = Math.min(255, (R[k] + 0.035) * 255);
    d[k * 4 + 1] = Math.min(255, (G[k] + 0.03) * 255);
    d[k * 4 + 2] = Math.min(255, (B[k] + 0.045) * 255);
    d[k * 4 + 3] = 255;
  }
  k2.putImageData(img, 0, 0);
  c.save();
  c.globalCompositeOperation = 'multiply';
  c.imageSmoothingEnabled = true;
  c.drawImage(grid, tx0 * TA - ax, ty0 * TA - ay, gw * TA, gh * TA);
  c.restore();
  c.imageSmoothingEnabled = false;
}
