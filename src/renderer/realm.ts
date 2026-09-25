// What the generated realms add over the scene: the Orchard's tide and the Marches' mire, the
// Steppe's ash storms, the dust before a Warren cave-in and the glint before Glasswood shardfall,
// the Barrow's steam, the Salt Flats' white glare, and the Choir's hymn.
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
  const mire = g.pocket.waterKind() === 'mire';
  if (mire) {
    // Mud pools only in the surface basins: fill each column down to the ground.
    c.fillStyle = 'rgba(104, 112, 44, 0.6)';
    for (let x = x0; x < x1; x++) {
      const floor = Math.round(D.surfaceAt((x + ax) * PX) / PX - ay) + 3;
      if (floor > top) c.fillRect(x, Math.max(0, top), 1, Math.min(h, floor) - Math.max(0, top));
    }
  } else {
    const kind = g.pocket.waterKind();
    c.fillStyle =
      kind === 'magma'
        ? 'rgba(255, 110, 30, 0.62)'
        : kind === 'deep'
          ? 'rgba(20, 70, 110, 0.4)'
          : 'rgba(40, 110, 120, 0.42)';
    c.fillRect(x0, Math.max(0, top), x1 - x0, h - Math.max(0, top));
  }
  const magma = g.pocket.waterKind() === 'magma';
  // A lighter band just under the surface, and a rippling (or sluggish, bubbling) crest line.
  const wet = (x: number) => !mire || D.surfaceAt((x + ax) * PX) / PX - ay > top + 1;
  c.fillStyle = magma
    ? 'rgba(255, 200, 80, 0.8)'
    : mire
      ? 'rgba(160, 170, 80, 0.55)'
      : 'rgba(120, 200, 200, 0.25)';
  for (let x = x0; x < x1; x++) if (wet(x)) c.fillRect(x, Math.max(0, top), 1, 3);
  c.fillStyle = magma
    ? 'rgba(255, 240, 180, 0.9)'
    : mire
      ? 'rgba(214, 210, 140, 0.75)'
      : 'rgba(210, 245, 240, 0.7)';
  const speed = mire ? 0.3 : 1;
  for (let x = x0; x < x1; x++) {
    if (!wet(x)) continue;
    const wx = x + ax,
      wave = Math.round(Math.sin(wx / 9 + t * 2.2 * speed) + Math.sin(wx / 23 - t * 1.3 * speed));
    if ((wx + Math.floor(t * 6 * speed)) % 7 < 5) c.fillRect(x, top + wave - 1, 1, 1);
  }
  if (mire)
    for (let i = 0; i < 24; i++) {
      const life = (t * 0.5 + hash(i, 11)) % 1,
        bx = Math.floor(hash(i, 12) * (x1 - x0)) + x0;
      if (life < 0.3 && wet(bx)) c.fillRect(bx, top - Math.round(life * 6), 2, 1);
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
  // Steam from the vents that are blowing.
  if (g.s.pocket?.realm === 'barrow' && g.pocket.here())
    for (const st of g.s.structures) {
      if (st.type !== 'steam_vent' || !D.ventActive(st.x, g.s.elapsed)) continue;
      const sx = Math.round(st.x / PX - ax),
        sy = Math.round(st.y / PX - ay);
      if (sx < -20 || sx > w + 20 || sy < -80 || sy > h + 20) continue;
      for (let i = 0; i < 30; i++) {
        const life = (t * 2 + hash(i, 21)) % 1;
        c.fillStyle = `rgba(240, 240, 240, ${(0.7 * (1 - life)).toFixed(2)})`;
        c.fillRect(
          sx + Math.round((hash(i, 22) - 0.5) * 14 * (1 + life * 2)),
          sy - Math.round(life * 60),
          2,
          2,
        );
      }
    }
  // The white sun: a hot glare over the open flats.
  const sun = g.pocket.sunLevel();
  if (sun > 0) {
    const guard = g.equipment.has('shade') ? 0.3 : 1;
    c.fillStyle = `rgba(255, 246, 220, ${(0.22 * guard * (0.85 + 0.15 * Math.sin(t * 1.3))).toFixed(2)})`;
    c.fillRect(0, 0, w, h);
  }
  // The Garden's seasons tint the air: summer glare, autumn haze, winter snow.
  const season = g.pocket.here() ? g.pocket.season() : null;
  if (season && season.id !== 'spring') {
    c.fillStyle =
      season.id === 'summer'
        ? 'rgba(255, 220, 140, 0.14)'
        : season.id === 'autumn'
          ? 'rgba(200, 110, 50, 0.12)'
          : 'rgba(210, 230, 255, 0.18)';
    c.fillRect(0, 0, w, h);
    if (season.id !== 'summer') {
      c.fillStyle =
        season.id === 'winter' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(216, 112, 58, 0.8)';
      for (let i = 0; i < 70; i++) {
        const x = Math.floor((((hash(i, 41) * w + t * 14 * (hash(i, 42) - 0.3)) % w) + w) % w),
          y = Math.floor((hash(i, 43) * h + t * (18 + hash(i, 44) * 20)) % h);
        c.fillRect(x, y, season.id === 'winter' ? 1 : 2, 1);
      }
    }
  }
  // The hymn: a cold blue haze and drifting notes.
  const hymn = g.pocket.hymnLevel();
  if (hymn > 0) {
    const guard = g.equipment.has('hymnward') || g.pocket.warmed() ? 0.35 : 1;
    c.fillStyle = `rgba(150, 190, 240, ${(hymn * 0.38 * guard).toFixed(2)})`;
    c.fillRect(0, 0, w, h);
    c.fillStyle = `rgba(230, 244, 255, ${(hymn * 0.8).toFixed(2)})`;
    for (let i = 0; i < 40; i++) {
      const x = Math.floor((hash(i, 31) * w + t * 20 * (hash(i, 32) - 0.5)) % w),
        y = Math.floor(((hash(i, 33) * h - t * (10 + hash(i, 34) * 14)) % h) + h) % h;
      c.fillRect(x, y, 1, 3);
      c.fillRect(x + 1, y, 2, 1);
    }
  }
  const fall = g.pocket.pendingCaveIn();
  if (fall?.kind === 'star') {
    // A column of gathering starlight over the spot where the pulse will land.
    const sx = Math.round(fall.x / PX - ax),
      k = Math.max(0, 1 - (fall.at - g.s.elapsed) / 2.6);
    c.fillStyle = `rgba(200, 210, 255, ${(0.12 + k * 0.3).toFixed(2)})`;
    c.fillRect(sx - 40, 0, 80, h);
    c.fillStyle = `rgba(255, 244, 208, ${(0.2 + k * 0.5).toFixed(2)})`;
    c.fillRect(sx - 10, 0, 20, h);
  } else if (fall?.kind === 'shards') {
    // A glint high in the crystal canopy, then the glass comes down.
    const sx = Math.round(fall.x / PX - ax),
      sy = Math.max(4, Math.round(fall.y / PX - ay));
    c.fillStyle = 'rgba(220, 245, 255, 0.9)';
    for (let i = 0; i < 18; i++) {
      if (Math.sin(t * 20 + i * 1.7) < 0.2) continue;
      c.fillRect(sx + Math.round((hash(i, 9) - 0.5) * 90), sy + Math.round(hash(i, 10) * 30), 1, 1);
    }
  } else if (fall) {
    const sx = Math.round(fall.x / PX - ax),
      sy = Math.round(fall.y / PX - ay);
    c.fillStyle = 'rgba(160, 130, 90, 0.8)';
    for (let i = 0; i < 26; i++) {
      const life = (t * 1.4 + hash(i, 7)) % 1;
      c.fillRect(sx + Math.round((hash(i, 8) - 0.5) * 80), sy + Math.round(life * 40), 1, 2);
    }
  }
}
