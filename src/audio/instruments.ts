// Synthesised instruments. Each voice builds a short-lived Web Audio graph for one note, so they
// work in a live AudioContext and an OfflineAudioContext alike. The palette leans on General MIDI
// favourites (pulse lead, pizzicato, flute, brass, choir, glockenspiel, orchestra hit) with a few
// modern synth voices and a drum kit.
//
// Kept cheap on purpose: per-note filters are static (automated biquads are recomputed every
// sample), tone colour that changes over a note comes from layers with different decays, and
// shared processing (tone filters, formants, vibrato LFOs, stereo spread) lives on the part.

import { midiToHz } from './theory.ts';

export interface Kit {
  ctx: BaseAudioContext;
  noise: AudioBuffer;
  pulse25: PeriodicWave;
  pulse12: PeriodicWave;
  drive: Float32Array<ArrayBuffer>;
  fuzz: Float32Array<ArrayBuffer>;
}

/** A part's inputs: the main input, hard-spread left/right inputs, and a shared vibrato LFO. */
export class PartOut {
  readonly k: Kit;
  readonly node: AudioNode;
  private readonly rate: number;
  private sides?: [StereoPannerNode, StereoPannerNode];
  private osc?: OscillatorNode;

  constructor(k: Kit, node: AudioNode, rate: number) {
    this.k = k;
    this.node = node;
    this.rate = rate;
  }

  private spread() {
    if (!this.sides) {
      this.sides = [-0.7, 0.7].map((v) => {
        const p = this.k.ctx.createStereoPanner();
        p.pan.value = v;
        p.connect(this.node);
        return p;
      }) as [StereoPannerNode, StereoPannerNode];
    }
    return this.sides;
  }

  get left(): AudioNode {
    return this.spread()[0];
  }

  get right(): AudioNode {
    return this.spread()[1];
  }

  /** Unit-amplitude sine at the instrument's vibrato rate, running for the part's lifetime. */
  get lfo(): AudioNode {
    if (!this.osc) {
      this.osc = this.k.ctx.createOscillator();
      this.osc.frequency.value = this.rate;
      this.osc.start();
    }
    return this.osc;
  }

  dispose() {
    this.osc?.stop();
  }
}

/** Plays one note into `out` at time `t` (seconds) for `dur` seconds at velocity `v`. */
export type Voice = (k: Kit, out: PartOut, t: number, midi: number, dur: number, v: number) => void;

export interface Instrument {
  voice: Voice;
  /** Low-pass cutoff applied once on the part. */
  cutoff?: number;
  /** Extra processing applied once on the part. */
  insert?: (k: Kit) => { input: AudioNode; output: AudioNode };
  /** Vibrato rate for the part's shared LFO. */
  vibrato?: number;
}

const kits = new WeakMap<BaseAudioContext, Kit>();

function pulseWave(ctx: BaseAudioContext, duty: number) {
  const n = 48,
    real = new Float32Array(n),
    imag = new Float32Array(n);
  for (let i = 1; i < n; i++) real[i] = (2 * Math.sin(Math.PI * i * duty)) / (Math.PI * i);
  return ctx.createPeriodicWave(real, imag);
}

function shaper(amount: number) {
  const curve = new Float32Array(1024);
  for (let i = 0; i < curve.length; i++) {
    const x = (i / (curve.length - 1)) * 2 - 1;
    curve[i] = Math.tanh(amount * x) / Math.tanh(amount);
  }
  return curve;
}

export function kit(ctx: BaseAudioContext): Kit {
  let k = kits.get(ctx);
  if (!k) {
    const noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = noise.getChannelData(0);
    let seed = 1;
    for (let i = 0; i < data.length; i++) {
      seed = (seed * 16807) % 2147483647;
      data[i] = (seed / 2147483647) * 2 - 1;
    }
    k = {
      ctx,
      noise,
      pulse25: pulseWave(ctx, 0.25),
      pulse12: pulseWave(ctx, 0.125),
      drive: shaper(2.2),
      fuzz: shaper(14),
    };
    kits.set(ctx, k);
  }
  return k;
}

// ── Building blocks ────────────────────────────────────────────────────────────────────────

function osc(
  k: Kit,
  shape: OscillatorType | PeriodicWave,
  freq: number,
  t: number,
  end: number,
  detune = 0,
) {
  const o = k.ctx.createOscillator();
  if (typeof shape === 'string') o.type = shape as OscillatorType;
  else o.setPeriodicWave(shape);
  o.frequency.value = freq;
  o.detune.value = detune;
  o.start(t);
  o.stop(end);
  return o;
}

function noise(k: Kit, t: number, end: number) {
  const n = k.ctx.createBufferSource();
  n.buffer = k.noise;
  n.loop = true;
  n.start(t, (t * 7.31) % 1.5);
  n.stop(end);
  return n;
}

function filter(k: Kit, type: BiquadFilterType, freq: number, q = 0.7) {
  const f = k.ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = Math.min(freq, k.ctx.sampleRate / 2);
  f.Q.value = q;
  return f;
}

function gain(k: Kit, value: number) {
  const g = k.ctx.createGain();
  g.gain.value = value;
  return g;
}

/** Attack, decay to sustain, hold until `t + dur`, then release. Returns the gain and end time. */
function adsr(
  k: Kit,
  t: number,
  dur: number,
  a: number,
  d: number,
  s: number,
  r: number,
  peak: number,
) {
  const g = k.ctx.createGain(),
    p = g.gain,
    at = Math.max(0.002, Math.min(a, dur * 0.9));
  p.setValueAtTime(0, t);
  p.linearRampToValueAtTime(peak, t + at);
  p.setTargetAtTime(peak * s, t + at, d / 3 + 0.001);
  p.setTargetAtTime(0, t + Math.max(dur, at), r / 3 + 0.001);
  return { g, end: t + Math.max(dur, at) + r * 2.5 + 0.02 };
}

/** Same envelope on several gain nodes (for stereo voices). */
function adsrN(
  n: number,
  k: Kit,
  t: number,
  dur: number,
  a: number,
  d: number,
  s: number,
  r: number,
  peak: number,
) {
  const envs = Array.from({ length: n }, () => adsr(k, t, dur, a, d, s, r, peak));
  return { gs: envs.map((e) => e.g), end: envs[0].end };
}

/** Percussive envelope: quick attack, exponential decay (seconds to fall about 30 dB). */
function perc(k: Kit, t: number, peak: number, decay: number, attack = 0.002) {
  const g = k.ctx.createGain(),
    p = g.gain;
  p.setValueAtTime(0, t);
  p.linearRampToValueAtTime(peak, t + attack);
  p.setTargetAtTime(0, t + attack, decay / 3.5);
  return { g, end: t + attack + decay * 2 + 0.02 };
}

/** Delayed vibrato from the part LFO onto oscillator frequencies. */
function vibrato(
  out: PartOut,
  oscs: OscillatorNode[],
  f: number,
  t: number,
  cents: number,
  delay = 0.2,
) {
  const depth = out.k.ctx.createGain(),
    hzDepth = f * (2 ** (cents / 1200) - 1);
  depth.gain.setValueAtTime(0, t);
  depth.gain.setValueAtTime(0, t + delay);
  depth.gain.linearRampToValueAtTime(hzDepth, t + delay + 0.35);
  out.lfo.connect(depth);
  for (const o of oscs) depth.connect(o.frequency);
  // Stop feeding the oscillators once they end so the depth node can be collected.
  oscs[0].addEventListener('ended', () => depth.disconnect());
}

function insertChain(...nodes: AudioNode[]) {
  for (let i = 1; i < nodes.length; i++) nodes[i - 1].connect(nodes[i]);
  return { input: nodes[0], output: nodes[nodes.length - 1] };
}

const hz = midiToHz;

// ── Leads and melodic voices ───────────────────────────────────────────────────────────────

const pulse: Instrument = {
  cutoff: 7500,
  vibrato: 5.6,
  voice: (k, out, t, m, dur, v) => {
    const f = hz(m);
    const { g, end } = adsr(k, t, dur, 0.006, 0.3, 0.7, 0.12, 0.17 * v);
    const a = osc(k, k.pulse25, f, t, end),
      b = osc(k, k.pulse25, f, t, end, 7);
    if (dur > 0.25) vibrato(out, [a, b], f, t, 11, 0.18);
    a.connect(g);
    b.connect(g);
    g.connect(out.node);
  },
};

const square: Instrument = {
  cutoff: 3500,
  vibrato: 5.2,
  voice: (k, out, t, m, dur, v) => {
    const f = hz(m);
    const { g, end } = adsr(k, t, dur, 0.01, 0.25, 0.75, 0.1, 0.13 * v);
    const o = osc(k, 'square', f, t, end);
    if (dur > 0.25) vibrato(out, [o], f, t, 9, 0.2);
    o.connect(g).connect(out.node);
  },
};

const supersaw: Instrument = {
  cutoff: 6500,
  voice: (k, out, t, m, dur, v) => {
    const f = hz(m);
    const {
      gs: [l, r],
      end,
    } = adsrN(2, k, t, dur, 0.01, 0.5, 0.75, 0.25, 0.05 * v);
    [-20, -9, 0, 9, 20].forEach((c, i) => {
      const o = k.ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = f;
      o.detune.value = c;
      o.start(t + i * 0.0007);
      o.stop(end);
      if (i !== 1 && i !== 3) o.connect(l);
      if (i !== 0 && i !== 4) o.connect(r);
    });
    l.connect(out.left);
    r.connect(out.right);
  },
};

const pad: Instrument = {
  cutoff: 2200,
  vibrato: 4.3,
  voice: (k, out, t, m, dur, v) => {
    const f = hz(m);
    const {
      gs: [l, r, c],
      end,
    } = adsrN(3, k, t, dur, 0.5, 1.4, 0.85, 1.1, 0.035 * v);
    const a = osc(k, 'sawtooth', f, t, end, -9),
      b = osc(k, 'sawtooth', f, t, end, 9);
    vibrato(out, [a, b], f, t, 6, 0.1);
    a.connect(l).connect(out.left);
    b.connect(r).connect(out.right);
    osc(k, 'triangle', f, t, end).connect(c).connect(out.node);
  },
};

const strings: Instrument = {
  cutoff: 4000,
  vibrato: 5.3,
  voice: (k, out, t, m, dur, v) => {
    const f = hz(m);
    const {
      gs: [l, r],
      end,
    } = adsrN(2, k, t, dur, 0.07, 0.6, 0.85, 0.3, 0.065 * v);
    const a = osc(k, 'sawtooth', f, t, end, -6),
      b = osc(k, 'sawtooth', f, t, end, 6),
      c = osc(k, 'triangle', f, t, end);
    if (dur > 0.3) vibrato(out, [a, b, c], f, t, 11, 0.25);
    a.connect(l);
    c.connect(l);
    b.connect(r);
    c.connect(r);
    l.connect(out.left);
    r.connect(out.right);
  },
};

/** Bowed strings with a fast bow tremolo, for tension. */
const tremolo: Instrument = {
  cutoff: 3600,
  insert: (k) => {
    const trem = gain(k, 0.6),
      lfo = k.ctx.createOscillator(),
      depth = gain(k, 0.4);
    lfo.type = 'triangle';
    lfo.frequency.value = 12.5;
    lfo.start();
    lfo.connect(depth).connect(trem.gain);
    return { input: trem, output: trem };
  },
  voice: (k, out, t, m, dur, v) => {
    const f = hz(m);
    const {
      gs: [l, r],
      end,
    } = adsrN(2, k, t, dur, 0.06, 0.4, 0.9, 0.25, 0.06 * v);
    osc(k, 'sawtooth', f, t, end, -7).connect(l).connect(out.left);
    osc(k, 'sawtooth', f, t, end, 7).connect(r).connect(out.right);
  },
};

const pizz: Instrument = {
  cutoff: 5000,
  voice: (k, out, t, m, _dur, v) => {
    const f = hz(m);
    const bright = perc(k, t, 0.1 * v, 0.1),
      body = perc(k, t, 0.2 * v, 0.32);
    osc(k, 'sawtooth', f, t, bright.end).connect(bright.g).connect(out.node);
    osc(k, 'triangle', f, t, body.end).connect(body.g).connect(out.node);
  },
};

/** Nylon-string guitar. */
const pluck: Instrument = {
  cutoff: 4500,
  voice: (k, out, t, m, dur, v) => {
    const f = hz(m),
      ring = Math.max(0.35, Math.min(dur * 1.6, 1.5));
    const bright = perc(k, t, 0.07 * v, 0.14),
      body = perc(k, t, 0.17 * v, ring);
    osc(k, 'sawtooth', f, t, bright.end, 4).connect(bright.g).connect(out.node);
    osc(k, 'triangle', f, t, body.end).connect(body.g).connect(out.node);
  },
};

const harp: Instrument = {
  cutoff: 5000,
  voice: (k, out, t, m, dur, v) => {
    const f = hz(m),
      ring = Math.max(0.8, Math.min(dur * 2, 2.2));
    const body = perc(k, t, 0.16 * v, ring),
      shine = perc(k, t, 0.04 * v, ring * 0.5);
    osc(k, 'triangle', f, t, body.end).connect(body.g).connect(out.node);
    osc(k, 'sine', f * 2, t, shine.end)
      .connect(shine.g)
      .connect(out.node);
  },
};

/** Oud-like bright pluck with a small pitch fall, for the desert. */
const oud: Instrument = {
  cutoff: 6000,
  insert: (k) => {
    const nasal = filter(k, 'peaking', 1800, 1.4);
    nasal.gain.value = 6;
    return { input: nasal, output: nasal };
  },
  voice: (k, out, t, m, dur, v) => {
    const f = hz(m),
      ring = Math.max(0.3, Math.min(dur * 1.4, 0.9));
    const bright = perc(k, t, 0.09 * v, 0.12),
      body = perc(k, t, 0.1 * v, ring);
    const a = osc(k, 'sawtooth', f, t, bright.end, 3),
      b = osc(k, 'sawtooth', f, t, body.end, -8),
      c = osc(k, 'triangle', f, t, body.end);
    for (const o of [a, b, c]) {
      o.frequency.setValueAtTime(f * 1.012, t);
      o.frequency.exponentialRampToValueAtTime(f, t + 0.04);
    }
    a.connect(bright.g).connect(out.node);
    const lv = gain(k, 0.4);
    b.connect(lv).connect(body.g);
    c.connect(body.g);
    body.g.connect(out.node);
  },
};

const flute: Instrument = {
  vibrato: 5,
  voice: (k, out, t, m, dur, v) => {
    const f = hz(m);
    const { g, end } = adsr(k, t, dur, 0.06, 0.25, 0.85, 0.14, 0.13 * v);
    const a = osc(k, 'sine', f, t, end),
      b = osc(k, 'triangle', f, t, end),
      bl = gain(k, 0.22);
    if (dur > 0.25) vibrato(out, [a, b], f, t, 13, 0.18);
    const breath = noise(k, t, end),
      bp = filter(k, 'bandpass', f * 2, 1.6),
      bg = gain(k, 0.16);
    a.connect(g);
    b.connect(bl).connect(g);
    breath.connect(bp).connect(bg).connect(g);
    g.connect(out.node);
  },
};

const ocarina: Instrument = {
  vibrato: 5.4,
  voice: (k, out, t, m, dur, v) => {
    const f = hz(m);
    const { g, end } = adsr(k, t, dur, 0.035, 0.2, 0.9, 0.12, 0.15 * v);
    const a = osc(k, 'sine', f, t, end),
      b = osc(k, 'sine', f * 2, t, end),
      bl = gain(k, 0.07);
    if (dur > 0.25) vibrato(out, [a, b], f, t, 10, 0.2);
    a.connect(g);
    b.connect(bl).connect(g);
    g.connect(out.node);
  },
};

/** Clarinet-ish hollow reed. */
const reed: Instrument = {
  cutoff: 2600,
  vibrato: 4.8,
  voice: (k, out, t, m, dur, v) => {
    const f = hz(m);
    const { g, end } = adsr(k, t, dur, 0.025, 0.2, 0.85, 0.09, 0.08 * v);
    const o = osc(k, 'square', f, t, end);
    if (dur > 0.3) vibrato(out, [o], f, t, 8, 0.25);
    o.connect(g).connect(out.node);
  },
};

/** Nasal double reed with a wide vibrato and a scoop into each note. */
const shawm: Instrument = {
  cutoff: 5500,
  vibrato: 6.2,
  insert: (k) => {
    const nasal = filter(k, 'peaking', 1400, 1.5);
    nasal.gain.value = 9;
    return { input: nasal, output: nasal };
  },
  voice: (k, out, t, m, dur, v) => {
    const f = hz(m);
    const { g, end } = adsr(k, t, dur, 0.02, 0.15, 0.9, 0.07, 0.06 * v);
    const o = osc(k, k.pulse12, f, t, end);
    o.frequency.setValueAtTime(f * 0.965, t);
    o.frequency.exponentialRampToValueAtTime(f, t + 0.06);
    if (dur > 0.2) vibrato(out, [o], f, t, 24, 0.15);
    o.connect(g).connect(out.node);
  },
};

/** Brass: a dark body with a brighter blare that swells in and settles back. */
const brass: Instrument = {
  cutoff: 5000,
  vibrato: 5,
  voice: (k, out, t, m, dur, v) => {
    const f = hz(m);
    const body = adsr(k, t, dur, 0.05, 0.4, 0.85, 0.18, 0.075 * v),
      blare = adsr(k, t, dur, 0.08, 0.35, 0.35, 0.12, 0.045 * v),
      dark = filter(k, 'lowpass', Math.min(f * 2.5, 2400), 0.6);
    const oscs = [-7, 0, 7].map((c) => osc(k, 'sawtooth', f, t, body.end, c));
    for (const o of oscs) {
      o.frequency.setValueAtTime(f * 0.98, t);
      o.frequency.linearRampToValueAtTime(f, t + 0.06);
      o.connect(dark);
      o.connect(blare.g);
    }
    if (dur > 0.35) vibrato(out, oscs, f, t, 8, 0.3);
    dark.connect(body.g).connect(out.node);
    blare.g.connect(out.node);
  },
};

/** Frequency-modulated bell: carrier plus a decaying modulator at `ratio`. */
function fmBell(
  k: Kit,
  out: AudioNode,
  t: number,
  f: number,
  v: number,
  ratio: number,
  index: number,
  modDecay: number,
  decay: number,
  peak: number,
) {
  const { g, end } = perc(k, t, peak * v, decay);
  const car = osc(k, 'sine', f, t, end),
    mod = osc(k, 'sine', f * ratio, t, t + modDecay * 2.5),
    mg = k.ctx.createGain();
  mg.gain.setValueAtTime(f * index, t);
  mg.gain.exponentialRampToValueAtTime(f * index * 0.01, t + modDecay * 2.5);
  mod.connect(mg).connect(car.frequency);
  car.connect(g).connect(out);
  return end;
}

const bell: Instrument = {
  voice: (k, out, t, m, _dur, v) => {
    const f = hz(m);
    fmBell(k, out.node, t, f, v, 3.5, 2.2, 0.12, 1.5, 0.11);
    const { g, end } = perc(k, t, 0.03 * v, 0.35);
    osc(k, 'sine', f * 4, t, end)
      .connect(g)
      .connect(out.node);
  },
};

const musicbox: Instrument = {
  voice: (k, out, t, m, _dur, v) => {
    const f = hz(m);
    fmBell(k, out.node, t, f, v, 5, 1.1, 0.06, 1, 0.12);
    const { g, end } = perc(k, t, 0.025 * v, 0.5);
    osc(k, 'sine', f * 2, t, end)
      .connect(g)
      .connect(out.node);
  },
};

const crystal: Instrument = {
  voice: (k, out, t, m, _dur, v) => {
    const f = hz(m);
    fmBell(k, out.left, t, f, v, 2.41, 1.6, 0.6, 2.6, 0.06);
    fmBell(k, out.right, t, f * 1.004, v, 3.01, 0.6, 0.3, 2.2, 0.05);
  },
};

const marimba: Instrument = {
  voice: (k, out, t, m, _dur, v) => {
    const f = hz(m);
    const body = perc(k, t, 0.22 * v, 0.5),
      tone = perc(k, t, 0.06 * v, 0.07);
    osc(k, 'sine', f, t, body.end).connect(body.g).connect(out.node);
    osc(k, 'sine', f * 3.93, t, tone.end)
      .connect(tone.g)
      .connect(out.node);
  },
};

/** Electric piano: FM tine with a bright attack settling to a round tone. */
const epiano: Instrument = {
  voice: (k, out, t, m, dur, v) => {
    const f = hz(m);
    const { g, end } = adsr(k, t, dur, 0.003, 1.6, 0.35, 0.3, 0.14 * v);
    const car = osc(k, 'sine', f, t, end),
      mod = osc(k, 'sine', f, t, end),
      mg = k.ctx.createGain();
    mg.gain.setValueAtTime(f * 1.3, t);
    mg.gain.exponentialRampToValueAtTime(f * 0.12, t + 0.8);
    mod.connect(mg).connect(car.frequency);
    car.connect(g).connect(out.node);
    const tine = perc(k, t, 0.025 * v, 0.08);
    osc(k, 'sine', f * 7, t, tine.end)
      .connect(tine.g)
      .connect(out.node);
  },
};

/** "Aah" choir: detuned saws through a vowel formant bank on the part. */
const choir: Instrument = {
  vibrato: 5,
  insert: (k) => {
    const input = gain(k, 1),
      output = gain(k, 1);
    for (const [freq, q, level] of [
      [730, 6, 1],
      [1090, 7, 0.55],
      [2440, 9, 0.25],
    ]) {
      const bp = filter(k, 'bandpass', freq, q);
      input.connect(bp).connect(gain(k, level)).connect(output);
    }
    return { input, output };
  },
  voice: (k, out, t, m, dur, v) => {
    const f = hz(m);
    const {
      gs: [l, r],
      end,
    } = adsrN(2, k, t, dur, 0.35, 0.8, 0.9, 0.8, 0.13 * v);
    const oscs = [-8, 0, 8].map((c) => osc(k, 'sawtooth', f, t, end, c));
    vibrato(out, oscs, f, t, 12, 0.25);
    oscs[0].connect(l);
    oscs[1].connect(l);
    oscs[1].connect(r);
    oscs[2].connect(r);
    l.connect(out.left);
    r.connect(out.right);
  },
};

/** Wolf howl: a slow glide up, a held cry, and a fall. */
const howl: Instrument = {
  vibrato: 5.5,
  insert: (k) => {
    const bp = filter(k, 'bandpass', 950, 1.2);
    return { input: bp, output: bp };
  },
  voice: (k, out, t, m, dur, v) => {
    const f = hz(m);
    const { g, end } = adsr(k, t, dur, 0.3, 0.3, 0.9, 0.5, 0.2 * v);
    const oscs = [osc(k, 'sawtooth', f, t, end), osc(k, 'triangle', f, t, end)];
    for (const o of oscs) {
      o.frequency.setValueAtTime(f * 0.72, t);
      o.frequency.exponentialRampToValueAtTime(f, t + 0.4);
      o.frequency.setValueAtTime(f, t + dur * 0.7);
      o.frequency.exponentialRampToValueAtTime(f * 0.8, t + dur + 0.3);
      o.connect(g);
    }
    vibrato(out, oscs, f, t, 18, 0.4);
    g.connect(out.node);
  },
};

/** Classic stacked orchestra hit. */
const orchhit: Instrument = {
  voice: (k, out, t, m, _dur, v) => {
    const f = hz(m);
    const { g, end } = perc(k, t, 0.14 * v, 0.5);
    const lp = filter(k, 'lowpass', 7000, 1);
    lp.frequency.setValueAtTime(7000, t);
    lp.frequency.exponentialRampToValueAtTime(800, t + 0.35);
    for (const [ratio, det] of [
      [1, -5],
      [1.5, 4],
      [2, 6],
      [3, -3],
      [0.5, 0],
    ])
      osc(k, 'sawtooth', f * ratio, t, end, det).connect(lp);
    const n = noise(k, t, t + 0.2),
      bp = filter(k, 'bandpass', 1500, 1),
      ng = perc(k, t, 0.6, 0.12);
    n.connect(bp).connect(ng.g).connect(lp);
    lp.connect(g).connect(out.node);
  },
};

/** Overdriven guitar; play power chords with `E5`-style chord symbols. Short notes palm-mute. */
const guitar: Instrument = {
  cutoff: 3400,
  insert: (k) => {
    const pre = gain(k, 3),
      ws = k.ctx.createWaveShaper(),
      mid = filter(k, 'peaking', 700, 1),
      post = gain(k, 0.35);
    ws.curve = k.fuzz;
    mid.gain.value = -5;
    return insertChain(pre, ws, mid, post);
  },
  voice: (k, out, t, m, dur, v) => {
    const f = hz(m),
      muted = dur < 0.16;
    const { g, end } = adsr(k, t, dur, 0.003, 0.3, muted ? 0.25 : 0.85, 0.06, 0.3 * v);
    const a = osc(k, 'sawtooth', f, t, end, -9),
      b = osc(k, muted ? ('triangle' as const) : ('sawtooth' as const), f, t, end, 9);
    a.connect(g);
    b.connect(g);
    g.connect(out.node);
  },
};

// ── Bass ───────────────────────────────────────────────────────────────────────────────────

const bass: Instrument = {
  cutoff: 1400,
  voice: (k, out, t, m, dur, v) => {
    const f = hz(m);
    const body = adsr(k, t, dur, 0.004, 0.35, 0.65, 0.07, 0.24 * v),
      pick = perc(k, t, 0.1 * v, 0.14);
    osc(k, 'triangle', f, t, body.end).connect(body.g).connect(out.node);
    osc(k, 'sawtooth', f, t, pick.end).connect(pick.g).connect(out.node);
  },
};

const synthbass: Instrument = {
  cutoff: 2600,
  insert: (k) => {
    const ws = k.ctx.createWaveShaper();
    ws.curve = k.drive;
    return insertChain(ws, gain(k, 0.32));
  },
  voice: (k, out, t, m, dur, v) => {
    const f = hz(m);
    const body = adsr(k, t, dur, 0.003, 0.22, 0.8, 0.05, 0.2 * v),
      growl = adsr(k, t, dur, 0.003, 0.12, 0.3, 0.05, 0.12 * v);
    osc(k, 'sine', f, t, body.end).connect(body.g).connect(out.node);
    osc(k, 'sawtooth', f, t, growl.end, -5).connect(growl.g);
    osc(k, k.pulse25, f, t, growl.end, 5).connect(growl.g);
    growl.g.connect(out.node);
  },
};

const sub: Instrument = {
  voice: (k, out, t, m, dur, v) => {
    const f = hz(m);
    const { g, end } = adsr(k, t, dur, 0.01, 0.2, 1, 0.1, 0.12 * v);
    osc(k, 'sine', f, t, end).connect(g);
    const h = gain(k, 0.15);
    osc(k, 'triangle', f * 2, t, end)
      .connect(h)
      .connect(g);
    g.connect(out.node);
  },
};

// ── Drums and effects ──────────────────────────────────────────────────────────────────────

function click(
  k: Kit,
  out: AudioNode,
  t: number,
  freq: number,
  peak: number,
  decay: number,
  q = 1,
) {
  const n = noise(k, t, t + decay * 2 + 0.03),
    f = filter(k, 'bandpass', freq, q),
    e = perc(k, t, peak, decay);
  n.connect(f).connect(e.g).connect(out);
}

function thump(
  k: Kit,
  out: AudioNode,
  t: number,
  from: number,
  to: number,
  sweep: number,
  peak: number,
  decay: number,
) {
  const e = perc(k, t, peak, decay),
    o = osc(k, 'sine', from, t, e.end);
  o.frequency.setValueAtTime(from, t);
  o.frequency.exponentialRampToValueAtTime(to, t + sweep);
  o.connect(e.g).connect(out);
}

const drum = (voice: Voice, extra: Partial<Instrument> = {}): Instrument => ({ voice, ...extra });

const kick = drum((k, out, t, _m, _d, v) => {
  thump(k, out.node, t, 140, 48, 0.09, 0.45 * v, 0.35);
  click(k, out.node, t, 3000, 0.1 * v, 0.008);
});

const bigkick = drum(
  (k, out, t, _m, _d, v) => {
    thump(k, out.node, t, 190, 44, 0.11, 0.95 * v, 0.5);
    click(k, out.node, t, 4000, 0.3 * v, 0.01, 0.7);
  },
  {
    insert: (k) => {
      const ws = k.ctx.createWaveShaper();
      ws.curve = k.drive;
      return insertChain(ws, gain(k, 0.3));
    },
  },
);

const snare = drum((k, out, t, _m, _d, v) => {
  click(k, out.node, t, 3500, 0.75 * v, 0.2, 0.4);
  thump(k, out.node, t, 210, 170, 0.05, 0.6 * v, 0.09);
});

const clap = drum((k, out, t, _m, _d, v) => {
  const n = noise(k, t, t + 0.5),
    bp = filter(k, 'bandpass', 1300, 1.1),
    g = k.ctx.createGain(),
    p = g.gain,
    peak = 2.4 * v;
  p.setValueAtTime(0, t);
  for (const off of [0, 0.011, 0.022]) {
    p.setValueAtTime(peak, t + off);
    p.setTargetAtTime(peak * 0.15, t + off + 0.001, 0.003);
  }
  p.setValueAtTime(peak, t + 0.033);
  p.setTargetAtTime(0, t + 0.034, 0.055);
  n.connect(bp).connect(g).connect(out.node);
});

const hat = drum((k, out, t, _m, _d, v) => click(k, out.node, t, 10000, 0.35 * v, 0.05, 0.5));

const ohat = drum((k, out, t, _m, _d, v) => click(k, out.node, t, 9000, 0.25 * v, 0.3, 0.5));

const crash = drum((k, out, t, _m, _d, v) => {
  click(k, out.left, t, 7000, 0.32 * v, 1.7, 0.4);
  click(k, out.right, t, 8200, 0.28 * v, 1.5, 0.4);
});

const ride = drum((k, out, t, _m, _d, v) => {
  const e = perc(k, t, 0.05 * v, 0.55),
    bp = filter(k, 'bandpass', 8500, 0.8);
  for (const r of [2, 3, 4.16, 5.43, 6.79, 8.21]) osc(k, 'square', 310 * r, t, e.end).connect(bp);
  bp.connect(e.g).connect(out.node);
  click(k, out.node, t, 9000, 0.05 * v, 0.1, 0.8);
});

const tom = drum((k, out, t, m, _d, v) => {
  const f = hz(m);
  thump(k, out.node, t, f, f * 0.62, 0.22, 0.6 * v, 0.32);
  click(k, out.node, t, 1200, 0.1 * v, 0.03, 0.8);
});

const taiko = drum((k, out, t, _m, _d, v) => {
  thump(k, out.node, t, 98, 52, 0.2, 0.45 * v, 0.55);
  click(k, out.node, t, 400, 0.2 * v, 0.14, 0.5);
});

const timpani = drum((k, out, t, m, _d, v) => {
  const f = hz(m);
  const e = perc(k, t, 0.2 * v, 1.2);
  for (const [r, level] of [
    [1, 1],
    [1.5, 0.3],
    [2, 0.18],
  ]) {
    const o = osc(k, 'sine', f * r, t, e.end),
      lv = gain(k, level);
    o.frequency.setValueAtTime(f * r * 1.03, t);
    o.frequency.exponentialRampToValueAtTime(f * r, t + 0.12);
    o.connect(lv).connect(e.g);
  }
  e.g.connect(out.node);
  click(k, out.node, t, 300, 0.12 * v, 0.08, 0.5);
});

const shaker = drum((k, out, t, _m, _d, v) => {
  const n = noise(k, t, t + 0.15),
    bp = filter(k, 'bandpass', 6500, 1.2),
    e = perc(k, t, 0.16 * v, 0.06, 0.012);
  n.connect(bp).connect(e.g).connect(out.node);
});

const tamb = drum((k, out, t, _m, _d, v) => {
  click(k, out.node, t, 9500, 0.2 * v, 0.14, 2.5);
  click(k, out.node, t, 6800, 0.1 * v, 0.1, 3);
});

const doum = drum((k, out, t, _m, _d, v) => thump(k, out.node, t, 115, 80, 0.15, 0.7 * v, 0.3));

const tek = drum((k, out, t, _m, _d, v) => {
  click(k, out.node, t, 3800, 0.4 * v, 0.035, 2);
  thump(k, out.node, t, 900, 700, 0.02, 0.12 * v, 0.03);
});

const rim = drum((k, out, t, _m, _d, v) => {
  click(k, out.node, t, 2200, 0.35 * v, 0.03, 4);
  thump(k, out.node, t, 520, 480, 0.02, 0.18 * v, 0.03);
});

/** Finger cymbals. */
const zill = drum((k, out, t, _m, _d, v) => {
  for (const [f, level] of [
    [2800, 1],
    [4130, 0.6],
    [5870, 0.3],
  ]) {
    const e = perc(k, t, 0.035 * v * level, 1.1);
    osc(k, 'sine', f, t, e.end).connect(e.g).connect(out.node);
  }
});

const chirp = drum((k, out, t, m, _d, v) => {
  const f = hz(m),
    g = k.ctx.createGain(),
    p = g.gain;
  p.setValueAtTime(0, t);
  for (let i = 0; i < 3; i++) {
    const s = t + i * 0.034;
    p.setValueAtTime(0, s);
    p.linearRampToValueAtTime(0.035 * v, s + 0.004);
    p.linearRampToValueAtTime(0, s + 0.02);
  }
  osc(k, 'sine', f, t, t + 0.12)
    .connect(g)
    .connect(out.node);
});

const drip = drum((k, out, t, m, _d, v) => {
  const f = hz(m),
    e = perc(k, t, 0.14 * v, 0.14),
    o = osc(k, 'sine', f, t, e.end);
  o.frequency.setValueAtTime(f, t);
  o.frequency.exponentialRampToValueAtTime(f * 1.9, t + 0.06);
  o.connect(e.g).connect(out.node);
});

/** Filtered noise sweeping upward for the length of the note. */
const riser = drum((k, out, t, _m, dur, v) => {
  const end = t + dur + 0.05,
    n = noise(k, t, end),
    bp = filter(k, 'bandpass', 250, 2.5),
    g = k.ctx.createGain();
  bp.frequency.setValueAtTime(250, t);
  bp.frequency.exponentialRampToValueAtTime(7500, t + dur);
  g.gain.setValueAtTime(0.001, t);
  g.gain.exponentialRampToValueAtTime(0.35 * v, t + dur);
  g.gain.linearRampToValueAtTime(0, end);
  n.connect(bp).connect(g).connect(out.node);
});

/** Reverse cymbal swell that lands on the end of the note. */
const swell = drum((k, out, t, _m, dur, v) => {
  const end = t + dur + 0.04,
    n = noise(k, t, end),
    hp = filter(k, 'highpass', 3500),
    g = k.ctx.createGain();
  g.gain.setValueAtTime(0.001, t);
  g.gain.exponentialRampToValueAtTime(0.28 * v, t + dur);
  g.gain.linearRampToValueAtTime(0, end);
  n.connect(hp).connect(g).connect(out.node);
});

const impact = drum((k, out, t, _m, _d, v) => {
  thump(k, out.node, t, 85, 30, 1.2, 0.9 * v, 1.6);
  click(k, out.node, t, 250, 0.9 * v, 0.9, 0.4);
});

const thunder = drum((k, out, t, _m, _d, v) => {
  click(k, out.node, t, 1800, 0.3 * v, 0.2, 0.5);
  const n = noise(k, t, t + 5),
    lp = filter(k, 'lowpass', 320, 0.6),
    g = k.ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.9 * v, t + 0.12);
  g.gain.setTargetAtTime(0.35 * v, t + 0.12, 0.4);
  g.gain.setTargetAtTime(0, t + 1.4, 0.9);
  n.connect(lp).connect(g).connect(out.node);
});

/** Gusting wind for the length of the note, centred on the note's pitch. */
const wind = drum((k, out, t, m, dur, v) => {
  const end = t + dur + 1.2,
    n = noise(k, t, end),
    bp = filter(k, 'bandpass', hz(m), 1.8),
    g = k.ctx.createGain();
  bp.frequency.setValueAtTime(hz(m) * 0.6, t);
  bp.frequency.linearRampToValueAtTime(hz(m) * 1.4, t + dur * 0.55);
  bp.frequency.linearRampToValueAtTime(hz(m) * 0.7, t + dur + 1);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.3 * v, t + dur * 0.5);
  g.gain.linearRampToValueAtTime(0, end);
  n.connect(bp).connect(g).connect(out.node);
});

export const INSTRUMENTS = {
  pulse,
  square,
  supersaw,
  pad,
  strings,
  tremolo,
  pizz,
  pluck,
  harp,
  oud,
  flute,
  ocarina,
  reed,
  shawm,
  brass,
  bell,
  musicbox,
  crystal,
  marimba,
  epiano,
  choir,
  howl,
  orchhit,
  guitar,
  bass,
  synthbass,
  sub,
  kick,
  bigkick,
  snare,
  clap,
  hat,
  ohat,
  crash,
  ride,
  tom,
  taiko,
  timpani,
  shaker,
  tamb,
  doum,
  tek,
  rim,
  zill,
  chirp,
  drip,
  riser,
  swell,
  impact,
  thunder,
  wind,
} satisfies Record<string, Instrument>;

export type InstrumentId = keyof typeof INSTRUMENTS;
