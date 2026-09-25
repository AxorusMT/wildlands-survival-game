// What the generated realms add over the scene: the Orchard's tide, the Steppe's ash storms, and
// the dust that trickles down before a Warren cave-in.
import { D } from './art.ts';
import { PX, hash } from './px.ts';
import type { RenderGame } from './types.ts';

/** Water below the tide line, drawn over the scene before lighting so it darkens with depth. */
export function drawTide(
  c: CanvasRenderingContext2D,
  g: RenderGame,
  ax: number,
  ay: number,
  w: number,
  h: number,
  t: number,
) {
  const level = g.pocket.waterLevel();
  if (level === null) return;
  const x0 = Math.max(0, Math.round(D.POCKET.start / PX - ax)),
    x1 = Math.min(w, Math.round(D.POCKET.end / PX - ax));
  if (x1 <= x0) return;
  const top = Math.round(level / PX - ay);
  if (top > h) return;
  c.fillStyle = 'rgba(40, 110, 120, 0.42)';
  c.fillRect(x0, Math.max(0, top), x1 - x0, h - Math.max(0, top));
  // A lighter band just under the surface, and a rippling crest line.
  c.fillStyle = 'rgba(120, 200, 200, 0.25)';
  c.fillRect(x0, Math.max(0, top), x1 - x0, 3);
  c.fillStyle = 'rgba(210, 245, 240, 0.7)';
  for (let x = x0; x < x1; x++) {
    const wx = x + ax,
      wave = Math.round(Math.sin(wx / 9 + t * 2.2) + Math.sin(wx / 23 - t * 1.3));
    if ((wx + Math.floor(t * 6)) % 7 < 5) c.fillRect(x, top + wave - 1, 1, 1);
  }
}

/** Ash-storm haze and drifting cinders, over the lit scene; dust before a cave-in. */
export function drawRealmAir(
  c: CanvasRenderingContext2D,
  g: RenderGame,
  ax: number,
  ay: number,
  w: number,
  h: number,
  t: number,
) {
  const ash = g.pocket.ashLevel();
  if (ash > 0) {
    const guard = g.equipment.has('ashward') ? 0.35 : 1;
    c.fillStyle = `rgba(112, 94, 80, ${(ash * 0.62 * guard).toFixed(2)})`;
    c.fillRect(0, 0, w, h);
    c.fillStyle = `rgba(200, 180, 160, ${(ash * 0.8).toFixed(2)})`;
    for (let i = 0; i < 160; i++) {
      const x = Math.floor((((hash(i, 1) * w * 3 - t * (60 + hash(i, 2) * 90)) % w) + w) % w),
        y = Math.floor((hash(i, 3) * h + Math.sin(t * 2 + i) * 6 + t * 12 * hash(i, 4)) % h);
      c.fillRect(x, y, hash(i, 5) > 0.7 ? 2 : 1, 1);
    }
  }
  const fall = g.pocket.pendingCaveIn();
  if (fall) {
    const sx = Math.round(fall.x / PX - ax),
      sy = Math.round(fall.y / PX - ay);
    c.fillStyle = 'rgba(160, 130, 90, 0.8)';
    for (let i = 0; i < 26; i++) {
      const life = (t * 1.4 + hash(i, 7)) % 1;
      c.fillRect(sx + Math.round((hash(i, 8) - 0.5) * 80), sy + Math.round(life * 40), 1, 2);
    }
  }
}
