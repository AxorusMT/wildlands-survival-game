import { compose } from '../score.ts';

// Upper Hell: F Phrygian heat. A growling bass ostinato and war drums, hammer-on-anvil hits,
// low brass announcing the theme, then a pulse lead and choir carrying it higher through the
// smoke, and a breathless drum break before the loop.
export const brimstone = compose(
  {
    id: 'brimstone',
    title: 'Brimstone Forges',
    mood: 'Upper hell',
    bpm: 112,
    bars: 28,
    sidechain: { part: 'kick', depth: 0.4, release: 0.2 },
    parts: {
      kick: { inst: 'bigkick', vol: 0.8 },
      snare: { inst: 'snare', vol: 0.6, rev: 0.3 },
      taiko: { inst: 'taiko', vol: 0.85, rev: 0.4 },
      tom: { inst: 'tom', vol: 0.6, rev: 0.3 },
      anvil: { inst: 'ride', vol: 2, rev: 0.35, pan: 0.3 },
      crash: { inst: 'crash', vol: 0.55, rev: 0.3 },
      riser: { inst: 'riser', vol: 0.4, rev: 0.3 },
      impact: { inst: 'impact', vol: 0.7, rev: 0.5 },
      bass: { inst: 'synthbass', vol: 0.75, duck: true },
      pad: { inst: 'pad', vol: 0.6, duck: true, rev: 0.45, cutoff: 1600 },
      trem: { inst: 'tremolo', vol: 1.1, rev: 0.45 },
      brass: { inst: 'brass', vol: 1, rev: 0.4 },
      lead: { inst: 'pulse', vol: 0.75, rev: 0.3, echo: 0.3 },
      choir: { inst: 'choir', vol: 0.8, rev: 0.6 },
      hit: { inst: 'orchhit', vol: 0.7, rev: 0.45 },
    },
  },
  (s) => {
    const prog = 'Fm Gb Fm Eb Fm Gb Db C';
    const ostinato = 'R:2 R:1 R:1 8:2 R:2 5:2 R:2 8:2 7:2';
    const theme =
      'f4:6 gb4:2 ab4:4 c5:4 | db5:6 c5:2 bb4:8 | ab4:6 bb4:2 c5:4 f5:4 | eb5:8 db5:4 c5:4 | ' +
      'f5:6 gb5:2 ab5:4 f5:4 | gb5:6 f5:2 db5:8 | db5:4 eb5:4 f5:4 ab5:4 | g5:8 e5:4 c5:4';
    const forge = (bar: number, bars: number, full: boolean) => {
      s.grid('kick', bar, full ? 'x..x..x.x..x..x.' : 'x.......x.......', bars);
      s.grid('snare', bar, '....x.......x...', bars);
      s.grid('taiko', bar, full ? 'x.....x...x.....' : 'x...........x...', bars);
      s.grid('anvil', bar, '..x...x...x...xx', bars, { vel: 0.8 });
    };

    // A (0–7): the forges wake
    s.bass('bass', 0, prog, ostinato, 29);
    s.pad('trem', 0, prog, 53, { vel: 0.8 });
    s.grid('taiko', 0, 'x.......x.......', 8);
    s.grid('anvil', 0, '........x.......', 8, { vel: 0.7 });
    s.grid('tom', 7, 'x.x.x.x.xxxxxxxx', 1, { midi: 45 });
    s.play('hit', 0, '>f3:16 | r:16 | r:16 | r:16 | f3:16 | r:16 | r:16 | >c4:4 c4:4 c4:8');

    // B (8–15): the brass states the theme
    s.note('impact', 32, 60, 1);
    s.grid('crash', 8, 'x...............');
    s.play('brass', 8, theme);
    s.bass('bass', 8, prog, ostinato, 29);
    s.pad('pad', 8, prog, 60);
    forge(8, 8, false);

    // C (16–23): the theme climbs into the smoke
    s.grid('crash', 16, 'x...............');
    s.grid('crash', 20, 'x...............');
    s.play('lead', 16, theme, { transpose: 12 });
    s.play('brass', 16, theme, { vel: 0.8 });
    s.pad('choir', 16, prog, 64);
    s.pad('pad', 16, prog, 57);
    s.bass('bass', 16, prog, 'R:1 R:1 8:1 R:1', 29);
    forge(16, 8, true);
    s.play('hit', 16, '>f3:16 | r:16 | r:16 | r:16 | f3:16 | r:16 | db4:16 | >c4:3 c4:3 c4:10');

    // D (24–27): a drum break and the heat rising again
    s.pad('choir', 24, 'Fm:2 Gb C', 58, { vel: 0.8 });
    s.bass('bass', 24, 'Fm:2 Gb C', 'R:4 r:4 R:2 R:2 r:4', 29);
    s.grid('taiko', 24, 'x..x..x.x..x..x.', 3);
    s.grid('tom', 26, '....x.x.x.xxxxxx', 1, { midi: 50 });
    s.grid('tom', 27, 'xxxxxxxxxxxxxxxx', 1, { midi: 43 });
    s.grid('snare', 27, '........xxxxxxxx');
    s.automate('snare', 'vol', 27, 1, 0.4, 1.2);
    s.note('riser', 104, 60, 8);
  },
);
