import test from 'node:test';
import assert from 'node:assert/strict';
import { TRACK_LIST, TRACKS } from '../src/audio/tracks/index.ts';
import { musicScene } from '../src/audio/scenes.ts';
import { INSTRUMENTS } from '../src/audio/instruments.ts';
import { noteToMidi, parseChord, voiceChord } from '../src/audio/theory.ts';

const seconds = (t, fromBar = 0) => ((t.bars - fromBar) * t.beatsPerBar * 60) / t.bpm;

test('score notation parses notes, chords, and smooth voicings', () => {
  assert.equal(noteToMidi('c4'), 60);
  assert.equal(noteToMidi('bb3'), 58);
  assert.equal(noteToMidi('e#5'), 77);
  assert.deepEqual(parseChord('F#m7b5').intervals, [0, 3, 6, 10]);
  assert.equal(parseChord('C/E').bass, 4);
  const c = voiceChord(parseChord('C'), 62);
  const f = voiceChord(parseChord('F'), 62, c);
  assert.ok(f.reduce((sum, n, i) => sum + Math.abs(n - c[i]), 0) <= 3);
});

test('every track loops about a minute of well-formed, playable music', () => {
  assert.ok(TRACK_LIST.length >= 12);
  for (const t of TRACK_LIST) {
    assert.ok(seconds(t, t.loopBar) > 50 && seconds(t) < 72, `${t.id} length`);
    let last = -1;
    for (const e of t.events) {
      assert.ok(e.t >= last, `${t.id} events sorted`);
      last = e.t;
      assert.ok(e.p in t.parts, `${t.id} part ${e.p}`);
      if (!('param' in e)) {
        assert.ok(
          e.m >= 20 && e.m <= 115 && e.d > 0 && e.v > 0,
          `${t.id} note ${JSON.stringify(e)}`,
        );
        assert.ok(e.t < t.bars * t.beatsPerBar, `${t.id} note inside the track`);
      }
    }
    for (const def of Object.values(t.parts)) assert.ok(def.inst in INSTRUMENTS);
    if (t.sidechain) assert.ok(t.sidechain.part in t.parts);
  }
});

test('the music follows menu, death, boss, caves, weather, biome, and night', () => {
  const base = {
    playing: true,
    dead: false,
    boss: false,
    depth: 0,
    weather: 'clear',
    biome: 'meadow',
    night: false,
  };
  const cases = [
    [{ playing: false }, 'menu'],
    [{ dead: true, boss: true }, 'fallen'],
    [{ boss: true, depth: 500 }, 'boss'],
    [{ depth: 200 }, 'cave'],
    [{ depth: 500 }, 'depths'],
    [{ weather: 'storm', biome: 'desert' }, 'storm'],
    [{ biome: 'taiga', night: true }, 'cold'],
    [{ biome: 'badlands' }, 'desert'],
    [{ biome: 'marsh' }, 'marsh'],
    [{ biome: 'forest', night: true }, 'night'],
    [{ biome: 'forest' }, 'forest'],
    [{ biome: 'coast' }, 'coast'],
    [{}, 'meadow'],
  ];
  for (const [over, want] of cases) assert.equal(musicScene({ ...base, ...over }), want);
  for (const [, id] of cases) assert.ok(TRACKS[id], `track for ${id}`);
});
