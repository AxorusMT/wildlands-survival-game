import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../src/data/index.ts';
import { Game } from '../src/game/Game.ts';

const T = D.TILE;
const fresh = () => new Game(17);
const stand = (g, x, y) => {
  const p = g.s.player;
  p.x = x;
  p.y = y ?? g.groundTopAt(x) + 1;
  p.vx = 0;
  p.vy = 0;
};
const furnish = (g, type, tx, gy) => {
  const st = {
    id: 9000 + g.s.structures.length,
    type,
    x: tx * T + T / 2,
    y: gy * T - 1,
    fuel: 1,
    water: 0,
    store: {},
    crop: null,
    plantedAt: 0,
    triggeredAt: 0,
  };
  g.s.structures.push(st);
  return st;
};
/**
 * Builds a six-by-four room on the meadow: a floor, stone sides and roof, wooden back walls, and
 * a door on the right. Returns its corners.
 */
const house = (g, x = D.BIOME_CENTERS.meadow[0] + 300) => {
  const tx0 = Math.floor(x / T),
    gy = Math.floor(g.groundTopAt(x + 4 * T) / T);
  for (let tx = tx0; tx <= tx0 + 7; tx++) {
    g.setTile(tx, gy, 2);
    g.setTile(tx, gy - 5, 2);
    for (let ty = gy - 4; ty < gy; ty++) {
      g.setTile(tx, ty, tx === tx0 || (tx === tx0 + 7 && ty < gy - 2) ? 2 : 0);
      if (tx > tx0 && tx < tx0 + 7) g.setWall(tx, ty, 11);
    }
  }
  const door = g.town.placeDoor((tx0 + 7) * T + 16, (gy - 1) * T + 16);
  assert.ok(door.ok, 'door placed');
  return { tx0, gy, door: door.structure };
};

test('a room needs walls, a door, a seat, a table, and a light to be a home', () => {
  const g = fresh();
  const { tx0, gy } = house(g);
  const inside = () => g.town.roomAt(tx0 + 3, gy - 1);
  assert.equal(inside().cells.size, 24);
  assert.deepEqual(inside().missing, [
    'A chair or bed is needed.',
    'A table is needed.',
    'A light is needed.',
  ]);
  furnish(g, 'chair', tx0 + 2, gy);
  furnish(g, 'table', tx0 + 4, gy);
  furnish(g, 'torch', tx0 + 6, gy);
  assert.deepEqual(inside().missing, []);
  // A hole in the back wall lets the outside in.
  g.setWall(tx0 + 3, gy - 3, 0);
  assert.equal(g.wallAt(tx0 + 3, gy - 3), 0);
  assert.match(inside().missing[0], /Back walls/);
  g.setWall(tx0 + 3, gy - 3, 11);
  // So does a hole in the roof.
  g.setTile(tx0 + 3, gy - 5, 0);
  assert.match(inside().missing[0], /not enclosed|Back walls/);
});

test('settlers move into finished homes once unlocked, and leave when the home breaks', () => {
  const g = fresh();
  const { tx0, gy } = house(g);
  furnish(g, 'chair', tx0 + 2, gy);
  furnish(g, 'table', tx0 + 4, gy);
  furnish(g, 'torch', tx0 + 6, gy);
  g.town.update(5);
  assert.equal(g.town.settlers().length, 0, 'nobody comes before the campfire');
  g.progress.record('place:campfire');
  g.town.update(5);
  const [guide] = g.town.settlers();
  assert.equal(guide?.settler, 'guide');
  assert.ok(g.s.town.homes.guide);
  assert.ok(g.s.tutorial.tally['settler:guide']);
  // One settler to a room: a second seat does not make room for the trader.
  furnish(g, 'chair', tx0 + 5, gy);
  g.add('coin', 60);
  g.town.update(5);
  assert.equal(g.town.settlers().length, 1);
  // Settlers cannot be hurt, and stay near home.
  stand(g, guide.x - 30, guide.y);
  g.combat.hurtMob?.(guide, 100);
  assert.equal(guide.hp, guide.maxHp);
  for (let i = 0; i < 600; i++) g.tick(1 / 60);
  assert.ok(Math.abs(guide.x - guide.homeX) < 200);
  // Take the table and the guide leaves.
  g.s.structures = g.s.structures.filter((st) => st.type !== 'table');
  g.town.update(5);
  assert.equal(g.town.settlers().length, 0);
  assert.equal(g.s.town.homes.guide, undefined);
});

test('doors block while closed, open when walked into, and swing shut behind you', () => {
  const g = fresh();
  const { tx0, gy, door } = house(g);
  const dx = tx0 + 7;
  assert.equal(g.tileAt(dx, gy - 1), D.DOOR_TILE);
  assert.equal(g.tileAt(dx, gy - 2), D.DOOR_TILE);
  // Walk into it from outside.
  stand(g, (dx + 2) * T, gy * T - 1);
  g.s.player.grounded = true;
  for (let i = 0; i < 60 && door.crop !== 'open'; i++) {
    g.move(-1, 0, 1 / 60);
  }
  assert.equal(door.crop, 'open');
  assert.equal(g.tileAt(dx, gy - 1), 0);
  stand(g, (dx + 8) * T, gy * T - 1);
  for (let i = 0; i < 4 * 60; i++) g.tick(1 / 60);
  assert.equal(door.crop, null);
  assert.equal(g.tileAt(dx, gy - 1), D.DOOR_TILE);
  // Mining a door takes it down and gives it back.
  g.town.toggleDoor(door);
  g.town.toggleDoor(door);
  g.town.removeDoor(door);
  assert.equal(g.tileAt(dx, gy - 1), 0);
  assert.ok(!g.s.structures.includes(door));
});

test('walls are placed against ground, knocked down by hammers, and saved', () => {
  const g = fresh();
  const x = D.BIOME_CENTERS.meadow[0] + 900,
    tx = Math.floor(x / T),
    gy = Math.floor(g.groundTopAt(x) / T);
  stand(g, x - 40);
  g.add('wood_wall', 3);
  g.equipment.assign(0, 'wood_wall');
  g.equipment.select(0);
  assert.equal(g.equipment.useKind('wood_wall'), 'wall');
  // Mid-air with nothing beside it: refused.
  assert.equal(g.hands.useAt({ x: tx * T + 16, y: (gy - 4) * T + 16 }).ok, false);
  assert.ok(g.hands.useAt({ x: tx * T + 16, y: (gy - 1) * T + 16 }).ok);
  assert.equal(g.wallAt(tx, gy - 1), D.WALLS.wood_wall);
  assert.equal(g.count('wood_wall'), 2);
  // Now it can climb.
  g.s.player.usedAt = -9;
  assert.ok(g.hands.useAt({ x: tx * T + 16, y: (gy - 2) * T + 16 }).ok);
  // Saved and restored.
  const store = new Map();
  g.save({ setItem: (k, v) => store.set(k, v), getItem: (k) => store.get(k) });
  const back = fresh();
  back.load({ setItem: (k, v) => store.set(k, v), getItem: (k) => store.get(k) });
  assert.equal(back.wallAt(tx, gy - 2), D.WALLS.wood_wall);
  // A hammer takes it down and gives it back.
  g.add('wooden_hammer');
  g.equipment.assign(1, 'wooden_hammer');
  g.equipment.select(1);
  assert.equal(g.equipment.useKind('wooden_hammer'), 'hammer');
  const before = g.s.drops.length;
  g.s.player.usedAt = -9;
  assert.ok(g.hands.useAt({ x: tx * T + 16, y: (gy - 2) * T + 16 }).ok);
  assert.equal(g.wallAt(tx, gy - 2), 0);
  assert.ok(g.s.drops.slice(before).some((d) => d.item === 'wood_wall'));
  // Natural cave walls underground come away as stone walls.
  assert.equal(D.WALL_ITEM[2], 'stone_wall');
});

test('coins drop from creatures, and settlers buy and sell', () => {
  const g = fresh();
  const wolf = g.s.animals.find((a) => a.type === 'wolf' && !a.deadUntil);
  const had = g.count('coin');
  stand(g, wolf.x, wolf.y);
  g.wildlife.kill(wolf);
  const got =
    g.count('coin') + g.s.drops.filter((d) => d.item === 'coin').reduce((n, d) => n + d.qty, 0);
  assert.ok(got > had, 'a wolf leaves silver');

  const { tx0, gy } = house(g);
  furnish(g, 'chair', tx0 + 2, gy);
  furnish(g, 'table', tx0 + 4, gy);
  furnish(g, 'torch', tx0 + 6, gy);
  g.progress.record('place:campfire');
  g.town.update(5);
  const [guide] = g.town.settlers();
  stand(g, guide.x + 10, guide.y);
  g.s.inventory = g.s.inventory.filter((e) => e.id !== 'coin');
  assert.equal(g.town.buy('guide', 'torch').ok, false, 'no money');
  assert.ok(g.town.talk(guide).action === 'shop');
  g.add('coin', 10);
  assert.ok(g.town.buy('guide', 'torch', 2).ok);
  assert.equal(g.count('coin'), 6);
  assert.equal(g.town.buy('guide', 'steel_ingot').ok, false, 'not in stock');
  g.add('iron_ingot', 2);
  const price = g.town.sellPrice('iron_ingot');
  assert.ok(price >= 2);
  assert.ok(g.town.sell('iron_ingot').ok);
  assert.equal(g.count('coin'), 6 + price);
  // Everything is worth something, and crafted things more than their parts.
  for (const id of Object.keys(D.ITEMS)) assert.ok(g.town.valueOf(id) > 0, id);
  assert.ok(g.town.valueOf('iron_ingot') > g.town.valueOf('iron_ore'));
  // Every ware on every shelf is a real item.
  for (const st of D.SETTLERS)
    for (const [id] of st.stock) assert.ok(D.ITEMS[id], `${st.id}: ${id}`);
});

test('sleeping in a bed sets where you wake, and passes the night', () => {
  const g = fresh();
  const x = D.BIOME_CENTERS.meadow[0] + 1400;
  g.add('bed');
  stand(g, x);
  const r = g.place('bed', x, g.groundTopAt(x));
  assert.ok(r.ok, r.reason);
  const bed = g.s.structures.find((st) => st.type === 'bed');
  // Push time to midnight.
  while (!g.isNight()) g.s.elapsed += 10;
  g.town.sleep(bed);
  assert.ok(!g.isNight());
  assert.deepEqual(g.s.spawn, { x: bed.x, y: bed.y });
  stand(g, D.BIOME_CENTERS.tundra[0]);
  g.s.dead = true;
  g.recover();
  assert.ok(Math.abs(g.s.player.x - bed.x) < 40);
  // Without the bed you wake in the meadow.
  g.s.structures = g.s.structures.filter((st) => st !== bed);
  g.s.dead = true;
  g.recover();
  assert.ok(Math.abs(g.s.player.x - bed.x) > 40);
});

test('silver, gold, and gems lie in the mines and make their own tier', () => {
  const g = fresh();
  for (const kind of ['silver_ore', 'gold_ore', 'ruby', 'sapphire', 'emerald'])
    assert.ok(
      g.s.nodes.some((n) => n.kind === kind),
      kind,
    );
  assert.ok(D.RECIPES.some((r) => r.id === 'silver_ingot'));
  assert.ok(D.RECIPES.some((r) => r.id === 'gold_pick'));
  assert.ok(D.ARMOR_SETS.some((s) => s.key === 'silver'));
  assert.ok(D.TOOL_TIERS.gold_pick[1] > D.TOOL_TIERS.iron_pick[1]);
});
