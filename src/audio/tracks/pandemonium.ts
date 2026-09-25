import { compose } from '../score.ts';

// Lower Hell: the throne room. D minor bent toward Phrygian, with the tritone (D to Ab) at its
// heart. A bell tolls over a chanting choir, a pipe organ spins a toccata above war drums, the
// full host rises with guitars and double kick under an organ theme, then a slow black ritual of
// chant and bells climbs back into the fire.
export const pandemonium = compose(
  {
    id: 'pandemonium',
    title: 'Throne of Cinders',
    mood: 'Lower hell',
    bpm: 100,
    bars: 28,
    loopBar: 4,
    sidechain: { part: 'kick', depth: 0.35, release: 0.16 },
    parts: {
      kick: { inst: 'bigkick', vol: 0.8 },
      snare: { inst: 'snare', vol: 0.7, rev: 0.35 },
      taiko: { inst: 'taiko', vol: 0.9, rev: 0.5 },
      timp: { inst: 'timpani', vol: 0.9, rev: 0.5 },
      crash: { inst: 'crash', vol: 0.55, rev: 0.35 },
      impact: { inst: 'impact', vol: 0.8, rev: 0.6 },
      riser: { inst: 'riser', vol: 0.4, rev: 0.4 },
      swell: { inst: 'swell', vol: 0.45, rev: 0.4 },
      toll: { inst: 'toll', vol: 1.7, rev: 0.75 },
      pedal: { inst: 'organ', vol: 0.8, rev: 0.4, cutoff: 1400 },
      organ: { inst: 'organ', vol: 0.75, rev: 0.55, pan: -0.15 },
      lead: { inst: 'organ', vol: 2.3, rev: 0.5, echo: 0.15 },
      chant: { inst: 'chant', vol: 1, rev: 0.6 },
      choir: { inst: 'choir', vol: 0.75, rev: 0.7 },
      guitar: { inst: 'guitar', vol: 0.55, pan: -0.35, duck: true },
      guitar2: { inst: 'guitar', vol: 0.4, pan: 0.35, transpose: 12, duck: true },
      bass: { inst: 'synthbass', vol: 0.85, duck: true },
      hit: { inst: 'orchhit', vol: 0.75, rev: 0.5 },
    },
  },
  (s) => {
    const intro = 'Dm Dm Eb A',
      progA = 'Dm Eb Dm Ab Dm Eb Bbm A',
      progB = 'Dm Eb Dm Ab Bbm Gm A A',
      powerB = 'D5 Eb5 D5 Ab5 Bb5 G5 A5 A5',
      progC = 'Dm:2 Ab:2 Dm:2 A:2';
    const tolls = (bar: number, bars: number, every = 1) => {
      for (let b = 0; b < bars; b += every) s.at('toll', bar + b, 'd3', 4);
    };

    // Intro (0–3): the bell and the chant
    tolls(0, 4);
    s.pad('organ', 0, intro, 57, { vel: 0.8 });
    s.automate('organ', 'vol', 0, 3, 0.15, 1);
    s.play('chant', 0, 'd3:4 d3:4 d3:4 f3:2 e3:2 | d3:16 | eb3:4 eb3:4 d3:4 c3:4 | c#3:16');
    s.bass('pedal', 0, intro, 'R:16', 26);
    s.note('riser', 8, 60, 8);
    s.grid('timp', 3, 'oooooooxxxxxXXXX', 1, { midi: 38 });
    s.note('swell', 12, 60, 4);

    // A (4–11): the toccata over war drums
    s.note('impact', 16, 60, 1);
    s.grid('crash', 4, 'x...............');
    s.arp('organ', 4, progA, '2 1 0 1 3 1 0 1', 57, 1, { vel: 0.85 });
    s.bass('pedal', 4, progA, 'R:8 R:8', 26);
    s.hits('chant', 4, progA, 'x...x...x.x.x...', 50);
    s.grid('taiko', 4, 'x.......x.......', 8);
    s.grid('kick', 4, 'x..x....x..x....', 7);
    s.grid('kick', 11, 'x..x....x.xxxxxx');
    s.grid('snare', 11, '........x.x.xxxx');
    s.play('hit', 4, '>d4:16 | r:16 | r:16 | >ab3:16 | d4:16 | r:16 | r:16 | >a3:3 a3:3 a3:10');
    tolls(4, 8, 2);

    // B (12–19): the host rises
    s.note('impact', 48, 60, 1);
    s.grid('crash', 12, 'x...............');
    s.grid('crash', 16, 'x...............');
    const theme =
      'd5:3 f5:3 a5:2 ab5:4 f5:4 | g5:3 eb5:3 bb4:2 eb5:8 | d5:3 f5:3 a5:2 d6:4 c#6:4 | ' +
      'c6:3 ab5:3 eb5:2 ab5:8 | bb5:3 db6:3 f6:2 db6:4 bb5:4 | g5:3 bb5:3 d6:2 bb5:4 g5:4 | ' +
      'a5:3 c#6:3 e6:2 g6:4 e6:4 | c#6:8 a5:4 e5:4';
    s.play('lead', 12, theme);
    s.pad('choir', 12, progB, 62);
    s.hits('guitar', 12, powerB, 'x-.xx-.xx-.xx.xx', 50);
    s.hits('guitar2', 12, powerB, 'x-.xx-.xx-.xx.xx', 50);
    s.bass('bass', 12, progB, 'R:2', 26);
    s.bass('pedal', 12, progB, 'R:16', 26);
    s.grid('kick', 12, 'x.xxx.xxx.xxx.xx', 8);
    s.grid('snare', 12, '....x.......x...', 7);
    s.grid('snare', 19, '....x...x.x.xxxx');
    s.grid('taiko', 12, 'x.......x.......', 8);
    s.play('hit', 12, '>d4:16 | r:16 | r:16 | >ab3:16 | r:16 | r:16 | >a3:16 | r:16');

    // C (20–27): the ritual, climbing back into the fire
    s.play(
      'chant',
      20,
      'd3:8 f3:8 | e3:8 d3:8 | eb3:8 c3:8 | eb3:16 | d3:8 a3:8 | f3:8 d3:8 | c#3:8 e3:8 | a2:16',
    );
    s.pad('organ', 20, progC, 60, { vel: 0.9 });
    s.bass('pedal', 20, progC, 'R:16', 26);
    s.pad('choir', 24, 'Dm:2 A:2', 66, { vel: 0.8 });
    tolls(20, 8);
    s.grid('kick', 20, 'x..x............', 6, { vel: 0.9 });
    s.grid('timp', 26, 'x.......x.......|oooooooxxxxxXXXX', 1, { midi: 38 });
    s.automate('timp', 'vol', 26, 2, 0.5, 1.2);
    s.note('riser', 96, 60, 16);
    s.note('swell', 108, 60, 4);
  },
);
