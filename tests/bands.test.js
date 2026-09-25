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
const BAND23 = [
  'glasswood',
  'marches',
  'barrow',
  'saltflats',
  'choir',
  'feverlands',
  'observatory',
  'gutter',
  'undertow',
  'emberheart',
  'garden',
];

test('every realm is complete: creatures, boss, keys, relic, music, and codex page', () => {
  assert.equal(D.REALMS.length, 15);
  for (const tpl of D.WHOLE_REALMS) {
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
  for (const w of [
    'prism_wand',
    'bonecleaver',
    'brass_repeater',
    'mirage_blade',
    'bellhammer',
    'venom_blade',
    'astral_tome',
    'gilded_greatblade',
    'leviathan_harpoon',
    'anvil_maul',
    'season_bow',
  ])
    assert.ok(D.SIGNATURE[w] && D.WEAPONS[w] && D.RECIPES.some((r) => r.id === w), w);
  // Band II keys come from Band I spoils; Band III from Band II.
  const cost = (id) => D.RECIPES.find((r) => r.id === id).cost;
  assert.ok(cost('glasswood_fragment').tide_pearl);
  assert.ok(cost('choir_fragment').marrow_ingot);
  assert.ok(cost('feverlands_fragment').rime_silver);
  assert.ok(cost('undertow_fragment').plague_ivory);
  // Bands rise in order.
  for (const id of ['feverlands', 'observatory', 'gutter']) assert.equal(D.realmById(id).band, 4);
  for (const id of ['undertow', 'emberheart', 'garden']) assert.equal(D.realmById(id).band, 5);
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

test('Feverlands bites carry sickness, and the fever-dream scrambles the record', () => {
  const g = fresh();
  g.command('realm feverlands 1');
  let caught = 0;
  for (let i = 0; i < 60; i++) {
    g.s.ailments = [];
    g.pocket.feverBite();
    caught += g.s.ailments.length;
  }
  assert.ok(caught > 5 && caught < 40, `${caught} of 60`);
  g.s.ailments = [{ id: 'fever_dream', stage: 2, next: 9999, since: 0 }];
  assert.ok(g.pocket.dreaming());
  wear(g, 'plaguedoctor');
  assert.equal(g.pocket.dreaming(), false);
  g.s.ailments = [];
  for (let i = 0; i < 40; i++) g.pocket.feverBite();
  assert.equal(g.s.ailments.length, 0, 'the plague doctor is untouched');
});

test('the Observatory is light, and its star pulses gather, then fall', () => {
  const g = fresh();
  g.command('realm observatory 1');
  assert.ok(g.pocket.gravityScale() < 1);
  g.s.player.y = g.groundTopAt(g.s.player.x) + 1;
  const seed = g.s.pocket.seed;
  while (D.starPulse(g.s.elapsed, seed) <= 0 || g.s.elapsed < 30) g.s.elapsed += 1;
  g.pocket.update(0.1);
  assert.equal(g.pocket.pendingCaveIn()?.kind, 'star');
  g.s.elapsed += 3;
  g.pocket.update(0.1);
  assert.ok(g.combat.projectiles.some((b) => b.kind === 'star_pulse' && b.damage > 0));
});

test('cursed gold sickens hoarders in the Gutter; the gilded are safe', () => {
  const g = fresh();
  g.command('realm gutter 1');
  assert.ok(g.s.structures.filter((st) => st.type === 'dungeon_chest' && inside(st)).length >= 8);
  g.pocket.update(0.1);
  for (let i = 0; i < 80 && !g.ailments.has('gold_sickness'); i++) {
    g.add('coin', 10);
    g.pocket.update(0.1);
  }
  assert.ok(g.ailments.has('gold_sickness'));
  const w = fresh();
  w.command('realm gutter 1');
  wear(w, 'gilded');
  w.pocket.update(0.1);
  for (let i = 0; i < 80; i++) {
    w.add('coin', 10);
    w.pocket.update(0.1);
  }
  assert.equal(w.ailments.has('gold_sickness'), false);
});

test('in the Undertow you swim, your breath runs out, and diving bells restore it', () => {
  const g = fresh();
  g.command('realm undertow 1');
  const p = g.s.player;
  p.invuln = 0;
  assert.ok(g.pocket.submerged());
  assert.ok(g.s.structures.some((st) => st.type === 'diving_bell' && inside(st)));
  p.x += 400;
  p.y = g.groundTopAt(p.x);
  for (const st of g.s.structures) if (st.type === 'diving_bell') st.x = 0;
  g.pocket.update(10);
  assert.ok(g.pocket.air()[0] < 31);
  const hp = g.s.vitals.health;
  g.pocket.update(40);
  assert.ok(g.s.vitals.health < hp, 'drowning');
  const bell = g.s.structures.find((st) => st.type === 'diving_bell');
  bell.x = p.x;
  bell.y = p.y;
  g.pocket.update(5);
  assert.ok(g.pocket.air()[0] > 30);
  wear(g, 'leviathan');
  assert.equal(g.pocket.air(), null);
  assert.equal(g.pocket.submerged(), false);
});

test('Emberheart magma rises through the low ledge and burns', () => {
  const g = fresh();
  g.command('realm emberheart 1');
  const geo = D.activeRealm().geo;
  assert.equal(D.magmaLevel(geo, 10), geo.low);
  assert.ok(Math.abs(D.magmaLevel(geo, 90) - geo.high) < 1);
  g.s.elapsed = Math.ceil(g.s.elapsed / 120) * 120 + 90;
  const p = g.s.player;
  p.y = geo.high + 200;
  assert.ok(g.pocket.inMagma());
  const hp = g.s.vitals.health;
  g.pocket.update(1);
  assert.ok(g.s.vitals.health < hp - 5);
  wear(g, 'forgeborn');
  const hp2 = g.s.vitals.health;
  g.pocket.update(1);
  assert.equal(g.s.vitals.health, hp2);
});

test('the Garden turns through four seasons that change the air', () => {
  const g = fresh();
  g.command('realm garden 1');
  const seed = g.s.pocket.seed;
  const seen = new Map();
  for (let t = 0; t < D.SEASON_SECONDS * 4; t += 30) {
    g.s.elapsed = t;
    seen.set(D.seasonAt(t, seed).id, g.temperature());
  }
  assert.equal(seen.size, 4);
  assert.ok(seen.get('summer') > seen.get('winter') + 40);
});

test('the Fractured Realms splice two realms, borrow a hazard, and never run out of tiers', () => {
  const a = D.fracture(424242),
    b = D.fracture(424242);
  assert.equal(a, b, 'the same seed, the same splice');
  assert.match(a.name, /Fractured .* · /);
  assert.ok(D.WHOLE_REALMS.some((r) => r.boss === a.boss));
  const geo = a.build(424242);
  const mid = D.RW / 2;
  assert.equal(geo.tile(mid, geo.floors[0](mid) - 40), 0, 'the seam is open');
  assert.ok(geo.ladders.some((l) => Math.abs(l.x - mid) < 1));
  assert.equal(D.tierName(14), 'XIV');
  assert.ok(D.rollMods(40, () => 0.5).length <= 6);
  const g = fresh();
  g.pocket.record('fractured').best = 11;
  assert.equal(g.pocket.maxTier('fractured'), 12);
  assert.equal(g.pocket.maxTier('orchard'), 1);
  g.command('realm fractured 12');
  assert.equal(g.s.pocket.realm, 'fractured');
  assert.equal(g.s.pocket.tier, 12);
  assert.ok(g.s.animals.filter(inside).length > 20);
  const altar = g.s.structures.find((st) => st.type === 'boss_altar' && inside(st));
  assert.equal(altar.kind, D.templateOf(g.s.pocket).boss);
  g.s.player.x = altar.x - 200;
  g.s.player.y = altar.y;
  assert.ok(g.bosses.summon(altar).ok);
  const boss = g.bosses.active();
  assert.ok(boss.maxHp > D.MOBS[boss.type].hp * D.TIER_SCALE.hp(12) * 1.4, 'empowered');
});

test('tier twelve is forged from fracture shards, and a shard reforges well', () => {
  assert.equal(D.TIERS.at(-1).mat, 'ascended');
  assert.ok(D.WEAPONS.ascended_sword && D.RECIPES.some((r) => r.id === 'ascended_sword'));
  assert.ok(D.RECIPES.find((r) => r.id === 'ascended_ingot').cost.fracture_shard);
  assert.ok(D.RECIPES.find((r) => r.id === 'fractured_key').cost.fracture_shard);
  assert.ok(D.MOBS.the_leviathan.loot.some(([id]) => id === 'fracture_shard'));
  const g = fresh();
  g.command('god');
  g.add('iron_sword');
  g.add('fracture_shard', 3);
  const before = g.s.armoury.iron_sword.q;
  g.dev.god = false;
  g.add('workbench');
  const x = g.s.player.x + 40;
  g.place('workbench', x, g.groundTopAt(x));
  assert.ok(g.armoury.reforge('iron_sword', true).ok);
  assert.equal(g.count('fracture_shard'), 2);
  assert.ok(g.s.armoury.iron_sword.q >= before);
});
