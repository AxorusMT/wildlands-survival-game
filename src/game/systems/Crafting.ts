import { dist } from '../../core/math.ts';
import { ITEMS, itemName } from '../../data/items.ts';
import { RECIPES } from '../../data/recipes.ts';
import { WEAPONS } from '../../data/resources.ts';
import { TILE, TILE_ROWS, WORLD_H, dimensionAt, regionBounds } from '../../data/world.ts';
import { uniqueId } from '../ids.ts';
import { RULES } from '../rules.ts';

import { RESEARCH_RENOWN, STATION_QUALITY } from '../../data/stations.ts';
import { EVOLUTIONS, WEAPON_CLASS } from '../../data/weapons.ts';

import { System } from './System.ts';

/** Small things that stand close together inside a home. */
const FURNITURE = new Set([
  'chair',
  'table',
  'bed',
  'torch',
  'door',
  'lantern',
  'chest',
  'workbench',
]);

export class Crafting extends System {
  /** Why a recipe cannot be made now, or null if it can. Console-unlocked recipes are free. */
  check(id: string): string | null {
    const r = RECIPES.find((r) => r.id === id);
    if (!r) return 'No such recipe.';
    if (
      id === 'effergy' &&
      (this.game.s.structures.some((x) => x.type === 'effergy') || this.game.count('effergy'))
    )
      return 'Only one Effergy may be owned.';
    if (
      id === 'rift_gate' &&
      (this.game.s.structures.some((x) => x.type === 'rift_gate') || this.game.count('rift_gate'))
    )
      return 'Only one Rift Gate may stand.';
    if (this.free(id)) return null;
    if (r.station && !this.game.near(r.station)) return 'Stand near a ' + itemName(r.station) + '.';
    if (r.station === 'campfire' && !this.game.nearLitFire()) return 'The campfire needs fuel.';
    if (!this.game.canAfford(r.cost)) return 'More materials are needed.';
    return null;
  }
  /** Studies an item at a research desk: it is used up, and its uses are revealed. */
  study(id: string) {
    if (!this.game.near('research_desk') && !this.game.dev.god)
      return { ok: false, reason: 'Study at a research desk.' };
    if (!this.game.count(id)) return { ok: false, reason: 'You carry none to study.' };
    if ((this.game.s.tutorial.tally['study:' + id] ?? 0) > 0)
      return { ok: false, reason: 'You have already studied it.' };
    this.game.remove(id);
    this.game.progress.record('study:' + id);
    this.game.skills.gain(RESEARCH_RENOWN);
    const uses = RECIPES.filter((r) => r.cost[id]).map((r) => itemName(r.id).toLowerCase());
    const evo = WEAPON_CLASS[id] ? EVOLUTIONS[WEAPON_CLASS[id][0]] : null;
    this.game.sound('page');
    this.game.say(
      `Studied ${itemName(id).toLowerCase()}.` +
        (uses.length
          ? ` It goes into ${uses.slice(0, 6).join(', ')}${uses.length > 6 ? ', and more' : ''}.`
          : '') +
        (evo
          ? ` At +5 it may become ${evo[0].map((e) => e.name).join(' or ')}; at +10, ${evo[1].map((e) => e.name).join(' or ')}.`
          : ''),
      'good',
    );
    return { ok: true, reveals: uses };
  }
  private free(id: string) {
    return this.game.dev.unlocked.has(id);
  }
  craft(id: string) {
    const reason = this.check(id);
    if (reason) return { ok: false, reason };
    const r = RECIPES.find((r) => r.id === id)!;
    if (!this.free(id))
      for (const [item, qty] of Object.entries(r.cost)) this.game.remove(item, qty);
    // Finer stations turn out finer weapons.
    this.game.armoury.craftLuck = Math.max(
      1,
      ...Object.entries(STATION_QUALITY)
        .filter(([st]) => this.game.near(st) && this.game.near(st)!.type === st)
        .map(([, k]) => k),
    );
    this.game.add(id, r.yield ?? 1);
    this.game.armoury.craftLuck = 1;
    this.game.sound(
      r.station === 'forge' || r.station === 'furnace'
        ? 'craft_anvil'
        : r.station === 'campfire' || r.station === 'drying_rack'
          ? 'craft_cook'
          : r.station === 'apothecary'
            ? 'craft_brew'
            : 'craft_wood',
    );
    this.game.progress.record('craft:' + id);
    this.game.say('Made ' + (r.yield ? r.yield + ' ' : '') + itemName(id) + '.', 'good');
    if (ITEMS[id][1] === 'structure' && id !== 'torch') this.game.s.placing = id;
    if (WEAPONS[id] && WEAPONS[id][0] > WEAPONS[this.game.s.player.weapon][0])
      this.game.s.player.weapon = id;
    return { ok: true };
  }
  place(id: string, x: number, y: number) {
    if (ITEMS[id]?.[1] !== 'structure' || !this.game.count(id))
      return { ok: false, reason: 'That structure is not in your pack.' };
    if (
      (id === 'effergy' || id === 'rift_gate') &&
      this.game.s.structures.some((st) => st.type === id)
    )
      return { ok: false, reason: 'Only one ' + itemName(id) + ' may stand.' };
    if (id === 'waystone' && dimensionAt(x))
      return { ok: false, reason: 'A Waystone must stand in the wildlands.' };
    if (dist({ x, y }, this.game.s.player) > RULES.placeReach)
      return { ok: false, reason: 'Place it within reach.' };
    const [lo, hi] = regionBounds(x);
    if (
      x < lo + RULES.placeEdgePadding + 32 ||
      y < RULES.placeEdgePadding ||
      x > hi - RULES.placeEdgePadding - 32 ||
      y > WORLD_H - RULES.placeEdgePadding
    )
      return { ok: false, reason: 'Too close to the edge.' };
    if (id === 'door') {
      const r = this.game.town.placeDoor(x, y);
      if (r.ok) {
        this.game.remove(id);
        this.game.s.placing = null;
        this.game.sound('place', x, y);
        this.game.progress.record('place:door');
      }
      return r;
    }
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
          dist(st, { x, y }) <
          (id === 'platform' || st.type === 'platform'
            ? RULES.platformSpacing
            : FURNITURE.has(id) || FURNITURE.has(st.type)
              ? 22
              : RULES.structureSpacing),
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
    if (id === 'rift_gate') this.game.realms.socket();
    this.game.sound('place', x, y);
    this.game.s.placing = null;
    this.game.progress.record('place:' + id);
    this.game.say(itemName(id) + ' placed.', 'good');
    return { ok: true, structure: st };
  }
}
