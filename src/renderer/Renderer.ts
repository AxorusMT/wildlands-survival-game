// The frame, in pixel art: everything is drawn at low resolution into an art buffer (one art
// pixel is two world pixels), lit per tile, then scaled up by a whole number with no smoothing.
import type { Point } from '../core/types.ts';
import { drawAnimal, drawPlayer } from './actors.ts';
import { D } from './art.ts';
import { drawDrops, drawParticles, drawWeather } from './effects.ts';
import { drawLighting, gatherLights } from './lighting.ts';
import { drawCache, drawNode, drawTree, TREE_KINDS } from './nature.ts';
import { PX, cached, makeCanvas, ramp, sprite, type PixelView } from './px.ts';
import { drawSky } from './sky.ts';
import { drawStructure } from './structures.ts';
import { drawGround, drawLava, drawWalls } from './tiles.ts';
import type { RenderGame } from './types.ts';
export { spawnEffects } from './effects.ts';
export { pixelView, type PixelView } from './px.ts';

let art: HTMLCanvasElement | null = null;

function drawLadders(c: CanvasRenderingContext2D, ax: number, ay: number, w: number, h: number) {
  for (const shaft of D.SHAFTS) {
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

export function draw(
  c: CanvasRenderingContext2D,
  g: RenderGame,
  cam: Point,
  view: PixelView,
  menu = false,
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
  drawParticles(a, ax, ay, now);
  drawLighting(a, g, ax, ay, w, h, gatherLights(g, t, menu));
  drawWeather(a, g, ax, ay, w, h, fx, menu);
  c.imageSmoothingEnabled = false;
  c.drawImage(art, 0, 0, w * view.scale, h * view.scale);
}
