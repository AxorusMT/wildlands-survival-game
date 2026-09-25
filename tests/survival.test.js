import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../src/data/index.ts';
import { Game } from '../src/game/Game.ts';

const fresh = () => new Game(17);
const place = (g, type, dx = 40) => {
  const x = g.s.player.x + dx;
  g.add(type);
  const r = g.place(type, x, g.groundTopAt(x));
  assert.ok(r?.ok !== false, r?.reason);
  return g.s.structures.find((st) => st.type === type && !st.fixed);
};
const standIn = (g, biome) => {
  const x = D.BIOME_CENTERS[biome][0];
  g.s.player.x = x;
  g.s.player.y = g.groundTopAt(x) + 1;
};

test('heat speeds rot and cold slows it', () => {
  assert.equal(D.rotRate(15), 1);
  assert.ok(D.rotRate(-15) < 0.4);
  assert.ok(D.rotRate(40) > 2);
  assert.equal(D.meltRate(-5), 0);
  assert.ok(D.meltRate(38) > 2);
  const hot = fresh(),
    cold = fresh();
  standIn(hot, 'desert');
  standIn(cold, 'tundra');
  hot.s.elapsed = cold.s.elapsed = 400; // midday
  for (const g of [hot, cold]) g.add('raw_meat');
  hot.survival.advanceDecay(100);
  cold.survival.advanceDecay(100);
  const left = (g) => g.s.inventory.find((e) => e.id === 'raw_meat').fresh;
  assert.ok(left(hot) < left(cold) - 60, `${left(hot)} vs ${left(cold)}`);
});

test('the cold-storage ladder keeps food, and ice melts faster in the heat', () => {
  const g = fresh();
  const box = place(g, 'icebox');
  box.fuel = 0;
  g.add('raw_meat', 3);
  assert.ok(g.larder.stow(box, 'raw_meat', 2).ok);
  assert.equal(g.count('raw_meat'), 1);
  assert.equal(box.larder.length, 2);
  // Without ice it is only a box.
  g.survival.advanceDecay(50);
  assert.ok(box.larder[0].fresh < 500 - 45);
  // With ice, food keeps.
  g.add('ice', 2);
  assert.ok(g.larder.refuel(box).ok);
  assert.equal(box.fuel, D.STORAGE.icebox.per);
  const before = box.larder[0].fresh;
  g.survival.advanceDecay(100);
  assert.ok(Math.abs(before - box.larder[0].fresh - 18) < 1, 'ages at 0.18');
  // Taking it back returns its freshness to the pack.
  assert.ok(g.larder.take(box, 'raw_meat').ok);
  assert.equal(g.count('raw_meat'), 2);
  // Iceboxes fill up.
  g.add('berry', 20);
  let r;
  for (let i = 0; i < 20; i++) r = g.larder.stow(box, 'berry');
  assert.equal(r.ok, false);
  assert.match(r.reason, /full/);
  // In the desert heat the same ice melts much faster.
  const h = fresh();
  standIn(h, 'desert');
  h.s.elapsed = 400;
  const hot = place(h, 'icebox');
  hot.fuel = 600;
  h.survival.advanceDecay(100);
  assert.ok(hot.fuel < 600 - 130, `desert ice ${hot.fuel}`);
  // A snow cellar in the tundra needs no ice at all; a rime vault never does.
  const t = fresh();
  standIn(t, 'tundra');
  const cellar = place(t, 'snow_cellar');
  cellar.fuel = 0;
  assert.ok(t.larder.cold(cellar));
  const vault = place(t, 'rime_vault', 120);
  assert.ok(t.larder.cold(vault));
  assert.ok(t.larder.multiplier(vault) < t.larder.multiplier(cellar));
});

test('ice in the pack melts into water unless it is freezing out, and a satchel slows it', () => {
  const g = fresh();
  g.s.elapsed = 400;
  g.add('ice', 3);
  g.survival.advanceDecay(800);
  assert.equal(g.count('ice'), 2);
  assert.ok(g.count('wild_water') >= 1);
  const c = fresh();
  standIn(c, 'tundra');
  c.add('ice', 3);
  c.survival.advanceDecay(2000);
  assert.equal(c.count('ice'), 3);
  // Cooling charms keep the pack's food longer.
  const s = fresh();
  s.add('insulated_satchel');
  s.equipment.wear('insulated_satchel');
  s.add('raw_meat');
  s.survival.advanceDecay(100);
  assert.ok(s.s.inventory.find((e) => e.id === 'raw_meat').fresh > 500 - 80);
});

test('food goes stale, then spoiled, then rotten, and each is worse to eat', () => {
  const g = fresh();
  g.add('cooked_meat', 3);
  const [a, b, c] = g.s.inventory.filter((e) => e.id === 'cooked_meat');
  const life = D.ITEMS.cooked_meat[2];
  a.fresh = life * 0.15;
  b.fresh = life * 0.05;
  c.fresh = -1;
  assert.equal(g.itemState(a), 'stale');
  assert.equal(g.itemState(b), 'spoiled');
  assert.equal(g.itemState(c), 'rotten');
  // Stale food nourishes less.
  g.s.vitals.calories = 10;
  g.s.inventory = [a];
  g.use('cooked_meat');
  assert.ok(g.s.vitals.calories < 10 + D.FOOD.cooked_meat[0] * 0.8);
  // Spoiled food can sicken you.
  g.rng = () => 0;
  g.s.inventory = [b];
  g.use('cooked_meat');
  assert.ok(g.ailments.has('food_poisoning'));
});

test('an ailment incubates, shows, worsens, and yields to its treatment', () => {
  const g = fresh();
  assert.ok(g.ailments.contract('fever'));
  assert.equal(g.s.disease, null, 'no symptoms yet');
  g.s.elapsed += 25;
  g.ailments.update(0.1);
  assert.ok(g.messages.some((m) => /feel a little off/.test(m.message)));
  g.s.elapsed += 20;
  g.ailments.update(0.1);
  assert.equal(g.s.disease, 'fever');
  assert.equal(g.ailments.list()[0].stage, 1);
  // Left alone in poor health it worsens.
  g.s.vitals.hydration = 10;
  g.s.elapsed += D.DISEASES.fever.worsen + 1;
  g.ailments.update(0.1);
  assert.equal(g.ailments.list()[0].stage, 2);
  const stamina = (g.s.vitals.stamina = 100);
  g.ailments.update(10);
  assert.ok(g.s.vitals.stamina < stamina, 'it drains');
  // Treated, it goes, and leaves you immune for a while.
  g.add('fever_remedy');
  g.use('fever_remedy');
  assert.equal(g.ailments.has('fever'), false);
  assert.equal(g.s.disease, null);
  assert.equal(g.ailments.contract('fever'), false, 'immune');
});

test('ailments pass off, chain, and some cannot be cured too late', () => {
  // Mild food poisoning passes if you are fed and watered.
  const g = fresh();
  g.ailments.contract('food_poisoning', true);
  for (let i = 0; i < 40; i++) {
    g.s.vitals.hydration = g.s.vitals.calories = 80;
    g.ailments.update(5);
  }
  assert.equal(g.ailments.has('food_poisoning'), false);
  // A critical infected wound can turn to blood poisoning.
  const w = fresh();
  w.ailments.contract('wound', true);
  w.ailments.list()[0].stage = 3;
  w.rng = () => 0;
  w.ailments.update(1);
  assert.ok(w.ailments.has('blood_poisoning'));
  // Rabies serum works only before it takes hold.
  const r = fresh();
  r.ailments.contract('rabies', true);
  r.ailments.list()[0].stage = 2;
  r.add('rabies_serum');
  r.use('rabies_serum');
  assert.ok(r.ailments.has('rabies'));
  // A field vaccine keeps rabies, tetanus, and cholera away.
  const v = fresh();
  v.add('field_vaccine');
  v.use('field_vaccine');
  assert.equal(v.ailments.contract('tetanus'), false);
  assert.equal(v.ailments.contract('cholera'), false);
});

test('cold, heat, and a diet without greens bring ailments that ease when the cause is gone', () => {
  const g = fresh();
  g.s.vitals.bodyTemp = 34;
  for (let i = 0; i < 100; i++) g.ailments.update(1);
  assert.ok(g.ailments.has('hypothermia'));
  assert.ok(g.ailments.speedScale() < 1, 'it slows you');
  g.s.vitals.bodyTemp = 37;
  for (let i = 0; i < 20; i++) g.ailments.update(1);
  assert.equal(g.ailments.has('hypothermia'), false);
  const s = fresh();
  s.s.vitals.vitamins = 5;
  for (let i = 0; i < 250; i++) s.ailments.update(1);
  assert.ok(s.ailments.has('scurvy'));
  s.add('berry_preserves', 4);
  for (let i = 0; i < 4; i++) s.use('berry_preserves');
  for (let i = 0; i < 20; i++) s.ailments.update(1);
  assert.equal(s.ailments.has('scurvy'), false);
});

test('heavy blows cause injuries; bandages and splints treat them', () => {
  const g = fresh();
  g.rng = () => 0;
  g.combat.hurtPlayer(50, 'A test blow');
  assert.ok(g.ailments.has('bleeding'));
  assert.ok(g.ailments.has('fracture'));
  const speed = g.ailments.speedScale();
  assert.ok(speed < 0.95);
  g.add('bandage');
  g.use('bandage');
  assert.equal(g.ailments.has('bleeding'), false);
  g.add('splint');
  g.use('splint');
  assert.equal(g.ailments.has('fracture'), false);
  // Fire burns.
  g.s.player.invuln = 0;
  g.combat.hurtPlayer(10, 'Flames', undefined, 'fire');
  assert.ok(g.ailments.has('burn'));
});

test('meals leave comforts behind them, and realm water must be filtered', () => {
  const g = fresh();
  g.add('hearty_stew');
  g.use('hearty_stew');
  assert.ok(g.s.buffs.well_fed > 0);
  assert.ok(g.equipment.has('buff:well_fed'));
  g.add('ember_chili');
  g.use('ember_chili');
  assert.ok(g.s.buffs.warm_belly > 0);
  // Water gathered in a realm is brackish, and can carry cholera.
  g.command('realm orchard 1');
  const pond = { kind: 'water', x: g.s.player.x + 10, y: g.s.player.y, hp: Infinity };
  g.s.nodes.push(pond);
  const r = g.gather(pond);
  assert.equal(r.id, 'brackish_water');
  g.rng = () => 0;
  g.use('brackish_water');
  assert.ok(g.ailments.has('cholera'));
  // A water filter makes it safe.
  assert.ok(D.RECIPES.find((x) => x.id === 'filtered_water' && x.station === 'water_filter'));
});

test('older records keep their disease as an ailment already showing', () => {
  const g = fresh();
  const store = new Map();
  const rec = JSON.parse(JSON.stringify({ ...g.s, tiles: undefined }));
  rec.disease = 'wound';
  delete rec.ailments;
  delete rec.vitals.vitamins;
  store.set('wildlands-save-v1', JSON.stringify(rec));
  const back = fresh();
  back.load({ setItem: (k, v) => store.set(k, v), getItem: (k) => store.get(k) });
  assert.ok(back.ailments.has('wound'));
  assert.equal(back.s.disease, 'wound');
  assert.equal(back.s.vitals.vitamins, 70);
});

test('clothing layers keep out cold, heat, and rain, and wear through until mended', () => {
  const g = fresh();
  for (const id of ['wool_underlayer', 'fur_jerkin', 'oilskin_coat']) {
    g.add(id);
    assert.ok(g.equipment.wear(id).ok);
  }
  const shield = g.equipment.clothingShield();
  assert.equal(shield.insul, 3 + 6 + 2);
  assert.ok(shield.water >= 0.7);
  // A second garment of the same layer replaces the first.
  g.add('fur_cloak');
  g.equipment.wear('fur_cloak');
  assert.equal(g.s.player.clothing.outer, 'fur_cloak');
  // Warmer in the tundra than without.
  const bare = fresh();
  for (const h of [g, bare]) {
    standIn(h, 'tundra');
    h.s.vitals.bodyTemp = 36;
    for (let i = 0; i < 60; i++) h.survival.update(1);
  }
  assert.ok(g.s.vitals.bodyTemp > bare.s.vitals.bodyTemp + 0.2);
  // Worn through, it keeps nothing out; mended at a workbench, it is whole again.
  g.s.wear = { fur_cloak: 100 };
  assert.equal(g.equipment.clothingShield().insul, 3 + 6);
  g.add('fiber', 10);
  g.add('hide', 5);
  g.add('workbench');
  const x = g.s.player.x + 40;
  g.place('workbench', x, g.groundTopAt(x));
  assert.ok(g.durability.repair('fur_cloak').ok);
  assert.equal(g.durability.wear('fur_cloak'), 0);
});

test('weapons blunt and tools dull with use; worn-out gear is mended, not lost', () => {
  const g = fresh();
  g.add('iron_sword');
  g.s.player.weapon = 'iron_sword';
  const sharp = g.armoury.stats('iron_sword').damage;
  for (let i = 0; i < 5; i++) g.combat.swing();
  assert.ok(g.durability.wear('iron_sword') > 0);
  g.s.wear.iron_sword = 100;
  assert.ok(Math.abs(g.armoury.stats('iron_sword').damage - sharp / 2) < 0.01);
  g.add('iron_pick');
  assert.equal(g.toolTier('pick'), 3);
  g.s.wear.iron_pick = 100;
  assert.equal(g.toolTier('pick'), 0, 'a worn-out pick will not cut its tier');
  assert.equal(g.count('iron_pick'), 1, 'but it is still yours');
});

test('water: skins, freezing, tablets, the distiller, and ice harvesters', () => {
  const g = fresh();
  g.s.vitals.hydration = 10;
  g.add('wild_water', 2);
  g.use('wild_water');
  const plain = g.s.vitals.hydration;
  g.add('waterskin');
  g.s.vitals.hydration = 10;
  g.use('wild_water');
  assert.ok(g.s.vitals.hydration > plain + 5, 'a waterskin makes it go further');
  // Water freezes in the deep cold, but not in an insulated flask.
  const c = fresh();
  standIn(c, 'tundra');
  c.s.elapsed = 1200;
  c.add('boiled_water', 3);
  c.larder.advance(250);
  if (c.temperature() < -4) assert.ok(c.count('ice') >= 1);
  const f = fresh();
  standIn(f, 'tundra');
  f.s.elapsed = 1200;
  f.add('boiled_water', 3);
  f.add('insulated_flask');
  f.larder.advance(250);
  assert.equal(f.count('boiled_water'), 3);
  // A tablet cleans three.
  const t = fresh();
  t.add('wild_water', 4);
  t.add('purification_tablet');
  assert.ok(t.use('purification_tablet').ok);
  assert.equal(t.count('boiled_water'), 3);
  assert.equal(t.count('wild_water'), 1);
  // The distiller boils water with wood.
  const d = fresh();
  d.add('brackish_water', 4);
  d.add('wood', 2);
  const st = place(d, 'distiller');
  d.s.player.x = st.x;
  d.s.player.y = st.y;
  assert.ok(d.interact().ok);
  assert.equal(d.count('boiled_water'), 4);
  assert.equal(d.count('wood'), 0);
  // An ice harvester cuts ice where it freezes.
  const h = fresh();
  standIn(h, 'tundra');
  h.s.elapsed = 1200;
  const cutter = place(h, 'ice_harvester');
  h.larder.advance(260);
  if (h.environment.temperatureAt(cutter.x, cutter.y - 20) <= 0) assert.ok(cutter.store.ice >= 2);
});

test('a varied diet keeps you strong; one food, meal after meal, does not', () => {
  const g = fresh();
  for (let i = 0; i < 6; i++) g.survival.ate('cooked_meat');
  assert.equal(g.survival.diet().state, 'malnourished');
  for (const id of ['bread', 'berry', 'cooked_fish', 'mushroom', 'potato', 'honey'])
    g.survival.ate(id);
  assert.equal(g.survival.diet().state, 'balanced');
});

test('rickets comes from long darkness and lifts in the sun; the lamp burns resin', () => {
  const g = fresh();
  g.s.player.y = g.groundTopAt(g.s.player.x) + 600;
  assert.ok(g.survival.dark());
  for (let i = 0; i < 1300 && !g.ailments.has('rickets'); i += 10) g.ailments.update(10);
  assert.ok(g.ailments.has('rickets'));
  const lamp = fresh();
  lamp.add('miners_lamp');
  lamp.equipment.wear('miners_lamp');
  lamp.s.player.y = lamp.groundTopAt(lamp.s.player.x) + 600;
  lamp.add('resin', 1);
  lamp.durability.update(1);
  assert.equal(lamp.count('resin'), 0, 'resin burns');
  assert.ok(lamp.equipment.has('light'));
  lamp.durability.update(400);
  assert.equal(lamp.equipment.has('light'), false, 'out of resin, out of light');
});
