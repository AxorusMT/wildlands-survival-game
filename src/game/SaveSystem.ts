import { reserveIds } from './ids.ts';
import { clamp } from '../core/math.ts';
import { seededRandom } from '../core/random.ts';
import type { SaveStorage, Structure } from '../core/types.ts';
import { NODES } from '../data/resources.ts';
import { BIOME_CENTERS, BIOME_SPANS, WORLD_W } from '../data/world.ts';
import { RULES } from './rules.ts';

import { System } from './systems/System.ts';

/** World layout version: 3 is the wide, five-layer world. */
export const LAYOUT = 3;
/** Region width in layouts 1 and 2, which laid the same regions out evenly. */
const OLD_REGION_WIDTH = 1200;

export class SaveSystem extends System {
  save(storage: SaveStorage = globalThis.localStorage, silent = false) {
    this.game.s.lastSave = Date.now();
    // The tile grid is rebuilt from the world's geometry; only changed tiles are stored.
    const { tiles: _tiles, ...record } = this.game.s;
    storage.setItem(RULES.saveKey, JSON.stringify(record));
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
        const span = BIOME_SPANS.find((b) => b.id === oldGrid[row][col])!;
        return clamp(
          BIOME_CENTERS[span.id][0] + (((ox % 1600) - 800) / 1600) * (span.end - span.start) * 0.8,
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
      parsed.layout = LAYOUT;
      this.game.s = parsed;
      this.game.rng = seededRandom(parsed.seed);
      this.game.messages = [];
      this.game.world.generate();
    } else {
      this.game.s = parsed;
      this.game.rng = seededRandom(parsed.seed + Math.floor(parsed.elapsed));
      this.game.messages = [];
      if ((parsed.layout ?? 1) < LAYOUT) this.migrateLayout();
      else {
        this.game.s.tiles = this.game.world.generateTiles();
        for (const [index, kind] of Object.entries(this.game.s.tileEdits ?? {}))
          if (+index < this.game.s.tiles.length) this.game.s.tiles[+index] = kind;
      }
    }
    this.game.s.tileEdits ??= {};
    this.game.s.drops ??= [];
    this.game.events = [];
    this.game.s.chapter ??= 0;
    this.game.s.discoveries ??= ['meadow'];
    this.game.progress.advanceChapter();
    const away = clamp((Date.now() - parsed.lastSave) / 1000, 0, RULES.maxOfflineSeconds);
    // The field record ages food and fuel while the expedition is closed.
    this.game.survival.advanceDecay(away);
    this.game.s.elapsed += away;
    for (const n of this.game.s.nodes)
      if (n.hp <= 0 && this.game.s.elapsed >= n.depletedUntil) {
        n.hp = NODES[n.kind].hp;
        delete n.felledAt;
      }
    this.game.say('Field record reopened. ' + Math.round(away) + ' seconds passed.', 'good');
    return true;
  }
  /**
   * Records from the narrow three-layer world keep the expedition (pack, vitals, camp, progress)
   * and move the player and camp to the same place in each wider region; the land is regrown.
   */
  private migrateLayout() {
    const s = this.game.s,
      remap = (x: number) => {
        const i = clamp(Math.floor(x / OLD_REGION_WIDTH), 0, BIOME_SPANS.length - 1),
          span = BIOME_SPANS[i],
          f = clamp(x / OLD_REGION_WIDTH - i, 0, 1);
        return clamp(span.start + f * (span.end - span.start), 30, WORLD_W - 30);
      };
    s.nodes = [];
    s.animals = [];
    s.caches = [];
    if (s.altar) s.altar.activeBoss = null;
    this.game.world.generate();
    s.player.x = remap(s.player.x);
    s.player.y = this.game.groundTopAt(s.player.x) + 1;
    Object.assign(s.player, { vx: 0, vy: 0, grounded: true });
    for (const st of s.structures) {
      st.x = remap(st.x);
      st.y = this.game.groundTopAt(st.x) - 1;
    }
    s.layout = LAYOUT;
    this.game.say('The wilds have grown vast and deep since this record was written.', 'good');
  }
}
