import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../src/data/index.ts';
import { Game } from '../src/game/Game.ts';

const fresh = () => new Game(17);
const memory = () => {
  const store = new Map();
  return { setItem: (k, v) => store.set(k, v), getItem: (k) => store.get(k), store };
};
/** Builds a Waystone beside the player and stands at it. */
const waystone = (g) => {
  const x = g.s.player.x + 60;
  g.add('waystone');
  const r = g.place('waystone', x, g.groundTopAt(x));
  assert.ok(r?.ok !== false, r?.reason);
  return g.s.structures.find((st) => st.type === 'waystone');
};
const inside = (o) => D.inPocket(o.x);

test('realms are built from their seed: the same seed gives the same land, others differ', () => {
  for (const tpl of D.REALMS) {
    const a = tpl.build(1234),
      b = tpl.build(1234),
      c = tpl.build(98765);
    let same = 0,
      differ = 0;
    for (let x = 100; x < D.RW - 100; x += 97)
      for (let y = 600; y < 3000; y += 83) {
        if (a.tile(x, y) === b.tile(x, y)) same++;
        if (a.tile(x, y) !== c.tile(x, y)) differ++;
      }
    assert.equal(same, Math.ceil((D.RW - 200) / 97) * Math.ceil(2400 / 83), tpl.id);
    assert.ok(differ > 100, `${tpl.id} seeds differ`);
    // Walls of bedrock at both ends, and open ground where travellers arrive.
    assert.equal(a.tile(10, 1500), 27);
    assert.equal(a.tile(a.arrive, a.floors[0](a.arrive) - 40), 0, `${tpl.id} arrival is open`);
    assert.ok(a.tile(a.arrive, a.floors[0](a.arrive) + 20), `${tpl.id} arrival has a floor`);
  }
});

test('a Waystone and a key open a realm; the key is spent and tiers unlock in order', () => {
  const g = fresh();
  assert.equal(g.pocket.open('orchard', 1).ok, false, 'no Waystone');
  waystone(g);
  assert.match(g.pocket.open('orchard', 1).reason, /key/);
  g.add('orchard_key', 2);
  assert.equal(g.pocket.open('orchard', 2).ok, false, 'tier II is locked');
  const home = { x: g.s.player.x, y: g.s.player.y };
  assert.ok(g.pocket.open('orchard', 1).ok);
  assert.equal(g.count('orchard_key'), 1);
  assert.equal(g.s.pocket.realm, 'orchard');
  assert.equal(g.biome().id, 'orchard');
  assert.equal(g.layer().id, 'orchard');
  assert.ok(g.pocket.here());
  // You arrive standing on ground, with a way home beside you.
  const p = g.s.player;
  assert.ok(g.tileAt(Math.floor(p.x / 32), Math.floor((p.y + 4) / 32)));
  assert.ok(g.s.structures.some((st) => st.type === 'portal' && inside(st)));
  // It is furnished: resources, monsters, chests, and the great foe's altar.
  assert.ok(g.s.nodes.filter(inside).length > 40);
  assert.ok(g.s.animals.filter(inside).length > 20);
  assert.ok(g.s.structures.filter((st) => st.type === 'dungeon_chest' && inside(st)).length >= 3);
  assert.ok(g.s.structures.some((st) => st.type === 'boss_altar' && st.kind === 'orchard_mother'));
  // Shrines bless you once.
  const shrine = g.s.structures.find((st) => st.type === 'shrine' && inside(st));
  assert.ok(shrine, 'a shrine');
  assert.ok(g.pocket.pray(shrine).ok);
  assert.ok(Object.keys(g.s.buffs).length);
  assert.equal(g.pocket.pray(shrine).ok, false);
  // The portal leads back to the Waystone, and the realm stays open behind you.
  const portal = g.s.structures.find((st) => st.type === 'portal' && inside(st));
  p.x = portal.x + 10;
  p.y = portal.y;
  assert.ok(g.interact().ok);
  assert.ok(Math.abs(p.x - home.x) < 200);
  assert.equal(g.s.pocket.realm, 'orchard');
  assert.ok(g.pocket.resume().ok);
  assert.ok(g.pocket.here());
});

test('opening another realm replaces the last, land, creatures, and changes alike', () => {
  const g = fresh();
  waystone(g);
  g.add('orchard_key');
  g.add('warren_key');
  g.pocket.open('orchard', 1);
  const tx = Math.floor((D.POCKET.start + 2000) / 32);
  g.setTile(tx, 20, 12);
  assert.ok(Object.keys(g.s.tileEdits).some((k) => +k % D.TILE_COLS === tx));
  g.pocket.leave();
  g.pocket.open('warren', 1);
  assert.equal(D.POCKET.id, 'warren');
  assert.ok(!Object.keys(g.s.tileEdits).some((k) => +k % D.TILE_COLS === tx));
  assert.ok(!g.s.animals.some((a) => a.type === 'bog_crab'));
  assert.ok(g.s.animals.some((a) => a.type === 'warren_rat'));
  // The Warren is all burrow: rock overhead, and you arrive in a tunnel.
  assert.equal(D.surfaceAt(g.s.player.x), 0);
  const tx2 = Math.floor(g.s.player.x / 32),
    ty2 = Math.floor(g.s.player.y / 32);
  assert.ok(
    [...Array(20)].some((_, k) => g.tileAt(tx2, ty2 - 2 - k)),
    'rock overhead',
  );
});

test('tier and modifiers scale monsters, harm, and loot', () => {
  const g = fresh();
  g.pocket.record('steppe').best = 3;
  g.command('realm steppe 1');
  const low = g.s.animals.find((a) => a.type === 'ash_hound' && inside(a)).maxHp;
  g.command('realm steppe 4');
  const inst = g.s.pocket;
  assert.equal(inst.tier, 4);
  assert.equal(inst.mods.length, 3);
  assert.equal(new Set(inst.mods).size, 3);
  const high = g.s.animals.find((a) => a.type === 'ash_hound' && inside(a)).maxHp;
  assert.ok(high >= low * D.TIER_SCALE.hp(4) * 0.99, `${high} vs ${low}`);
  assert.ok(g.pocket.damageScale() >= D.TIER_SCALE.damage(4));
  assert.ok(g.pocket.lootScale(g.s.player.x) > D.TIER_SCALE.loot(4));
  // Outside the realm nothing is scaled.
  assert.equal(g.pocket.lootScale(1000), 1);
  // Modifiers roll one fewer than the tier, and never both extremes of temperature.
  for (let seed = 1; seed < 200; seed++) {
    let k = 0;
    const mods = D.rollMods(5, () => ((Math.sin(seed * 99.1 + k++ * 7.3) + 1) / 2) % 1);
    assert.equal(mods.length, 4);
    assert.ok(!(mods.includes('frostbound') && mods.includes('scorched')));
  }
});

test('the great foe falls once per expedition; the tier is cleared and the relic won', () => {
  const g = fresh();
  g.command('realm warren 1');
  g.command('god');
  const altar = g.s.structures.find((st) => st.type === 'boss_altar' && st.kind === 'warren_queen');
  g.s.player.x = altar.x - 120;
  g.s.player.y = altar.y;
  assert.ok(g.bosses.summon(altar).ok);
  const boss = g.bosses.active();
  assert.equal(boss.type, 'warren_queen');
  for (let i = 0; i < 240; i++) g.tick(1 / 60);
  g.wildlife.kill(boss);
  assert.ok(g.s.pocket.cleared);
  const rec = g.s.realms.warren;
  assert.equal(rec.best, 1);
  assert.ok(rec.relic);
  assert.equal(g.count('queens_mandible'), 1);
  assert.equal(g.pocket.maxTier('warren'), 2);
  assert.equal(g.bosses.summon(altar).ok, false, 'spent until a new expedition');
  // The relic is worn like any accessory.
  assert.ok(g.equipment.wear('queens_mandible').ok);
  assert.ok(g.equipment.has('tremor'));
});

test('each realm has its hazard: tide, ash storms, and cave-ins', () => {
  const g = fresh();
  g.command('realm orchard 1');
  const p = g.s.player;
  const level = g.pocket.waterLevel();
  assert.ok(level > 1000 && level < 2000);
  // Stand below the tide line and you wade: slow, soaked, and chilled.
  p.y = level + 200;
  assert.ok(g.pocket.submerged());
  g.s.vitals.wetness = 0;
  g.pocket.update(1);
  assert.ok(g.s.vitals.wetness > 4);
  g.add('tide_conch');
  g.equipment.wear('tide_conch');
  assert.equal(g.pocket.submerged(), false, 'the conch lets you swim');

  const h = fresh();
  h.command('realm steppe 1');
  const seed = h.s.pocket.seed;
  while (D.ashStorm(h.s.elapsed, seed) < 1) h.s.elapsed += 1;
  h.s.player.y = h.groundTopAt(h.s.player.x) + 1;
  assert.ok(h.pocket.ashLevel() > 0.9);
  h.s.vitals.stamina = 100;
  h.pocket.update(2);
  assert.ok(h.s.vitals.stamina < 100, 'the storm chokes');
  for (const piece of ['ashwalker_helmet', 'ashwalker_chestplate', 'ashwalker_greaves']) {
    h.add(piece);
    h.equipment.wear(piece);
  }
  h.s.vitals.stamina = 100;
  h.pocket.update(2);
  assert.equal(h.s.vitals.stamina, 100, 'ashcloth keeps it out');

  const w = fresh();
  w.command('realm warren 1');
  w.s.elapsed += 60;
  w.pocket.update(0.1);
  assert.ok(w.pocket.pendingCaveIn());
  w.s.elapsed += 3;
  const shots = w.combat.projectiles.length;
  w.pocket.update(0.1);
  assert.ok(w.combat.projectiles.filter((b) => b.kind === 'falling_rock').length > shots - 1);
  assert.ok(w.combat.projectiles.some((b) => b.kind === 'falling_rock'));
});

test('modifiers bend the rules: hunger, gravity, echoes, and collapse', () => {
  const g = fresh();
  g.command('realm orchard 1');
  g.s.pocket.mods = ['hungering', 'low_gravity', 'echoing', 'unstable'];
  assert.equal(g.pocket.drainScale(), 1.5);
  assert.ok(g.pocket.gravityScale() < 1);
  const crab = g.s.animals.find((a) => a.type === 'bog_crab' && inside(a));
  const before = g.s.animals.length;
  g.wildlife.kill(crab);
  const echoes = g.s.animals.slice(before);
  assert.equal(echoes.length, 2);
  assert.ok(echoes.every((a) => a.echo && a.maxHp < crab.maxHp));
  g.wildlife.kill(echoes[0]);
  assert.equal(g.s.animals.length, before + 2, 'echoes do not split again');
  // Unstable realms collapse and throw you home.
  g.s.elapsed += 601;
  g.pocket.update(0.1);
  assert.equal(g.s.pocket, null);
  assert.equal(D.POCKET.id, 'pocket');
  assert.ok(!g.pocket.here());
  assert.ok(!g.s.animals.some(inside));
});

test('the open realm survives a save, and older records move to the wider grid', () => {
  const g = fresh();
  g.command('realm steppe 2');
  const tx = Math.floor((D.POCKET.start + 3000) / 32);
  g.setTile(tx, 30, 12);
  const mem = memory();
  g.save(mem, true);
  const back = fresh();
  assert.equal(D.POCKET.id, 'pocket', 'a fresh game empties the pocket');
  back.load(mem);
  assert.equal(back.s.pocket.realm, 'steppe');
  assert.equal(D.POCKET.id, 'steppe');
  assert.equal(back.tileAt(tx, 30), 12);
  assert.deepEqual(back.s.tiles, g.s.tiles);

  // A layout-4 record: edits indexed on the narrower grid.
  const old = fresh();
  const OLD = 1918,
    i = 25 * OLD + 400;
  const rec = JSON.parse(JSON.stringify({ ...old.s, tiles: undefined }));
  rec.layout = 4;
  rec.tileEdits = { [i]: 13 };
  rec.wallEdits = { [i]: 11 };
  delete rec.pocket;
  const mem2 = memory();
  mem2.setItem('wildlands-field-record', JSON.stringify(rec));
  const up = fresh();
  assert.ok(up.load({ ...mem2, getItem: () => JSON.stringify(rec) }));
  assert.equal(up.s.layout, 5);
  assert.equal(up.tileAt(400, 25), 13);
  assert.equal(up.wallAt(400, 25), 11);
});
