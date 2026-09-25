import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../src/data/index.ts';
import { Game } from '../src/game/Game.ts';

const fresh = () => new Game(23);
/** Grants renown up to a level. */
const reach = (g, level) => {
  g.s.meta.renown = D.renownFor(level);
};

test('renown rises with what you do and grants a point per level', () => {
  const g = fresh();
  assert.equal(g.skills.level(), 1);
  assert.equal(g.skills.points(), 0);
  // Monotonic curve, 60 levels.
  for (let l = 2; l <= D.MAX_RENOWN; l++) assert.ok(D.renownFor(l) > D.renownFor(l - 1));
  assert.equal(D.renownLevel(D.renownFor(12)), 12);
  const before = g.skills.renown();
  g.progress.record('kill:wolf');
  const first = g.skills.renown() - before;
  g.progress.record('kill:wolf');
  const second = g.skills.renown() - before - first;
  assert.ok(first > 0 && second > 0);
  assert.ok(first > second, 'first kills of a kind are worth more');
  reach(g, 6);
  assert.equal(g.skills.level(), 6);
  assert.equal(g.skills.points(), 5);
});

test('every tree has four rows of six and three keystones, each learnable in order', () => {
  assert.equal(D.TREES.length, 5);
  for (const t of D.TREES) {
    const nodes = D.SKILLS.filter((n) => n.tree === t.id);
    for (const row of [1, 2, 3, 4]) assert.equal(nodes.filter((n) => n.row === row).length, 6);
    const keys = nodes.filter((n) => n.row === 5);
    assert.equal(keys.length, 3);
    assert.ok(keys.every((n) => n.keystone && n.cost === 2));
  }
  assert.equal(new Set(D.SKILLS.map((n) => n.id)).size, D.SKILLS.length, 'unique ids');
});

test('learning spends points, respects row gates, and changes stats', () => {
  const g = fresh();
  assert.equal(g.skills.learn('edge').ok, false, 'no points yet');
  reach(g, 30);
  const hp = g.maxHealth();
  assert.ok(g.skills.learn('grit').ok);
  assert.equal(g.maxHealth(), hp + 10);
  assert.equal(g.skills.learn('grit').ok, false, 'not twice');
  // Row 2 opens after 3 points in the tree.
  assert.match(g.skills.blocked('tough'), /Spend 3/);
  assert.ok(g.skills.learn('edge').ok);
  assert.ok(g.skills.learn('hardy').ok);
  assert.ok(g.skills.learn('tough').ok);
  const def = g.equipment.defense();
  // Keystones need 14 points in the tree and cost 2.
  assert.match(g.skills.blocked('berserker'), /Spend 14/);
  for (const id of [
    'footwork',
    'cleave',
    'savagery',
    'rhythm',
    'long_arm',
    'duelists_eye',
    'iron_skin',
    'bloodletter',
    'brutal',
    'bulwark',
  ])
    assert.ok(g.skills.learn(id).ok, id);
  assert.equal(g.skills.spentIn('warfare'), 14);
  const left = g.skills.points();
  assert.ok(g.skills.learn('juggernaut').ok);
  assert.equal(g.skills.points(), left - 2);
  assert.equal(g.equipment.defense(), def + 3 + 15);
  // Melee damage from Edge and Savagery shows in the Armoury's numbers.
  const plain = fresh();
  plain.add('iron_sword');
  g.add('iron_sword');
  assert.ok(g.armoury.stats('iron_sword').damage > plain.armoury.stats('iron_sword').damage * 1.1);
});

test('respec costs fallen stars and marks, and returns every point', () => {
  const g = fresh();
  reach(g, 10);
  g.skills.learn('edge');
  g.skills.learn('grit');
  assert.equal(g.skills.points(), 7);
  assert.equal(g.skills.respec().ok, false);
  for (const [k, n] of Object.entries(D.RESPEC_COST)) g.add(k, n);
  assert.ok(g.skills.respec().ok);
  assert.equal(g.skills.points(), 9);
  assert.equal(g.count('fallen_star'), 0);
});

test('weapon mastery trains with use and lifts that family', () => {
  const g = fresh();
  g.add('iron_sword');
  const [family] = g.armoury.classOf('iron_sword');
  const before = g.armoury.stats('iron_sword');
  assert.equal(g.skills.mastery(family), 0);
  g.skills.train(family, D.masteryFor(10));
  assert.equal(g.skills.mastery(family), 10);
  const after = g.armoury.stats('iron_sword');
  assert.ok(Math.abs(after.damage / before.damage - 1.1) < 0.001);
  assert.ok(Math.abs(after.crit - before.crit - 0.05) < 1e-9);
  assert.ok(D.masteryTitle(20) !== D.masteryTitle(1));
});

test('a finished Codex page grants its bonus', () => {
  const g = fresh();
  const page = D.CODEX.find((p) => p.id === 'wilds');
  const hp = g.maxHealth();
  assert.deepEqual(g.skills.page(page), [0, page.entries.length]);
  for (const id of page.entries.slice(0, -1)) g.progress.record('kill:' + id);
  g.s.elapsed += 3;
  assert.equal(g.maxHealth(), hp);
  g.progress.record('kill:' + page.entries.at(-1));
  g.s.elapsed += 3;
  assert.ok(g.skills.pageDone(page));
  assert.equal(g.maxHealth(), hp + 10);
  // Count pages fill with different entries.
  const palate = D.CODEX.find((p) => p.id === 'palate');
  g.progress.record('eat:berries');
  g.progress.record('eat:berries');
  assert.deepEqual(g.skills.page(palate), [1, palate.count]);
});

test('the relic shelf holds relics by renown and lends their gifts', () => {
  const g = fresh();
  assert.equal(D.shelfSlots(1), 3);
  assert.equal(D.shelfSlots(20), 4);
  assert.equal(D.shelfSlots(40), 5);
  const x = g.s.player.x + 40;
  g.add('relic_shelf');
  assert.ok(g.place('relic_shelf', x, g.groundTopAt(x))?.ok !== false);
  const shelf = g.s.structures.find((st) => st.type === 'relic_shelf');
  assert.equal(g.skills.shelve(shelf, 'wood').ok, false);
  assert.equal(g.skills.shelve(shelf, 'tide_conch').ok, false, 'must carry it');
  for (const id of ['tide_conch', 'kiln_heart', 'queens_mandible', 'beast_core']) g.add(id);
  const def = g.equipment.defense();
  assert.ok(g.skills.shelve(shelf, 'tide_conch').ok);
  assert.equal(g.count('tide_conch'), 0);
  assert.ok(g.equipment.has('swim'));
  assert.equal(g.equipment.defense(), def + 2);
  assert.ok(g.skills.shelve(shelf, 'kiln_heart').ok);
  assert.ok(g.skills.shelve(shelf, 'queens_mandible').ok);
  assert.equal(g.skills.shelve(shelf, 'beast_core').ok, false, 'three at renown 1');
  reach(g, 20);
  assert.ok(g.skills.shelve(shelf, 'beast_core').ok);
  assert.ok(g.skills.unshelve(shelf, 'tide_conch').ok);
  assert.equal(g.count('tide_conch'), 1);
  assert.ok(!g.equipment.has('swim'));
  // Using the shelf opens its page.
  g.s.player.x = shelf.x;
  g.s.player.y = shelf.y;
  assert.equal(g.interaction.interact().action, 'shelf');
});

test('archetype sets span three bands and each bonus changes play', () => {
  const sets = D.ARMOR_SETS.filter((s) =>
    ['vanguard', 'ranger', 'arcanist', 'wayfarer'].includes(s.bonus),
  );
  assert.equal(sets.length, 12);
  for (const bonus of ['vanguard', 'ranger', 'arcanist', 'wayfarer'])
    assert.deepEqual(
      sets.filter((s) => s.bonus === bonus).map((s) => s.tier),
      [3, 6, 9],
    );
  for (const s of sets) {
    for (const piece of ['helmet', 'chestplate', 'greaves'])
      assert.ok(
        D.RECIPES.some((r) => r.id === `${s.key}_${piece}`),
        s.key + piece,
      );
  }
  const wearSet = (g, key) => {
    for (const piece of ['helmet', 'chestplate', 'greaves']) {
      g.add(`${key}_${piece}`);
      g.equipment.wear(`${key}_${piece}`);
    }
  };
  const base = fresh(),
    tank = fresh(),
    mage = fresh(),
    walker = fresh();
  wearSet(tank, 'warden');
  wearSet(mage, 'acolyte');
  wearSet(walker, 'drifter');
  assert.ok(tank.equipment.has('vanguard'));
  assert.ok(tank.equipment.defense() >= 3 + 11);
  assert.equal(mage.equipment.maxMana(), base.equipment.maxMana() + 40);
  assert.ok(walker.larder.packCooling() < base.larder.packCooling());
});

test('skills reach survival: iron gut, coin sense, and a stronger constitution', () => {
  const g = fresh();
  reach(g, 40);
  // Iron stomach (row 3 of survival) needs points in the tree first.
  const surv = D.SKILLS.filter((n) => n.tree === 'survival');
  for (const n of surv.filter((n) => n.row <= 2)) g.skills.learn(n.id);
  assert.ok(g.skills.learn('iron_stomach').ok, g.skills.blocked('iron_stomach') ?? '');
  assert.equal(g.ailments.contract('food_poisoning', false, 'spoiled'), false);
  const coins = D.SKILLS.find((n) => n.id === 'coin_sense');
  assert.equal(coins.stats.coins, 0.15);
  // Everything a skill names is a real stat and every stat sums.
  const st = g.skills.stats();
  for (const n of D.SKILLS) for (const k of Object.keys(n.stats)) assert.ok(k in st, k);
});

test('renown, skills, and mastery survive a save', () => {
  const store = new Map();
  const storage = {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => store.set(k, v),
    removeItem: (k) => store.delete(k),
  };
  const g = fresh();
  reach(g, 8);
  g.skills.learn('edge');
  g.skills.train('spear', D.masteryFor(4));
  g.save(storage);
  const loaded = fresh();
  assert.equal(loaded.load(storage), true);
  assert.equal(loaded.skills.level(), 8);
  assert.ok(loaded.skills.has('edge'));
  assert.equal(loaded.skills.mastery('spear'), 4);
  assert.equal(loaded.skills.points(), 6);
});

test('sixty-odd feats, each with a title and a perk, earned from the record', () => {
  assert.ok(D.FEATS.length >= 60);
  assert.equal(new Set(D.FEATS.map((f) => f.id)).size, D.FEATS.length);
  const g = fresh();
  const st = g.skills.stats();
  for (const f of D.FEATS) {
    assert.ok(f.title && f.perkText, f.id);
    for (const k of Object.keys(f.perk)) assert.ok(k in st, `${f.id}: ${k}`);
    const [have, need] = f.measure(g.feats.ctx());
    assert.ok(need > 0 && have >= 0, f.id);
  }
  assert.equal(g.feats.earned().length, 0);
  const dmg = g.skills.get('meleeDmg');
  g.progress.record('kill:wolf');
  assert.ok(g.feats.has('first_blood'));
  assert.ok(g.skills.get('meleeDmg') > dmg, 'the perk applies');
  assert.equal(g.feats.title(), null);
  assert.ok(g.feats.wear('first_blood').ok);
  assert.equal(g.feats.title(), 'the Blooded');
  assert.equal(g.feats.wear('realmbreaker').ok, false);
  // Feats and titles survive a save.
  const store = new Map();
  const storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  g.save(storage);
  const h = fresh();
  h.load(storage);
  assert.ok(h.feats.has('first_blood'));
  assert.equal(h.feats.title(), 'the Blooded');
  // Progress is measured.
  for (let i = 0; i < 40; i++) h.progress.record('kill:boar');
  const kills = Object.entries(h.s.tutorial.tally)
    .filter(([k]) => k.startsWith('kill:'))
    .reduce((n, [, v]) => n + v, 0);
  assert.deepEqual(h.feats.progress('hunter'), [kills, 100]);
});

const placeAt = (g, type, dx = 40) => {
  const x = g.s.player.x + dx;
  g.add(type);
  const r = g.place(type, x, g.groundTopAt(x));
  assert.ok(r?.ok !== false, r?.reason);
  return g.s.structures.find((st) => st.type === type);
};

test('upgraded stations do the work of those below, and make finer weapons', () => {
  const g = fresh();
  placeAt(g, 'tinkers_bench');
  assert.ok(g.near('workbench'), "a tinker's bench is a workbench too");
  assert.equal(g.near('artisan_bench'), undefined);
  const h = fresh();
  placeAt(h, 'hearth');
  assert.ok(h.nearLitFire(), 'a hearth burns without feeding');
  assert.ok(D.RECIPES.find((r) => r.id === 'ascended_sword').station === 'rift_forge');
  // An artisan bench rolls better quality on average.
  const avg = (station) => {
    let sum = 0;
    for (let i = 0; i < 40; i++) {
      const k = new Game(100 + i);
      k.dev.unlocked.add('iron_sword');
      if (station) placeAt(k, station);
      k.crafting.craft('iron_sword');
      sum += k.s.armoury.iron_sword.q;
    }
    return sum / 40;
  };
  assert.ok(avg('artisan_bench') > avg(null));
});

test('a heavy pack slows you; a better pack carries more', () => {
  const g = fresh();
  const cap = g.inventory.capacity();
  g.add('stone', 400);
  assert.ok(g.inventory.load() > cap);
  assert.ok(g.inventory.overload() > 0);
  g.add('expedition_frame');
  assert.ok(g.inventory.capacity() >= cap + 180);
  assert.equal(g.inventory.overload(), 0);
});

test('study at a research desk: used up, uses revealed, renown earned', () => {
  const g = fresh();
  placeAt(g, 'research_desk');
  g.add('copper_ingot', 2);
  const renown = g.skills.renown();
  const r = g.crafting.study('copper_ingot');
  assert.ok(r.ok);
  assert.ok(r.reveals.length > 3);
  assert.equal(g.count('copper_ingot'), 1);
  assert.ok(g.skills.renown() > renown);
  assert.equal(g.crafting.study('copper_ingot').ok, false, 'once is enough');
});

test('mastery 10 teaches each family a move of its own', () => {
  assert.equal(Object.keys(D.MASTERY_PERKS).length, D.FAMILIES.length);
  const g = fresh();
  g.add('iron_staff');
  g.add('mana_crystal');
  g.s.mana = 200;
  g.s.player.weapon = 'iron_staff';
  const before = g.combat.projectiles.length;
  g.combat.fire('iron_staff', { x: g.s.player.x + 200, y: g.s.player.y - 30 });
  const one = g.combat.projectiles.length - before;
  g.skills.train('staff', D.masteryFor(10));
  const mid = g.combat.projectiles.length;
  g.combat.fire('iron_staff', { x: g.s.player.x + 200, y: g.s.player.y - 30 });
  assert.equal(g.combat.projectiles.length - mid, one + 1, 'an extra bolt');
});

test('field repair kits, artisan whetstones, and the panacea', () => {
  const g = fresh();
  g.add('iron_sword');
  g.s.player.weapon = 'iron_sword';
  g.s.wear = { iron_sword: 80 };
  g.add('repair_kit');
  assert.ok(g.use('repair_kit').ok);
  assert.equal(g.durability.wear('iron_sword'), 30);
  g.s.armoury.iron_sword.q = 1;
  g.add('whetstone');
  assert.ok(g.use('whetstone').ok);
  assert.equal(g.s.armoury.iron_sword.q, 2);
  g.ailments.contract('fever', true);
  g.ailments.contract('wound', true);
  g.add('panacea');
  assert.ok(g.use('panacea').ok);
  assert.equal(g.ailments.showing().length, 0);
});
