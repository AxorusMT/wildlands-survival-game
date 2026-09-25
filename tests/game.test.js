import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../src/data/index.ts';
import { Game } from '../src/game/Game.ts';

const fresh = () => new Game(17);
const allMaterials = (game) => {
  for (const id of Object.keys(D.ITEMS))
    if (!['weapon', 'tool', 'clothing', 'structure'].includes(D.ITEMS[id][1])) game.add(id, 80);
};
const station = (game, type) => {
  const st = {
    id: Math.random(),
    type,
    x: game.s.player.x + 35,
    y: game.s.player.y,
    fuel: 900,
    crop: null,
    plantedAt: 0,
  };
  game.s.structures.push(st);
  return st;
};
/** The first structure the player built (dungeons and dimensions furnish the rest). */
const built = (game) => game.s.structures.find((st) => !st.fixed);

test('long side-view world has shaped terrain, connected caves, and nearby starter resources', () => {
  const g = fresh();
  assert.equal(D.OVERWORLD_W, 30000);
  assert.equal(D.WORLD_H, 4480);
  assert.equal(g.biome().id, 'meadow');
  assert.ok(
    Math.max(...[7000, 7300, 7600, 7900, 8200].map(D.surfaceAt)) -
      Math.min(...[7000, 7300, 7600, 7900, 8200].map(D.surfaceAt)) >
      20,
  );
  assert.equal(D.baseTileAt(130, 0), 0);
  assert.equal(D.caveAt(D.ENTRANCES[3], D.caveY(D.ENTRANCES[3], 2)), true);
  assert.ok(g.s.tiles.length > 100000);
  for (const kind of ['wood', 'stone', 'fiber', 'flint', 'water'])
    assert.ok(
      g.s.nodes.some(
        (n) => n.kind === kind && Math.hypot(n.x - g.s.player.x, n.y - g.s.player.y) < 260,
      ),
    );
});

test('field tutorial advances through gathering, making, placement, and safe drinking', () => {
  const g = fresh();
  g.add('wood', 16);
  g.add('stone', 16);
  g.add('fiber', 12);
  assert.equal(g.s.tutorial.step, 3);
  assert.equal(g.craft('stone_axe').ok, true);
  g.add('flint', 2);
  assert.equal(g.craft('campfire').ok, true);
  assert.equal(g.place('campfire', g.s.player.x + 50, g.s.player.y).ok, true);
  g.add('wild_water');
  assert.equal(g.craft('boiled_water').ok, true);
  assert.equal(g.use('boiled_water').ok, true);
  assert.equal(g.s.tutorial.step, D.TUTORIAL.length);
});

test('ore and recipes respect tool, material, and station gates', () => {
  const g = fresh();
  const iron = { kind: 'iron_ore', x: g.s.player.x + 20, y: g.s.player.y, hp: 2 };
  assert.match(g.gather(iron).reason, /tier 2/);
  g.add('stone_pick');
  assert.match(g.gather(iron).reason, /tier 2/);
  g.add('copper_pick');
  assert.equal(g.gather(iron).ok, true);
  g.add('iron_ore', 10);
  g.add('coal', 10);
  assert.match(g.craft('iron_ingot').reason, /Furnace/);
  station(g, 'furnace');
  assert.equal(g.craft('iron_ingot').ok, true);
  assert.equal(g.count('iron_ingot'), 1);
});

test('diseases have corresponding treatments; washing improves hygiene', () => {
  const g = fresh();
  g.rng = () => 0;
  g.add('wild_water');
  g.use('wild_water');
  assert.equal(g.s.disease, 'dysentery');
  g.contract('dysentery');
  g.add('herbal_tea');
  assert.equal(g.use('herbal_tea').ok, true);
  assert.equal(g.s.disease, null);
  g.add('raw_meat');
  g.use('raw_meat');
  assert.equal(g.s.disease, 'fever');
  g.contract('fever');
  g.add('fever_remedy');
  g.use('fever_remedy');
  assert.equal(g.s.disease, null);
  g.contract('wound');
  g.add('poultice');
  g.use('poultice');
  assert.equal(g.s.disease, null);
  g.s.vitals.hygiene = 10;
  g.add('wild_water');
  assert.equal(g.wash().ok, true);
  assert.equal(g.s.vitals.hygiene, 46);
});

test('individual food ages, icebox slows it, and loading applies offline time', () => {
  const g = fresh();
  g.add('raw_meat', 2);
  g.s.inventory.find((e) => e.id === 'raw_meat').fresh = 30;
  g.survival.advanceDecay(20);
  assert.deepEqual(
    g.s.inventory.filter((e) => e.id === 'raw_meat').map((e) => e.fresh),
    [10, 480],
  );
  station(g, 'icebox');
  g.survival.advanceDecay(20);
  assert.deepEqual(
    g.s.inventory.filter((e) => e.id === 'raw_meat').map((e) => Math.round(e.fresh)),
    [6, 476],
  );
  const store = new Map();
  const storage = { setItem: (k, v) => store.set(k, v), getItem: (k) => store.get(k) };
  g.save(storage);
  const saved = JSON.parse(store.get('wildlands-save-v1'));
  saved.lastSave -= 100000;
  store.set('wildlands-save-v1', JSON.stringify(saved));
  const loaded = fresh();
  assert.equal(loaded.load(storage), true);
  assert.ok(loaded.s.inventory.find((e) => e.id === 'raw_meat').fresh < 0);
});

test('icebox cooling stops exactly when its ice runs out', () => {
  const g = fresh();
  g.add('raw_meat');
  const ice = station(g, 'icebox');
  ice.fuel = 10;
  g.survival.advanceDecay(30);
  assert.equal(ice.fuel, 0);
  assert.equal(g.s.inventory.find((e) => e.id === 'raw_meat').fresh, 500 - 10 * 0.18 - 20);
});

test('farm plots grow seeds into harvest and structures persist', () => {
  const g = fresh();
  g.add('farm_plot');
  g.add('potato');
  const placed = g.place('farm_plot', g.s.player.x + 50, g.s.player.y);
  assert.equal(placed.ok, true);
  assert.equal(g.plant(placed.structure, 'potato').ok, true);
  g.s.elapsed += 241;
  g.s.player.x += 50;
  assert.equal(g.interact().ok, true);
  assert.equal(g.count('potato'), 5);
  const store = new Map(),
    storage = { setItem: (k, v) => store.set(k, v), getItem: (k) => store.get(k) };
  g.save(storage);
  const copy = fresh();
  copy.load(storage);
  assert.equal(built(copy).type, 'farm_plot');
});

test('older field records migrate into the side-view world with inventory and structures', () => {
  const g = fresh();
  g.add('wood', 7);
  station(g, 'campfire');
  const store = new Map(),
    storage = { setItem: (k, v) => store.set(k, v), getItem: (k) => store.get(k) };
  g.save(storage);
  const old = JSON.parse(store.get('wildlands-save-v1'));
  old.version = 1;
  old.player.x = 1416;
  old.player.y = 1062;
  old.structures = old.structures.filter((st) => !st.fixed);
  for (const st of old.structures) {
    st.x = 1437;
    st.y = 1062;
  }
  delete old.tiles;
  delete old.caches;
  delete old.chapter;
  delete old.discoveries;
  store.set('wildlands-save-v1', JSON.stringify(old));
  const loaded = fresh();
  assert.equal(loaded.load(storage), true);
  assert.equal(loaded.s.version, 3);
  assert.equal(loaded.count('wood'), 7);
  assert.equal(built(loaded).type, 'campfire');
  assert.ok(loaded.s.tiles.length > 20000);
  assert.ok(loaded.s.player.x > 0 && loaded.s.player.x < D.WORLD_W);
});

test('version-two saves retain progress when rebuilt into side-view terrain', () => {
  const g = fresh(),
    store = new Map(),
    storage = { setItem: (k, v) => store.set(k, v), getItem: (k) => store.get(k) };
  g.add('iron_ingot', 4);
  g.save(storage);
  const old = JSON.parse(store.get('wildlands-save-v1'));
  old.version = 2;
  old.player.x = 2360;
  old.player.y = 1770;
  delete old.tiles;
  delete old.caches;
  store.set('wildlands-save-v1', JSON.stringify(old));
  const copy = fresh();
  assert.equal(copy.load(storage), true);
  assert.equal(copy.s.version, 3);
  assert.equal(copy.count('iron_ingot'), 4);
  assert.equal(copy.s.tiles.length, D.TILE_COLS * D.TILE_ROWS);
});

test('gravity, jumping, shaft descent, and close-range mining work', () => {
  const g = fresh(),
    start = g.s.player.y;
  assert.equal(g.jump(), true);
  for (let i = 0; i < 20; i++) g.move(0, 0, 0.016);
  assert.ok(g.s.player.y < start - 25);
  for (let i = 0; i < 75; i++) g.move(0, 0, 0.016);
  assert.equal(g.s.player.grounded, true);
  const ex = D.ENTRANCES[3];
  g.s.player.x = ex;
  g.s.player.y = D.surfaceAt(ex) - 2;
  g.s.player.vy = 0;
  g.s.player.grounded = false;
  for (let i = 0; i < 160; i++) g.move(0, 1, 0.016);
  assert.ok(g.s.player.y > D.caveY(ex, 1));
  const mx = D.BIOME_CENTERS.meadow[0] + 400;
  g.s.player.x = mx;
  g.s.player.y = g.groundTopAt(mx) - 1;
  const tx = Math.floor((mx + 45) / D.TILE),
    ty = Math.floor(D.surfaceAt(mx + 45) / D.TILE) + 1;
  const before = g.count('dirt');
  assert.equal(g.mineTileAt(tx * D.TILE + 16, ty * D.TILE + 16).ok, true);
  // The earth pops out as a pickup and flies to the player.
  for (let i = 0; i < 120; i++) g.tick(1 / 60);
  assert.equal(g.count('dirt'), before + 1);
  assert.equal(g.tileAt(tx, ty), 0);
});

test('new foods, poison treatment, rain collection, chest storage, and expedition chapters', () => {
  const g = fresh();
  g.add('trail_ration');
  const before = g.s.vitals.calories;
  g.use('trail_ration');
  assert.ok(g.s.vitals.calories > before);
  g.contract('poisoning');
  g.add('antivenom');
  g.use('antivenom');
  assert.equal(g.s.disease, null);
  const catcher = {
    id: 1,
    type: 'rain_catcher',
    x: g.s.player.x + 20,
    y: g.s.player.y,
    water: 0,
    fuel: 0,
  };
  g.s.structures.push(catcher);
  g.s.weather = 'rain';
  for (let i = 0; i < 100; i++) g.tick(0.1);
  assert.ok(catcher.water > 0);
  const chest = { id: 2, type: 'chest', x: g.s.player.x + 30, y: g.s.player.y, store: {} };
  g.s.structures.push(chest);
  g.add('stone', 2);
  assert.equal(g.storeInChest(chest, 'stone').ok, true);
  assert.equal(chest.store.stone, 1);
  assert.equal(g.takeFromChest(chest, 'stone').ok, true);
  g.progress.record('visit:forest');
  assert.equal(g.s.chapter, 1);
});

test('Effergy requires exact costly recipe, only one altar, and attunes wolves', () => {
  const g = fresh();
  allMaterials(g);
  station(g, 'forge');
  const recipe = D.RECIPES.find((r) => r.id === 'effergy');
  assert.deepEqual(recipe.cost, {
    obsidian: 24,
    steel_ingot: 18,
    sulfur: 12,
    bone: 16,
    hide: 12,
    ice: 6,
    antibiotic: 2,
  });
  assert.equal(g.craft('effergy').ok, true);
  const altar = g.place('effergy', g.s.player.x + 90, g.s.player.y);
  assert.equal(altar.ok, true);
  assert.equal(g.craft('effergy').ok, false);
  assert.equal(g.attune('wolf').ok, true);
  assert.equal(g.attune('deer').ok, false);
});

test('wolf hunts summon each boss; obsidian gate, rewards, and upgrades work', () => {
  const g = fresh();
  station(g, 'effergy');
  g.s.altar.attuned = 'wolf';
  for (let level = 1; level <= 3; level++) {
    const cfg = D.BOSSES[level - 1];
    for (let i = 0; i < cfg.kills; i++) g.wildlife.kill({ type: 'wolf', deadUntil: 0 });
    const boss = g.s.animals.find((a) => a.id === g.s.altar.activeBoss);
    assert.ok(boss);
    assert.equal(boss.hp, cfg.hp);
    // The Direwolf's escort would take the swing too; this checks the Direwolf alone.
    g.s.animals = g.s.animals.filter((a) => !a.companion);
    g.s.player.x = boss.x;
    g.s.player.y = boss.y;
    g.s.player.weapon = 'flint_spear';
    g.s.player.attackAt = 0;
    g.s.vitals.stamina = 100;
    assert.equal(g.attack().hit, false);
    assert.equal(boss.hp, cfg.hp);
    g.s.player.weapon = 'obsidian_blade';
    g.s.player.attackAt = 0;
    g.s.vitals.stamina = 100;
    assert.equal(g.attack().hit, true);
    boss.hp = 1;
    g.s.player.attackAt = 0;
    g.s.vitals.stamina = 100;
    g.attack();
    assert.equal(g.s.altar.activeBoss, null);
    assert.equal(g.s.altar.kills, 0);
    for (const [id, n] of Object.entries(cfg.rewards)) assert.ok(g.count(id) >= n);
    if (level < 3) {
      g.s.altar.xp = level === 1 ? 100 : 250;
      [g.s.player.x, g.s.player.y] = D.BIOME_CENTERS.meadow;
      assert.equal(g.upgradeAltar().ok, true);
      assert.equal(g.s.altar.level, level + 1);
    }
  }
});
