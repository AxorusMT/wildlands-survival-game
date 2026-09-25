import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../src/data/index.ts';
import { Game } from '../src/game/Game.ts';
import { RULES } from '../src/game/rules.ts';

const course = () => new Game(23).newGame(23, { tutorial: true });
const memory = () => {
  const store = new Map();
  return { setItem: (k, v) => store.set(k, v), getItem: (k) => store.get(k), store };
};
const inCourse = (o) => o.x >= D.POCKET.start;
/** Stands the player at a course position (local x). */
const standAt = (g, lx) => {
  const x = D.POCKET.start + lx;
  g.s.player.x = x;
  g.s.player.y = g.groundTopAt(x) + 1;
};

test('a new expedition can begin in the Training Grounds, or skip them', () => {
  const g = course();
  assert.equal(g.s.pocket.realm, 'tutorial');
  assert.ok(g.pocket.inCourse() && g.pocket.here());
  assert.equal(g.s.tutorial.course, 0);
  assert.equal(g.pocket.banner.name, 'The Training Grounds');
  for (const off of [new Game(23), new Game(23).newGame(23, { tutorial: false })]) {
    assert.equal(off.s.pocket, null);
    assert.equal(off.pocket.inCourse(), false);
    assert.ok(Math.abs(off.s.player.x - RULES.spawnX) < 1);
  }
});

test('the course is laid by hand: a station for every lesson, no great foe, no scatter', () => {
  const g = course(),
    s = g.s,
    structs = s.structures.filter(inCourse);
  const count = (type) => structs.filter((st) => st.type === type).length;
  assert.equal(count('signpost'), D.STATIONS.length);
  assert.equal(count('portal'), 2);
  assert.equal(count('boss_altar'), 0);
  assert.equal(
    count('shrine') + count('merchant_stall') + count('cairn') + count('lore_tablet'),
    0,
  );
  assert.equal(count('icebox'), 1);
  assert.ok(structs.find((st) => st.type === 'icebox').fuel > 0, 'the icebox is stocked');
  const nodes = (kind) => s.nodes.filter((n) => inCourse(n) && n.kind === kind).length;
  assert.ok(nodes('wood') >= 5 && nodes('stone') >= 5 && nodes('fiber') >= 3);
  assert.ok(nodes('water') >= 1 && nodes('copper_ore') >= 2);
  const mobs = s.animals
    .filter(inCourse)
    .map((a) => a.type)
    .sort();
  assert.deepEqual(mobs, ['deer', 'deer', 'slime']);
  const loot = structs.filter((st) => st.type === 'dungeon_chest').map((c) => Object.keys(c.store));
  assert.deepEqual(loot.flat().sort(), ['bandage', 'oilskin_coat']);
});

test('the course is not a realm the Atlas, keys or fractures know', () => {
  assert.equal(D.realmById('tutorial'), D.TRAINING);
  assert.ok(!D.REALMS.includes(D.TRAINING));
  assert.ok(!D.WHOLE_REALMS.includes(D.TRAINING));
  for (let seed = 0; seed < 40; seed++)
    assert.notEqual(D.fracture(seed).hazard.id, 'none', 'no splice borrows the course');
});

test('signposts teach, and lessons follow one another through the course', () => {
  const g = course();
  standAt(g, D.STATIONS[0].at);
  assert.ok(g.interact().ok);
  assert.equal(g.s.tutorial.tally['sign:0'], 1);
  assert.match(g.messages[0].message, /A \/ D walk/);
  assert.equal(g.s.tutorial.course, 1, 'reading the first sign is the first lesson');
  // The climb counts once you are down in the hollow.
  g.s.player.x = D.POCKET.start + (D.COURSE_HOLLOW.x0 + D.COURSE_HOLLOW.x1) / 2;
  g.s.player.y = D.COURSE_HOLLOW.y + 60;
  g.pocket.update(0.1);
  assert.equal(g.s.tutorial.course, 2);
  // Every remaining lesson, done in turn, walks the step to the end.
  for (const [, key, n] of D.COURSE.slice(2, -1)) g.progress.record(key, n);
  assert.equal(g.s.tutorial.course, D.COURSE.length - 1);
  assert.equal(g.s.tutorial.step, 0, 'the overworld tasks wait until the course is done');
});

test('the brambles cut, and the chest beyond them holds the cure', () => {
  const g = course();
  standAt(g, (D.COURSE_BRAMBLES[0] + D.COURSE_BRAMBLES[1]) / 2);
  g.pocket.update(0.1);
  assert.ok(g.ailments.has('bleeding'));
  g.pocket.update(0.1);
  assert.equal(g.s.tutorial.tally['course:bramble'], 1, 'only once');
  const chest = g.s.structures.find((st) => st.type === 'dungeon_chest' && st.store.bandage);
  g.realms.openChest(chest);
  assert.ok(g.count('bandage') >= 1);
  g.use('bandage');
  assert.equal(g.ailments.has('bleeding'), false);
  assert.equal(g.s.tutorial.tally['cure:bleeding'], 1);
});

test('the far portal finishes the course; you keep what you made and land in the meadow', () => {
  const g = course();
  g.add('wood', 5);
  g.add('stone', 5);
  g.add('fiber', 5);
  const exit = g.s.structures.find((st) => st.type === 'portal' && st.kind === 'course');
  g.s.player.x = exit.x + 10;
  g.s.player.y = exit.y;
  assert.ok(g.interact().ok);
  assert.equal(g.s.pocket, null);
  assert.equal(g.pocket.inCourse(), false);
  assert.ok(Math.abs(g.s.player.x - RULES.spawnX) < 1);
  assert.equal(g.count('wood'), 5);
  assert.equal(g.s.tutorial.tally['course:done'], 1);
  assert.equal(g.s.tutorial.course, D.COURSE.length);
  assert.ok(g.s.tutorial.step >= 3, 'the field tasks catch up with what you gathered');
  assert.ok(!g.s.structures.some(inCourse), 'the course is gone');
});

test('the near portal asks twice before skipping the course', () => {
  const g = course();
  const home = g.s.structures.find(
    (st) => st.type === 'portal' && st.kind === 'home' && inCourse(st),
  );
  g.s.player.x = home.x + 10;
  g.s.player.y = home.y;
  const first = g.interact();
  assert.equal(first.ok, false);
  assert.match(first.reason, /again/);
  assert.ok(g.pocket.inCourse());
  assert.ok(g.interact().ok);
  assert.equal(g.pocket.inCourse(), false);
  assert.equal(g.s.tutorial.tally['course:done'] ?? 0, 0);
});

test('the course survives a save, and a fall wakes you at its start', () => {
  const g = course();
  g.progress.record('sign:0');
  const mem = memory();
  g.save(mem, true);
  const back = new Game(1);
  assert.ok(back.load(mem));
  assert.ok(back.pocket.inCourse());
  assert.equal(back.s.tutorial.course, 1);
  const hollow = Math.floor((D.POCKET.start + 1000) / 32);
  assert.equal(back.tileAt(hollow, Math.floor((D.COURSE_HOLLOW.y + 40) / 32)), 0);
  back.s.dead = true;
  back.recover();
  assert.ok(back.pocket.here(), 'you wake on the course');
});
