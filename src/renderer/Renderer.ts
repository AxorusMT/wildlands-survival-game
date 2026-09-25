// The frame, in pixel art: everything is drawn at low resolution into an art buffer (one art
// pixel is two world pixels), lit per tile, then scaled up by a whole number with no smoothing.
import type { Point } from '../core/types.ts';
import { drawAnimal, drawPlayer } from './actors.ts';
import { D } from './art.ts';
import { drawDrops, drawParticles, drawWeather } from './effects.ts';
import { drawLighting, gatherLights } from './lighting.ts';
import { drawCache, drawNode, drawTree, TREE_KINDS } from './nature.ts';
import { PROJECTILES } from '../data/gear.ts';
import { PX, TA, cached, hash, makeCanvas, ramp, sprite, type PixelView } from './px.ts';
import { drawRealmAir, drawTide } from './realm.ts';
import { drawSky } from './sky.ts';
import { drawStructure } from './structures.ts';
import { drawGround, drawLava, drawWalls } from './tiles.ts';
import type { RenderGame } from './types.ts';
export { spawnEffects } from './effects.ts';
export { pixelView, type PixelView } from './px.ts';

let art: HTMLCanvasElement | null = null;

function drawLadders(c: CanvasRenderingContext2D, ax: number, ay: number, w: number, h: number) {
  for (const shaft of D.allShafts()) {
    const sx = Math.round(shaft.x / PX - ax);
    if (sx < -30 || sx > w + 30) continue;
    const surface = shaft.top < D.surfaceAt(shaft.x) + 20,
      y1 = Math.round((surface ? D.surfaceAt(shaft.x) - 24 : shaft.top) / PX - ay),
      y2 = Math.round((shaft.bottom + 40) / PX - ay);
    if (y2 < -20 || y1 > h + 20) continue;
    const deep = shaft.top > D.LAYERS[3].top,
      [dk, d, m, l] = ramp(deep ? '#5a4444' : '#7a5d42');
    const top = Math.max(y1, -4),
      bottom = Math.min(y2, h + 4);
    for (const rx of [-11, 10]) {
      c.fillStyle = dk;
      c.fillRect(sx + rx - 1, top, 4, bottom - top);
      c.fillStyle = m;
      c.fillRect(sx + rx, top, 2, bottom - top);
      c.fillStyle = l;
      c.fillRect(sx + rx, top, 1, bottom - top);
    }
    for (let y = y1 + 7 + Math.max(0, Math.floor((top - y1 - 7) / 10)) * 10; y < bottom; y += 10) {
      c.fillStyle = dk;
      c.fillRect(sx - 10, y - 1, 21, 3);
      c.fillStyle = d;
      c.fillRect(sx - 10, y, 21, 1);
    }
    if (!surface) continue;
    // A rope-lashed frame marks the shaft mouth from the surface.
    const frame = cached('shaftframe', () =>
      sprite(38, 34, 19, 20, (p) => {
        p.line(3, 33, 5, 3, '#6b4f37');
        p.line(4, 33, 6, 3, '#6b4f37');
        p.line(34, 33, 32, 3, '#6b4f37');
        p.line(35, 33, 33, 3, '#6b4f37');
        p.rect(0, 2, 38, 3, '#7a5d42');
        p.rect(0, 2, 38, 1, '#9a7a58');
        for (const x of [5, 32]) {
          p.line(x - 2, 1, x + 2, 5, '#d2bb88');
          p.line(x - 2, 5, x + 2, 1, '#d2bb88');
        }
        p.line(23, 5, 23, 13, '#cdb383');
        p.rect(22, 13, 3, 3, '#cdb383');
      }),
    );
    c.drawImage(frame.cv, sx - frame.ox, y1 + 13 - frame.oy);
  }
}

/** Shots in flight: a bright head with a short trail, lit where they glow. */
function drawProjectiles(
  c: CanvasRenderingContext2D,
  g: RenderGame,
  ax: number,
  ay: number,
  w: number,
  h: number,
) {
  for (const b of g.combat.projectiles) {
    const spec = PROJECTILES[b.kind] ?? PROJECTILES.arrow,
      x = Math.round(b.x / PX - ax),
      y = Math.round(b.y / PX - ay);
    if (x < -40 || x > w + 40 || y < -40 || y > h + 40) continue;
    const ang = Math.atan2(b.vy, b.vx),
      dx = Math.cos(ang),
      dy = Math.sin(ang);
    if (['arrow', 'dart', 'bone_shard', 'feather', 'icicle'].includes(b.kind)) {
      const len = b.kind === 'dart' ? 4 : 7;
      c.fillStyle = spec.color;
      for (let i = 0; i < len; i++)
        c.fillRect(Math.round(x - dx * i), Math.round(y - dy * i), 1, 1);
      c.fillStyle = b.kind === 'arrow' ? '#aab0b2' : '#ffffff';
      c.fillRect(Math.round(x + dx), Math.round(y + dy), 1, 1);
      continue;
    }
    if (b.kind === 'lightning') {
      c.fillStyle = spec.color;
      let lx = x;
      for (let yy = y - 120; yy < y; yy += 3) {
        lx += Math.round((hash(yy, Math.floor(g.s.elapsed * 30)) - 0.5) * 4);
        c.fillRect(lx, yy, 2, 3);
      }
      continue;
    }
    const r = Math.max(1, Math.round(spec.size / PX / 2));
    if (spec.drag) {
      // Clouds: a soft dithered puff.
      c.globalAlpha = 0.55;
      c.fillStyle = spec.color;
      for (let j = -r; j <= r; j++)
        for (let i = -r; i <= r; i++)
          if (i * i + j * j <= r * r && (i + j + Math.floor(g.s.elapsed * 8)) % 2 === 0)
            c.fillRect(x + i, y + j, 1, 1);
      c.globalAlpha = 1;
      continue;
    }
    c.fillStyle = spec.glow ?? spec.color;
    c.globalAlpha = 0.5;
    for (let i = 1; i < 5; i++)
      c.fillRect(Math.round(x - dx * i * 2) - 1, Math.round(y - dy * i * 2) - 1, 2, 2);
    c.globalAlpha = 1;
    c.fillStyle = spec.color;
    c.fillRect(x - r, y - r + 1, r * 2, r * 2 - 1);
    c.fillRect(x - r + 1, y - r, r * 2 - 1, r * 2 + 1);
    c.fillStyle = '#ffffff';
    c.fillRect(x - 1, y - 1, 1, 1);
  }
}
/** The tile under the cursor, outlined when the held item works on it. */
function drawCursor(
  c: CanvasRenderingContext2D,
  g: RenderGame,
  ax: number,
  ay: number,
  cursor: Point | null,
) {
  if (!cursor) return;
  const kind = g.equipment.useKind(g.equipment.held());
  if (kind !== 'pick' && kind !== 'block' && kind !== 'structure') return;
  const tx = Math.floor(cursor.x / D.TILE),
    ty = Math.floor(cursor.y / D.TILE),
    x = tx * TA - ax,
    y = ty * TA - ay,
    p = g.s.player,
    far = Math.hypot(tx * D.TILE + 16 - p.x, ty * D.TILE + 16 - (p.y - 24)) > 180;
  c.fillStyle = far ? 'rgba(255,120,100,0.5)' : 'rgba(255,248,220,0.7)';
  for (let i = 0; i < TA; i += 2) {
    c.fillRect(x + i, y, 1, 1);
    c.fillRect(x + i, y + TA - 1, 1, 1);
    c.fillRect(x, y + i, 1, 1);
    c.fillRect(x + TA - 1, y + i, 1, 1);
  }
}
/** Cracks spreading across tiles that have been struck but not yet broken. */
function drawCracks(
  c: CanvasRenderingContext2D,
  g: RenderGame,
  ax: number,
  ay: number,
  cursor: Point | null,
) {
  if (!cursor) return;
  const tx0 = Math.floor(cursor.x / D.TILE) - 3,
    ty0 = Math.floor(cursor.y / D.TILE) - 3;
  for (let ty = ty0; ty < ty0 + 7; ty++)
    for (let tx = tx0; tx < tx0 + 7; tx++) {
      const n = Math.min(3, g.hands.crackAt(tx, ty));
      if (!n) continue;
      const crack = cached('crack' + n, () =>
        sprite(
          TA,
          TA,
          0,
          0,
          (p) => {
            const lines = [
              [8, 8, 3, 3],
              [8, 8, 13, 5],
              [8, 8, 6, 14],
              [8, 8, 14, 12],
            ];
            for (const [x0, y0, x1, y1] of lines.slice(0, n + 1)) p.line(x0, y0, x1, y1, '#1a1410');
          },
          false,
        ),
      );
      c.drawImage(crack.cv, tx * TA - ax - 1, ty * TA - ay - 1);
    }
}

export function draw(
  c: CanvasRenderingContext2D,
  g: RenderGame,
  cam: Point,
  view: PixelView,
  menu = false,
  cursor: Point | null = null,
) {
  const w = view.artW,
    h = view.artH;
  if (!art || art.width !== w || art.height !== h) art = makeCanvas(w, h);
  const a = art.getContext('2d')!;
  a.imageSmoothingEnabled = false;
  const t = g.s.elapsed,
    now = performance.now() / 1000,
    ax = Math.round(cam.x / PX),
    ay = Math.round(cam.y / PX),
    fx = menu ? cam.x + view.worldW / 2 : g.s.player.x;
  drawSky(a, g, ax, ay, w, h, fx);
  const visibleChunks = drawWalls(a, g, ax, ay, w, h);
  drawLava(a, g, ax, ay, w, h, now);
  drawLadders(a, ax, ay, w, h);
  drawGround(a, visibleChunks, ax, ay);
  drawCracks(a, g, ax, ay, cursor);
  const on = (o: Point, pad = 80) => {
    const x = o.x / PX - ax,
      y = o.y / PX - ay;
    return x > -pad && x < w + pad && y > -20 && y < h + 110;
  };
  const sx = (o: Point) => o.x / PX - ax,
    sy = (o: Point) => o.y / PX - ay;
  for (const s of g.s.structures)
    if (s.type === 'rift_gate' || s.type === 'portal')
      if (on(s)) drawStructure(a, g, s, sx(s), sy(s), t);
  for (const n of g.s.nodes) if (TREE_KINDS.has(n.kind) && on(n)) drawTree(a, n, sx(n), sy(n), t);
  for (const n of g.s.nodes)
    if (!TREE_KINDS.has(n.kind) && on(n) && (n.hp > 0 || n.kind !== 'water'))
      drawNode(a, n, sx(n), sy(n), t);
  for (const cache of g.s.caches)
    if (!cache.opened && on(cache)) drawCache(a, cache, sx(cache), sy(cache));
  for (const s of g.s.structures)
    if (s.type !== 'rift_gate' && s.type !== 'portal' && on(s))
      drawStructure(a, g, s, sx(s), sy(s), t);
  for (const m of g.s.animals) if (!m.deadUntil && on(m)) drawAnimal(a, g, m, sx(m), sy(m), t);
  drawDrops(a, g, ax, ay, w, h, t);
  if (!menu) drawPlayer(a, g, g.s.player, sx(g.s.player), sy(g.s.player), t);
  drawProjectiles(a, g, ax, ay, w, h);
  drawParticles(a, ax, ay, now);
  if (!menu) drawTide(a, g, ax, ay, w, h, now);
  drawLighting(a, g, ax, ay, w, h, gatherLights(g, t, menu));
  if (!menu) drawRealmAir(a, g, ax, ay, w, h, now);
  drawCursor(a, g, ax, ay, cursor);
  drawWeather(a, g, ax, ay, w, h, fx, menu);
  c.imageSmoothingEnabled = false;
  c.drawImage(art, 0, 0, w * view.scale, h * view.scale);
}
