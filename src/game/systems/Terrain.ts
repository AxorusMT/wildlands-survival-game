import { clamp } from '../../core/math.ts';
import { itemName } from '../../data/items.ts';
import { TILE, TILE_COLS, TILE_ROWS, WORLD_H } from '../../data/world.ts';
import { RULES } from '../rules.ts';

import { System } from './System.ts';

export class Terrain extends System {
  tileAt(tx: number, ty: number) {
    return tx < 0 || ty < 0 || tx >= TILE_COLS || ty >= TILE_ROWS
      ? 0
      : this.game.s.tiles[ty * TILE_COLS + tx] || 0;
  }
  groundTopAt(x: number) {
    const tx = clamp(Math.floor(x / TILE), 0, TILE_COLS - 1);
    for (let ty = 0; ty < TILE_ROWS; ty++) if (this.tileAt(tx, ty)) return ty * TILE;
    return WORLD_H - TILE;
  }
  // The first standing surface at or below y, so cave objects rest on the passage floor.
  floorNear(x: number, y: number) {
    const tx = clamp(Math.floor(x / TILE), 0, TILE_COLS - 1);
    let ty = clamp(Math.floor(y / TILE), 0, TILE_ROWS - 1);
    while (ty > 0 && this.tileAt(tx, ty) && this.tileAt(tx, ty - 1)) ty--;
    for (let i = 0; i < 8 && ty < TILE_ROWS; i++, ty++)
      if (this.tileAt(tx, ty) && !this.tileAt(tx, ty - 1)) return ty * TILE - 1;
    return y;
  }
  mineTileAt(x: number, y: number) {
    const tx = Math.floor(x / TILE),
      ty = Math.floor(y / TILE),
      kind = this.tileAt(tx, ty);
    if (!kind) return { ok: false, reason: 'There is no solid ground there.' };
    if (Math.hypot(x - this.game.s.player.x, y - (this.game.s.player.y - 24)) > RULES.mineReach)
      return { ok: false, reason: 'Move closer to mine this tile.' };
    const need = kind === 6 ? 4 : kind === 5 ? 2 : kind === 2 ? 1 : 0;
    if (this.game.toolTier('pick') < need)
      return { ok: false, reason: 'This ground needs a tier ' + need + ' pickaxe.' };
    if (this.game.s.vitals.stamina < RULES.mineStamina)
      return { ok: false, reason: 'Too exhausted to mine.' };
    this.game.s.vitals.stamina -= RULES.mineStamina;
    this.game.s.tiles[ty * TILE_COLS + tx] = 0;
    const yieldItem = (
      { 1: 'dirt', 2: 'stone', 3: 'dirt', 4: 'clay', 5: 'ice', 6: 'stone' } as Record<
        number,
        string
      >
    )[kind];
    this.game.add(yieldItem, 1);
    if (kind === 6 && this.game.rng() < 0.22) this.game.add('obsidian', 1);
    this.game.say('Mined ' + itemName(yieldItem).toLowerCase() + '.', 'good');
    return { ok: true, item: yieldItem };
  }
}
