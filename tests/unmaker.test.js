import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../src/data/index.ts';
import { Game } from '../src/game/Game.ts';
import { TRACKS } from '../src/audio/tracks/index.ts';
import { musicScene } from '../src/audio/scenes.ts';

const memory = () => {
  const store = new Map();
  return { setItem: (k, v) => store.set(k, v), getItem: (k) => store.get(k), store };
};
/** A god-mode traveller in the Void with the Unmaker just summoned. */
function summoned(seed = 5) {
  const g = new Game(seed);
  g.command('god');
  g.command('tp void');
  g.command('summon unmaker');
  return g;
}
const tick = (g, seconds) => {
  for (let i = 0; i < Math.round(seconds * 60); i++) g.tick(1 / 60);
};
const foe = (g) => g.unmaker.foe();
/** Runs its entrance through to the drop. */
function fighting(seed) {
  const g = summoned(seed);
  tick(g, D.ENTRANCE + 0.2);
  return g;
}

test('its entrance is timed to the build of its theme, and holds everything still', () => {
  const t = TRACKS.unmaker;
  assert.equal(t.loopBar, D.ENTRANCE_BARS, 'the build is the part that never loops');
  assert.ok(Math.abs(D.ENTRANCE - (t.loopBar * t.beatsPerBar * 60) / t.bpm) < 1e-9);
  const g = summoned(),
    u = foe(g);
  assert.ok(g.unmaker.frozen());
  assert.equal(g.combat.hurtMob(u, 500, g.s.player), 0, 'untouchable in the tear');
  assert.equal(g.attack().ok, false);
  const x = g.s.player.x;
  g.move(1, 0, 0.5);
  assert.equal(g.s.player.x, x, 'you cannot move while it enters');
  tick(g, D.ENTRANCE + 0.2);
  assert.equal(g.unmaker.frozen(), false);
  assert.equal(u.reveal, 1);
  assert.equal(g.unmaker.hype?.title, 'THE UNMAKER', 'the beat drops on the reveal');
  assert.ok(g.combat.hurtMob(u, 500, g.s.player) > 0);
  assert.ok(
    g.s.animals.some((m) => m.minion && m.type === 'watcher'),
    'its host arrives',
  );
});

test('four phases and a last stand, each brought in by a cutscene the music follows', () => {
  const g = fighting(),
    u = foe(g);
  assert.equal(
    musicScene({
      playing: true,
      dead: false,
      boss: true,
      bossType: 'unmaker',
      bossPhase: 0,
      layer: 'void',
      weather: 'clear',
      biome: 'void',
      night: false,
    }),
    'unmaker',
  );
  for (const [n, ph] of D.UNMAKER_PHASES.entries()) {
    if (!n) continue;
    u.hp = Math.floor(u.maxHp * ph.at) - 1;
    tick(g, 0.1);
    assert.equal(g.unmaker.cutscene?.kind, 'phase', `phase ${ph.name} has its cutscene`);
    assert.ok(g.unmaker.frozen() && g.unmaker.timeScale() < 1);
    assert.equal(g.combat.hurtMob(u, 500, g.s.player), 0, 'untouchable while it transforms');
    tick(g, 3.2);
    assert.equal(g.unmaker.phase(), n);
    assert.equal(g.unmaker.bpm, ph.bpm, 'the aura follows the new theme');
    assert.equal(
      musicScene({
        playing: true,
        dead: false,
        boss: true,
        bossType: 'unmaker',
        bossPhase: n,
        layer: 'void',
        weather: 'clear',
        biome: 'void',
        night: false,
      }),
      ph.music,
    );
    assert.ok(
      TRACKS[ph.music] && TRACKS[ph.music].bpm > D.UNMAKER_PHASES[n - 1].bpm,
      'each theme is faster',
    );
    tick(g, 2);
  }
  u.hp = Math.floor(u.maxHp * D.LAST_STAND) - 1;
  tick(g, 0.1);
  assert.equal(g.unmaker.cutscene?.kind, 'last');
  tick(g, 3);
  assert.equal(u.timers.lastStand, 1);
  assert.ok(
    g.s.animals.filter((m) => m.minion && !m.deadUntil).length >= 6,
    'its whole host at its side',
  );
});

test('it grows exponentially more dangerous as it weakens', () => {
  const g = fighting(),
    u = foe(g),
    at = (frac) => {
      u.hp = u.maxHp * frac;
      return g.unmaker.intensity(u);
    };
  assert.equal(at(1), 1);
  const k = [1, 0.75, 0.5, 0.25, 0].map(at);
  for (let i = 1; i < k.length; i++)
    assert.ok(k[i] / k[i - 1] > 1.5, 'each quarter lost multiplies it');
  assert.ok(k[4] > 5.5, 'about six times at the end');
});

test('it thinks: it leads its shots, sidesteps yours, and learns how you fight', () => {
  const g = fighting(7),
    u = foe(g),
    p = g.s.player;
  // A shot led at a running target meets it.
  p.vx = 220;
  p.grounded = true;
  const from = { x: p.x - 400, y: p.y - 200 },
    speed = 660,
    ang = g.unmaker.aim(from, speed);
  let best = Infinity;
  for (let t = 0; t < 1.5; t += 0.01) {
    const bx = from.x + Math.cos(ang) * speed * t,
      by = from.y + Math.sin(ang) * speed * t;
    best = Math.min(best, Math.hypot(bx - (p.x + p.vx * t), by - (p.y - 26)));
  }
  assert.ok(best < 12, `the lead meets you (${best.toFixed(1)} px)`);
  const direct = Math.atan2(p.y - 26 - from.y, p.x - from.x);
  assert.ok(Math.abs(ang - direct) > 0.05, 'and does not aim where you were');
  // It sidesteps a shot bearing down on it (it tries, often).
  let dodged = false;
  for (let i = 0; i < 40 && !dodged; i++) {
    const was = { x: u.x, y: u.y };
    g.unmaker['dodgeAt'] = 0;
    g.combat.spawn('arrow', { x: u.x - 120, y: u.y - 60 }, 0, 900, 10, 'player');
    g.unmaker['dodge'](u, 0, 1);
    dodged = Math.hypot(u.x - was.x, u.y - was.y) > 50;
  }
  assert.ok(dodged, 'it sidesteps shots');
  // Fought from range, it closes in; fought up close, it keeps away.
  g.unmaker['ledger'] = { melee: 0, ranged: 2000 };
  assert.equal(g.unmaker['ranged'](), true);
  g.unmaker['ledger'] = { melee: 2000, ranged: 0 };
  assert.equal(g.unmaker['ranged'](), false);
});

test('while two shades live, they bear most of its wounds', () => {
  const g = fighting(),
    u = foe(g);
  const full = g.unmaker.absorb(u, 1000, g.s.player);
  for (const dx of [-200, 200]) g.bosses.minion('void_shade', u.x + dx, u.y, 12);
  assert.equal(g.unmaker.absorb(u, 1000, g.s.player), Math.round(full * 0.35));
});

test('its death: the killing blow, the finale, the burst, and the best spoils there are', () => {
  const g = fighting(),
    u = foe(g);
  u.hp = 20;
  g.combat.hurtMob(u, 99999, g.s.player);
  assert.ok(g.s.animals.includes(u) && u.hp === 1, 'it holds on for its death scene');
  assert.equal(g.unmaker.cutscene?.kind, 'death');
  assert.ok(g.unmaker.finale(), 'the finale plays');
  assert.equal(
    musicScene({
      playing: true,
      dead: false,
      boss: true,
      bossType: 'unmaker',
      finale: true,
      layer: 'void',
      weather: 'clear',
      biome: 'void',
      night: false,
    }),
    'unmaker_finale',
  );
  const f = TRACKS.unmaker_finale;
  assert.equal(f.bpm, TRACKS.menu.bpm, 'at the title theme’s own tempo');
  assert.ok(
    Math.abs(D.SUPERNOVA - (D.FINALE_DROP_BARS * 4 * 60) / f.bpm) < 1e-9,
    'it bursts on the drop',
  );
  tick(g, D.UNMADE + 0.3);
  assert.ok(!g.s.animals.includes(u), 'unmade');
  assert.equal(g.s.bosses.unmaker, 1);
  const got = (id) =>
    g.count(id) + g.s.drops.filter((d) => d.item === id).reduce((n, d) => n + d.qty, 0);
  for (const id of [
    'oblivion',
    'unmakers_gaze',
    'aura_of_the_unmade',
    'void_heart',
    'fracture_shard',
  ])
    assert.ok(got(id) > 0, `${id} dropped`);
  assert.ok(g.unmaker.frozen(), 'held through the fourth wall');
  tick(g, D.SHATTER_AT + D.SHATTER_SECONDS - D.UNMADE + 0.2);
  assert.equal(g.unmaker.frozen(), false);
  assert.equal(g.unmaker.timeScale(), 1);
});

test('its spoils: the strongest weapons in their families, a heart past every limit, and an aura', () => {
  assert.ok(D.WEAPONS.oblivion[1] > D.WEAPONS.ascended_greatsword[1]);
  assert.ok(D.WEAPONS.unmakers_gaze[1] > D.WEAPONS.ascended_staff[1]);
  assert.deepEqual(D.WEAPON_CLASS.oblivion, ['greatsword', 12]);
  const g = new Game(3);
  g.s.maxHealth = D.CRYSTALS.baseHealth + D.CRYSTALS.lifeMax + 100;
  g.add('void_heart', 3);
  assert.ok(g.use('void_heart').ok);
  assert.ok(g.use('void_heart').ok);
  assert.equal(g.use('void_heart').ok, false, 'twice at most');
  assert.equal(g.s.maxHealth, D.CRYSTALS.baseHealth + D.CRYSTALS.lifeMax + 200);
  g.add('aura_of_the_unmade');
  g.equipment.wear('aura_of_the_unmade');
  g.world.addAnimal('wolf', g.s.player.x + 60, g.s.player.y);
  const wolf = g.s.animals[g.s.animals.length - 1],
    hp = wolf.hp;
  g.equipment.update(0.6);
  assert.ok(wolf.hp < hp, 'the aura sears foes near you');
});

test('a fight saved mid-entrance simply begins, and no other foe makes an entrance', () => {
  const g = summoned(),
    mem = memory();
  tick(g, 2);
  g.save(mem, true);
  const back = new Game(1);
  back.load(mem);
  tick(back, 0.2);
  assert.equal(foe(back).intro, 0);
  assert.equal(back.unmaker.frozen(), false);
  const h = new Game(2);
  h.command('god');
  h.command('summon hollow_king');
  assert.equal(h.unmaker.frozen(), false);
  assert.equal(h.unmaker.overlay(), null);
});
