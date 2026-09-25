import { clamp, dist } from '../../core/math.ts';
import type { Interactable, ResourceNode, Structure } from '../../core/types.ts';
import { ITEMS, itemName } from '../../data/items.ts';
import { NODES, nodeForm } from '../../data/resources.ts';
import { RULES } from '../rules.ts';

import { System } from './System.ts';

export class Interaction extends System {
  nearestInteractable(radius: number = RULES.interactReach) {
    const p = this.game.s.player;
    const objects: Interactable[] = [
      ...this.game.s.nodes
        .filter((n) => n.hp > 0)
        .map((n) => ({ object: n, type: 'node' as const, d: dist(n, p) })),
      ...this.game.s.structures.map((st) => ({
        object: st,
        type: 'structure' as const,
        d: dist(st, p),
      })),
      ...this.game.s.caches
        .filter((c) => !c.opened)
        .map((c) => ({ object: c, type: 'cache' as const, d: dist(c, p) })),
    ]
      .filter((x) => x.d < radius)
      .sort((a, b) => a.d - b.d);
    return objects[0] || null;
  }
  interact() {
    const near = this.nearestInteractable();
    if (!near) return { ok: false, reason: 'Nothing is within reach.' };
    if (near.type === 'node') return this.gather(near.object);
    if (near.type === 'cache') {
      const c = near.object;
      c.opened = true;
      this.game.sound('open', c.x, c.y);
      const deep: Record<string, [string, string]> = {
        lower_mines: ['iron_ingot', 'crystal'],
        upper_hell: ['steel_ingot', 'obsidian'],
      };
      const loot = c.layer
        ? deep[c.layer]
        : (
            {
              coast: ['salt', 'reeds'],
              marsh: ['herb', 'clay'],
              forest: ['resin', 'copper_ore'],
              meadow: ['bread', 'flint'],
              taiga: ['coal', 'hide'],
              tundra: ['ice', 'iron_ore'],
              alpine: ['crystal', 'iron_ore'],
              desert: ['sulfur', 'cactus_fruit'],
              badlands: ['obsidian', 'coal'],
            } as Record<string, [string, string]>
          )[c.biome];
      this.game.add(loot[0], 2);
      this.game.add(loot[1], 2);
      this.game.say(
        'Opened an abandoned field cache: 2 ' +
          itemName(loot[0]) +
          ', 2 ' +
          itemName(loot[1]) +
          '.',
        'good',
      );
      return { ok: true, action: 'cache' };
    }
    const st = near.object;
    if (st.type === 'bedroll') {
      this.game.s.vitals.fatigue = clamp(this.game.s.vitals.fatigue - 32, 0, RULES.maxVital);
      this.game.s.vitals.stamina = 100;
      this.game.s.elapsed += 90;
      this.game.sound('rest');
      this.game.say('Rested beneath the open sky. Fatigue eases.', 'good');
    } else if (st.type === 'campfire') {
      if (this.game.count('wood')) {
        this.game.remove('wood');
        st.fuel += RULES.campfireRefuel;
        this.game.sound('place', st.x, st.y, 0.7);
        this.game.say('Fed the campfire with wood.', 'good');
      } else return { ok: false, reason: 'One wood refuels the campfire.' };
    } else if (st.type === 'icebox') {
      if (this.game.count('ice')) {
        this.game.remove('ice');
        st.fuel += RULES.iceboxRefuel;
        this.game.say('Icebox cooled with fresh ice.', 'good');
      } else return { ok: false, reason: 'One ice refuels the icebox.' };
    } else if (st.type === 'rain_catcher') {
      if (st.water < 1) return { ok: false, reason: 'The rain catcher is empty. Wait for rain.' };
      const amount = Math.min(3, Math.floor(st.water));
      st.water -= amount;
      this.game.add('wild_water', amount);
      this.game.say('Collected ' + amount + ' wild water. Boil it before drinking.', 'good');
    } else if (st.type === 'lantern') {
      if (!this.game.count('resin')) return { ok: false, reason: 'One resin refuels the lantern.' };
      this.game.remove('resin');
      st.fuel += RULES.lanternRefuel;
      this.game.say('Lantern refueled with resin.', 'good');
    } else if (st.type === 'chest') {
      this.game.sound('open', st.x, st.y);
      return { ok: true, action: 'chest', structure: st };
    } else if (st.type === 'farm_plot') {
      if (st.crop && this.game.s.elapsed - st.plantedAt >= RULES.cropGrowthSeconds) {
        this.game.add(st.crop, 5);
        this.game.say('Harvested ' + itemName(st.crop) + '.', 'good');
        st.crop = null;
      } else if (st.crop) return { ok: false, reason: itemName(st.crop) + ' is still growing.' };
      else return { ok: true, action: 'farm', structure: st };
    } else if (st.type === 'effergy') return { ok: true, action: 'beasts' };
    else {
      this.game.say('Standing by the ' + itemName(st.type) + '. Open Recipes to craft.');
      return { ok: true, action: 'recipes' };
    }
    return { ok: true };
  }
  fish() {
    if (!this.game.count('fishing_rod'))
      return { ok: false, reason: 'Make a fishing rod at a workbench.' };
    const water = this.game.s.nodes.find(
      (n) => n.kind === 'water' && dist(n, this.game.s.player) < RULES.fishReach,
    );
    if (!water) return { ok: false, reason: 'Stand by a pool to fish.' };
    if (this.game.s.vitals.stamina < 9) return { ok: false, reason: 'Too tired to fish.' };
    this.game.s.vitals.stamina -= 9;
    this.game.sound('cast');
    if (this.game.rng() < RULES.fishSuccessChance) {
      this.game.sound('catch', water.x, water.y);
      this.game.add('raw_fish');
      this.game.say('Caught a fish. Cook it before eating.', 'good');
      return { ok: true, caught: true };
    }
    this.game.say('The line came back empty.');
    return { ok: true, caught: false };
  }
  storeInChest(chest: Structure, id: string) {
    if (!chest || chest.type !== 'chest' || dist(chest, this.game.s.player) > 110)
      return { ok: false, reason: 'Stand beside the chest.' };
    if (!id || !this.game.count(id)) return { ok: false, reason: 'That item is not in the pack.' };
    if (ITEMS[id]?.[2]) return { ok: false, reason: 'Perishable food needs an icebox.' };
    this.game.remove(id);
    chest.store[id] = (chest.store[id] || 0) + 1;
    this.game.say(itemName(id) + ' stowed.', 'good');
    return { ok: true };
  }
  takeFromChest(chest: Structure, id: string) {
    if (!chest || chest.type !== 'chest' || dist(chest, this.game.s.player) > 110)
      return { ok: false, reason: 'Stand beside the chest.' };
    if (!chest.store[id]) return { ok: false, reason: 'None of that item is stored here.' };
    chest.store[id]--;
    if (!chest.store[id]) delete chest.store[id];
    this.game.add(id);
    this.game.say(itemName(id) + ' taken.', 'good');
    return { ok: true };
  }
  plant(st: Structure, crop: string) {
    if (!st || st.type !== 'farm_plot' || dist(st, this.game.s.player) > 95)
      return { ok: false, reason: 'Stand by a farm plot.' };
    if (st.crop) return { ok: false, reason: 'That plot is planted.' };
    if (!['herb', 'wheat', 'potato'].includes(crop) || !this.game.count(crop))
      return { ok: false, reason: 'A herb, wheat, or potato is needed.' };
    this.game.remove(crop);
    st.crop = crop;
    st.plantedAt = this.game.s.elapsed;
    this.game.say(itemName(crop) + ' planted. Harvest after four minutes.', 'good');
    return { ok: true };
  }
  gather(node: ResourceNode) {
    const p = this.game.s.player;
    if (dist(node, p) > RULES.gatherReach || node.hp <= 0)
      return { ok: false, reason: 'Move closer to the resource.' };
    const spec = NODES[node.kind],
      v = this.game.s.vitals;
    const tier = spec.tool ? this.game.toolTier(spec.tool) : 0;
    if (tier < (spec.req || 0))
      return {
        ok: false,
        reason:
          itemName(node.kind) +
          ' requires a tier ' +
          spec.req +
          (spec.tool === 'axe' ? ' axe.' : ' pickaxe.'),
      };
    if (v.stamina < 7) return { ok: false, reason: 'Too exhausted to gather. Rest or wait.' };
    v.stamina -= 7;
    v.hydration = clamp(v.hydration - 0.4, 0, RULES.maxVital);
    v.hygiene = clamp(v.hygiene - 0.3, 0, RULES.maxVital);
    const roll = () =>
      Math.floor(spec.yield[0] + this.game.rng() * (spec.yield[1] - spec.yield[0] + 1)) +
      (tier >= 3 ? 1 : 0);
    const form = nodeForm(node.kind),
      s = this.game.s;
    node.hitAt = s.elapsed;
    this.game.sound(
      form === 'tree'
        ? 'chop'
        : form === 'mineral'
          ? 'pick'
          : form === 'water'
            ? 'splash'
            : 'pluck',
      node.x,
      node.y - 20,
    );
    if (form === 'water') {
      const qty = roll();
      this.game.add('wild_water', qty);
      this.game.event('chip', node.x, node.y, 'water');
      this.game.say('Gathered ' + qty + ' wild water.', 'good');
      return { ok: true, id: 'wild_water', qty };
    }
    this.game.event('chip', node.x, node.y - (form === 'tree' ? 26 : 10), node.kind);
    if (form === 'plant') {
      // Plants give a handful each pick and grow back once stripped.
      const qty = roll();
      node.hp--;
      if (node.hp <= 0) node.depletedUntil = s.elapsed + spec.regen;
      this.game.drops.spawn(node.kind, qty, node.x, node.y - 14);
      return { ok: true, id: node.kind, qty };
    }
    // Trees and rock take several blows; the last one brings the whole thing down.
    node.hp--;
    if (node.hp > 0) return { ok: true, id: node.kind, qty: 0, hit: true };
    let qty = 0;
    for (let i = 0; i < spec.hp; i++) qty += roll();
    if (form === 'tree') {
      const dir = node.x >= p.x ? 1 : -1;
      node.felledAt = s.elapsed;
      node.fallDir = dir;
      // The stump waits a long while before a sapling takes its place.
      node.depletedUntil = s.elapsed + spec.regen * RULES.treeRegrowthFactor;
      this.game.event('fell', node.x, node.y, node.kind, dir);
      this.game.sound('creak', node.x, node.y - 40);
      this.game.drops.spawn(node.kind, qty, node.x + dir * 70, node.y - 24, RULES.treeFallSeconds);
      this.game.say('Timber! The tree comes down.', 'good');
    } else {
      const index = s.nodes.indexOf(node);
      if (index >= 0) s.nodes.splice(index, 1);
      this.game.event('crumble', node.x, node.y, node.kind);
      this.game.sound('crumble', node.x, node.y);
      this.game.drops.spawn(node.kind, qty, node.x, node.y - 12);
      this.game.say('The ' + itemName(node.kind).toLowerCase() + ' breaks apart.', 'good');
    }
    return { ok: true, id: node.kind, qty };
  }
}
