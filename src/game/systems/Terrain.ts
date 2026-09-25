import { clamp } from '../../core/math.ts';
import { itemName } from '../../data/items.ts';
import { MYC } from '../../data/dimensions.ts';
import {
  MINE_TIER,
  TILE,
  TILE_COLS,
  TILE_ROWS,
  TILE_YIELD,
  WORLD_H,
  POCKET,
  dimensionAt,
  naturalWallKind,
} from '../../data/world.ts';
import { activeRealm } from '../../data/realms/index.ts';
import { DOOR_TILE } from '../../data/town.ts';
import { RULES } from '../rules.ts';

import { System } from './System.ts';

export class Terrain extends System {
  tileAt(tx: number, ty: number) {
    return tx < 0 || ty < 0 || tx >= TILE_COLS || ty >= TILE_ROWS
      ? 0
      : this.game.s.tiles[ty * TILE_COLS + tx] || 0;
  }
  /** The back wall at a tile (a ground kind), placed by the player or the world's own; 0 is none. */
  wallAt(tx: number, ty: number) {
    if (tx < 0 || ty < 0 || tx >= TILE_COLS || ty >= TILE_ROWS) return 0;
    const edit = this.game.s.wallEdits[ty * TILE_COLS + tx];
    if (edit !== undefined) return edit < 0 ? 0 : edit;
    return naturalWallKind(tx, ty);
  }
  /** The raw wall edit at a tile, for noticing changes: -2 where the world's own stands. */
  wallEditAt(tx: number, ty: number) {
    return this.game.s.wallEdits[ty * TILE_COLS + tx] ?? -2;
  }
  setWall(tx: number, ty: number, kind: number) {
    if (tx < 0 || ty < 0 || tx >= TILE_COLS || ty >= TILE_ROWS) return;
    this.game.s.wallEdits[ty * TILE_COLS + tx] = kind > 0 ? kind : -1;
  }
  /** Changes one tile and remembers the change for the field record. */
  setTile(tx: number, ty: number, kind: number) {
    if (tx < 0 || ty < 0 || tx >= TILE_COLS || ty >= TILE_ROWS) return;
    const index = ty * TILE_COLS + tx;
    this.game.s.tiles[index] = kind;
    this.game.s.tileEdits[index] = kind;
  }
  groundTopAt(x: number) {
    const tx = clamp(Math.floor(x / TILE), 0, TILE_COLS - 1),
      dim = dimensionAt(x);
    // Under the Mycelial Deep's rock sky, the ground is the cavern floor, not the ceiling.
    const realm = dim === POCKET ? activeRealm() : null;
    const from =
      dim?.id === 'mycelia'
        ? Math.max(0, Math.floor((MYC.floor(x - dim.start) - 96) / TILE))
        : realm?.tpl.sky === 'cavern'
          ? Math.max(0, Math.floor((realm.geo.floors[0](x - POCKET.start) - 96) / TILE))
          : 0;
    for (let ty = from; ty < TILE_ROWS; ty++) if (this.tileAt(tx, ty)) return ty * TILE;
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
    if (kind === DOOR_TILE) {
      const door = this.game.town.doorAt(tx, ty);
      if (door) {
        this.game.town.removeDoor(door);
        this.game.drops.spawn('door', 1, door.x, door.y - 20);
      } else this.setTile(tx, ty, 0);
      return { ok: true, item: 'door' };
    }
    if (Math.hypot(x - this.game.s.player.x, y - (this.game.s.player.y - 24)) > RULES.mineReach)
      return { ok: false, reason: 'Move closer to mine this tile.' };
    const need = MINE_TIER[kind] ?? 1;
    if (this.game.toolTier('pick') < need)
      return { ok: false, reason: 'This ground needs a tier ' + need + ' pickaxe.' };
    if (this.game.s.vitals.stamina < RULES.mineStamina)
      return { ok: false, reason: 'Too exhausted to mine.' };
    this.game.s.vitals.stamina -= RULES.mineStamina;
    this.setTile(tx, ty, 0);
    const cx = tx * TILE + TILE / 2,
      cy = ty * TILE + TILE / 2,
      spec = TILE_YIELD[kind] ?? { item: 'stone' };
    this.game.event('dig', cx, cy, String(kind));
    this.game.sound(
      kind === 5
        ? 'dig_ice'
        : kind >= 9
          ? 'dig_hell'
          : kind === 2 || kind === 6 || kind === 8
            ? 'dig_stone'
            : 'dig_soil',
      cx,
      cy,
    );
    this.game.drops.spawn(spec.item, 1, cx, cy);
    if (spec.bonus && this.game.rng() < spec.bonus[1]) {
      this.game.drops.spawn(spec.bonus[0], 1, cx, cy);
      this.game.say('Found ' + itemName(spec.bonus[0]).toLowerCase() + ' in the rock!', 'good');
    }
    return { ok: true, item: spec.item };
  }
}
