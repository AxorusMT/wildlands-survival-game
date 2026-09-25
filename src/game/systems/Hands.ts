import { dist } from '../../core/math.ts';
import type { GameResult, Point, ResourceNode } from '../../core/types.ts';
import { BLOCKS, RANGED } from '../../data/gear.ts';
import { WALLS, WALL_ITEM } from '../../data/town.ts';
import { ITEMS, itemName } from '../../data/items.ts';
import { NODES, WEAPONS, nodeForm } from '../../data/resources.ts';
import {
  MINE_TIER,
  TILE,
  TILE_COLS,
  TILE_ROWS,
  dungeonAt,
  regionBounds,
} from '../../data/world.ts';
import { uniqueId } from '../ids.ts';
import { RULES } from '../rules.ts';

import { System } from './System.ts';

/** Seconds between uses of each kind of held thing. */
const PACE = { pick: 0.22, axe: 0.34, block: 0.12, melee: 0.34, consume: 0.6, none: 0.3 } as const;

/**
 * Using the held item at the cursor, the way a Terraria hotbar works: picks dig the tile or ore
 * under the cursor, axes chop trees, blocks and torches are placed, weapons swing or fire toward
 * it, and food and potions are consumed.
 */
export class Hands extends System {
  /** Damage dealt to tiles that have not yet broken, by tile index. Not saved. */
  private cracks = new Map<number, number>();
  crackAt(tx: number, ty: number) {
    return this.cracks.get(ty * TILE_COLS + tx) ?? 0;
  }
  /** Where the player is aiming, for the arm and the item in hand. */
  aim(target: Point) {
    const p = this.game.s.player,
      dx = target.x - p.x,
      dy = target.y - (p.y - 30);
    p.aim = Math.atan2(dy, Math.abs(dx));
  }
  private reachable(target: Point, reach = RULES.mineReach + 40) {
    const p = this.game.s.player;
    return Math.hypot(target.x - p.x, target.y - (p.y - 24)) <= reach;
  }
  /** The node under (or right beside) the cursor. */
  nodeAt(target: Point): ResourceNode | null {
    return (
      this.game.s.nodes
        .filter(
          (n) =>
            n.hp > 0 &&
            Math.abs(n.x - target.x) < (nodeForm(n.kind) === 'tree' ? 36 : 26) &&
            target.y < n.y + 12 &&
            target.y > n.y - (nodeForm(n.kind) === 'tree' ? 150 : 44),
        )
        .sort((a, b) => dist(a, target) - dist(b, target))[0] ?? null
    );
  }
  /** One use of the held item toward a world point. Call repeatedly while the button is held. */
  useAt(target: Point): GameResult {
    const s = this.game.s,
      p = s.player;
    if (s.dead) return { ok: false, reason: 'You must recover first.' };
    const held = this.game.equipment.held(),
      kind = this.game.equipment.useKind(held),
      t = s.elapsed;
    this.aim(target);
    const pace = RANGED[held ?? '']
      ? RANGED[held!].delay * this.game.armoury.stats(held!).pace
      : held && WEAPONS[held]
        ? Math.max(0.3, RULES.attackCooldownSeconds * 0.75 * this.game.armoury.stats(held).pace)
        : (PACE[kind as keyof typeof PACE] ?? 0.3);
    if (
      t <
      (p.usedAt ?? -9) +
        pace *
          (this.game.equipment.has('buff:mining') && (kind === 'pick' || kind === 'axe') ? 0.7 : 1)
    )
      return { ok: false, reason: '' };
    if (Math.abs(target.x - p.x) > 4) p.face = target.x >= p.x ? 0 : Math.PI;
    if (kind === 'block') return this.placeBlock(held!, target);
    if (kind === 'wall') return this.placeWall(held!, target);
    if (kind === 'hammer') return this.hammer(target);
    if (kind === 'structure') {
      if (held === 'torch') return this.placeTorch(target);
      s.placing = held;
      const r = this.game.place(held!, target.x, target.y);
      if (r.ok) p.usedAt = t;
      return r;
    }
    if (kind === 'consume' || kind === 'wear') {
      p.usedAt = t;
      return this.game.use(held!);
    }
    if (kind === 'bow' || kind === 'magic') {
      p.weapon = held!;
      const r = this.game.combat.fire(held!, target);
      if (r.ok) {
        p.usedAt = t;
        p.attackAt = t + RANGED[held!].delay * this.game.armoury.stats(held!).pace;
      }
      return r;
    }
    if (kind === 'melee') {
      p.weapon = held!;
      p.attackAt = 0;
      const r = this.game.attack();
      return r;
    }
    // Picks, axes, and bare hands work on what lies under the cursor.
    const node = this.nodeAt(target);
    if (node && this.reachable(node, RULES.gatherReach + 60)) {
      const form = nodeForm(node.kind);
      if (
        (kind === 'axe' && form === 'tree') ||
        (kind === 'pick' && form === 'mineral') ||
        form === 'plant' ||
        form === 'water' ||
        kind === 'none'
      ) {
        p.usedAt = t;
        return this.gatherFrom(node);
      }
    }
    if (kind === 'pick') return this.dig(target);
    if (kind === 'axe' || kind === 'none') {
      p.usedAt = t;
      return this.game.attack();
    }
    return { ok: false, reason: 'Nothing to do with ' + itemName(held ?? 'that') + ' there.' };
  }
  private gatherFrom(node: ResourceNode) {
    const p = this.game.s.player,
      d = dist(node, p);
    if (d <= RULES.gatherReach) return this.game.gather(node);
    // Within cursor reach but beyond arm's length: lean in.
    const x = p.x;
    p.x = node.x + Math.sign(x - node.x) * (RULES.gatherReach - 10);
    const r = this.game.gather(node);
    p.x = x;
    return r;
  }
  /** A pick strike on the tile under the cursor; harder rock takes more strikes. */
  dig(target: Point) {
    const s = this.game.s,
      p = s.player,
      tx = Math.floor(target.x / TILE),
      ty = Math.floor(target.y / TILE),
      kind = this.game.tileAt(tx, ty);
    if (!kind) return { ok: false, reason: '' };
    if (!this.reachable({ x: tx * TILE + TILE / 2, y: ty * TILE + TILE / 2 }))
      return { ok: false, reason: 'Too far to reach.' };
    const need = MINE_TIER[kind] ?? 1,
      tier = this.game.toolTier('pick');
    if (tier < need)
      return {
        ok: false,
        reason:
          need >= 99
            ? 'Nothing can break bedrock.'
            : 'This ground needs a tier ' + need + ' pickaxe.',
      };
    if (s.vitals.stamina < 2) return { ok: false, reason: 'Too exhausted to mine.' };
    p.usedAt = s.elapsed;
    // Every blow dulls the pick a little.
    const pick = this.game.bestTool('pick');
    if (pick) this.game.durability.use(pick);
    const index = ty * TILE_COLS + tx,
      hits = Math.max(1, 1 + need - Math.floor(tier / 2)),
      done = (this.cracks.get(index) ?? 0) + 1;
    this.game.sound('pick', tx * TILE + 16, ty * TILE + 16, 0.6);
    this.game.event('chip', tx * TILE + 16, ty * TILE + 16, 'stone');
    if (done < hits) {
      this.cracks.set(index, done);
      s.vitals.stamina -= this.game.equipment.has('buff:mining') ? 0.5 : 1.2;
      return { ok: true, hit: true };
    }
    this.cracks.delete(index);
    const saved = s.vitals.stamina;
    s.vitals.stamina = Math.max(s.vitals.stamina, RULES.mineStamina);
    // Mining from the cursor ignores the old arm's-length rule; reach was checked above.
    const px = p.x,
      py = p.y;
    p.x = tx * TILE + 16;
    p.y = ty * TILE + 40;
    const r = this.game.mineTileAt(tx * TILE + 16, ty * TILE + 16);
    p.x = px;
    p.y = py;
    s.vitals.stamina = Math.max(0, saved - (this.game.equipment.has('buff:mining') ? 2 : 4));
    return r;
  }
  placeBlock(id: string, target: Point) {
    const s = this.game.s,
      p = s.player,
      tx = Math.floor(target.x / TILE),
      ty = Math.floor(target.y / TILE);
    if (tx < 0 || ty < 0 || tx >= TILE_COLS || ty >= TILE_ROWS) return { ok: false, reason: '' };
    if (this.game.tileAt(tx, ty)) return { ok: false, reason: '' };
    const cx = tx * TILE + 16,
      cy = ty * TILE + 16;
    if (!this.reachable({ x: cx, y: cy }, RULES.placeReach + 30))
      return { ok: false, reason: 'Too far to place.' };
    const [lo, hi] = regionBounds(p.x);
    if (cx < lo + 64 || cx > hi - 64) return { ok: false, reason: '' };
    // Blocks need something to hold on to, and never close over the player.
    const touching = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ].some(([dx, dy]) => this.game.tileAt(tx + dx, ty + dy));
    const behind = cy > this.game.groundTopAt(cx) || !!dungeonAt(cx, cy);
    if (!touching && !behind) return { ok: false, reason: 'Blocks must touch other ground.' };
    if (
      Math.abs(cx - p.x) < 16 + RULES.playerHalfWidth &&
      cy > p.y - RULES.playerHeight - 16 &&
      cy < p.y + 16
    )
      return { ok: false, reason: '' };
    if (
      s.animals.some(
        (a) => !a.deadUntil && Math.abs(a.x - cx) < 24 && a.y > cy - 16 && a.y - 40 < cy + 16,
      )
    )
      return { ok: false, reason: '' };
    this.game.remove(id);
    this.game.setTile(tx, ty, BLOCKS[id]);
    p.usedAt = s.elapsed;
    this.game.sound('place_block', cx, cy, 0.8);
    this.game.progress.record('build');
    return { ok: true };
  }
  /** Back walls go on open tiles next to other walls or ground. */
  placeWall(id: string, target: Point) {
    const s = this.game.s,
      tx = Math.floor(target.x / TILE),
      ty = Math.floor(target.y / TILE);
    if (this.game.wallAt(tx, ty)) return { ok: false, reason: '' };
    if (!this.reachable({ x: tx * TILE + 16, y: ty * TILE + 16 }, RULES.placeReach + 30))
      return { ok: false, reason: 'Too far to place.' };
    const [lo, hi] = regionBounds(s.player.x);
    if (tx * TILE < lo + 64 || tx * TILE > hi - 64) return { ok: false, reason: '' };
    const touching = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ].some(([dx, dy]) => this.game.tileAt(tx + dx, ty + dy) || this.game.wallAt(tx + dx, ty + dy));
    if (!touching) return { ok: false, reason: 'Walls must touch ground or other walls.' };
    this.game.remove(id);
    this.game.setWall(tx, ty, WALLS[id]);
    s.player.usedAt = s.elapsed;
    this.game.sound('place_block', tx * TILE + 16, ty * TILE + 16, 0.5);
    this.game.progress.record('build');
    return { ok: true };
  }
  /** A hammer knocks down back walls, and picks up things you have built. */
  hammer(target: Point) {
    const s = this.game.s,
      tx = Math.floor(target.x / TILE),
      ty = Math.floor(target.y / TILE);
    if (!this.reachable({ x: tx * TILE + 16, y: ty * TILE + 16 }, RULES.placeReach))
      return { ok: false, reason: 'Too far to reach.' };
    s.player.usedAt = s.elapsed;
    const built = s.structures
      .filter(
        (st) =>
          !st.fixed &&
          Math.abs(st.x - target.x) < 22 &&
          target.y < st.y + 6 &&
          target.y > st.y - 60,
      )
      .sort((a, b) => Math.abs(a.x - target.x) - Math.abs(b.x - target.x))[0];
    if (built) {
      if (Object.keys(built.store).length) return { ok: false, reason: 'Empty it first.' };
      if (built.type === 'door') this.game.town.removeDoor(built);
      else s.structures = s.structures.filter((x) => x !== built);
      this.game.drops.spawn(
        built.type === 'torch' ? 'torch' : built.type,
        1,
        built.x,
        built.y - 16,
      );
      this.game.sound('crumble', built.x, built.y - 10, 0.6);
      return { ok: true };
    }
    const wall = this.game.wallAt(tx, ty);
    if (!wall || this.game.tileAt(tx, ty)) return { ok: false, reason: '' };
    if (dungeonAt(tx * TILE + 16, ty * TILE + 16) && this.game.toolTier('hammer') < 3)
      return { ok: false, reason: 'Dungeon walls need an iron hammer.' };
    this.game.setWall(tx, ty, 0);
    const item = WALL_ITEM[wall];
    if (item) this.game.drops.spawn(item, 1, tx * TILE + 16, ty * TILE + 16);
    this.game.event('dig', tx * TILE + 16, ty * TILE + 16, String(wall));
    this.game.sound('hammer', tx * TILE + 16, ty * TILE + 16, 0.6);
    return { ok: true };
  }
  /** Torches stick to any wall or floor, no clearing needed. */
  placeTorch(target: Point) {
    const s = this.game.s,
      tx = Math.floor(target.x / TILE),
      ty = Math.floor(target.y / TILE);
    if (this.game.tileAt(tx, ty)) return { ok: false, reason: '' };
    const x = tx * TILE + 16,
      y = ty * TILE + 30;
    if (!this.reachable({ x, y }, RULES.placeReach + 30))
      return { ok: false, reason: 'Too far to place.' };
    if (
      s.structures.some(
        (st) => st.type === 'torch' && Math.abs(st.x - x) < 20 && Math.abs(st.y - y) < 20,
      )
    )
      return { ok: false, reason: '' };
    this.game.remove('torch');
    s.structures.push({
      id: uniqueId(),
      type: 'torch',
      x,
      y,
      fuel: 1,
      water: 0,
      store: {},
      crop: null,
      plantedAt: 0,
      triggeredAt: 0,
    });
    s.player.usedAt = s.elapsed;
    this.game.sound('place', x, y, 0.5);
    return { ok: true };
  }
  /** What the held item would do at the cursor, for the prompt line. */
  describe(target: Point) {
    const held = this.game.equipment.held(),
      kind = this.game.equipment.useKind(held);
    if (!held) return 'Hands';
    if (kind === 'pick') {
      const node = this.nodeAt(target);
      if (node && NODES[node.kind]?.tool === 'pick')
        return 'Mine ' + itemName(node.kind).toLowerCase();
      return 'Dig';
    }
    if (kind === 'axe') return this.nodeAt(target) ? 'Chop' : 'Swing';
    if (kind === 'block' || kind === 'wall') return 'Place ' + itemName(held).toLowerCase();
    if (kind === 'hammer') return 'Knock down walls, pick up furniture';
    if (kind === 'structure') return 'Place ' + itemName(held).toLowerCase();
    if (kind === 'melee') return 'Strike';
    if (kind === 'bow') return 'Shoot';
    if (kind === 'magic') return 'Cast';
    if (kind === 'consume') return ITEMS[held]?.[1] === 'potion' ? 'Drink' : 'Use';
    if (kind === 'wear') return 'Wear';
    return itemName(held);
  }
}
