import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../src/data/index.ts';
import { Game } from '../src/game/Game.ts';

const fresh = () => new Game(17);
const run = (g, seconds) => {
  for (let i = 0; i < seconds * 60; i++) g.tick(1 / 60);
};
const memory = () => {
  const store = new Map();
  return { setItem: (k, v) => store.set(k, v), getItem: (k) => store.get(k), store };
};
const relief = (id) => {
  const span = D.BIOME_SPANS.find((s) => s.id === id);
  let lo = Infinity,
    hi = -Infinity;
  for (let x = span.start + 400; x < span.end - 400; x += 16) {
    lo = Math.min(lo, D.surfaceAt(x));
    hi = Math.max(hi, D.surfaceAt(x));
  }
  return hi - lo;
};

test('regions are wide, each with its own lie of the land, and every slope is walkable', () => {
  for (const span of D.BIOME_SPANS) assert.ok(span.end - span.start >= 2800, span.id);
  assert.ok(relief('marsh') < 60, 'the marsh is flat');
  assert.ok(relief('tundra') < relief('taiga'), 'the tundra is flatter than the taiga');
  assert.ok(relief('alpine') > 200, 'the alpine region is mountainous');
  const top = (tx) => {
    for (let ty = 0; ty < D.TILE_ROWS; ty++) if (D.baseTileAt(tx, ty)) return ty;
    return D.TILE_ROWS;
  };
  const shaft = (tx) => D.SHAFTS.some((s) => Math.abs(s.x - tx * D.TILE) < 90);
  // Dungeon facades are built with walls; everywhere else the land is walkable.
  const dungeon = (tx) => D.DUNGEONS.some((d) => tx >= d.tx0 - 1 && tx <= d.tx0 + d.cols + 1);
  for (let tx = 1; tx < Math.floor(D.OVERWORLD_W / D.TILE); tx++)
    if (!shaft(tx) && !shaft(tx - 1) && !dungeon(tx))
      assert.ok(Math.abs(top(tx) - top(tx - 1)) <= 1, `step at column ${tx}`);
});

test('the world descends through five layers linked by ladder shafts', () => {
  const x = D.BIOME_CENTERS.meadow[0];
  assert.deepEqual(
    [0, D.surfaceAt(x) + 60, 1400, 2200, 3100, 4000].map((y) => D.layerAt(x, y).id),
    ['surface', 'surface', 'upper_mines', 'lower_mines', 'upper_hell', 'lower_hell'],
  );
  const layerOf = (level) => D.layerAt(x, D.caveY(x, level)).id;
  assert.equal(layerOf(3), 'upper_mines');
  assert.equal(layerOf(5), 'lower_mines');
  assert.equal(layerOf(7), 'upper_hell');
  // Every shaft is open from top to bottom, and some reach the underworld floor clear of lava.
  // (Dungeon and dimension ladders are carved into their own tiles rather than the caves.)
  const open = (x, y) =>
    x < D.OVERWORLD_W && !D.dungeonAt(x, y)
      ? D.caveAt(x, y)
      : !D.baseTileAt(Math.floor(x / D.TILE), Math.floor(y / D.TILE));
  for (const s of D.SHAFTS)
    for (let y = Math.max(s.top, s.x < D.OVERWORLD_W ? D.surfaceAt(s.x) : 0); y < s.bottom; y += 16)
      assert.ok(open(s.x, y), `shaft at ${Math.round(s.x)} blocked at ${Math.round(y)}`);
  const hellLadders = D.SHAFTS.filter((s) => s.bottom > D.LAYERS[4].top);
  assert.ok(hellLadders.length >= 3);
  for (const s of hellLadders) assert.equal(D.lavaAt(s.x, s.bottom - 10), false);
  // Deeper rock needs better picks, and lava lies in the underworld.
  assert.ok(D.MINE_TIER[D.Ground.hellrock] > D.MINE_TIER[D.Ground.deepstone]);
  let lava = 0;
  for (let px = 0; px < D.OVERWORLD_W; px += 64) if (D.lavaAt(px, D.LAVA_Y + 20)) lava++;
  assert.ok(lava > 20);
});

test('a felled tree topples, drops its wood, and regrows from the stump', () => {
  const g = fresh(),
    p = g.s.player;
  const tree = g.s.nodes.find((n) => n.kind === 'wood');
  p.x = tree.x - 30;
  p.y = g.groundTopAt(p.x) + 1;
  assert.equal(g.gather(tree).qty, 0);
  assert.equal(g.gather(tree).qty, 0);
  const last = g.gather(tree);
  assert.ok(last.qty >= 6);
  assert.equal(tree.hp, 0);
  assert.ok(tree.felledAt !== undefined);
  assert.equal(g.nearestInteractable()?.object === tree, false);
  assert.equal(g.count('wood'), 0, 'the wood lands with the crown, not straight in the pack');
  run(g, 3);
  p.x = tree.x + tree.fallDir * 70;
  run(g, 2);
  assert.equal(g.count('wood'), last.qty);
  g.s.elapsed = tree.depletedUntil + 1;
  g.tick(0.016);
  assert.equal(tree.hp, D.NODES.wood.hp);
  assert.equal(tree.felledAt, undefined);
});

test('ore crumbles away for good and its pieces are picked up', () => {
  const g = fresh(),
    p = g.s.player;
  const stone = g.s.nodes.find((n) => n.kind === 'stone');
  p.x = stone.x - 20;
  p.y = g.groundTopAt(p.x) + 1;
  for (let i = 0; i < D.NODES.stone.hp; i++) assert.equal(g.gather(stone).ok, true);
  assert.equal(g.s.nodes.includes(stone), false);
  assert.ok(g.takeEvents().some((e) => e.type === 'crumble'));
  run(g, 2);
  assert.ok(g.count('stone') >= D.NODES.stone.hp * 2);
});

test('drops that fall into lava are lost', () => {
  const g = fresh();
  const x = D.BIOME_SPANS.map((s) => s.center).find((cx) => D.underworldFloor(cx) > D.LAVA_Y + 40);
  const floor = D.underworldFloor(x ?? 0);
  g.drops.spawn('hellstone', 3, x, D.LAVA_Y - 10);
  run(g, 2);
  assert.equal(g.s.drops.length, 0, `lava at ${x} floor ${floor}`);
});

test('saves keep only changed tiles, and older narrow-world records move into the wide world', () => {
  const g = fresh(),
    storage = memory();
  const tx = Math.floor(g.s.player.x / D.TILE) + 2,
    ty = Math.floor(g.groundTopAt(g.s.player.x + 64) / D.TILE);
  g.setTile(tx, ty, 0);
  g.save(storage, true);
  const raw = storage.store.get('wildlands-save-v1');
  assert.equal(JSON.parse(raw).tiles, undefined);
  assert.ok(raw.length < 400_000);
  const loaded = new Game(3);
  assert.equal(loaded.load(storage), true);
  assert.equal(loaded.tileAt(tx, ty), 0);
  assert.equal(loaded.s.tiles.length, D.TILE_COLS * D.TILE_ROWS);
  // A layout-2 record from the old 1200-pixel regions: the player stood in the old meadow.
  const old = JSON.parse(raw);
  old.layout = 2;
  old.player.x = 3 * 1200 + 600;
  delete old.tileEdits;
  storage.setItem('wildlands-save-v1', JSON.stringify(old));
  const migrated = new Game(3);
  assert.equal(migrated.load(storage), true);
  assert.equal(migrated.s.layout, 4);
  assert.equal(migrated.biome().id, 'meadow');
  assert.ok(migrated.s.nodes.length > 800);
});

test('hell burns without a Cinder Ward, and lava is deadly', () => {
  const burn = (ward, y) => {
    const g = fresh(),
      p = g.s.player;
    p.ward = ward;
    p.x = D.BIOME_CENTERS.forest[0];
    p.y = y;
    const before = g.s.vitals.health;
    g.survival.update(10);
    return before - g.s.vitals.health;
  };
  const deep = D.underworldCeiling(D.BIOME_CENTERS.forest[0]) + 150;
  assert.ok(burn(false, deep) > 15, 'lower hell without a ward');
  assert.ok(burn(true, deep) < 5, 'lower hell with a ward');
  const g = fresh();
  g.add('cinder_ward');
  assert.equal(g.use('cinder_ward').ok, true);
  assert.equal(g.s.player.ward, true);
  assert.ok(D.RECIPES.some((r) => r.id === 'cinder_ward'));
});
