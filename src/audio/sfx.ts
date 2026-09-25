// Synthesised sound effects. Every sound is a small, short-lived Web Audio graph built on the
// same kit as the music (noise buffer, waveshapers), so nothing is loaded from disk. Each takes
// the destination it should play into (already panned and attenuated by the caller) and a
// strength `v` around 1.

import { kit, type Kit } from './instruments.ts';

type Sfx = (k: Kit, out: AudioNode, t: number, v: number) => void;

// ── Building blocks ────────────────────────────────────────────────────────────────────────

function env(k: Kit, t: number, peak: number, decay: number, attack = 0.003) {
  const g = k.ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(peak, t + attack);
  g.gain.setTargetAtTime(0, t + attack, decay / 3.5);
  return { g, end: t + attack + decay * 2 + 0.03 };
}

function noiseSrc(k: Kit, t: number, end: number) {
  const n = k.ctx.createBufferSource();
  n.buffer = k.noise;
  n.loop = true;
  n.start(t, (t * 13.7) % 1.5);
  n.stop(end);
  return n;
}

function biquad(k: Kit, type: BiquadFilterType, freq: number, q = 0.8) {
  const f = k.ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = Math.min(freq, k.ctx.sampleRate / 2 - 100);
  f.Q.value = q;
  return f;
}

/** A burst of filtered noise; `sweepTo` glides the filter over the burst. */
function hiss(
  k: Kit,
  out: AudioNode,
  t: number,
  opts: {
    freq: number;
    q?: number;
    type?: BiquadFilterType;
    peak: number;
    decay: number;
    attack?: number;
    sweepTo?: number;
  },
) {
  const e = env(k, t, opts.peak, opts.decay, opts.attack ?? 0.003),
    f = biquad(k, opts.type ?? 'bandpass', opts.freq, opts.q ?? 1);
  if (opts.sweepTo) {
    f.frequency.setValueAtTime(opts.freq, t);
    f.frequency.exponentialRampToValueAtTime(opts.sweepTo, t + (opts.attack ?? 0.003) + opts.decay);
  }
  noiseSrc(k, t, e.end).connect(f).connect(e.g).connect(out);
}

/** A tone that glides from `from` to `to` Hz. */
function tone(
  k: Kit,
  out: AudioNode,
  t: number,
  opts: {
    from: number;
    to?: number;
    type?: OscillatorType;
    peak: number;
    decay: number;
    attack?: number;
    glide?: number;
  },
) {
  const e = env(k, t, opts.peak, opts.decay, opts.attack ?? 0.003),
    o = k.ctx.createOscillator();
  o.type = opts.type ?? 'sine';
  o.frequency.setValueAtTime(opts.from, t);
  if (opts.to) o.frequency.exponentialRampToValueAtTime(opts.to, t + (opts.glide ?? opts.decay));
  o.start(t);
  o.stop(e.end);
  o.connect(e.g).connect(out);
  return o;
}

/** A tone shaped by a formant filter, for animal cries. */
function cry(
  k: Kit,
  out: AudioNode,
  t: number,
  opts: {
    from: number;
    to: number;
    formant: number;
    q?: number;
    peak: number;
    dur: number;
    wobble?: number;
    type?: OscillatorType;
  },
) {
  const g = k.ctx.createGain(),
    o = k.ctx.createOscillator(),
    f = biquad(k, 'bandpass', opts.formant, opts.q ?? 2.5),
    end = t + opts.dur + 0.1;
  o.type = opts.type ?? 'sawtooth';
  o.frequency.setValueAtTime(opts.from, t);
  o.frequency.exponentialRampToValueAtTime(opts.to, t + opts.dur);
  if (opts.wobble) {
    const lfo = k.ctx.createOscillator(),
      depth = k.ctx.createGain();
    lfo.frequency.value = opts.wobble;
    depth.gain.value = opts.from * 0.04;
    lfo.connect(depth).connect(o.frequency);
    lfo.start(t);
    lfo.stop(end);
  }
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(opts.peak, t + Math.min(0.04, opts.dur * 0.2));
  g.gain.setValueAtTime(opts.peak, t + opts.dur * 0.6);
  g.gain.linearRampToValueAtTime(0, t + opts.dur);
  o.start(t);
  o.stop(end);
  o.connect(f).connect(g).connect(out);
}

/** A growl: a low buzz chopped by fast amplitude flutter. */
function growl(
  k: Kit,
  out: AudioNode,
  t: number,
  from: number,
  to: number,
  dur: number,
  peak: number,
  rough = 28,
) {
  const g = k.ctx.createGain(),
    flutter = k.ctx.createGain(),
    lfo = k.ctx.createOscillator(),
    depth = k.ctx.createGain(),
    o = k.ctx.createOscillator(),
    lp = biquad(k, 'lowpass', 700, 1.5),
    ws = k.ctx.createWaveShaper(),
    end = t + dur + 0.1;
  ws.curve = k.drive;
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(from, t);
  o.frequency.exponentialRampToValueAtTime(to, t + dur);
  lfo.frequency.value = rough;
  depth.gain.value = 0.5;
  flutter.gain.value = 0.5;
  lfo.connect(depth).connect(flutter.gain);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(peak, t + 0.06);
  g.gain.setValueAtTime(peak, t + dur * 0.7);
  g.gain.linearRampToValueAtTime(0, t + dur);
  for (const n of [o, lfo]) {
    n.start(t);
    n.stop(end);
  }
  o.connect(ws).connect(lp).connect(flutter).connect(g).connect(out);
}

const clicks = (
  k: Kit,
  out: AudioNode,
  t: number,
  n: number,
  spread: number,
  freq: number,
  peak: number,
) => {
  for (let i = 0; i < n; i++)
    hiss(k, out, t + (i / n) * spread + ((i * 37) % 7) * 0.004, {
      freq: freq * (0.8 + ((i * 13) % 5) * 0.1),
      q: 4,
      peak,
      decay: 0.025,
    });
};

// ── The player ─────────────────────────────────────────────────────────────────────────────

const SOUNDS: Record<string, Sfx> = {
  jump: (k, o, t, v) => {
    hiss(k, o, t, { freq: 600, sweepTo: 2000, q: 1.2, peak: 0.12 * v, decay: 0.12, attack: 0.03 });
    tone(k, o, t, { from: 240, to: 340, peak: 0.05 * v, decay: 0.08 });
  },
  land: (k, o, t, v) => {
    tone(k, o, t, { from: 120, to: 50, peak: 0.35 * v, decay: 0.14 });
    hiss(k, o, t, { freq: 500, type: 'lowpass', peak: 0.25 * v, decay: 0.08 });
  },
  step_soil: (k, o, t, v) => {
    hiss(k, o, t, { freq: 1600, q: 0.9, peak: 0.07 * v, decay: 0.05 });
    tone(k, o, t, { from: 90, to: 60, peak: 0.08 * v, decay: 0.04 });
  },
  step_grass: (k, o, t, v) => {
    hiss(k, o, t, { freq: 3200, q: 0.7, peak: 0.07 * v, decay: 0.06, attack: 0.01 });
    tone(k, o, t, { from: 90, to: 60, peak: 0.05 * v, decay: 0.04 });
  },
  step_stone: (k, o, t, v) => {
    hiss(k, o, t, { freq: 2600, q: 3, peak: 0.08 * v, decay: 0.03 });
    tone(k, o, t, { from: 140, to: 90, peak: 0.06 * v, decay: 0.03 });
  },
  step_sand: (k, o, t, v) =>
    hiss(k, o, t, { freq: 4200, type: 'highpass', peak: 0.05 * v, decay: 0.09, attack: 0.02 }),
  step_snow: (k, o, t, v) => {
    for (let i = 0; i < 3; i++)
      hiss(k, o, t + i * 0.018, { freq: 1300 + i * 300, q: 2.5, peak: 0.06 * v, decay: 0.03 });
  },
  step_mud: (k, o, t, v) =>
    hiss(k, o, t, { freq: 350, sweepTo: 1000, q: 3, peak: 0.1 * v, decay: 0.08 }),
  step_ash: (k, o, t, v) => {
    hiss(k, o, t, { freq: 1900, q: 1.5, peak: 0.06 * v, decay: 0.06 });
    clicks(k, o, t + 0.01, 2, 0.04, 5200, 0.03 * v);
  },
  hurt: (k, o, t, v) => {
    cry(k, o, t, { from: 210, to: 130, formant: 750, q: 3, peak: 0.28 * v, dur: 0.2 });
    tone(k, o, t, { from: 130, to: 60, peak: 0.3 * v, decay: 0.12 });
    hiss(k, o, t, { freq: 1600, q: 1, peak: 0.15 * v, decay: 0.06 });
  },
  burn: (k, o, t, v) => {
    hiss(k, o, t, {
      freq: 3500,
      sweepTo: 1500,
      type: 'highpass',
      peak: 0.12 * v,
      decay: 0.3,
      attack: 0.02,
    });
    clicks(k, o, t, 4, 0.2, 3000, 0.05 * v);
  },
  death: (k, o, t, v) => {
    cry(k, o, t, { from: 190, to: 90, formant: 650, peak: 0.25 * v, dur: 0.7, wobble: 7 });
    [220, 175, 147, 110].forEach((f, i) =>
      tone(k, o, t + 0.15 + i * 0.28, {
        from: f,
        type: 'triangle',
        peak: 0.12 * v,
        decay: 1.4,
        attack: 0.02,
      }),
    );
    tone(k, o, t + 0.1, { from: 70, to: 32, peak: 0.4 * v, decay: 1.5 });
  },
  swing: (k, o, t, v) =>
    hiss(k, o, t, { freq: 3500, sweepTo: 700, q: 1.4, peak: 0.13 * v, decay: 0.14, attack: 0.02 }),
  hit: (k, o, t, v) => {
    tone(k, o, t, { from: 160, to: 70, peak: 0.35 * v, decay: 0.12 });
    hiss(k, o, t, { freq: 2200, q: 1.5, peak: 0.2 * v, decay: 0.05 });
  },
  // ── Gathering and building ──
  chop: (k, o, t, v) => {
    tone(k, o, t, { from: 220, to: 140, type: 'triangle', peak: 0.3 * v, decay: 0.09 });
    hiss(k, o, t, { freq: 950, q: 5, peak: 0.25 * v, decay: 0.07 });
    tone(k, o, t + 0.035, { from: 420, to: 300, peak: 0.08 * v, decay: 0.05 });
  },
  creak: (k, o, t, v) => {
    cry(k, o, t, {
      from: 70,
      to: 120,
      formant: 480,
      q: 7,
      peak: 0.25 * v,
      dur: 0.85,
      wobble: 13,
      type: 'sawtooth',
    });
    clicks(k, o, t + 0.3, 5, 0.5, 1400, 0.05 * v);
  },
  timber: (k, o, t, v) => {
    tone(k, o, t, { from: 95, to: 40, peak: 0.5 * v, decay: 0.5 });
    hiss(k, o, t, { freq: 1100, type: 'lowpass', peak: 0.35 * v, decay: 0.5 });
    hiss(k, o, t + 0.05, { freq: 5200, type: 'highpass', peak: 0.1 * v, decay: 0.9, attack: 0.05 });
    clicks(k, o, t, 8, 0.35, 1800, 0.08 * v);
  },
  pick: (k, o, t, v) => {
    tone(k, o, t, { from: 2300, peak: 0.1 * v, decay: 0.12 });
    tone(k, o, t, { from: 3350, peak: 0.06 * v, decay: 0.08 });
    hiss(k, o, t, { freq: 3500, q: 2, peak: 0.18 * v, decay: 0.04 });
    tone(k, o, t, { from: 150, to: 90, peak: 0.12 * v, decay: 0.06 });
  },
  crumble: (k, o, t, v) => {
    clicks(k, o, t, 10, 0.35, 2400, 0.09 * v);
    hiss(k, o, t, { freq: 500, type: 'lowpass', peak: 0.3 * v, decay: 0.35 });
    tone(k, o, t, { from: 110, to: 55, peak: 0.25 * v, decay: 0.25 });
  },
  dig_soil: (k, o, t, v) => {
    hiss(k, o, t, { freq: 700, type: 'lowpass', peak: 0.3 * v, decay: 0.12 });
    clicks(k, o, t + 0.02, 4, 0.12, 1500, 0.05 * v);
  },
  dig_stone: (k, o, t, v) => {
    SOUNDS.pick(k, o, t, v * 0.9);
    clicks(k, o, t + 0.04, 5, 0.18, 2600, 0.05 * v);
  },
  dig_ice: (k, o, t, v) => {
    tone(k, o, t, { from: 3600, peak: 0.08 * v, decay: 0.3 });
    tone(k, o, t, { from: 5100, peak: 0.05 * v, decay: 0.2 });
    clicks(k, o, t, 7, 0.2, 6000, 0.05 * v);
  },
  dig_hell: (k, o, t, v) => {
    SOUNDS.pick(k, o, t, v * 0.8);
    hiss(k, o, t + 0.02, {
      freq: 4000,
      type: 'highpass',
      peak: 0.08 * v,
      decay: 0.35,
      attack: 0.02,
    });
  },
  pluck: (k, o, t, v) => {
    hiss(k, o, t, { freq: 3000, q: 0.9, peak: 0.1 * v, decay: 0.08, attack: 0.01 });
    hiss(k, o, t + 0.07, { freq: 2400, q: 0.9, peak: 0.08 * v, decay: 0.07, attack: 0.01 });
    hiss(k, o, t + 0.1, { freq: 1800, q: 5, peak: 0.12 * v, decay: 0.02 });
  },
  splash: (k, o, t, v) => {
    hiss(k, o, t, { freq: 800, sweepTo: 2800, q: 1, peak: 0.2 * v, decay: 0.25, attack: 0.01 });
    [620, 880, 540].forEach((f, i) =>
      tone(k, o, t + 0.04 + i * 0.05, { from: f, to: f * 1.5, peak: 0.05 * v, decay: 0.06 }),
    );
  },
  pickup: (k, o, t, v) => {
    tone(k, o, t, { from: 740, to: 1100, peak: 0.07 * v, decay: 0.06 });
    tone(k, o, t + 0.05, { from: 1320, peak: 0.05 * v, decay: 0.08 });
  },
  sizzle: (k, o, t, v) => {
    hiss(k, o, t, { freq: 6000, type: 'highpass', peak: 0.12 * v, decay: 0.5, attack: 0.02 });
    clicks(k, o, t, 6, 0.4, 3500, 0.05 * v);
  },
  place: (k, o, t, v) => {
    tone(k, o, t, { from: 130, to: 80, peak: 0.3 * v, decay: 0.1 });
    hiss(k, o, t, { freq: 900, q: 2, peak: 0.12 * v, decay: 0.06 });
    tone(k, o, t + 0.09, { from: 200, to: 150, type: 'triangle', peak: 0.1 * v, decay: 0.05 });
  },
  open: (k, o, t, v) => {
    cry(k, o, t, { from: 300, to: 520, formant: 900, q: 6, peak: 0.1 * v, dur: 0.35, wobble: 18 });
    hiss(k, o, t + 0.36, { freq: 2600, q: 4, peak: 0.15 * v, decay: 0.03 });
  },
  craft_wood: (k, o, t, v) => {
    for (let i = 0; i < 3; i++) {
      tone(k, o, t + i * 0.14, {
        from: 260,
        to: 170,
        type: 'triangle',
        peak: 0.2 * v,
        decay: 0.07,
      });
      hiss(k, o, t + i * 0.14, { freq: 1200, q: 4, peak: 0.12 * v, decay: 0.04 });
    }
  },
  craft_anvil: (k, o, t, v) => {
    for (let i = 0; i < 3; i++)
      for (const [f, a, d] of [
        [1150, 0.09, 0.6],
        [1730, 0.06, 0.45],
        [2590, 0.05, 0.3],
        [3480, 0.03, 0.2],
      ])
        tone(k, o, t + i * 0.2, { from: f * (i === 2 ? 1.06 : 1), peak: a * v, decay: d });
  },
  craft_cook: (k, o, t, v) => {
    hiss(k, o, t, { freq: 5000, type: 'highpass', peak: 0.09 * v, decay: 0.8, attack: 0.05 });
    clicks(k, o, t, 8, 0.7, 4200, 0.04 * v);
  },
  craft_brew: (k, o, t, v) => {
    for (let i = 0; i < 5; i++)
      tone(k, o, t + i * 0.09, {
        from: 380 + i * 60,
        to: 700 + i * 90,
        peak: 0.06 * v,
        decay: 0.06,
      });
    tone(k, o, t + 0.5, { from: 2600, peak: 0.05 * v, decay: 0.3 });
  },
  eat: (k, o, t, v) => {
    for (let i = 0; i < 3; i++)
      hiss(k, o, t + i * 0.1, { freq: 1500 + i * 250, q: 1.8, peak: 0.12 * v, decay: 0.05 });
  },
  drink: (k, o, t, v) => {
    for (let i = 0; i < 2; i++) {
      tone(k, o, t + i * 0.2, { from: 330, to: 190, peak: 0.12 * v, decay: 0.12 });
      hiss(k, o, t + i * 0.2, { freq: 700, q: 3, peak: 0.08 * v, decay: 0.08 });
    }
  },
  medicine: (k, o, t, v) => {
    tone(k, o, t, { from: 2900, peak: 0.07 * v, decay: 0.25 });
    tone(k, o, t + 0.05, { from: 3700, peak: 0.05 * v, decay: 0.2 });
    SOUNDS.drink(k, o, t + 0.15, v * 0.8);
  },
  equip: (k, o, t, v) => {
    hiss(k, o, t, { freq: 5500, type: 'highpass', peak: 0.12 * v, decay: 0.3, attack: 0.02 });
    tone(k, o, t + 0.02, { from: 1900, to: 2100, peak: 0.06 * v, decay: 0.35 });
    tone(k, o, t + 0.02, { from: 2850, peak: 0.04 * v, decay: 0.3 });
  },
  wear: (k, o, t, v) => {
    hiss(k, o, t, { freq: 1300, q: 0.7, peak: 0.12 * v, decay: 0.25, attack: 0.08 });
    hiss(k, o, t + 0.2, { freq: 1700, q: 0.7, peak: 0.08 * v, decay: 0.15, attack: 0.04 });
  },
  cast: (k, o, t, v) => {
    hiss(k, o, t, { freq: 2600, sweepTo: 900, q: 1.4, peak: 0.12 * v, decay: 0.25, attack: 0.05 });
    tone(k, o, t + 0.45, { from: 500, to: 900, peak: 0.08 * v, decay: 0.08 });
  },
  catch: (k, o, t, v) => {
    SOUNDS.splash(k, o, t, v);
    clicks(k, o, t + 0.1, 6, 0.3, 3000, 0.04 * v);
  },
  rest: (k, o, t, v) =>
    hiss(k, o, t, { freq: 900, type: 'lowpass', peak: 0.12 * v, decay: 1.2, attack: 0.5 }),
  page: (k, o, t, v) =>
    hiss(k, o, t, { freq: 2200, sweepTo: 5200, q: 0.8, peak: 0.08 * v, decay: 0.14, attack: 0.03 }),
  click: (k, o, t, v) => tone(k, o, t, { from: 1600, to: 1200, peak: 0.05 * v, decay: 0.03 }),
  thunder: (k, o, t, v) => {
    hiss(k, o, t, { freq: 1800, q: 0.5, peak: 0.25 * v, decay: 0.2 });
    hiss(k, o, t + 0.05, { freq: 260, type: 'lowpass', peak: 0.7 * v, decay: 2.8, attack: 0.15 });
    hiss(k, o, t + 0.6, { freq: 180, type: 'lowpass', peak: 0.4 * v, decay: 2, attack: 0.3 });
  },
  boss: (k, o, t, v) => {
    growl(k, o, t, 70, 50, 1.4, 0.5 * v, 22);
    cry(k, o, t + 0.2, { from: 180, to: 330, formant: 900, peak: 0.2 * v, dur: 1.4, wobble: 5 });
  },
  victory: (k, o, t, v) => {
    [523, 659, 784, 1047].forEach((f, i) => {
      tone(k, o, t + i * 0.12, {
        from: f,
        type: 'triangle',
        peak: 0.12 * v,
        decay: 0.7,
        attack: 0.01,
      });
      tone(k, o, t + i * 0.12, { from: f * 2, peak: 0.03 * v, decay: 0.4 });
    });
  },
  // ── Creatures ──
  deer_call: (k, o, t, v) =>
    cry(k, o, t, {
      from: 720,
      to: 520,
      formant: 1250,
      q: 3,
      peak: 0.16 * v,
      dur: 0.35,
      wobble: 11,
    }),
  deer_hurt: (k, o, t, v) =>
    cry(k, o, t, { from: 900, to: 560, formant: 1400, q: 3, peak: 0.2 * v, dur: 0.3, wobble: 16 }),
  wolf_call: (k, o, t, v) => {
    cry(k, o, t, {
      from: 330,
      to: 520,
      formant: 900,
      q: 2,
      peak: 0.12 * v,
      dur: 0.6,
      wobble: 5,
      type: 'triangle',
    });
    cry(k, o, t + 0.6, {
      from: 520,
      to: 400,
      formant: 900,
      q: 2,
      peak: 0.1 * v,
      dur: 0.9,
      wobble: 5,
      type: 'triangle',
    });
  },
  wolf_attack: (k, o, t, v) => {
    growl(k, o, t, 110, 90, 0.35, 0.3 * v, 30);
    cry(k, o, t + 0.3, { from: 380, to: 220, formant: 900, peak: 0.2 * v, dur: 0.12 });
  },
  wolf_hurt: (k, o, t, v) =>
    cry(k, o, t, { from: 900, to: 700, formant: 1300, peak: 0.18 * v, dur: 0.22, wobble: 20 }),
  boar_call: (k, o, t, v) => growl(k, o, t, 95, 75, 0.28, 0.25 * v, 34),
  boar_attack: (k, o, t, v) => {
    growl(k, o, t, 120, 90, 0.3, 0.3 * v, 38);
    hiss(k, o, t + 0.2, { freq: 600, type: 'lowpass', peak: 0.2 * v, decay: 0.1 });
  },
  boar_hurt: (k, o, t, v) =>
    cry(k, o, t, { from: 800, to: 1500, formant: 1500, peak: 0.2 * v, dur: 0.3, wobble: 25 }),
  bat_call: (k, o, t, v) => {
    for (let i = 0; i < 3; i++)
      tone(k, o, t + i * 0.06, { from: 5400, to: 3900, peak: 0.05 * v, decay: 0.04 });
    for (let i = 0; i < 4; i++)
      hiss(k, o, t + i * 0.08, { freq: 900, type: 'lowpass', peak: 0.06 * v, decay: 0.04 });
  },
  bat_attack: (k, o, t, v) =>
    tone(k, o, t, { from: 4600, to: 2800, type: 'triangle', peak: 0.08 * v, decay: 0.12 }),
  bat_hurt: (k, o, t, v) =>
    tone(k, o, t, { from: 6000, to: 3000, type: 'triangle', peak: 0.08 * v, decay: 0.15 }),
  scorpion_call: (k, o, t, v) => clicks(k, o, t, 6, 0.3, 4200, 0.06 * v),
  scorpion_attack: (k, o, t, v) => {
    hiss(k, o, t, { freq: 5000, type: 'highpass', peak: 0.12 * v, decay: 0.35, attack: 0.03 });
    clicks(k, o, t, 4, 0.15, 3600, 0.07 * v);
  },
  scorpion_hurt: (k, o, t, v) => clicks(k, o, t, 5, 0.1, 2800, 0.09 * v),
  ember_bat_call: (k, o, t, v) => {
    SOUNDS.bat_call(k, o, t, v * 0.8);
    clicks(k, o, t + 0.05, 5, 0.3, 3200, 0.05 * v);
  },
  ember_bat_attack: (k, o, t, v) => {
    tone(k, o, t, { from: 3400, to: 1700, type: 'sawtooth', peak: 0.06 * v, decay: 0.2 });
    hiss(k, o, t, { freq: 4500, type: 'highpass', peak: 0.08 * v, decay: 0.3 });
  },
  ember_bat_hurt: (k, o, t, v) =>
    tone(k, o, t, { from: 4200, to: 1900, type: 'sawtooth', peak: 0.07 * v, decay: 0.2 }),
  hellhound_call: (k, o, t, v) => {
    growl(k, o, t, 62, 48, 1.1, 0.4 * v, 20);
    hiss(k, o, t + 0.1, { freq: 1600, q: 0.6, peak: 0.06 * v, decay: 0.9, attack: 0.2 });
  },
  hellhound_attack: (k, o, t, v) => {
    growl(k, o, t, 90, 60, 0.45, 0.45 * v, 26);
    cry(k, o, t + 0.35, { from: 300, to: 160, formant: 700, peak: 0.25 * v, dur: 0.18 });
  },
  hellhound_hurt: (k, o, t, v) => growl(k, o, t, 150, 100, 0.3, 0.3 * v, 40),
  die: (k, o, t, v) => {
    tone(k, o, t, { from: 180, to: 60, peak: 0.25 * v, decay: 0.4 });
    hiss(k, o, t, { freq: 600, type: 'lowpass', peak: 0.15 * v, decay: 0.3 });
  },
};

export type SfxName = keyof typeof SOUNDS;
export const SFX_NAMES = Object.keys(SOUNDS);

/** Level trims from measuring every effect, so footsteps, cries, and crashes sit together. */
const TRIM: Record<string, number> = {
  step_soil: 0.6,
  step_snow: 3,
  step_mud: 4.5,
  step_ash: 2.6,
  land: 0.7,
  eat: 3,
  open: 2.4,
  pluck: 1.4,
  craft_brew: 1.5,
  scorpion_call: 3,
  wolf_call: 1.8,
  wolf_attack: 0.7,
  boar_call: 0.5,
  boar_attack: 0.7,
  hellhound_call: 0.6,
  hellhound_attack: 0.65,
  hellhound_hurt: 0.7,
};

/** Plays a named effect into `out` at time `t` (now if omitted). Unknown names are ignored. */
export function playSfx(
  ctx: BaseAudioContext,
  out: AudioNode,
  name: string,
  v = 1,
  t = ctx.currentTime,
) {
  const sound = SOUNDS[name];
  if (sound) sound(kit(ctx), out, t, v * (TRIM[name] ?? 1));
  return !!sound;
}

// ── Ambience ───────────────────────────────────────────────────────────────────────────────

export interface AmbienceLevels {
  rain: number;
  wind: number;
  fire: number;
  lava: number;
  cave: number;
  hell: number;
  birds: number;
  surf: number;
  night: number;
}
export const SILENCE: AmbienceLevels = {
  rain: 0,
  wind: 0,
  fire: 0,
  lava: 0,
  cave: 0,
  hell: 0,
  birds: 0,
  surf: 0,
  night: 0,
};

/** Continuous beds (rain, wind, rumble) plus scattered one-shots (birdsong, drips, crackle). */
export class Ambience {
  private readonly ctx: BaseAudioContext;
  private readonly out: AudioNode;
  private readonly beds: Partial<Record<keyof AmbienceLevels, GainNode>> = {};
  private levels: AmbienceLevels = { ...SILENCE };
  private nextShot: Partial<Record<keyof AmbienceLevels, number>> = {};

  constructor(ctx: BaseAudioContext, out: AudioNode) {
    this.ctx = ctx;
    this.out = out;
    const k = kit(ctx);
    const bed = (name: keyof AmbienceLevels, build: (input: AudioNode) => AudioNode) => {
      const g = ctx.createGain();
      g.gain.value = 0;
      const n = ctx.createBufferSource();
      n.buffer = k.noise;
      n.loop = true;
      n.playbackRate.value = 0.97 + Object.keys(this.beds).length * 0.013;
      n.start();
      build(n).connect(g).connect(out);
      this.beds[name] = g;
    };
    // Rain: a bright hiss over a soft low wash.
    bed('rain', (n) => {
      const hp = biquad(k, 'bandpass', 3800, 0.4),
        body = biquad(k, 'lowpass', 900, 0.5),
        mix = ctx.createGain();
      n.connect(hp).connect(mix);
      const g2 = ctx.createGain();
      g2.gain.value = 0.6;
      n.connect(body).connect(g2).connect(mix);
      return mix;
    });
    // Wind: a band of noise whose centre drifts slowly, like gusts.
    bed('wind', (n) => {
      const bp = biquad(k, 'bandpass', 600, 1.6),
        lfo = ctx.createOscillator(),
        depth = ctx.createGain();
      lfo.frequency.value = 0.13;
      depth.gain.value = 320;
      lfo.connect(depth).connect(bp.frequency);
      lfo.start();
      return n.connect(bp);
    });
    // Deep rumble for lava and the hell layers.
    const rumble = (name: keyof AmbienceLevels, cutoff: number) =>
      bed(name, (n) => {
        const lp = biquad(k, 'lowpass', cutoff, 0.7),
          g = ctx.createGain(),
          lfo = ctx.createOscillator(),
          depth = ctx.createGain();
        lfo.frequency.value = 0.21;
        depth.gain.value = 0.35;
        g.gain.value = 0.65;
        lfo.connect(depth).connect(g.gain);
        lfo.start();
        return n.connect(lp).connect(g);
      });
    rumble('lava', 220);
    rumble('hell', 120);
    // A faint room tone for caves.
    bed('cave', (n) => n.connect(biquad(k, 'lowpass', 350, 0.5)));
    // Surf: noise swelling and falling like waves on the shore.
    bed('surf', (n) => {
      const lp = biquad(k, 'lowpass', 1100, 0.5),
        g = ctx.createGain(),
        lfo = ctx.createOscillator(),
        depth = ctx.createGain();
      lfo.frequency.value = 0.11;
      depth.gain.value = 0.5;
      g.gain.value = 0.5;
      lfo.connect(depth).connect(g.gain);
      lfo.start();
      return n.connect(lp).connect(g);
    });
  }

  /** Eases every bed toward new levels (0–1) and schedules one-shots that are due. */
  update(levels: AmbienceLevels, now = this.ctx.currentTime) {
    this.levels = levels;
    const scale: Partial<Record<keyof AmbienceLevels, number>> = {
      rain: 0.1,
      wind: 0.12,
      lava: 0.35,
      hell: 0.4,
      cave: 0.12,
      surf: 0.12,
    };
    for (const [name, g] of Object.entries(this.beds))
      g.gain.setTargetAtTime(
        levels[name as keyof AmbienceLevels] * (scale[name as keyof AmbienceLevels] ?? 0.1),
        now,
        0.6,
      );
    const shots: [keyof AmbienceLevels, number, (t: number) => void][] = [
      ['birds', 2.2, (t) => this.bird(t)],
      ['night', 1.6, (t) => this.cricket(t)],
      [
        'fire',
        0.18,
        (t) =>
          clicks(
            kit(this.ctx),
            this.out,
            t,
            2,
            0.05,
            2600 + Math.random() * 2000,
            0.04 * levels.fire,
          ),
      ],
      ['cave', 2.4, (t) => this.drip(t)],
      ['lava', 1.1, (t) => this.bubble(t)],
    ];
    for (const [name, every, play] of shots) {
      const level = levels[name];
      if (level < 0.05) continue;
      const due = this.nextShot[name] ?? now;
      if (now >= due) {
        play(now + Math.random() * 0.1);
        this.nextShot[name] = now + (every * (0.4 + Math.random() * 1.2)) / Math.max(0.3, level);
      }
    }
  }

  private bird(t: number) {
    const k = kit(this.ctx),
      base = 2200 + Math.random() * 1800,
      notes = 2 + Math.floor(Math.random() * 4),
      v = this.levels.birds;
    for (let i = 0; i < notes; i++) {
      const f = base * (1 + (Math.random() - 0.5) * 0.35);
      tone(k, this.out, t + i * 0.11, {
        from: f,
        to: f * (Math.random() < 0.5 ? 1.3 : 0.8),
        peak: 0.025 * v,
        decay: 0.07,
        attack: 0.01,
      });
    }
  }
  private cricket(t: number) {
    const k = kit(this.ctx),
      f = 4300 + Math.random() * 500;
    for (let i = 0; i < 3; i++)
      tone(k, this.out, t + i * 0.035, { from: f, peak: 0.012 * this.levels.night, decay: 0.015 });
  }
  private drip(t: number) {
    const f = 900 + Math.random() * 900;
    tone(kit(this.ctx), this.out, t, {
      from: f,
      to: f * 1.9,
      peak: 0.04 * this.levels.cave,
      decay: 0.08,
      glide: 0.05,
    });
  }
  private bubble(t: number) {
    const f = 90 + Math.random() * 80;
    tone(kit(this.ctx), this.out, t, {
      from: f,
      to: f * 2.2,
      peak: 0.12 * this.levels.lava,
      decay: 0.12,
      glide: 0.1,
    });
  }
}
