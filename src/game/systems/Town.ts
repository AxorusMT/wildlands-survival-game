import { dist } from '../../core/math.ts';
import type { Animal, Structure } from '../../core/types.ts';
import { ITEMS, itemName } from '../../data/items.ts';
import { RECIPES } from '../../data/recipes.ts';
import {
  BASE_VALUE,
  DOOR_TILE,
  HOUSE_NEEDS,
  ROOM_SIZE,
  SETTLERS,
  settlerById,
} from '../../data/town.ts';
import { TILE, TILE_COLS, dimensionAt, dungeonAt } from '../../data/world.ts';
import { uniqueId } from '../ids.ts';
import { RULES } from '../rules.ts';

import { System } from './System.ts';

/** A room found by flood fill: its open cells and what it is missing to be a home. */
export interface Room {
  cells: Set<number>;
  missing: string[];
  seat?: Structure;
}

/**
 * Homes and settlers. A home is an enclosed room with back walls everywhere, a door, a seat, a
 * table, and a light. Settlers arrive as the expedition reaches milestones, move into free homes,
 * and trade in silver marks. Doors are solid tiles while closed, drawn by their structure.
 */
export class Town extends System {
  private checkAt = 0;
  private valueMemo = new Map<string, number>();

  // ─── Doors ─────────────────────────────────────────────────────────────────
  /** Places a door in a two-tile gap standing on solid ground. */
  placeDoor(x: number, y: number) {
    const tx = Math.floor(x / TILE);
    let ty = Math.floor(y / TILE);
    // Find the floor below the cursor.
    for (let i = 0; i < 4 && !this.game.tileAt(tx, ty + 1); i++) ty++;
    if (!this.game.tileAt(tx, ty + 1))
      return { ok: false, reason: 'A door must stand on solid ground.' };
    if (this.game.tileAt(tx, ty) || this.game.tileAt(tx, ty - 1))
      return { ok: false, reason: 'A door needs a gap two tiles tall.' };
    const st: Structure = {
      id: uniqueId(),
      type: 'door',
      x: tx * TILE + TILE / 2,
      y: (ty + 1) * TILE - 1,
      fuel: 0,
      water: 0,
      store: {},
      crop: null,
      plantedAt: 0,
      triggeredAt: 0,
    };
    this.game.s.structures.push(st);
    this.setDoor(st, false);
    return { ok: true, structure: st };
  }
  private doorCells(st: Structure): [number, number][] {
    const tx = Math.floor(st.x / TILE),
      ty = Math.floor(st.y / TILE);
    return [
      [tx, ty],
      [tx, ty - 1],
    ];
  }
  /** Opens or closes a door; closed doors fill their tiles. */
  setDoor(st: Structure, open: boolean) {
    for (const [tx, ty] of this.doorCells(st)) this.game.setTile(tx, ty, open ? 0 : DOOR_TILE);
    st.crop = open ? 'open' : null;
    st.triggeredAt = this.game.s.elapsed;
  }
  toggleDoor(st: Structure) {
    this.setDoor(st, st.crop !== 'open');
    this.game.sound('door', st.x, st.y - 30);
    return { ok: true };
  }
  /** The door whose tile this is, if any. */
  doorAt(tx: number, ty: number) {
    return this.game.s.structures.find(
      (st) => st.type === 'door' && this.doorCells(st).some(([x, y]) => x === tx && y === ty),
    );
  }
  /** Walking into a closed door opens it. */
  push(tx: number, ty: number) {
    const door = this.doorAt(tx, ty);
    if (door && door.crop !== 'open') this.toggleDoor(door);
    return !!door;
  }
  removeDoor(st: Structure) {
    for (const [tx, ty] of this.doorCells(st))
      if (this.game.tileAt(tx, ty) === DOOR_TILE) this.game.setTile(tx, ty, 0);
    this.game.s.structures = this.game.s.structures.filter((x) => x !== st);
  }

  // ─── Rooms ─────────────────────────────────────────────────────────────────
  /** Flood-fills the open cells around a tile, stopping at solid ground and doors. */
  roomAt(tx0: number, ty0: number): Room {
    const cells = new Set<number>(),
      missing: string[] = [],
      queue: [number, number][] = [[tx0, ty0]];
    let leak = false;
    if (this.game.tileAt(tx0, ty0)) return { cells, missing: ['That spot is solid.'] };
    while (queue.length) {
      const [tx, ty] = queue.pop()!,
        key = ty * TILE_COLS + tx;
      if (cells.has(key) || this.game.tileAt(tx, ty) || this.doorAt(tx, ty)) continue;
      cells.add(key);
      if (cells.size > ROOM_SIZE.max) {
        leak = true;
        break;
      }
      if (!this.game.wallAt(tx, ty)) {
        leak = true;
        break;
      }
      queue.push([tx + 1, ty], [tx - 1, ty], [tx, ty + 1], [tx, ty - 1]);
    }
    if (leak)
      missing.push(
        cells.size > ROOM_SIZE.max
          ? 'The room is too big or not enclosed.'
          : 'Back walls are missing.',
      );
    else if (cells.size < ROOM_SIZE.min) missing.push('The room is too small.');
    const inside = (st: Structure) =>
      cells.has(Math.floor((st.y - 4) / TILE) * TILE_COLS + Math.floor(st.x / TILE));
    const inRoom = this.game.s.structures.filter(inside);
    const has = (list: readonly string[]) => inRoom.find((st) => list.includes(st.type));
    const seat = has(HOUSE_NEEDS.seat),
      door = this.game.s.structures.some(
        (st) =>
          st.type === 'door' &&
          this.doorCells(st).some(([x, y]) =>
            [
              [1, 0],
              [-1, 0],
            ].some(([dx, dy]) => cells.has((y + dy) * TILE_COLS + x + dx)),
          ),
      );
    if (!leak) {
      if (!seat) missing.push('A chair or bed is needed.');
      if (!has(HOUSE_NEEDS.table)) missing.push('A table is needed.');
      if (!has(HOUSE_NEEDS.light)) missing.push('A light is needed.');
      if (!door) missing.push('A door is needed.');
      const x = tx0 * TILE,
        y = ty0 * TILE;
      if (dungeonAt(x, y) || dimensionAt(x)) missing.push('No one will live here.');
    }
    return { cells, missing, seat };
  }
  /** What a seat's room lacks, as a message. */
  inspect(st: Structure) {
    const room = this.roomAt(Math.floor(st.x / TILE), Math.floor((st.y - 4) / TILE));
    const owner = Object.entries(this.game.s.town.homes).find(
      ([, h]) => Math.abs(h.x - st.x) < 8 && Math.abs(h.y - st.y) < 8,
    );
    if (!room.missing.length) {
      const who = owner ? settlerById(owner[0]) : null;
      this.game.say(
        who ? `${who.name} ${who.title} lives here.` : 'This room would make a fine home.',
        'good',
      );
    } else this.game.say('Not yet a home: ' + room.missing.join(' '), 'danger');
    return { ok: true };
  }

  // ─── Settlers ──────────────────────────────────────────────────────────────
  settlers(): Animal[] {
    return this.game.s.animals.filter((a) => a.settler);
  }
  unlocked(id: string) {
    const st = settlerById(id);
    if (!st) return false;
    const [key, n] = st.unlock;
    if (key === 'sigils') return this.game.s.rift.sigils.length >= n;
    return (this.game.s.tutorial.tally[key] ?? 0) >= n;
  }
  /** Moves an unlocked settler into a free home, one at a time. */
  private moveIn() {
    const s = this.game.s,
      present = new Set(this.settlers().map((a) => a.settler));
    const waiting = SETTLERS.filter((st) => !present.has(st.id) && this.unlocked(st.id));
    if (!waiting.length) return;
    const claimed = Object.values(s.town.homes);
    for (const seat of s.structures.filter((st) => HOUSE_NEEDS.seat.includes(st.type as 'chair'))) {
      if (claimed.some((h) => Math.abs(h.x - seat.x) < 8 && Math.abs(h.y - seat.y) < 8)) continue;
      const room = this.roomAt(Math.floor(seat.x / TILE), Math.floor((seat.y - 4) / TILE));
      if (room.missing.length) continue;
      // One settler to a room, however many seats it has.
      const taken = claimed.some((h) =>
        room.cells.has(Math.floor((h.y - 4) / TILE) * TILE_COLS + Math.floor(h.x / TILE)),
      );
      if (taken) continue;
      const who = waiting[0];
      s.town.homes[who.id] = { x: seat.x, y: seat.y };
      this.game.world.addAnimal(who.id, seat.x + 20, seat.y, {
        body: true,
        vx: 0,
        vy: 0,
        settler: who.id,
      });
      this.game.sound('victory', seat.x, seat.y);
      this.game.say(`${who.name} ${who.title} has moved in!`, 'victory');
      this.game.progress.record('settler:' + who.id);
      return;
    }
  }
  /** Settlers whose homes fall apart become homeless and wander off. */
  private checkHomes() {
    const s = this.game.s;
    for (const [id, h] of Object.entries(s.town.homes)) {
      const seat = s.structures.find((st) => Math.abs(st.x - h.x) < 8 && Math.abs(st.y - h.y) < 8);
      const room = seat && this.roomAt(Math.floor(seat.x / TILE), Math.floor((seat.y - 4) / TILE));
      if (room && !room.missing.length) continue;
      delete s.town.homes[id];
      s.animals = s.animals.filter((a) => a.settler !== id);
      const who = settlerById(id);
      if (who) this.game.say(`${who.name} ${who.title} has no home and has left.`, 'danger');
    }
  }
  /** Settlers housed near the player (a town lifts the spirits). */
  townNear(radius = 1400) {
    const p = this.game.s.player;
    return this.settlers().filter(
      (a) => Math.abs(a.homeX - p.x) < radius && Math.abs(a.homeY - p.y) < 600,
    ).length;
  }
  talk(a: Animal) {
    const who = settlerById(a.settler ?? '');
    if (!who) return { ok: false };
    const line = who.lines[Math.floor(this.game.rng() * who.lines.length)];
    this.game.say(`${who.name}: "${line}"`);
    return { ok: true, action: 'shop', settler: who.id };
  }

  // ─── Trade ─────────────────────────────────────────────────────────────────
  /** What an item is worth in silver marks: raw materials by table, crafts by their parts. */
  valueOf(id: string, depth = 0): number {
    const memo = this.valueMemo.get(id);
    if (memo !== undefined) return memo;
    let v = BASE_VALUE[id];
    if (v === undefined) {
      const stock = SETTLERS.flatMap((st) => st.stock).find(([item]) => item === id);
      const r = RECIPES.find((x) => x.id === id);
      if (stock) v = stock[1];
      else if (r && depth < 8)
        v = Math.ceil(
          (Object.entries(r.cost).reduce(
            (n, [item, q]) => n + this.valueOf(item, depth + 1) * q,
            0,
          ) *
            1.25) /
            (r.yield ?? 1),
        );
      else v = ITEMS[id]?.[1] === 'trophy' ? 100 : 8;
    }
    this.valueMemo.set(id, v);
    return v;
  }
  sellPrice(id: string) {
    return id === 'coin' ? 0 : Math.max(1, Math.floor(this.valueOf(id) / 4));
  }
  private nearSettler(id?: string) {
    const p = this.game.s.player;
    return this.settlers().find(
      (a) => (!id || a.settler === id) && dist(a, p) < RULES.interactReach + 60,
    );
  }
  buy(settlerId: string, item: string, qty = 1) {
    const who = settlerById(settlerId),
      offer = who?.stock.find(([id]) => id === item);
    if (!who || !offer) return { ok: false, reason: 'That is not for sale.' };
    if (!this.nearSettler(settlerId)) return { ok: false, reason: `Stand beside ${who.name}.` };
    const cost = offer[1] * qty;
    if (this.game.count('coin') < cost)
      return { ok: false, reason: `That costs ${cost} silver marks.` };
    this.game.remove('coin', cost);
    this.game.add(item, qty);
    this.game.sound('coin');
    this.game.say(`Bought ${qty} ${itemName(item)} for ${cost} marks.`, 'good');
    return { ok: true };
  }
  sell(item: string, qty = 1) {
    if (!this.nearSettler()) return { ok: false, reason: 'Stand beside a settler to trade.' };
    if (item === 'coin' || this.game.count(item) < qty)
      return { ok: false, reason: 'You do not have that.' };
    const price = this.sellPrice(item) * qty;
    this.game.remove(item, qty);
    this.game.add('coin', price);
    this.game.sound('coin');
    this.game.say(`Sold ${qty} ${itemName(item)} for ${price} marks.`, 'good');
    return { ok: true };
  }

  // ─── Beds ──────────────────────────────────────────────────────────────────
  /** Resting in a bed sets where you wake after a fall, and sleeps through the night. */
  sleep(bed: Structure) {
    const s = this.game.s;
    s.spawn = { x: bed.x, y: bed.y };
    s.vitals.fatigue = Math.max(0, s.vitals.fatigue - 45);
    s.vitals.stamina = 100;
    if (this.game.isNight()) {
      const now = this.game.timeOfDay(),
        until = (6 * 60 - now + 24 * 60) % (24 * 60);
      s.elapsed += until / RULES.minutesPerSecond;
      this.game.say('You sleep through the night. You will wake here if you fall.', 'good');
    } else this.game.say('Your bed is made. You will wake here if you fall.', 'good');
    this.game.sound('rest');
    return { ok: true };
  }

  update(dt: number) {
    const s = this.game.s;
    // Open doors swing shut once nobody stands in them.
    for (const st of s.structures)
      if (st.type === 'door' && st.crop === 'open' && s.elapsed - st.triggeredAt > 2) {
        const busy = [s.player, ...s.animals.filter((a) => !a.deadUntil)].some(
          (o) => Math.abs(o.x - st.x) < 30 && o.y > st.y - 70 && o.y < st.y + 10,
        );
        if (!busy) this.setDoor(st, false);
        else st.triggeredAt = s.elapsed;
      }
    this.checkAt -= dt;
    if (this.checkAt > 0) return;
    this.checkAt = 4;
    this.checkHomes();
    this.moveIn();
  }
}
