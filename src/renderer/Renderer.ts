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
import { drawSky, drawClouds } from './sky.ts';
import { drawTerrain, drawLadders } from './terrain.ts';
import { drawNode, drawCache, drawTree, treeNode } from './resources.ts';
import { drawStructure } from './structures.ts';
import { drawAnimal, drawPlayer } from './actors.ts';
import { drawLighting, drawWeather } from './atmosphere.ts';
import type { Canvas2D, RenderGame } from './types.ts';
import type { Point } from '../core/types.ts';

export function draw(c: Canvas2D, g: RenderGame, cam: Point, w: number, h: number, menu = false) {
  const t = g.s.elapsed,
    tod = g.timeOfDay(),
    fx = menu ? cam.x + w / 2 : g.s.player.x;
  c.clearRect(0, 0, w, h);
  drawSky(c, g, cam, w, h, fx, tod);
  drawTerrain(c, g, cam, w, h);
  drawLadders(c, cam, w);
  const visible = (o: Point, pad = 140) =>
    o.x > cam.x - pad && o.x < cam.x + w + pad && o.y > cam.y - 40 && o.y < cam.y + h + 220;
  for (const n of g.s.nodes)
    if (treeNode(n.kind) && visible(n, 160)) drawTree(c, n, n.x - cam.x, n.y - cam.y, t);
  for (const n of g.s.nodes)
    if (!treeNode(n.kind) && visible(n) && (n.hp > 0 || n.kind !== 'water'))
      drawNode(c, n, n.x - cam.x, n.y - cam.y, t);
  for (const cache of g.s.caches)
    if (!cache.opened && visible(cache)) drawCache(c, cache, cache.x - cam.x, cache.y - cam.y, t);
  for (const s of g.s.structures)
    if (visible(s)) drawStructure(c, g, s, s.x - cam.x, s.y - cam.y, t);
  for (const a of g.s.animals)
    if (!a.deadUntil && visible(a)) drawAnimal(c, g, a, a.x - cam.x, a.y - cam.y, t);
  if (!menu) drawPlayer(c, g.s.player, g.s.player.x - cam.x, g.s.player.y - cam.y, t);
  drawLighting(c, g, cam, w, h, menu, tod);
  drawWeather(c, g, cam, w, h, menu, fx, tod);
  const vignette = c.createRadialGradient(w / 2, h / 2, h * 0.35, w / 2, h / 2, w * 0.75);
  vignette.addColorStop(0, 'rgba(40,32,22,0)');
  vignette.addColorStop(1, 'rgba(30,22,18,0.32)');
  c.fillStyle = vignette;
  c.fillRect(0, 0, w, h);
}
