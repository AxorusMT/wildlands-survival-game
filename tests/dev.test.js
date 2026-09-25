import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../src/data/index.ts';
import { Game } from '../src/game/Game.ts';

const fresh = () => new Game(17);
const ok = (lines) =>
  assert.ok(
    lines.every((l) => !l.startsWith('!')),
    lines.join('\n'),
  );

test('the field console gives items, unlocks recipes, and toggles god and noclip', () => {
  const g = fresh();
  ok(g.command('give iron_ingot 12'));
  assert.equal(g.count('iron_ingot'), 12);
  ok(g.command('give Obsidian pick'));
  assert.equal(g.count('obsidian_pick'), 1);
  assert.match(g.command('give nonsense')[0], /^!/);
  assert.match(g.command('give copper')[0], /could be/);
  // Unlocked recipes are made anywhere, for free.
  assert.equal(g.canCraft('forge'), false);
  ok(g.command('unlock forge'));
  assert.equal(g.canCraft('forge'), true);
  assert.equal(g.craft('forge').ok, true);
  assert.equal(g.count('iron_ingot'), 12);
  ok(g.command('unlock all'));
  assert.ok(D.RECIPES.every((r) => r.id === 'effergy' || g.canCraft(r.id)));
  ok(g.command('lock all'));
  assert.equal(g.canCraft('forge'), false);
  // Godmode keeps you alive in lower hell; noclip flies through rock.
  ok(g.command('god'));
  ok(g.command('tp lower_hell'));
  assert.equal(g.layer().id, 'lower_hell');
  for (let i = 0; i < 600; i++) g.tick(1 / 30);
  assert.equal(g.s.dead, false);
  assert.equal(g.s.vitals.health, 100);
  ok(g.command('noclip'));
  const y = g.s.player.y;
  for (let i = 0; i < 30; i++) g.move(0, -1, 1 / 30);
  assert.ok(g.s.player.y < y - 400, 'noclip flies straight up through rock');
  assert.match(g.command('frobnicate')[0], /Unknown command/);
});

test('the field console summons, slays, teleports, and sets time and weather', () => {
  const g = fresh();
  const before = g.s.animals.length;
  ok(g.command('summon wolf 3'));
  ok(g.command('summon ember'));
  assert.equal(g.s.animals.length, before + 4);
  const summoned = g.s.animals.slice(-4);
  for (let i = 0; i < 60; i++) g.tick(1 / 30);
  for (const a of summoned) assert.ok(Math.abs(a.y - g.s.player.y) < 200, `${a.type} stays nearby`);
  ok(g.command('summon direwolf'));
  assert.ok(g.s.altar.activeBoss);
  const killed = g.command('kill 2000');
  ok(killed);
  assert.ok(summoned.every((a) => a.deadUntil > 0));
  ok(g.command('tp desert'));
  assert.equal(g.biome().id, 'desert');
  ok(g.command('tp 5000 900'));
  assert.equal(Math.round(g.s.player.x), 5000);
  ok(g.command('time midnight'));
  assert.equal(g.isNight(), true);
  ok(g.command('time noon'));
  assert.equal(Math.round(g.timeOfDay()), 720);
  ok(g.command('weather storm'));
  assert.equal(g.s.weather, 'storm');
  assert.deepEqual(g.devtools.complete('sum'), ['summon']);
  assert.ok(g.devtools.complete('summon hell').includes('hellhound'));
  assert.ok(g.command('help').length > 10);
});

test('actions make the sounds you would expect', () => {
  const g = fresh(),
    p = g.s.player;
  const sounds = () =>
    g
      .takeEvents()
      .filter((e) => e.type === 'sfx')
      .map((e) => e.kind);
  g.takeEvents();
  g.jump();
  assert.ok(sounds().includes('jump'));
  const tree = g.s.nodes.find((n) => n.kind === 'wood');
  p.x = tree.x - 30;
  p.y = g.groundTopAt(p.x) + 1;
  g.gather(tree);
  assert.ok(sounds().includes('chop'));
  g.gather(tree);
  g.gather(tree);
  assert.ok(sounds().includes('creak'));
  g.add('berry');
  g.use('berry');
  assert.ok(sounds().includes('eat'));
  g.add('flint_spear');
  g.use('flint_spear');
  assert.ok(sounds().includes('equip'));
  g.command('summon wolf');
  g.command('god');
  let heard = [];
  for (let i = 0; i < 200; i++) {
    g.tick(1 / 30);
    heard.push(...sounds());
  }
  assert.ok(heard.includes('wolf_attack'), heard.join(','));
  p.x += 40;
  for (let i = 0; i < 40; i++) g.move(1, 0, 1 / 30);
  assert.ok(sounds().some((s) => s.startsWith('step_')));
});

test('gear kits you out for a stage of the journey, up to the Unmaker', () => {
  const g = new Game(4);
  assert.match(g.command('gear nothing')[0], /^! Usage/);
  const lines = g.command('gear endgame');
  assert.match(lines[0], /endgame kit/);
  const p = g.s.player;
  assert.deepEqual(Object.values(p.armor).sort(), [
    'voidsteel_chestplate',
    'voidsteel_greaves',
    'voidsteel_helmet',
  ]);
  assert.equal(p.weapon, 'ascended_greatsword');
  const e = g.armoury.entry('ascended_greatsword');
  assert.equal(D.QUALITIES[e.q].id, 'mythic');
  assert.equal(e.lvl, 10);
  assert.equal(e.inf, 'holy', 'the Unmaker is weak to holy light');
  assert.equal(g.equipment.maxHealth(), 400);
  assert.ok(g.count('void_seal') >= 1, 'with a seal to call it');
  assert.equal(g.s.accessories.length, 3);
  // Kits replace one another cleanly, and "unmaker" is another name for the last.
  g.command('gear early');
  assert.equal(g.s.player.weapon, 'iron_greatsword');
  assert.equal(g.s.accessories.length, 1);
  g.command('gear unmaker');
  assert.equal(g.s.player.weapon, 'ascended_greatsword');
});
