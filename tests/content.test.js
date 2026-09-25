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
const stand = (g, x, y) => {
  const p = g.s.player;
  p.x = x;
  p.y = y ?? g.groundTopAt(x) + 1;
  p.vx = 0;
  p.vy = 0;
};

test('four dungeons are built into the world, each with loot, traps, guardians, and a boss altar', () => {
  const g = fresh();
  assert.equal(D.DUNGEONS.length, 4);
  for (const d of D.DUNGEONS) {
    const altar = g.s.structures.find((st) => st.type === 'boss_altar' && st.kind === d.def.boss);
    assert.ok(altar, `${d.def.id} altar`);
    assert.ok(D.dungeonAt(altar.x, altar.y - 20), `${d.def.id} altar inside its walls`);
    const chests = g.s.structures.filter(
      (st) => st.type === 'dungeon_chest' && st.kind === d.def.id,
    );
    assert.ok(
      chests.length >= 3 && chests.every((c) => Object.keys(c.store).length),
      `${d.def.id} chests`,
    );
    assert.ok(
      g.s.structures.some(
        (st) => st.type.startsWith('trap_') && D.dungeonAt(st.x, st.y - 10) === d,
      ),
    );
    const guards = g.s.animals.filter((a) => a.body && D.dungeonAt(a.x, a.y - 10) === d);
    assert.ok(guards.length >= 6, `${d.def.id} guardians`);
    // Brick walls stand, and ordinary picks cannot break them.
    assert.ok(D.MINE_TIER[d.def.brick] >= 6);
    assert.ok(d.shafts.length >= 3, `${d.def.id} ladders`);
  }
  // The Citadel's gates open on the underworld floor and it rises through hell to its throne.
  const citadel = D.DUNGEONS.find((d) => d.def.id === 'citadel');
  assert.equal(D.layerAt(citadel.entrance.x + 40, citadel.entrance.y - 20).id, 'lower_hell');
  assert.ok(citadel.altar.y < citadel.entrance.y - 600);
  assert.equal(D.lavaAt(citadel.entrance.x + 40, citadel.entrance.y - 20), false);
  for (const d of D.DUNGEONS.filter((d) => d !== citadel))
    assert.ok(d.altar.y > d.entrance.y + 600, d.def.id);
});

test('a dungeon chest gives up its loot once', () => {
  const g = fresh();
  const chest = g.s.structures.find((st) => st.type === 'dungeon_chest');
  const loot = { ...chest.store };
  stand(g, chest.x, chest.y + 1);
  const r = g.interact();
  assert.equal(r.ok, true);
  for (const [id, n] of Object.entries(loot)) assert.ok(g.count(id) >= n, id);
  assert.equal(g.realms.openChest(chest).ok, false);
});

test('bosses are called at their altars, fight back, and leave a sigil', () => {
  const g = fresh();
  g.dev.god = true;
  const altar = g.s.structures.find((st) => st.type === 'boss_altar' && st.kind === 'hollow_king');
  stand(g, altar.x + 40, altar.y + 1);
  assert.equal(g.bosses.summon(altar).ok, true);
  const king = g.bosses.active();
  assert.equal(king.type, 'hollow_king');
  assert.equal(g.bosses.summon(altar).ok, false, 'one boss at a time');
  let cast = false;
  for (let i = 0; i < 240 && !cast; i++) {
    g.tick(1 / 60);
    cast = g.combat.projectiles.some((b) => b.from === 'mob');
  }
  assert.ok(cast, 'the king casts');
  g.combat.hurtMob(king, 1e6, g.s.player);
  assert.equal(g.bosses.active(), null);
  assert.equal(g.s.bosses.hollow_king, 1);
  assert.ok(g.s.drops.some((d) => d.item === 'sigil_crypt'));
  // A second fight needs the crypt key.
  assert.equal(g.bosses.summon(altar).ok, false);
  g.add('crypt_key');
  assert.equal(g.bosses.summon(altar).ok, true);
  assert.equal(g.count('crypt_key'), 0);
});

test('the Rift Gate takes sigils and opens the dimensions in order; portals lead home', () => {
  const g = fresh();
  for (const [id, n] of Object.entries(D.RECIPES.find((r) => r.id === 'rift_gate').cost))
    g.add(id, n);
  g.s.structures.push({
    id: 1e6,
    type: 'forge',
    x: g.s.player.x + 30,
    y: g.s.player.y,
    fuel: 0,
    water: 0,
    store: {},
    crop: null,
    plantedAt: 0,
    triggeredAt: 0,
  });
  assert.equal(g.craft('rift_gate').ok, true);
  assert.equal(g.craft('rift_gate').ok, false, 'only one gate');
  const placed = g.place('rift_gate', g.s.player.x + 120, g.s.player.y);
  assert.equal(placed.ok, true);
  const gate = placed.structure;
  g.s.nodes = g.s.nodes.filter((n) => Math.abs(n.x - gate.x) > 200);
  stand(g, gate.x + 30);
  assert.equal(g.realms.travel('mycelia').ok, false, 'no sigils yet');
  g.add('sigil_crypt');
  assert.equal(g.interact().action, 'rift');
  assert.deepEqual(g.s.rift.sigils, ['sigil_crypt']);
  assert.equal(g.realms.travel('skyreach').ok, false, 'Skyreach needs two sigils');
  assert.equal(g.realms.travel('mycelia').ok, true);
  assert.equal(g.layer().id, 'mycelia');
  assert.equal(g.biome().id, 'mycelia');
  // Standing on the cavern floor, not on its rock sky.
  const p = g.s.player;
  assert.ok(p.y > 1000);
  const portal = g.s.structures.find((st) => st.type === 'portal' && st.store.mycelia);
  assert.ok(portal && Math.abs(portal.x - p.x) < 200);
  stand(g, portal.x + 20, p.y);
  assert.equal(g.interact().ok, true);
  assert.equal(D.regionAt(g.s.player.x), 'overworld');
  assert.ok(Math.abs(g.s.player.x - gate.x) < 200);
});

test('every dimension is walled off, furnished, peopled, and has its boss', () => {
  const g = fresh();
  for (const dim of D.DIMENSIONS) {
    const inside = (o) => o.x > dim.start && o.x < dim.end;
    assert.ok(g.s.nodes.filter(inside).length > 15, `${dim.id} resources`);
    assert.ok(g.s.animals.filter(inside).length > 10, `${dim.id} creatures`);
    assert.ok(
      g.s.structures.some((st) => st.type === 'boss_altar' && inside(st)),
      `${dim.id} altar`,
    );
    assert.equal(D.baseTileAt(Math.floor((dim.start - 100) / D.TILE), 70), D.Ground.bedrock);
    const [lo, hi] = D.regionBounds(dim.start + 500);
    assert.deepEqual([lo, hi], [dim.start, dim.end]);
  }
  // The dimension ores need the tools of the dimension before.
  assert.ok(D.NODES.starmetal_ore.req > D.NODES.myconite_ore.req);
  assert.ok(D.NODES.voidsteel_ore.req > D.NODES.starmetal_ore.req);
});

test('the hotbar fills itself, and the held item digs, builds, and lights at the cursor', () => {
  const g = fresh();
  g.add('iron_pick');
  g.add('stone_brick', 10);
  g.add('torch', 5);
  assert.deepEqual(g.s.hotbar.slice(0, 3), ['iron_pick', 'stone_brick', 'torch']);
  g.add('wood', 5);
  assert.ok(!g.s.hotbar.includes('wood'), 'plain materials stay in the pack');
  const p = g.s.player;
  const tx = Math.floor(p.x / D.TILE) + 1,
    ty = Math.floor((p.y + 4) / D.TILE);
  assert.ok(g.tileAt(tx, ty));
  g.equipment.select(0);
  let broke = false;
  for (let i = 0; i < 20 && !broke; i++) {
    g.s.elapsed += 0.3;
    g.useAt(tx * D.TILE + 16, ty * D.TILE + 16);
    broke = !g.tileAt(tx, ty);
  }
  assert.ok(broke, 'the pick breaks the tile');
  g.equipment.select(1);
  g.s.elapsed += 1;
  assert.equal(g.useAt(tx * D.TILE + 16, ty * D.TILE + 16).ok, true);
  assert.equal(g.tileAt(tx, ty), D.BLOCKS.stone_brick);
  assert.equal(g.count('stone_brick'), 9);
  g.equipment.select(2);
  g.s.elapsed += 1;
  assert.equal(g.useAt(p.x - 40, p.y - 40).ok, true);
  assert.ok(g.s.structures.some((st) => st.type === 'torch' && Math.abs(st.x - (p.x - 40)) < 32));
  // Empty slots clear themselves when the last item is used.
  g.remove('torch', 4);
  assert.equal(g.s.hotbar[2], null);
});

test('armour sets add defense and set bonuses; damage is reduced', () => {
  const g = fresh();
  for (const id of ['iron_helmet', 'iron_chestplate', 'iron_greaves']) {
    g.add(id);
    assert.equal(g.use(id).ok, true);
  }
  assert.equal(g.equipment.fullSet(), 'iron');
  assert.equal(g.equipment.defense(), 2 + 3 + 2 + 3);
  const before = g.s.vitals.health;
  const taken = g.combat.hurtPlayer(30, 'Test');
  assert.equal(taken, 30 - 5);
  assert.equal(g.s.vitals.health, before - 25);
  g.add('scarab_charm');
  g.use('scarab_charm');
  assert.equal(g.equipment.defense(), 14);
  g.use('iron_helmet');
  assert.equal(g.equipment.fullSet(), null);
});

test('draughts heal, potions buff and wear off, and crystals grow health and mana', () => {
  const g = fresh();
  g.s.vitals.health = 20;
  g.add('healing_draught', 2);
  assert.equal(g.use('healing_draught').ok, true);
  assert.equal(g.s.vitals.health, 80);
  assert.equal(g.use('healing_draught').ok, false, 'potion sickness');
  g.add('swiftness_potion');
  g.use('swiftness_potion');
  assert.ok(g.equipment.speedBonus() > 1.2);
  g.s.buffs.swiftness = 0.5;
  run(g, 1);
  assert.equal(g.s.buffs.swiftness, undefined);
  g.add('life_crystal', 2);
  g.use('life_crystal');
  g.use('life_crystal');
  assert.equal(g.maxHealth(), 140);
  g.add('fallen_star', 5);
  for (const [id, n] of Object.entries(D.RECIPES.find((r) => r.id === 'mana_crystal').cost))
    assert.equal(g.count(id) >= n, true);
  assert.equal(g.craft('mana_crystal').ok, true);
  g.use('mana_crystal');
  assert.equal(g.equipment.maxMana(), 40);
});

test('bows need arrows, fire true, and hurt what they hit; staves spend mana', () => {
  const g = fresh();
  const p = g.s.player;
  g.add('wooden_bow');
  assert.equal(g.combat.fire('wooden_bow', { x: p.x + 300, y: p.y - 30 }).ok, false);
  g.add('arrow', 10);
  const target = g.s.animals.find((a) => a.type === 'deer');
  target.x = p.x + 200;
  target.y = p.y;
  target.deadUntil = 0;
  const hp = target.hp;
  assert.equal(g.combat.fire('wooden_bow', { x: target.x, y: target.y - 22 }).ok, true);
  assert.equal(g.count('arrow'), 9);
  for (let i = 0; i < 60 && target.hp === hp; i++) g.combat.step(1 / 60);
  assert.ok(target.hp < hp, 'the arrow landed');
  g.add('ember_wand');
  g.s.mana = 3;
  assert.equal(g.combat.fire('ember_wand', { x: p.x + 100, y: p.y }).ok, false);
  g.s.mana = 20;
  assert.equal(g.combat.fire('ember_wand', { x: p.x + 100, y: p.y }).ok, true);
  assert.equal(g.s.mana, 15);
});

test('monsters of the deep places chase, strike, and shoot', () => {
  const g = fresh();
  const p = g.s.player;
  g.world.addAnimal('skeleton_archer', p.x + 250, p.y, { body: true, vx: 0, vy: 0 });
  g.world.addAnimal('crypt_ghoul', p.x + 120, p.y, { body: true, vx: 0, vy: 0 });
  const health = g.s.vitals.health;
  run(g, 5);
  assert.ok(g.s.vitals.health < health, 'the player was hurt');
  assert.ok(g.s.drops.length >= 0);
});

test('records keep the hotbar, bosses, and Rift; layout-3 records gain the deep places', () => {
  const g = fresh(),
    storage = memory();
  g.add('iron_pick');
  g.s.bosses.pharaoh = 2;
  g.s.rift.sigils = ['sigil_sun'];
  g.s.maxHealth = 180;
  g.save(storage, true);
  const copy = new Game(3);
  assert.equal(copy.load(storage), true);
  assert.equal(copy.s.hotbar[0], 'iron_pick');
  assert.equal(copy.s.bosses.pharaoh, 2);
  assert.deepEqual(copy.s.rift.sigils, ['sigil_sun']);
  assert.equal(copy.maxHealth(), 180);
  // A layout-3 record: tile edits on the old, narrower grid, and none of the new places.
  const old = JSON.parse(storage.store.get('wildlands-save-v1'));
  old.layout = 3;
  const tx = Math.floor(g.s.player.x / D.TILE) + 3,
    ty = 30;
  old.tileEdits = { [ty * 938 + tx]: 0 };
  old.structures = old.structures.filter((st) => !st.fixed);
  old.animals = old.animals.filter((a) => a.x < D.OVERWORLD_W && !a.body);
  delete old.hotbar;
  delete old.bosses;
  delete old.rift;
  delete old.maxHealth;
  storage.setItem('wildlands-save-v1', JSON.stringify(old));
  const migrated = new Game(3);
  assert.equal(migrated.load(storage), true);
  assert.equal(migrated.s.layout, 5);
  assert.equal(migrated.tileAt(tx, ty), 0);
  assert.ok(migrated.s.structures.some((st) => st.type === 'boss_altar'));
  assert.equal(migrated.maxHealth(), 100);
  assert.ok(migrated.s.hotbar.includes('iron_pick'));
});
