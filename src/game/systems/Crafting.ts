import { dist } from '../../core/math.ts';
import { ITEMS, itemName } from '../../data/items.ts';
import { RECIPES } from '../../data/recipes.ts';
import { WEAPONS } from '../../data/resources.ts';
import { TILE, TILE_ROWS, WORLD_H, WORLD_W } from '../../data/world.ts';
import { uniqueId } from '../ids.ts';
import { RULES } from '../rules.ts';

import { System } from './System.ts';

export class Crafting extends System {
  craft(id: string) {
    const r = RECIPES.find((r) => r.id === id);
    if (!r) return { ok: false, reason: 'No such recipe.' };
    if (
      id === 'effergy' &&
      (this.game.s.structures.some((x) => x.type === 'effergy') || this.game.count('effergy'))
    )
      return { ok: false, reason: 'Only one Effergy may be owned.' };
    if (r.station && !this.game.near(r.station))
      return { ok: false, reason: 'Stand near a ' + itemName(r.station) + '.' };
    if (r.station === 'campfire' && !this.game.nearLitFire())
      return { ok: false, reason: 'The campfire needs fuel.' };
    if (!this.game.canAfford(r.cost)) return { ok: false, reason: 'More materials are needed.' };
    for (const [item, qty] of Object.entries(r.cost)) this.game.remove(item, qty);
    this.game.add(id);
    this.game.progress.record('craft:' + id);
    this.game.say('Made ' + itemName(id) + '.', 'good');
    if (ITEMS[id][1] === 'structure') this.game.s.placing = id;
    if (WEAPONS[id] && WEAPONS[id][0] > WEAPONS[this.game.s.player.weapon][0])
      this.game.s.player.weapon = id;
    return { ok: true };
  }
  place(id: string, x: number, y: number) {
    if (ITEMS[id]?.[1] !== 'structure' || !this.game.count(id))
      return { ok: false, reason: 'That structure is not in your pack.' };
    if (id === 'effergy' && this.game.s.structures.some((st) => st.type === id))
      return { ok: false, reason: 'Only one Effergy may be owned.' };
    if (dist({ x, y }, this.game.s.player) > RULES.placeReach)
      return { ok: false, reason: 'Place it within reach.' };
    if (
      x < RULES.placeEdgePadding ||
      y < RULES.placeEdgePadding ||
      x > WORLD_W - RULES.placeEdgePadding ||
      y > WORLD_H - RULES.placeEdgePadding
    )
      return { ok: false, reason: 'Too close to the edge.' };
    if (id !== 'platform') {
      let support = null;
      const tx = Math.floor(x / TILE);
      for (
        let ty = Math.floor(y / TILE);
        ty < Math.min(TILE_ROWS, Math.floor((y + 116) / TILE) + 1);
        ty++
      ) {
        if (this.game.tileAt(tx, ty)) {
          support = ty * TILE;
          break;
        }
      }
      if (support === null) return { ok: false, reason: 'Place this on solid ground.' };
      y = support - 1;
    }
    if (
      this.game.s.structures.some(
        (st) =>
          dist(st, { x, y }) < (id === 'platform' ? RULES.platformSpacing : RULES.structureSpacing),
      )
    )
      return { ok: false, reason: 'Leave room between structures.' };
    this.game.remove(id);
    const st = {
      id: uniqueId(),
      type: id,
      x,
      y,
      fuel:
        id === 'campfire' ? RULES.campfireInitialFuel : id === 'lantern' ? RULES.lanternRefuel : 0,
      water: 0,
      store: {},
      crop: null,
      plantedAt: 0,
      triggeredAt: 0,
    };
    this.game.s.structures.push(st);
    this.game.s.placing = null;
    this.game.progress.record('place:' + id);
    this.game.say(itemName(id) + ' placed.', 'good');
    return { ok: true, structure: st };
  }
}
