const saved: Partial<{ music: number; sfx: number }> = (() => {
  try {
    return JSON.parse(localStorage.getItem('wildlands-audio') || '{}') as Partial<{
      music: number;
      sfx: number;
    }>;
  } catch {
    return {};
  }
})();
const settings = { music: saved.music ?? 0.44, sfx: saved.sfx ?? 0.6 };
let ac: AudioContext | undefined;
let master: GainNode | undefined;
let musicBus: GainNode | undefined;
let sfxBus: GainNode | undefined;
let nextBar = 0,
  bar = 0,
  scene = 'menu';
const chords: Record<string, number[][]> = {
  menu: [
    [196, 246.94, 293.66],
    [174.61, 220, 261.63],
    [164.81, 196, 246.94],
    [174.61, 220, 293.66],
  ],
  meadow: [
    [196, 246.94, 293.66],
    [220, 261.63, 329.63],
    [174.61, 220, 261.63],
    [196, 246.94, 293.66],
  ],
  forest: [
    [174.61, 220, 261.63],
    [164.81, 196, 246.94],
    [146.83, 185, 220],
    [164.81, 220, 261.63],
  ],
  cold: [
    [146.83, 185, 220],
    [130.81, 164.81, 196],
    [123.47, 155.56, 185],
    [130.81, 164.81, 220],
  ],
  desert: [
    [196, 233.08, 293.66],
    [174.61, 220, 261.63],
    [155.56, 196, 233.08],
    [174.61, 220, 293.66],
  ],
  cave: [
    [130.81, 155.56, 196],
    [116.54, 146.83, 174.61],
    [110, 130.81, 164.81],
    [123.47, 155.56, 185],
  ],
  boss: [
    [110, 130.81, 164.81],
    [98, 123.47, 146.83],
    [92.5, 116.54, 138.59],
    [103.83, 130.81, 155.56],
  ],
};
function init() {
  if (ac) return;
  const C = window.AudioContext;
  if (!C) return;
  ac = new C();
  master = ac.createGain();
  master.gain.value = 0.8;
  master.connect(ac.destination);
  musicBus = ac.createGain();
  musicBus.gain.value = settings.music * 0.28;
  musicBus.connect(master);
  sfxBus = ac.createGain();
  sfxBus.gain.value = settings.sfx * 0.42;
  sfxBus.connect(master);
  nextBar = ac.currentTime + 0.1;
  setInterval(schedule, 180);
}
function start() {
  init();
  ac?.resume();
}
function tone(
  freq: number,
  when: number,
  duration: number,
  type: OscillatorType = 'sine',
  vol = 0.1,
  bus = musicBus,
) {
  if (!ac || !bus) return;
  const osc = ac.createOscillator(),
    gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(Math.max(30, freq), when);
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), when + 0.035);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
  osc.connect(gain).connect(bus);
  osc.start(when);
  osc.stop(when + duration + 0.02);
}
function schedule() {
  if (!ac || ac.state !== 'running') return;
  const now = ac.currentTime;
  while (nextBar < now + 1.4) {
    const tempo = scene === 'boss' ? 1.42 : scene === 'cave' ? 2.45 : 2.75,
      notes = chords[scene] || chords.meadow,
      chord = notes[bar % notes.length],
      s = nextBar;
    tone(chord[0] / 2, s, tempo * 1.7, 'triangle', 0.14);
    tone(chord[0], s, tempo * 1.3, 'sine', 0.08);
    tone(chord[1], s, tempo * 1.25, 'sine', 0.065);
    tone(chord[2], s, tempo * 1.25, 'sine', 0.06);
    const motif = [0, 2, 1, 2, 0, 1, 2, 1];
    for (let i = 0; i < 4; i++) {
      const idx = motif[(bar * 4 + i) % motif.length],
        pitch = chord[idx] * (i === 3 && bar % 3 === 0 ? 2 : 1);
      tone(
        pitch,
        s + (i * tempo) / 4,
        tempo * 0.46,
        scene === 'boss' ? 'sawtooth' : 'triangle',
        scene === 'cave' ? 0.042 : 0.065,
      );
    }
    if (scene === 'boss') {
      for (let i = 0; i < 4; i++) tone(55, s + (i * tempo) / 4, 0.16, 'triangle', 0.08);
    }
    bar++;
    nextBar += tempo;
  }
}
function setScene(v: string) {
  scene = v;
}
function effect(kind: string) {
  start();
  const audio = ac;
  if (!audio) return;
  const pitches: Record<string, number[]> = {
    gather: [280, 420],
    craft: [330, 495, 660],
    hit: [155, 105],
    hurt: [105, 72],
    page: [380, 290],
    boss: [110, 82, 61],
    victory: [330, 440, 550, 770],
    mine: [170, 120],
    jump: [260, 370],
    fish: [315, 420],
  };
  const seq = pitches[kind] || pitches.page;
  seq.forEach((f, i) =>
    tone(
      f,
      audio.currentTime + i * 0.075,
      0.16,
      kind === 'hurt' || kind === 'boss' ? 'sawtooth' : 'triangle',
      0.17,
      sfxBus,
    ),
  );
}
function setVolumes(m: number, s: number) {
  settings.music = Math.max(0, Math.min(1, m));
  settings.sfx = Math.max(0, Math.min(1, s));
  if (musicBus) musicBus.gain.value = settings.music * 0.28;
  if (sfxBus) sfxBus.gain.value = settings.sfx * 0.42;
  localStorage.setItem('wildlands-audio', JSON.stringify(settings));
}
export const Audio = { start, effect, setScene, setVolumes, settings };
