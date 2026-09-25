import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../src/data/index.ts';
import { Game } from '../src/game/Game.ts';

/** Each band's great foes, and the weapon tier the band's own materials forge. */
const BANDS = {
  1: [['orchard_mother', 'kiln_beast', 'warren_queen'], 5],
  2: [['lumen_stag', 'ossuary_hydra'], 7],
  3: [['engine_saint', 'mirage_tyrant', 'the_hymnal', 'sporemother'], 9],
  4: [['mother_of_rot', 'the_astronomer', 'pauper_king'], 10],
  5: [['the_leviathan', 'anvil_god', 'four_faced_warden'], 11],
};
/** Seconds to fell a boss at tier I with a +5 Common weapon of a family and tier. */
function ttk(g, family, tier, boss) {
  const w = D.GRID.find((x) => x.tier === tier && x.family === family);
  if (!g.count(w.id)) g.add(w.id);
  g.s.armoury[w.id].q = 1;
  g.s.armoury[w.id].lvl = 5;
  const st = g.armoury.stats(w.id),
    ranged = D.RANGED[w.id],
    period = (ranged?.delay ?? 0.52) * st.pace,
    shots = (ranged?.count ?? 1) + st.count,
    m = D.MOBS[boss],
    blow = Math.max(1, st.damage + (ranged?.kind === 'bow' ? 6 : 0) - (m.defense ?? 0) * 0.5);
  return m.hp / ((blow * shots) / period);
}

test('every band’s great foes fall in a fair time to that band’s weapons', () => {
  const g = new Game(1);
  for (const [band, [bosses, tier]] of Object.entries(BANDS))
    for (const f of D.FAMILIES)
      for (const b of bosses) {
        const s = ttk(g, f.id, tier, b);
        const [lo, hi] = f.ranged ? [15, 90] : [12, 60];
        assert.ok(s >= lo && s <= hi, `band ${band} ${f.id} vs ${b}: ${s.toFixed(0)}s`);
      }
});

test('a band’s foes are far tougher with the band before’s weapons', () => {
  const g = new Game(2);
  for (const band of [2, 3, 4, 5]) {
    const [bosses] = BANDS[band],
      [, lowTier] = BANDS[band - 1];
    const slow = ttk(g, 'blade', Math.max(1, lowTier - 2), bosses[0]),
      fair = ttk(g, 'blade', BANDS[band][1], bosses[0]);
    assert.ok(slow > fair * 1.4, `band ${band}: ${slow.toFixed(0)} vs ${fair.toFixed(0)}`);
  }
});

test('ranged families pay for their safety, but not too dearly', () => {
  const g = new Game(3);
  const melee = ttk(g, 'blade', 9, 'engine_saint'),
    bow = ttk(g, 'bow', 9, 'engine_saint'),
    staff = ttk(g, 'staff', 9, 'engine_saint');
  assert.ok(bow > melee && bow < melee * 2.2);
  assert.ok(staff > melee && staff < melee * 2.2);
});

test('fragments gate the bands in order: each band’s keys need the band before’s spoils', () => {
  const spoils = {
    1: ['tide_pearl', 'burrow_amber', 'kiln_ingot', 'crab_shell'],
    2: ['prism_glass', 'marrow_ingot'],
    3: ['brass_ingot', 'saltglass', 'rime_silver'],
    4: ['plague_ivory', 'astral_lens', 'crown_gold', 'fever_bloom'],
  };
  for (const r of D.WHOLE_REALMS) {
    if (r.band < 2) continue;
    const cost = D.RECIPES.find((x) => x.id === r.fragment).cost;
    assert.ok(
      spoils[r.band - 1].some((item) => cost[item]),
      `${r.id} fragments need Band ${r.band - 1} spoils (${Object.keys(cost).join(', ')})`,
    );
  }
});

test('food keeps for minutes in the warm, hours in cold storage', () => {
  const life = D.ITEMS.raw_meat[2];
  const minutes = (temp, mult = 1) => life / (D.rotRate(temp) * mult) / 60;
  assert.ok(minutes(15) > 5 && minutes(15) < 15, 'raw meat in a temperate day');
  assert.ok(minutes(35) < minutes(15) * 0.6, 'the heat nearly halves it');
  assert.ok(minutes(15, D.STORAGE.icebox.mult) > 40, 'an icebox keeps it most of an hour');
  assert.ok(minutes(15, D.STORAGE.rime_vault.mult) > 300, 'a rime vault keeps it for hours');
  assert.ok(D.ITEMS.canned_stew[2] / 60 > 600, 'cans keep for ever');
});

test('a night out is survivable: cold if wet, but not a death spiral', () => {
  for (const weather of ['clear', 'rain']) {
    const g = new Game(4);
    const x = D.BIOME_CENTERS.meadow[0];
    g.s.player.x = x;
    g.s.player.y = g.groundTopAt(x) + 1;
    while (!g.isNight()) g.s.elapsed += 10;
    g.s.weather = weather;
    g.s.weatherNext = 1e9;
    for (let i = 0; i < 1200; i++) {
      g.survival.update(1);
      g.ailments.update(1);
      g.environment.advance(1);
    }
    if (weather === 'clear') assert.equal(g.s.ailments.length, 0, 'a dry night costs nothing');
    else {
      assert.ok(
        g.s.vitals.health > 30,
        `rain and cold hurt, but twenty minutes do not kill (${g.s.vitals.health})`,
      );
      assert.equal(g.ailments.has('frostbite'), false, 'no frostbite above freezing');
    }
  }
});
