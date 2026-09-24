import { reserveIds } from './ids.ts';
import { clamp } from '../core/math.ts';
import { seededRandom } from '../core/random.ts';
import type { SaveStorage, Structure } from '../core/types.ts';
import { NODES } from '../data/resources.ts';
import { BIOME_CENTERS, WORLD_W } from '../data/world.ts';
import { RULES } from './rules.ts';

import { System } from './systems/System.ts';

export class SaveSystem extends System {
  save(storage: SaveStorage = globalThis.localStorage, silent = false) {
    this.game.s.lastSave = Date.now();
    storage.setItem(RULES.saveKey, JSON.stringify(this.game.s));
    if (!silent) this.game.say('Field record saved.', 'good');
    return true;
  }
  load(storage: SaveStorage = globalThis.localStorage) {
    const raw = storage.getItem(RULES.saveKey);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (![1, 2, 3].includes(parsed.version)) return false;
    const legacy = parsed.version < 3;
    const oldIds = [
      ...(parsed.nodes || []),
      ...(parsed.animals || []),
      ...(parsed.structures || []),
      ...(parsed.caches || []),
    ].map((x) => x.id);
    reserveIds(Math.max(...oldIds, 0));
    if (legacy) {
      const scale = parsed.version === 1 ? 5 / 3 : 1;
      const oldGrid = [
        ['tundra', 'taiga', 'alpine'],
        ['coast', 'meadow', 'forest'],
        ['marsh', 'desert', 'badlands'],
      ];
      const remap = (x: number, y: number) => {
        const ox = clamp(x * scale, 0, 4799),
          oy = clamp(y * scale, 0, 3599),
          col = Math.floor(ox / 1600),
          row = Math.floor(oy / 1200);
        return clamp(
          BIOME_CENTERS[oldGrid[row][col]][0] + ((ox % 1600) - 800) * 0.6,
          30,
          WORLD_W - 30,
        );
      };
      parsed.player.x = remap(parsed.player.x, parsed.player.y);
      parsed.player.y = this.game.groundTopAt(parsed.player.x) + 1;
      Object.assign(parsed.player, { vx: 0, vy: 0, grounded: true, coat: false, boots: false });
      parsed.structures.forEach((st: Structure) => {
        st.x = remap(st.x, st.y);
        st.y = this.game.groundTopAt(st.x) - 1;
        st.water = 0;
        st.store = {};
        st.triggeredAt = 0;
      });
      parsed.nodes = [];
      parsed.animals = [];
      parsed.caches = [];
      parsed.tiles = [];
      if (parsed.altar) parsed.altar.activeBoss = null;
      parsed.version = 3;
      this.game.s = parsed;
      this.game.rng = seededRandom(parsed.seed);
      this.game.messages = [];
      this.game.world.generate();
    } else {
      this.game.s = parsed;
      this.game.rng = seededRandom(parsed.seed + Math.floor(parsed.elapsed));
      this.game.messages = [];
    }
    if (!this.game.s.layout) {
      if (!legacy) {
        this.game.s.nodes = [];
        this.game.world.generateNodes();
      }
      this.game.s.layout = 2;
    }
    this.game.s.chapter ??= 0;
    this.game.s.discoveries ??= ['meadow'];
    this.game.progress.advanceChapter();
    const away = clamp((Date.now() - parsed.lastSave) / 1000, 0, RULES.maxOfflineSeconds);
    // The field record ages food and fuel while the expedition is closed.
    this.game.survival.advanceDecay(away);
    this.game.s.elapsed += away;
    for (const n of this.game.s.nodes) {
      if (n.hp <= 0 && this.game.s.elapsed >= n.depletedUntil) n.hp = NODES[n.kind].hp;
      // Older records stored cave finds at the passage midline; settle them on the floor.
      if (n.underground) n.y = this.game.floorNear(n.x, n.y);
    }
    this.game.say('Field record reopened. ' + Math.round(away) + ' seconds passed.', 'good');
    return true;
  }
}
