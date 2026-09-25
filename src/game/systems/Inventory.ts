import type { InventoryEntry } from '../../core/types.ts';
import { ITEMS } from '../../data/items.ts';
import { TOOL_TIERS } from '../../data/resources.ts';
import { RULES } from '../rules.ts';

import { System } from './System.ts';

export class Inventory extends System {
  count(id: string) {
    return this.game.s.inventory.reduce((n, entry) => n + (entry.id === id ? entry.qty : 0), 0);
  }
  /** Fresh, then stale (less nourishing), spoiled (may sicken), and at last rotten. */
  itemState(entry: InventoryEntry): 'stable' | 'fresh' | 'stale' | 'spoiled' | 'rotten' {
    const life = ITEMS[entry.id]?.[2] || 1;
    return entry.fresh === undefined
      ? 'stable'
      : entry.fresh <= 0
        ? 'rotten'
        : entry.fresh < life * 0.08
          ? 'spoiled'
          : entry.fresh < life * RULES.staleAtFraction
            ? 'stale'
            : 'fresh';
  }
  add(id: string, qty = 1, options: { fresh?: number } = {}) {
    const perish = ITEMS[id]?.[2];
    if (perish) {
      for (let i = 0; i < qty; i++)
        this.game.s.inventory.push({ id, qty: 1, fresh: options.fresh ?? perish });
    } else {
      const found = this.game.s.inventory.find((e) => e.id === id && e.fresh === undefined);
      if (found) found.qty += qty;
      else this.game.s.inventory.push({ id, qty });
    }
    this.game.progress.record(id, qty);
    this.game.equipment.offer(id);
    // A weapon's quality is rolled the first time it is found; realm finds run better.
    const realm = this.game.s.pocket;
    this.game.armoury.acquire(id, realm && this.game.pocket.here() ? 1 + realm.tier * 0.25 : 1);
  }
  remove(id: string, qty = 1) {
    if (this.count(id) < qty) return false;
    // Consume older food first, unless that food has already spoiled.
    const entries = this.game.s.inventory
      .filter((e) => e.id === id)
      .sort((a, b) => (a.fresh ?? Infinity) - (b.fresh ?? Infinity));
    for (const e of entries) {
      const n = Math.min(qty, e.qty);
      e.qty -= n;
      qty -= n;
      if (!qty) break;
    }
    this.game.s.inventory = this.game.s.inventory.filter((e) => e.qty > 0);
    this.game.equipment.tidy();
    return true;
  }
  canAfford(cost: Record<string, number>) {
    return Object.entries(cost).every(([id, n]) => this.count(id) >= n);
  }
  toolTier(kind: string) {
    return Object.entries(TOOL_TIERS).reduce(
      (best, [id, [tool, tier]]) => (tool === kind && this.count(id) ? Math.max(best, tier) : best),
      0,
    );
  }
}
