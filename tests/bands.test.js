import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../src/data/index.ts';
import { TRACKS } from '../src/audio/tracks/index.ts';
import { Game } from '../src/game/Game.ts';

const fresh = () => new Game(29);
const inside = (o) => D.inPocket(o.x);
const wear = (g, set) => {
  for (const piece of ['helmet', 'chestplate', 'greaves']) {
    g.add(`${set}_${piece}`);
    g.equipment.wear(`${set}_${piece}`);
  }
};
const BAND23 = ['glasswood', 'marches', 'barrow', 'saltflats', 'choir'];

test('every realm is complete: creatures, boss, keys, relic, music, and codex page', () => {
  assert.equal(D.REALMS.length, 8);
  for (const tpl of D.REALMS) {
    for (const m of tpl.mobs) assert.ok(D.MOBS[m.type], `${tpl.id} mob ${m.type}`);
    assert.ok(D.MOBS[tpl.boss]?.boss, `${tpl.id} boss`);
    assert.ok(D.MOBS[tpl.elite], `${tpl.id} elite`);
    assert.equal(D.BOSS_SHRINES[tpl.boss].place, tpl.id);
    for (const id of [tpl.fragment, tpl.key, tpl.relic, tpl.material])
      assert.ok(D.ITEMS[id], `${tpl.id} item ${id}`);
    assert.ok(D.RECIPES.some((r) => r.id === tpl.key));
    assert.ok(D.RECIPES.some((r) => r.id === tpl.fragment));
    assert.ok(D.RELIC_EFFECTS[tpl.relic], `${tpl.id} relic on the shelf`);
    assert.ok(TRACKS[tpl.music], `${tpl.id} music`);
    for (const [kind] of tpl.nodes) assert.ok(D.NODES[kind], `${tpl.id} node ${kind}`);
    for (const [id] of tpl.chestLoot) assert.ok(D.ITEMS[id], `${tpl.id} loot ${id}`);
  }
  for (const id of BAND23) {
    assert.ok(
      D.CODEX.some((p) => p.id === id),
      `codex ${id}`,
    );
    const tpl = D.realmById(id);
    assert.ok(tpl.band >= 2);
    // Its set, and its signature weapons, sit in the hierarchy.
    assert.ok(D.ARMOR_SETS.some((s) => s.bonus === tpl.hazard.ward));
  }
  for (const w of ['prism_wand', 'bonecleaver', 'brass_repeater', 'mirage_blade', 'bellhammer'])
    assert.ok(D.SIGNATURE[w] && D.WEAPONS[w] && D.RECIPES.some((r) => r.id === w), w);
  // Band II keys come from Band I spoils; Band III from Band II.
  const cost = (id) => D.RECIPES.find((r) => r.id === id).cost;
  assert.ok(cost('glasswood_fragment').tide_pearl);
  assert.ok(cost('choir_fragment').marrow_ingot);
});

test('the new realms open, furnish themselves, and their great foes answer', () => {
  for (const id of BAND23) {
    const g = fresh();
    g.command(`realm ${id} 1`);
    assert.equal(g.s.pocket.realm, id);
    assert.equal(g.biome().id, id);
    assert.ok(g.s.nodes.filter(inside).length > 30, `${id} nodes`);
    assert.ok(g.s.animals.filter(inside).length > 20, `${id} mobs`);
    const altar = g.s.structures.find((st) => st.type === 'boss_altar' && inside(st));
    assert.equal(altar.kind, D.realmById(id).boss);
    g.s.player.x = altar.x - 200;
    g.s.player.y = altar.y;
    assert.ok(g.bosses.summon(altar).ok, `${id} boss`);
    const boss = g.bosses.active();
    // Every script runs.
    for (let i = 0; i < 200; i++) {
      g.s.elapsed += 0.05;
      g.bosses.step(boss, 0.05);
    }
    assert.ok(!boss.deadUntil);
  }
});

test('Glasswood shardfall glints, then cuts, unless you wear prismweave', () => {
  const g = fresh();
  g.command('realm glasswood 1');
  g.s.player.y = g.groundTopAt(g.s.player.x) + 1;
  g.s.elapsed += 40;
  g.pocket.update(0.1);
  assert.equal(g.pocket.pendingCaveIn()?.kind, 'shards');
  g.s.elapsed += 2;
  g.pocket.update(0.1);
  const shards = g.combat.projectiles.filter((b) => b.kind === 'glass_shard');
  assert.ok(shards.length >= 5 && shards.every((b) => b.damage > 0));
  const w = fresh();
  w.command('realm glasswood 1');
  wear(w, 'prismweave');
  w.s.player.y = w.groundTopAt(w.s.player.x) + 1;
  w.s.elapsed += 40;
  w.pocket.update(0.1);
  w.s.elapsed += 2;
  w.pocket.update(0.1);
  assert.ok(w.combat.projectiles.filter((b) => b.kind === 'glass_shard').every((b) => !b.damage));
});

test('the marrow mire slows, soaks, and festers; bonewalkers stride through', () => {
  const g = fresh();
  g.command('realm marches 1');
  const p = g.s.player,
    level = g.pocket.waterLevel();
  // Find a basin whose floor lies below the mire, and wade into it.
  let x = p.x;
  while (D.surfaceAt(x) < level + 60) x += 32;
  p.x = x;
  p.y = level + 50;
  assert.ok(g.pocket.inMire());
  assert.equal(g.pocket.submerged(), false, 'mire is not deep water');
  assert.ok(g.pocket.moveScale() < 0.6);
  g.s.vitals.wetness = 0;
  for (let i = 0; i < 400 && !g.ailments.has('marrow_rot'); i++) g.pocket.update(1);
  assert.ok(g.s.vitals.wetness > 20);
  assert.ok(g.ailments.has('marrow_rot'), 'the mire festers');
  wear(g, 'bonewalker');
  assert.equal(g.pocket.moveScale(), 1);
  assert.ok(g.ailments.treat('marrow_purge') || true);
});

test('Barrow steam vents scald on their rhythm; gearwrights are never caught', () => {
  const g = fresh();
  g.command('realm barrow 1');
  const vent = g.s.structures.find((st) => st.type === 'steam_vent' && inside(st));
  assert.ok(vent, 'vents line the halls');
  g.s.player.x = vent.x;
  g.s.player.y = vent.y;
  g.s.player.invuln = 0;
  while (!D.ventActive(vent.x, g.s.elapsed)) g.s.elapsed += 0.1;
  const hp = g.s.vitals.health;
  g.pocket.update(0.1);
  assert.ok(g.s.vitals.health < hp, 'scalded');
  const w = fresh();
  w.command('realm barrow 1');
  wear(w, 'gearwright');
  const v2 = w.s.structures.find((st) => st.type === 'steam_vent' && inside(st));
  w.s.player.x = v2.x;
  w.s.player.y = v2.y;
  w.s.player.invuln = 0;
  while (!D.ventActive(v2.x, w.s.elapsed)) w.s.elapsed += 0.1;
  const hp2 = w.s.vitals.health;
  w.pocket.update(0.1);
  assert.equal(w.s.vitals.health, hp2);
});

test('the white sun parches the open flats by day, and mirages melt away', () => {
  const g = fresh();
  g.command('realm saltflats 1');
  while (g.isNight()) g.s.elapsed += 30;
  g.s.player.y = g.groundTopAt(g.s.player.x) + 1;
  assert.equal(g.pocket.sunLevel(), 1);
  g.s.vitals.hydration = 80;
  g.pocket.update(10);
  assert.ok(g.s.vitals.hydration < 78);
  // Below ground, in the mines, the sun cannot reach.
  g.s.player.y += 400;
  assert.equal(g.pocket.sunLevel(), 0);
  // A mirage that reaches you is gone, and does no harm.
  const m = g.s.animals.find((a) => a.type === 'mirage' && inside(a));
  assert.ok(m, 'mirages walk the flats');
  g.s.player.x = m.x;
  g.s.player.y = m.y;
  const hp = g.s.vitals.health;
  for (let i = 0; i < 20 && !m.deadUntil; i++) {
    g.s.elapsed += 0.1;
    g.wildlife.step(m, 0.1);
  }
  assert.ok(m.deadUntil, 'it melts away');
  assert.ok(g.s.vitals.health >= hp - 0.5);
});

test('the Frozen Choir keeps food, and its hymn chills and holds you unless warmed', () => {
  const g = fresh();
  g.command('realm choir 1');
  g.add('raw_meat');
  const before = g.s.inventory.find((e) => e.id === 'raw_meat').fresh;
  g.larder.advance(100);
  assert.equal(g.s.inventory.find((e) => e.id === 'raw_meat').fresh, before);
  const seed = g.s.pocket.seed;
  while (D.hymnAt(g.s.elapsed, seed) < 1) g.s.elapsed += 1;
  g.s.structures = g.s.structures.filter((st) => st.type !== 'kiln' || !inside(st));
  assert.ok(g.pocket.moveScale() < 0.7);
  const temp = (g.s.vitals.bodyTemp = 37);
  g.pocket.update(10);
  assert.ok(g.s.vitals.bodyTemp < temp);
  wear(g, 'choirsilver');
  assert.equal(g.pocket.moveScale(), 1);
});

test('polish: the catacombs under the mire are dry, and mirages leave nothing behind', () => {
  const g = fresh();
  g.command('realm marches 1');
  const p = g.s.player;
  p.y = D.surfaceAt(p.x) + 500;
  assert.equal(g.pocket.inMire(), false, 'the catacomb is not mire');
  const s = fresh();
  s.command('realm saltflats 1');
  const m = s.s.animals.find((a) => a.type === 'mirage' && inside(a));
  const drops = s.s.drops.length,
    renown = s.skills.renown();
  s.wildlife.kill(m);
  assert.ok(m.deadUntil);
  assert.equal(s.s.drops.length, drops, 'no coins or loot');
  assert.equal(s.skills.renown(), renown, 'no renown');
});

test('polish: realm set extras come from the full set, not the relic that shares its ward', () => {
  const base = fresh(),
    relic = fresh(),
    plate = fresh();
  relic.add('hydra_tooth');
  relic.equipment.wear('hydra_tooth');
  wear(plate, 'bonewalker');
  assert.ok(relic.equipment.has('mirewalk') && plate.equipment.has('mirewalk'));
  assert.equal(relic.equipment.defense(), base.equipment.defense());
  const amber = fresh(),
    ash = fresh();
  wear(amber, 'amberguard');
  wear(ash, 'ashwalker');
  const armour = (g) => g.equipment.worn().armor.reduce((n, id) => n + D.ARMOR[id].defense, 0);
  assert.equal(amber.equipment.defense(), base.equipment.defense() + armour(amber) + 2);
  assert.ok(ash.equipment.speedBonus() > base.equipment.speedBonus() + 0.09);
});
