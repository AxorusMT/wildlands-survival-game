import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../src/data/index.ts';
import { Game } from '../src/game/Game.ts';

const fresh = () => new Game(17);
/** Gives a weapon of a fixed quality and readies it. */
const arm = (g, id, q = 1) => {
  g.add(id);
  g.s.armoury[id].q = q;
  g.s.player.weapon = id;
  return g.armoury.stats(id);
};
/** A sturdy, still target in front of the player. */
const dummy = (g, type = 'skeleton') => {
  const p = g.s.player;
  g.world.addAnimal(type, p.x + 40, p.y, { body: true, vx: 0, vy: 0 });
  const a = g.s.animals[g.s.animals.length - 1];
  a.maxHp = a.hp = 100000;
  p.face = 0;
  return a;
};

test('the hierarchy is complete: ten families by eleven tiers, stronger at every tier', () => {
  assert.equal(D.FAMILIES.length, 10);
  assert.equal(D.TIERS.length, 11);
  assert.equal(D.GRID.length, 110);
  for (const w of D.GRID) {
    assert.ok(D.WEAPONS[w.id], `${w.id} stats`);
    assert.ok(D.ITEMS[w.id], `${w.id} item`);
    if (w.id !== 'rift_blade')
      assert.ok(
        D.RECIPES.find((r) => r.id === w.id),
        `${w.id} recipe`,
      );
    const f = D.familyById(w.family);
    if (f.ranged) assert.ok(D.RANGED[w.id], `${w.id} shoots`);
  }
  for (const f of D.FAMILIES) {
    const line = D.GRID.filter((w) => w.family === f.id).sort((a, b) => a.tier - b.tier);
    for (let i = 1; i < line.length; i++)
      assert.ok(
        D.WEAPONS[line[i].id][1] > D.WEAPONS[line[i - 1].id][1],
        `${line[i].id} beats ${line[i - 1].id}`,
      );
  }
  // Every signature weapon has a place in a family.
  for (const id of Object.keys(D.SIGNATURE)) assert.ok(D.WEAPONS[id], id);
});

test('quality is rolled when a weapon is first found, and scales it', () => {
  const g = fresh();
  g.add('iron_greatsword');
  const e = g.s.armoury.iron_greatsword;
  assert.ok(e && e.q >= 0 && e.q < D.QUALITIES.length);
  const counts = [0, 0, 0, 0, 0];
  for (let i = 0; i < 2000; i++) counts[D.rollQuality(Math.random)]++;
  assert.ok(counts[1] > counts[0] && counts[1] > counts[4], 'common is commonest');
  assert.ok(counts[4] > 0, 'mythic happens');
  e.q = 4;
  const mythic = g.armoury.stats('iron_greatsword').damage;
  e.q = 0;
  const crude = g.armoury.stats('iron_greatsword').damage;
  assert.ok(mythic > crude * 1.6);
  assert.match(g.armoury.title('iron_greatsword'), /^Crude Iron greatsword$/);
});

test('the anvil raises a weapon to +10, with an evolution chosen at +5 and +10', () => {
  const g = fresh();
  const base = arm(g, 'copper_battleaxe').damage;
  // Away from a workbench, and without materials, nothing happens.
  assert.equal(g.armoury.upgrade('copper_battleaxe').ok, false);
  const x = g.s.player.x + 30;
  g.add('workbench');
  g.place('workbench', x, g.groundTopAt(x));
  assert.match(g.armoury.upgrade('copper_battleaxe').reason, /anvil wants/);
  g.add('copper_ingot', 200);
  g.add('coin', 5000);
  for (let i = 0; i < 5; i++) assert.ok(g.armoury.upgrade('copper_battleaxe').ok);
  assert.equal(g.s.armoury.copper_battleaxe.lvl, 5);
  assert.ok(g.count('coin') < 5000);
  assert.ok(g.armoury.stats('copper_battleaxe').damage > base * 1.3);
  // +6 waits on a choice.
  assert.match(g.armoury.upgrade('copper_battleaxe').reason, /evolves/);
  const pace = g.armoury.stats('copper_battleaxe').pace;
  assert.ok(g.armoury.evolve('copper_battleaxe', 1).ok, 'balanced');
  assert.ok(g.armoury.stats('copper_battleaxe').pace < pace);
  for (let i = 0; i < 5; i++) assert.ok(g.armoury.upgrade('copper_battleaxe').ok);
  assert.ok(g.armoury.evolve('copper_battleaxe', 0).ok, 'reaper');
  assert.ok(g.armoury.stats('copper_battleaxe').heal > 0);
  assert.equal(g.armoury.upgrade('copper_battleaxe').ok, false, 'no further');
  assert.equal(g.armoury.title('copper_battleaxe').endsWith('+10'), true);
});

test('each family plays differently', () => {
  const g = fresh();
  g.command('god');
  // Blades: every third blow in quick succession hits harder.
  arm(g, 'iron_sword');
  const a = dummy(g);
  const hits = [];
  for (let i = 0; i < 3; i++) {
    const before = a.hp;
    g.combat.swing('iron_sword');
    hits.push(before - a.hp);
    g.s.elapsed += 0.5;
  }
  assert.ok(hits[2] > Math.max(hits[0], hits[1]) * 1.4, JSON.stringify(hits));
  // Battleaxes open bleeding wounds.
  arm(g, 'iron_battleaxe');
  const b = dummy(g, 'wolf');
  b.body = true;
  g.combat.swing('iron_battleaxe');
  assert.ok(b.fx?.bleed, 'bleeding');
  const hp = b.hp;
  for (let i = 0; i < 60; i++) g.wildlife.step(b, 1 / 60);
  assert.ok(b.hp < hp, 'the wound bleeds');
  // Warhammers stagger and crack armour.
  arm(g, 'iron_warhammer');
  const c = dummy(g);
  g.combat.swing('iron_warhammer');
  assert.ok(c.fx.stun > g.s.elapsed && c.fx.sunder > g.s.elapsed);
  // Whips mark foes, who then take more from everything.
  arm(g, 'iron_whip');
  const d = dummy(g, 'wolf');
  g.combat.swing('iron_whip');
  assert.ok(d.fx.mark);
  // Spears out-reach blades; greatswords out-hit them.
  assert.ok(D.WEAPONS.iron_spear[2] > D.WEAPONS.iron_sword[2] * 1.4);
  assert.ok(D.WEAPONS.iron_greatsword[1] > D.WEAPONS.iron_sword[1] * 1.3);
});

test('infusions and gems change what a weapon does', () => {
  const g = fresh();
  g.command('god');
  arm(g, 'steel_sword', 3);
  // Fire burns on after the blow.
  assert.ok(g.armoury.infuse('steel_sword', 'fire').ok);
  const a = dummy(g, 'wolf');
  g.combat.swing('steel_sword');
  assert.ok(a.fx.burn);
  // Frost slows.
  g.armoury.infuse('steel_sword', 'frost');
  const b = dummy(g, 'wolf');
  g.combat.swing('steel_sword');
  assert.ok(b.fx.slow > g.s.elapsed);
  // Void cuts through armour.
  g.armoury.infuse('steel_sword', 'void');
  const armoured = dummy(g, 'kiln_golem');
  g.s.elapsed += 2;
  const before = armoured.hp;
  g.combat.hurtMob(armoured, 60, g.s.player, false, g.armoury.stats('steel_sword'));
  const voided = before - armoured.hp;
  g.armoury.infuse('steel_sword', 'fire');
  const before2 = armoured.hp;
  g.rng = () => 0.5;
  g.combat.hurtMob(armoured, 60, g.s.player, false, g.armoury.stats('steel_sword'));
  assert.ok(voided > before2 - armoured.hp, 'void pierces');
  // A Masterwork weapon holds two gems, no more.
  assert.ok(g.armoury.socket('steel_sword', 'ruby').ok);
  assert.ok(g.armoury.socket('steel_sword', 'emerald').ok);
  assert.equal(g.armoury.socket('steel_sword', 'opal').ok, false);
  assert.ok(g.armoury.stats('steel_sword').crit > 0.09);
});

test('crossbows loose piercing bolts, tomes stream sparks, and evolutions add shots', () => {
  const g = fresh();
  g.command('god');
  const p = g.s.player;
  arm(g, 'iron_crossbow');
  g.add('arrow', 20);
  assert.ok(g.combat.fire('iron_crossbow', { x: p.x + 300, y: p.y - 30 }).ok);
  const bolt = g.combat.projectiles.at(-1);
  assert.equal(bolt.kind, 'bolt');
  assert.ok(bolt.pierce >= 1);
  arm(g, 'iron_tome');
  g.s.mana = 20;
  g.combat.fire('iron_tome', { x: p.x + 300, y: p.y - 30 });
  assert.ok(g.s.mana >= 17, 'a spark costs little');
  assert.equal(g.combat.projectiles.at(-1).kind, 'iron_spark');
  // A Split staff fans three bolts.
  arm(g, 'iron_staff');
  g.s.armoury.iron_staff.lvl = 10;
  g.s.armoury.iron_staff.evo = ['charged', 'split'];
  const n = g.combat.projectiles.length;
  g.s.mana = 100;
  g.combat.fire('iron_staff', { x: p.x + 300, y: p.y - 30 });
  assert.equal(g.combat.projectiles.length - n, 3);
});

test('the armoury is kept in the field record', () => {
  const g = fresh();
  arm(g, 'gold_broadsword', 4);
  g.s.armoury.gold_broadsword.lvl = 3;
  const store = new Map();
  const mem = { setItem: (k, v) => store.set(k, v), getItem: (k) => store.get(k) };
  g.save(mem, true);
  const back = fresh();
  back.load(mem);
  assert.equal(back.armoury.title('gold_broadsword'), 'Mythic Gold broadsword +3');
});
