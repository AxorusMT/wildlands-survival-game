import { compose } from '../score.ts';

// Title theme. Intro swell with a distant howl, the brass states the theme over half-time
// drums, strings climb through a snare-roll build, then the full anthem drops: four-on-the-floor
// kick, pumping supersaws, pulse lead hook, choir, gallop strings, and orchestra hits.
export const menu = compose(
  {
    id: 'menu',
    title: 'Wildlands',
    mood: 'Title theme',
    bpm: 132,
    bars: 36,
    loopBar: 4,
    sidechain: { part: 'kick', depth: 0.62, release: 0.3 },
    parts: {
      kick: { inst: 'bigkick', vol: 1 },
      clap: { inst: 'clap', vol: 0.55, rev: 0.25 },
      snare: { inst: 'snare', vol: 0.6, rev: 0.25 },
      hat: { inst: 'hat', vol: 0.5, pan: 0.25 },
      ohat: { inst: 'ohat', vol: 0.55, pan: -0.2 },
      crash: { inst: 'crash', vol: 0.7, rev: 0.3 },
      taiko: { inst: 'taiko', vol: 0.75, rev: 0.35 },
      timp: { inst: 'timpani', vol: 0.9, rev: 0.4 },
      riser: { inst: 'riser', vol: 0.45, rev: 0.4 },
      swell: { inst: 'swell', vol: 0.5, rev: 0.3 },
      impact: { inst: 'impact', vol: 0.8, rev: 0.5 },
      howl: { inst: 'howl', vol: 0.55, rev: 0.8, echo: 0.35, pan: -0.3 },
      bass: { inst: 'synthbass', vol: 0.9, duck: true },
      sub: { inst: 'sub', vol: 0.75, duck: true },
      saw: { inst: 'supersaw', vol: 0.65, duck: true, rev: 0.3 },
      pad: { inst: 'pad', vol: 0.9, duck: true, rev: 0.5 },
      choir: { inst: 'choir', vol: 0.75, rev: 0.6 },
      bell: { inst: 'bell', vol: 0.55, rev: 0.4, echo: 0.4, pan: 0.2 },
      pizz: { inst: 'pizz', vol: 0.55, rev: 0.2, echo: 0.15, pan: -0.25 },
      arp: { inst: 'supersaw', vol: 0.4, rev: 0.3, echo: 0.2, cutoff: 600 },
      gallop: { inst: 'strings', vol: 0.28, rev: 0.3, pan: 0.2 },
      lstr: { inst: 'strings', vol: 0.9, rev: 0.45 },
      brass: { inst: 'brass', vol: 1, rev: 0.4 },
      lead: { inst: 'pulse', vol: 0.75, rev: 0.25, echo: 0.28 },
      lead2: { inst: 'supersaw', vol: 0.8, rev: 0.25, echo: 0.1 },
      hit: { inst: 'orchhit', vol: 0.8, rev: 0.45 },
    },
  },
  (s) => {
    const intro = 'Dm Bb Gm A',
      progA = 'Dm Bb F C Dm Bb Gm A',
      progB = 'Gm Bb F C Gm Bb C C:.75',
      drop1 = 'Dm Bb F C Dm Bb F C',
      drop2 = 'Bb C Dm F Gm Bb C A';

    // ── Intro (bars 0–3) ──
    s.pad('pad', 0, intro, 62);
    s.automate('pad', 'vol', 0, 3, 0.2, 1);
    s.pad('choir', 0, intro, 57, { vel: 0.8 });
    s.arp('bell', 0, intro, '0 2 1 3 2 4 3 5', 74, 2, { vel: 0.8 });
    s.bass('sub', 0, intro, 'R:16', 33, { vel: 0.8 });
    s.play('howl', 0, 'r:4 a4:28 r:32');
    s.note('riser', 8, 60, 8, 0.8);
    s.grid('timp', 3, 'oooooooxxxxxXXXX', 1, { midi: 45 });
    s.note('swell', 12, 60, 4);

    // ── A: the theme (bars 4–11) ──
    const themeA =
      'd5:6 e5:2 f5:4 a5:4 | g5:6 f5:2 d5:8 | c5:6 d5:2 f5:4 c6:4 | g5:12 e5:4 | ' +
      'd5:6 e5:2 f5:4 a5:4 | bb5:6 a5:2 g5:4 f5:4 | g5:6 f5:2 e5:4 d5:4 | c#5:8 e5:4 a5:4';
    s.play('brass', 4, themeA);
    s.play('lstr', 4, themeA, { transpose: -12, vel: 0.8 });
    s.note('impact', 16, 60, 1);
    s.play('hit', 4, '>d4:16 | r:16 | r:16 | r:16 | d4:16 | r:16 | r:16 | r:16');
    s.grid('crash', 4, 'x...............', 1);
    s.grid('crash', 8, 'x...............', 1);
    s.grid('kick', 4, 'x.........x.....', 7);
    s.grid('kick', 11, 'x.........x.x.x.');
    s.grid('snare', 4, '........x.......', 7);
    s.grid('snare', 11, '........x...x.xx');
    s.grid('clap', 4, '........x.......', 8);
    s.grid('taiko', 4, '....x......x..x.', 8);
    s.grid('hat', 4, 'x.x.x.x.x.x.x.x.', 8, { vel: 0.7 });
    s.bass('timp', 4, progA, 'R:12 R:2 R:2', 38);
    s.bass('bass', 4, progA, 'R:2 8:2', 26);
    s.bass('sub', 4, progA, 'R:16', 33);
    s.pad('pad', 4, progA, 60);
    s.pad('choir', 4, progA, 60, { vel: 0.8 });
    s.arp('pizz', 4, progA, '0 2 1 2 3 2 1 2', 50, 2);

    // ── B: the climb (bars 12–19) ──
    s.play(
      'lstr',
      12,
      'd5:6 c5:2 bb4:8 | f5:6 eb5:2 d5:8 | c5:6 d5:2 f5:4 a5:4 | g5:16 | ' +
        'bb5:6 a5:2 g5:8 | d6:6 c6:2 bb5:8 | c6:4 d6:4 e6:4 g6:4 | g6:12 r:4',
    );
    s.play('brass', 16, 'bb4:6 a4:2 g4:8 | d5:6 c5:2 bb4:8 | c5:4 d5:4 e5:4 g5:4 | g5:12 r:4', {
      vel: 0.9,
    });
    s.pad('pad', 12, progB, 60);
    s.pad('choir', 12, progB, 62);
    s.arp('arp', 12, progB, '0 1 2 3 1 2 3 4', 55, 1);
    s.automate('arp', 'cutoff', 12, 7.75, 500, 9000);
    s.bass('bass', 12, 'Gm Bb F C', 'R:2 8:2', 26);
    s.bass('bass', 16, 'Gm Bb C', 'R:1 R:1 8:1 R:1', 26);
    s.play('bass', 19, 'c2:1 c2:1 c3:1 c2:1 c2:1 c2:1 c3:1 c2:1 c2:1 c2:1 c3:1 c2:1 r:4');
    s.bass('sub', 12, progB, 'R:16', 33);
    s.grid('kick', 12, 'x.......x.......', 4);
    s.grid('kick', 16, 'x...x...x...x...', 3);
    s.grid('kick', 19, 'x...x...x.......');
    s.grid('taiko', 12, '....x......x....', 4);
    s.grid('hat', 12, 'xxxxxxxxxxxxxxxx', 4, { vel: 0.45 });
    s.grid('snare', 16, 'x...x...x...x...|x.x.x.x.x.x.x.x.|xxxxxxxxxxxxxxxx|xxxxxxxxxxxx....');
    s.automate('snare', 'vol', 16, 3.75, 0.35, 1.3);
    s.play('timp', 18, 'r:8 a2:1 a2:1 a2:1 a2:1 a2:1 a2:1 a2:1 a2:1 | c3:12 r:4');
    s.note('riser', 64, 60, 16);
    s.note('swell', 76, 60, 4);

    // ── C: the drop (bars 20–35) ──
    const hook1 =
      '>a5:3 a5:3 a5:2 g5:2 a5:2 c6:2 d6:2 | d6:3 c6:3 bb5:2 g5:4 f5:4 | ' +
      '>c6:3 c6:3 c6:2 a5:2 c6:2 f6:2 e6:2 | e6:6 d6:2 c6:4 g5:4 | ' +
      '>a5:3 a5:3 a5:2 g5:2 a5:2 c6:2 d6:2 | d6:3 c6:3 bb5:2 a5:2 bb5:2 c6:2 d6:2 | ' +
      '>f6:6 e6:2 d6:2 c6:2 a5:4 | c6:4 d6:4 e6:8';
    const hook2 =
      '>bb5:3 d6:3 f6:2 f6:4 d6:4 | >c6:3 e6:3 g6:2 g6:4 e6:4 | ' +
      '>f6:3 e6:3 d6:2 d6:4 a5:4 | c6:3 d6:3 f6:2 >a6:8 | ' +
      '>g6:6 f6:2 d6:4 bb5:4 | f6:6 d6:2 bb5:4 d6:4 | e6:6 d6:2 c6:4 e6:4 | >e6:8 c#6:4 a5:4';
    s.play('lead', 20, hook1 + ' | ' + hook2);
    s.play('lead2', 20, hook1 + ' | ' + hook2, { transpose: -12 });
    s.play('brass', 20, 'd5:16 | d5:16 | c5:16 | c5:8 e5:8 | f5:16 | f5:16 | a5:16 | g5:16', {
      vel: 0.85,
    });
    s.play('brass', 28, hook2, { transpose: -12 });
    s.pad('saw', 20, drop1 + ' ' + drop2, 64);
    s.pad('pad', 20, drop1 + ' ' + drop2, 57);
    s.pad('choir', 20, drop1, 64, { vel: 0.7 });
    s.pad('choir', 28, drop2, 67);
    s.arp('pizz', 20, drop1 + ' ' + drop2, '0 1 2 3 4 3 2 1', 62, 1, { vel: 0.8 });
    s.hits('gallop', 28, drop2, 'x-xxx-xxx-xxx-xx', 55);
    s.bass('bass', 20, drop1, 'r:2 R:2', 26);
    s.bass('bass', 28, drop2, 'R:1 R:1 8:1 R:1', 26);
    s.bass('sub', 20, drop1 + ' ' + drop2, 'R:16', 33);
    s.automate('snare', 'vol', 20, 0, 1, 1);
    s.grid('kick', 20, 'x...x...x...x...', 15);
    s.grid('kick', 35, 'x...x...x...x.x.');
    s.grid('clap', 20, '....x.......x...', 16);
    s.grid('snare', 28, '....x.......x...', 7);
    s.grid('snare', 35, '....x.......x.xx');
    s.grid('ohat', 20, '..x...x...x...x.', 16);
    s.grid('hat', 20, '.o.o.o.o.o.o.o.o', 16);
    s.grid('taiko', 28, 'x.........x..x..', 8);
    for (const bar of [20, 24, 28, 32]) s.grid('crash', bar, 'x...............');
    s.note('impact', 80, 60, 1);
    s.play('hit', 20, '>d4:16 | r:16 | r:16 | r:16 | r:16 | r:16 | r:16 | r:16');
    s.play('hit', 28, '>bb3:16 | r:16 | r:16 | r:16 | g3:16 | r:16 | r:16 | >a3:3 a3:3 a3:10');
    s.bass('timp', 28, drop2, 'R:4 r:4 R:4 r:2 R:2', 38);
  },
);
