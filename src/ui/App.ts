import * as D from '../data/index.ts';
import { Game } from '../game/Game.ts';
import { draw, pixelView, spawnEffects, type PixelView } from '../renderer/Renderer.ts';
import { iconURL } from '../renderer/icons.ts';
import { mobPortrait } from '../renderer/actors.ts';
import { BOSS_STYLES, DEFAULT_BOSS_STYLE, WARDEN_FACES } from './bossStyles.ts';
import { ART, GROUND } from '../renderer/art.ts';
import { Audio } from '../audio/Audio.ts';
import { musicScene } from '../audio/scenes.ts';
import { SILENCE, type AmbienceLevels } from '../audio/sfx.ts';
import { DevConsole } from './Console.ts';
import type { GameMessage, Structure, Vitals } from '../core/types.ts';

declare global {
  interface Window {
    Wildlands: {
      game: Game;
      enterGame: () => void;
      renderJournal: () => void;
      state: typeof state;
    };
  }
}

const game = new Game();
const $ = <T extends HTMLElement = HTMLElement>(id: string): T => {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing game element: ${id}`);
  return element as T;
};
const canvas = $<HTMLCanvasElement>('world'),
  ctx = canvas.getContext('2d')!;
const keys = new Set<string>();
const state = {
  playing: false,
  intro: 0,
  journal: false,
  tab: 'pack',
  selectedRecipe: 'stone_axe',
  farm: null as Structure | null,
  chest: null as Structure | null,
  /** The cold storage open on the Pack page. */
  larder: null as Structure | null,
  /** The settler whose wares the Town page shows. */
  shop: null as string | null,
  /** The Atlas page: generated realms (by the selected one), or the Rift Gate. */
  atlasView: 'realms' as 'realms' | 'rift',
  atlasRealm: 'orchard',
  atlasTier: 1,
  /** The Gear page: what you wear, or the Armoury's weapon hierarchy (and which weapon). */
  gearView: 'gear' as 'gear' | 'armoury' | 'skills',
  armouryMode: 'weapons' as 'weapons' | 'armour',
  armourSel: '',
  skillTree: 'warfare',
  /** The Beasts page: the Effergy and bestiary, or the Codex (and which page). */
  beastsView: 'beasts' as 'beasts' | 'codex' | 'feats',
  codexPage: 'wilds',
  /** The relic shelf open on the Pack page. */
  shelf: null as Structure | null,
  /** The research desk open on the Pack page. */
  research: null as Structure | null,
  armourySel: 'iron_sword',
  camera: { x: 0, y: 0 },
  lastFrame: performance.now(),
  lastUI: 0,
  lastAuto: 0,
  seenMessage: null as GameMessage | null,
  lastAmbience: 0,
  nextThunder: 0,
  /** The pointer on the canvas (CSS pixels) and whether the use button is held. */
  pointer: { x: 0, y: 0, inside: false },
  using: false,
  hotbarSig: '',
};
const UI_RULES = {
  seedRange: 1_000_000,
  hudRefreshMs: 170,
  autoSaveSeconds: 40,
  maxFrameSeconds: 0.1,
  menuFocalX: D.BIOME_CENTERS.meadow[0],
};
const pretty = (id: string) => D.ITEMS[id]?.[0] || id;
/** Journal sketches are drawn in vector; rasterise each at low resolution and show it pixelated. */
const pixelArt = new Map<string, string>();
function pixelate(root: HTMLElement) {
  for (const svg of root.querySelectorAll('svg')) {
    const source = svg.outerHTML,
      done = pixelArt.get(source),
      img = document.createElement('img');
    img.className = (svg.getAttribute('class') ?? '') + ' pixelated';
    img.alt = '';
    svg.replaceWith(img);
    if (done) {
      img.src = done;
      continue;
    }
    const vb = (svg.getAttribute('viewBox') ?? '0 0 600 310').split(' ').map(Number),
      w = Math.round(vb[2] / 2),
      h = Math.round(vb[3] / 2),
      raw = new Image();
    raw.onload = () => {
      const cv = document.createElement('canvas');
      cv.width = w;
      cv.height = h;
      const k = cv.getContext('2d')!;
      k.drawImage(raw, 0, 0, w, h);
      // Posterise and harden edges so the sketch reads as drawn pixel by pixel.
      const data = k.getImageData(0, 0, w, h),
        d = data.data;
      for (let i = 0; i < d.length; i += 4) {
        for (let c = 0; c < 3; c++) d[i + c] = Math.round(d[i + c] / 24) * 24;
        d[i + 3] = d[i + 3] > 60 ? 255 : 0;
      }
      k.putImageData(data, 0, 0);
      const url = cv.toDataURL();
      pixelArt.set(source, url);
      img.src = url;
    };
    raw.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);
  }
}
/** A pixel icon for an item, framed like an inventory slot. */
const icon = (id: string) => `<span class="icon-slot"><img src="${iconURL(id)}" alt=""></span>`;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const fmt = (n: number) => String(Math.floor(n)).padStart(2, '0');
const timeText = () => {
  const t = game.timeOfDay();
  return `DAY ${game.s.day} · ${fmt(t / 60)}:${fmt(t % 60)} · ${game.s.weather.toUpperCase()}`;
};
const worn = (id: string) =>
  Object.values(game.s.player.armor ?? {}).includes(id) ||
  Object.values(game.s.player.clothing ?? {}).includes(id) ||
  game.s.accessories.includes(id);
/** A small wear bar and label for gear that wears out. */
const wearText = (id: string) => {
  if (!game.durability.wears(id)) return '';
  const w = game.durability.wear(id);
  return w >= 100
    ? ' · <b class="worn">WORN OUT</b>'
    : w >= 1
      ? ` · ${Math.round(100 - w)}% sound`
      : '';
};
const itemUseLabel = (id: string) => {
  const cat = D.ITEMS[id]?.[1];
  if (cat === 'armor' || cat === 'accessory' || D.CLOTHING[id]) return worn(id) ? 'REMOVE' : 'WEAR';
  if (cat === 'structure') return 'PLACE';
  if (cat === 'block') return 'HOLD';
  if (cat === 'potion') return 'DRINK';
  if (D.WEAPONS[id]) return 'EQUIP';
  if (['direwolf_cloak', 'hide_coat', 'explorer_boots', 'cinder_ward'].includes(id)) return 'WEAR';
  if (id === 'fishing_rod') return 'FISH';
  if (cat && ['food', 'water', 'medicine'].includes(cat)) return 'USE';
  return '';
};
const sound = (kind: string) => Audio.effect(kind);
let view: PixelView = pixelView(innerWidth, innerHeight, 1);
function resize() {
  // The world is pixel art at a whole-number scale; the canvas matches the device pixels exactly.
  const ratio = devicePixelRatio || 1;
  view = pixelView(innerWidth, innerHeight, ratio);
  canvas.width = view.artW * view.scale;
  canvas.height = view.artH * view.scale;
  canvas.style.width = canvas.width / ratio + 'px';
  canvas.style.height = canvas.height / ratio + 'px';
  ctx.imageSmoothingEnabled = false;
}
/** A pointer position on the canvas in world coordinates. */
function worldAt(e: { clientX: number; clientY: number }) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: state.camera.x + (e.clientX - rect.left) / view.cssPerWorld,
    y: state.camera.y + (e.clientY - rect.top) / view.cssPerWorld,
  };
}
/** Where the cursor points in the world right now (the camera moves under a still mouse). */
const cursorWorld = () => worldAt({ clientX: state.pointer.x, clientY: state.pointer.y });
addEventListener('resize', resize);
resize();
const introPages = [
  {
    eyebrow: 'THE LANDING',
    title: 'Everything was lost.',
    copy: 'The last pack went into the surf. You have your hands, a blank record, and the scraps the meadow gives back.',
    art: `<svg viewBox="0 0 600 310" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="310" fill="#d8d2b7"/><path d="M0 195 Q80 130 160 177 T315 154 T600 177 V310 H0" fill="#8a977c"/><path d="M0 223 Q105 205 230 234 T600 212 V310 H0" fill="#a4a684"/><path d="M0 255 Q150 238 300 269 T600 249 V310 H0" fill="#c1ad82"/><g stroke="#3e5249" fill="none" stroke-width="5"><path d="M80 185V73m0 50-38-37m38 20 40-47M445 169V47m0 74-48-51m48 27 51-48"/><path d="M260 205l20-75 43-11 22 71-85 15z" fill="#766b51"/><path d="M278 137q29 14 46-9"/></g><g fill="#516a55"><ellipse cx="80" cy="68" rx="53" ry="28"/><ellipse cx="445" cy="44" rx="63" ry="27"/></g><path d="M219 246q44-40 89 0" stroke="#5c564a" stroke-width="3" fill="none"/><circle cx="510" cy="70" r="21" fill="#d1bd8f"/></svg>`,
  },
  {
    eyebrow: 'WATER / CAUTION',
    title: 'The stream is no refuge.',
    copy: 'Wild water carries illness. A small fire and a little patience can make it safe enough to drink.',
    art: `<svg viewBox="0 0 600 310" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="310" fill="#cfceae"/><path d="M0 115Q100 79 200 114T400 105T600 129v181H0" fill="#7d997d"/><path d="M0 205Q140 144 280 191T600 176v134H0" fill="#b9b38c"/><path d="M0 270Q140 183 296 241T600 218v92H0" fill="#87a9a3"/><path d="M0 287Q165 220 304 265T600 236" fill="none" stroke="#d1d8c6" stroke-width="5"/><g fill="none" stroke="#37524c" stroke-width="3"><path d="M83 119v76m0-53-29-24m29 48 27-36M500 120v105m0-68-33-22m33 52 40-35"/><path d="M274 152c-12-47 45-46 32 0m-44 0h56l-8 38h-40z"/></g><path d="M261 190h59" stroke="#9d624b" stroke-width="5"/><g fill="#526a58"><circle cx="83" cy="105" r="33"/><circle cx="500" cy="105" r="41"/></g><circle cx="438" cy="59" r="28" fill="#d6c494"/></svg>`,
  },
  {
    eyebrow: 'NIGHT / PROVISIONS',
    title: 'Everything changes by morning.',
    copy: 'Nights bite. Rain steals warmth. Food decays even in a closed pack. Build shelter, cook what you find, and keep moving.',
    art: `<svg viewBox="0 0 600 310" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="310" fill="#53685f"/><circle cx="450" cy="75" r="37" fill="#e5d9b0"/><path d="M0 201L105 112l79 77 105-115 143 120 78-63 90 80v99H0" fill="#66746b"/><path d="M0 236L101 183l101 55 104-74 117 78 177-44v112H0" fill="#344f46"/><path d="M0 257q150-22 300 0t300-9v62H0" fill="#738569"/><path d="M187 255l91-61 88 61z" fill="#a18b67" stroke="#dac69a" stroke-width="3"/><path d="M277 195v59" stroke="#473c30" stroke-width="3"/><path d="M476 250q-13-22 4-44 2 15 18 22 12-22 2-39 39 42 11 65z" fill="#d89961"/><path d="M481 253q6-26 21-36 13 19 8 36z" fill="#f0c779"/><g fill="#e0d8be"><circle cx="80" cy="58" r="2"/><circle cx="157" cy="80" r="2"/><circle cx="254" cy="47" r="2"/><circle cx="350" cy="91" r="2"/><circle cx="540" cy="34" r="2"/></g></svg>`,
  },
];
function showIntro() {
  state.intro = 0;
  $('menu').classList.add('hidden');
  $('intro').classList.remove('hidden');
  renderIntro();
}
function renderIntro() {
  const p = introPages[state.intro];
  $('intro-count').textContent = `${fmt(state.intro + 1)} / 03`;
  $('intro-art').innerHTML = p.art;
  pixelate($('intro-art'));
  $('intro-eyebrow').textContent = p.eyebrow;
  $('intro-title').textContent = p.title;
  $('intro-copy').textContent = p.copy;
  $('intro-next').innerHTML =
    state.intro === 2 ? 'Enter the meadow <span>→</span>' : 'Turn the page <span>→</span>';
}
function enterGame() {
  $('intro').classList.add('hidden');
  $('menu').classList.add('hidden');
  $('hud').classList.remove('hidden');
  state.playing = true;
  state.journal = false;
  $('journal').classList.add('hidden');
  $('death').classList.add('hidden');
  Audio.start();
  updateUI(true);
}
$('new-game').onclick = () => {
  sound('page');
  game.newGame(Date.now() % UI_RULES.seedRange);
  game.save(localStorage, true);
  showIntro();
};
$('continue-game').onclick = () => {
  sound('page');
  if (game.load()) enterGame();
};
$<HTMLButtonElement>('continue-game').disabled = !localStorage.getItem('wildlands-save-v1');
$('guide-button').onclick = () => {
  sound('page');
  $('menu-panel').classList.remove('hidden');
  $('menu-panel').innerHTML =
    '<h2>The first pages</h2><p>Cross nine regions from the coast to the badlands. Gather, mine, craft, cook, build shelter, and descend through three cave layers. The Effergy of Beasts calls the final hunts.</p><p><strong>A / D</strong> move · <strong>W / Space</strong> jump or climb a shaft · <strong>S</strong> descend · <strong>E</strong> gather or use · <strong>F</strong> strike · <strong>R / click</strong> mine · <strong>G</strong> fish · <strong>J</strong> journal · <strong>M</strong> map.</p><button id="panel-close" class="ink-button">Close this page</button>';
  $('panel-close').onclick = () => {
    $('menu-panel').classList.add('hidden');
    sound('page');
  };
};
$('settings-button').onclick = () => {
  sound('page');
  const a = Audio.settings;
  $('menu-panel').classList.remove('hidden');
  $('menu-panel').innerHTML =
    `<h2>Sound & settings</h2><label>Music <input id="music-volume" type="range" min="0" max="100" value="${Math.round(a.music * 100)}"></label><label>Effects <input id="sfx-volume" type="range" min="0" max="100" value="${Math.round(a.sfx * 100)}"></label><p>The score and effects are made live by your browser. Your volume choices are saved here.</p>${Audio.nowPlaying() ? `<p class="muted">Now playing: <em>${Audio.nowPlaying()}</em></p>` : ''}<button id="panel-close" class="ink-button">Close this page</button>`;
  const change = () =>
    Audio.setVolumes(
      +$<HTMLInputElement>('music-volume').value / 100,
      +$<HTMLInputElement>('sfx-volume').value / 100,
    );
  $('music-volume').oninput = change;
  $('sfx-volume').oninput = change;
  $('panel-close').onclick = () => {
    $('menu-panel').classList.add('hidden');
    sound('page');
  };
};
$('intro-next').onclick = () => {
  sound('page');
  if (state.intro < 2) {
    state.intro++;
    renderIntro();
  } else enterGame();
};
$('journal-button').onclick = () => toggleJournal();
$('book-close').onclick = () => toggleJournal(false);
$('recover').onclick = () => {
  game.recover();
  $('death').classList.add('hidden');
  updateUI(true);
};
$('reload-save').onclick = () => {
  if (game.load()) {
    $('death').classList.add('hidden');
    updateUI(true);
  } else {
    game.recover();
    $('death').classList.add('hidden');
  }
};
document.querySelectorAll<HTMLButtonElement>('.book-tabs button').forEach(
  (b) =>
    (b.onclick = () => {
      const tab = b.dataset.tab;
      if (tab && TABS.includes(tab)) state.tab = tab;
      sound('page');
      renderJournal();
    }),
);
const TABS = ['pack', 'gear', 'recipes', 'vitals', 'notes', 'beasts', 'atlas', 'town'];
function toggleJournal(force?: boolean) {
  if (!state.playing || game.s.dead) return;
  state.journal = force === undefined ? !state.journal : force;
  $('journal').classList.toggle('hidden', !state.journal);
  if (state.journal) {
    sound('page');
    renderJournal();
  }
}
function message(reason?: string) {
  if (reason) {
    game.say(reason, 'danger');
    updateUI(true);
  }
}
function doInteract() {
  const result = game.interact();
  if (!result.ok) message(result.reason);
  else {
    if (result.action === 'beasts' || result.action === 'recipes') sound('page');
    if (result.action === 'beasts') {
      state.tab = 'beasts';
      toggleJournal(true);
    }
    if (result.action === 'recipes') {
      state.tab = 'recipes';
      toggleJournal(true);
    }
    if (result.action === 'farm') {
      state.farm = result.structure ?? null;
      state.tab = 'pack';
      toggleJournal(true);
    }
    if (result.action === 'chest') {
      state.chest = result.structure ?? null;
      state.larder = null;
      state.tab = 'pack';
      toggleJournal(true);
    }
    if (result.action === 'rift') {
      state.tab = 'atlas';
      state.atlasView = 'rift';
      toggleJournal(true);
    }
    if (result.action === 'research') {
      state.research = result.structure ?? null;
      state.shelf = null;
      state.larder = null;
      state.tab = 'pack';
      sound('open');
      toggleJournal(true);
    }
    if (result.action === 'shelf') {
      state.shelf = result.structure ?? null;
      state.larder = null;
      state.tab = 'pack';
      sound('open');
      toggleJournal(true);
    }
    if (result.action === 'larder') {
      state.larder = result.structure ?? null;
      state.chest = null;
      state.tab = 'pack';
      sound('open');
      toggleJournal(true);
    }
    if (result.action === 'atlas') {
      state.tab = 'atlas';
      state.atlasView = 'realms';
      sound('page');
      toggleJournal(true);
    }
    if (result.action === 'shop') {
      state.shop = result.settler ?? null;
      state.tab = 'town';
      sound('page');
      toggleJournal(true);
    }
  }
  updateUI(true);
}
function doAttack() {
  const r = game.attack();
  if (!r.ok && r.reason && r.reason !== 'Recovering from the last strike.') message(r.reason);
  updateUI(true);
}
function doMine(x: number, y: number) {
  const r = game.mineTileAt(x, y);
  if (!r.ok) message(r.reason);
  updateUI(true);
}
const devConsole = new DevConsole(game, () => {
  if (state.journal) renderJournal();
  updateUI(true);
});
addEventListener('keydown', (e) => {
  if (e.code === 'Backquote' && state.playing) {
    e.preventDefault();
    keys.clear();
    devConsole.toggle();
    return;
  }
  if (devConsole.open) return;
  const key = e.key.toLowerCase();
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'tab'].includes(key))
    e.preventDefault();
  keys.add(key);
  if (e.repeat) return;
  if (key === 'escape') {
    if (state.journal) toggleJournal(false);
    else if (game.s.placing) {
      game.s.placing = null;
      game.say('Placement cancelled.');
    } else if (state.playing) {
      state.tab = 'notes';
      toggleJournal(true);
    }
    return;
  }
  if (!state.playing || game.s.dead) return;
  if (key === 'j' || key === 'i' || key === 'tab') {
    toggleJournal();
    return;
  }
  if (key === 'm') {
    state.tab = 'notes';
    toggleJournal(true);
    return;
  }
  if (state.journal) {
    if (/^[1-8]$/.test(key)) {
      state.tab = TABS[Number(key) - 1];
      renderJournal();
    }
    return;
  }
  // Number keys pick a quick slot (0 is the tenth).
  if (/^[0-9]$/.test(key)) {
    game.equipment.select(key === '0' ? 9 : Number(key) - 1);
    sound('equip');
    updateUI(true);
    return;
  }
  if (key === 'e') doInteract();
  if (key === 'f') doAttack();
  if (key === 'r')
    doMine(game.s.player.x + Math.cos(game.s.player.face) * 54, game.s.player.y - 12);
  if (key === 'g') {
    const r = game.fish();
    if (!r.ok) message(r.reason);
    updateUI(true);
  }
  if (key === ' ' || key === 'w' || key === 'arrowup') {
    game.jump();
  }
});
addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));
addEventListener('blur', () => keys.clear());
canvas.addEventListener('pointermove', (e) => {
  state.pointer.x = e.clientX;
  state.pointer.y = e.clientY;
  state.pointer.inside = true;
});
canvas.addEventListener('pointerleave', () => (state.pointer.inside = false));
canvas.addEventListener('pointerdown', (e) => {
  state.pointer.x = e.clientX;
  state.pointer.y = e.clientY;
  if (!state.playing || state.journal || game.s.dead) return;
  if (e.button === 2) {
    doInteract();
    return;
  }
  if (e.button !== 0) return;
  if (game.s.placing && !game.equipment.held()?.includes(game.s.placing)) {
    const { x, y } = worldAt(e);
    const r = game.place(game.s.placing, x, y);
    if (!r.ok) message(r.reason);
    updateUI(true);
    return;
  }
  state.using = true;
  useHeld(true);
});
addEventListener('pointerup', () => (state.using = false));
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
canvas.addEventListener(
  'wheel',
  (e) => {
    if (!state.playing || state.journal) return;
    e.preventDefault();
    game.equipment.select(game.s.hotbarIndex + (e.deltaY > 0 ? 1 : -1));
    updateUI(true);
  },
  { passive: false },
);
/** Uses the held item at the cursor; while the button stays down this repeats each frame. */
function useHeld(first = false) {
  const { x, y } = cursorWorld();
  const r = game.useAt(x, y);
  if (!r.ok && r.reason && first && r.reason !== 'Recovering from the last strike.')
    message(r.reason);
  if (r.ok) updateUI(first);
}
function renderJournal() {
  const tab = state.tab,
    left = $('page-left'),
    right = $('page-right');
  document
    .querySelectorAll<HTMLButtonElement>('.book-tabs button')
    .forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
  const page: Record<string, string> = {
    pack: '01',
    gear: '02',
    recipes: '03',
    vitals: '04',
    notes: '05',
    beasts: '06',
    atlas: '07',
    town: '08',
  };
  $('page-number').textContent = page[tab];
  $('right-page-heading').textContent = tab === 'notes' ? 'FIELD NOTES' : tab.toUpperCase();
  $('book').classList.remove('turn');
  void $('book').offsetWidth;
  $('book').classList.add('turn');
  if (tab === 'pack') renderPack(left, right);
  if (tab === 'recipes') renderRecipes(left, right);
  if (tab === 'vitals') renderVitals(left, right);
  if (tab === 'notes') renderNotes(left, right);
  if (tab === 'beasts') {
    if (state.beastsView === 'codex') renderCodex(left, right);
    else if (state.beastsView === 'feats') renderFeats(left, right);
    else renderBeasts(left, right);
  }
  if (tab === 'gear') {
    if (state.gearView === 'armoury') renderArmoury(left, right);
    else if (state.gearView === 'skills') renderSkills(left, right);
    else renderGear(left, right);
  }
  if (tab === 'atlas') {
    if (state.atlasView === 'rift') renderRift(left, right);
    else renderAtlas(left, right);
  }
  if (tab === 'town') renderTown(left, right);
  pixelate(left);
  pixelate(right);
}
function sketch(type: string) {
  if (type === 'pack')
    return `<svg class="sketch" viewBox="0 0 440 150" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#57634f" stroke-linecap="round" stroke-linejoin="round"><path stroke-width="2" d="M167 129q-16-12-13-28l5-53q7-12 25-15l56 3q21 4 25 18l4 50q-2 21-17 25z"/><path stroke-width="1.5" d="M158 57q49-19 106 2m-96 2q46 24 87 1m-86-18q1-16 15-18l53 3q18 4 18 22M174 78l80 2-3 29q-37 18-78-3zM180 81l-1 22q28 10 65 2l2-23M192 88v19m44-21v20"/><path stroke-width="2.5" d="M183 38V19q30-12 52 0v18m-51-12q27-12 50 0m-44 2q-8 7-5 12m45-10q6 7 4 12M166 69l-11 41m110-41 12 42"/><path stroke-width="1" d="M186 50l57 1m-56 5 55 2m-74 61q42 13 83-1m-91-12 11 8m91-9-10 10M81 121q28-16 52 0m150 4q25-21 68-7M46 132q39-8 75 0m191 2q55-12 95-1"/><path stroke-width="1.3" d="M76 124l-8-18m8 18 7-21m17 23-4-15m14 17 7-22m232 18-10-16m10 16 12-22m15 20-2-17"/></g><g fill="#7d896d"><circle cx="182" cy="67" r="2"/><circle cx="251" cy="67" r="2"/><path d="M79 120q-18-15-20-24 17 0 20 24m272 2q10-18 29-22-7 18-29 22" opacity=".45"/></g><text x="18" y="25" fill="#7c624d" font-family="Caveat" font-size="19">straps repaired twice</text><path d="M115 26q28 4 45 22" fill="none" stroke="#7c624d"/><text x="279" y="58" fill="#7c624d" font-family="Caveat" font-size="18">keep dry</text><path d="M276 65q-13 7-18 22" fill="none" stroke="#7c624d"/></svg>`;
  if (type === 'beast')
    return `<svg class="sketch" viewBox="0 0 440 155" xmlns="http://www.w3.org/2000/svg"><circle cx="211" cy="74" r="63" fill="none" stroke="#afa085" stroke-width="1"/><g fill="none" stroke="#5d5147" stroke-linecap="round" stroke-linejoin="round"><path stroke-width="2.6" d="M91 123q21-29 52-34l23-34 18 14 22-43 17 42 26-20 8 30 37-6 43 28-39 14-14 21-40 11-80-15z"/><path stroke-width="1.7" d="M154 94l-22-11 11-26 20 20m66-15 27-20 14 38m-37 57q23-19 56-21m-117 10 39-11 31 10m57-30 22 7-20 5"/><path stroke-width="1" d="M127 112l31-18m-16 26 28-20m-3 26 27-27m-8 30 30-24m-6 28 30-28m-3 28 25-24m-4 22 23-17m-42-63 26 15m-59-35 24 27m-32-39 17 38m-47-12 22 21m-62 9 22 10m93 5 16-15"/><path stroke-width="1.5" d="M311 102q-8 14-25 19m-91-33q10-5 18-3m-19-3 14-10m33 31 6 17m6-15 8 16"/></g><path d="M278 88q8-6 15 1-9 7-15-1" fill="#954d45"/><circle cx="286" cy="88" r="2" fill="#f0dbc1"/><path d="M327 97l14 4-13 5z" fill="#5d5147"/><text x="19" y="31" fill="#7c624d" font-family="Caveat" font-size="22">the old wolf</text><path d="M90 37q23 15 37 35" fill="none" stroke="#7c624d"/><text x="313" y="142" fill="#7c624d" font-family="Caveat" font-size="18">eyes like embers</text></svg>`;
  return `<svg class="sketch" viewBox="0 0 440 145" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#66694f" stroke-linecap="round" stroke-linejoin="round"><path stroke-width="4" d="M167 121 278 17"/><path stroke-width="2" d="M163 119q-8 7-3 13 7 4 14-5l-7-8m103-99q19-15 42-11l27 24q-19 3-32 18l-37-17z"/><path stroke-width="1" d="M274 21q25 8 33 30m-15-40 19 30m-9-29 19 25m-71 25-11-14m8 18-11-14m7 20-12-13m6 18-11-13m-9 20-13-13m10 21-13-13m8 19-13-12m-23 23 12 12m90-80 20-15m-15 28 29-16m-25 26 30-14M62 120q40-17 86 0m197 4q26-11 58-3"/><path stroke-width="1.5" d="M52 125l-7-18m7 18 10-18m16 17-3-14m275 14-9-16m9 16 11-17"/></g><path d="M270 22l29-9 28 19-18 8z" fill="#a8a88a" opacity=".26"/><text x="35" y="37" fill="#7d624b" font-family="Caveat" font-size="22">stone edge</text><path d="M98 42q36-4 65 24" fill="none" stroke="#7d624b"/><text x="315" y="82" fill="#7d624b" font-family="Caveat" font-size="20">fiber binding</text><path d="M315 84q-27-6-49-15" fill="none" stroke="#7d624b"/></svg>`;
}
/** A food's freshness: its stage and time left, and a bar that empties as it ages. */
function freshness(e: { id: string; fresh?: number }) {
  if (e.fresh === undefined) return '';
  const st = game.itemState(e as { id: string; qty: number; fresh?: number }),
    life = D.ITEMS[e.id]?.[2] || 1,
    pct = clamp((e.fresh / life) * 100, 0, 100);
  return `<small class="${st}">${st.toUpperCase()} · ${Math.max(0, Math.ceil(e.fresh / 60))} min</small><span class="fresh-bar ${st}"><i style="width:${pct}%"></i></span>`;
}
/** The open cold storage: how cold it is, how long its ice lasts, and what is inside. */
function larderPanel(st: Structure) {
  const spec = D.STORAGE[st.type],
    larder = game.larder,
    cold = larder.cold(st),
    left = larder.coldLeft(st),
    stored = st.larder ?? [];
  const byId = new Map<string, { n: number; worst: { id: string; fresh?: number } }>();
  for (const e of stored) {
    const b = byId.get(e.id);
    if (!b) byId.set(e.id, { n: e.qty, worst: e });
    else {
      b.n += e.qty;
      if ((e.fresh ?? 0) < (b.worst.fresh ?? 0)) b.worst = e;
    }
  }
  const gauge = spec.fuel
    ? `<div class="vital-row ${left < 180 ? 'danger' : ''}"><span>Cold</span><span class="mini-track"><i style="width:${clamp((st.fuel / ((spec.per ?? 900) * 3)) * 100, 0, 100)}%"></i></span><b>${left === Infinity ? '∞' : Math.round(left / 60) + 'm'}</b></div>`
    : '';
  return `<h2>${spec.name}</h2><p class="lede">${spec.text}</p>${gauge}<p>${cold ? `Cold: food here ages at <strong>×${larder.multiplier(st).toFixed(2)}</strong>` : '<strong>Warm</strong>: food here ages as fast as anywhere'} · ${stored.length} / ${spec.capacity} stored</p>${spec.fuel ? `<div class="book-actions"><button data-refuel ${game.count(spec.fuel) ? '' : 'disabled'}>ADD ${pretty(spec.fuel).toUpperCase()} · ${game.count(spec.fuel)} CARRIED</button></div>` : ''}<h3>Stored</h3><div class="book-list">${
    [...byId.entries()]
      .map(
        ([id, b]) =>
          `<div class="book-row"><div class="with-icon">${icon(id)}<div><strong>${pretty(id)}</strong>${freshness(b.worst)}</div></div><div><span class="qty">×${b.n}</span><button data-take="${id}">TAKE</button></div></div>`,
      )
      .join('') || '<p>Empty. Stow food from your pack on the right.</p>'
  }</div><div class="book-actions"><button class="quiet" data-close-larder>CLOSE</button></div>`;
}
function renderPack(left: HTMLElement, right: HTMLElement) {
  const items = game.s.inventory;
  left.innerHTML = `<h2>The Pack</h2><p class="lede">What you carry changes with time. What spoils can change you.</p>${sketch('pack')}<div class="divider"></div><h3>Equipment</h3><p>Weapon: <strong>${pretty(game.s.player.weapon)}</strong><br>Cloak: <strong>${game.s.player.cloak ? 'Worn' : game.count('direwolf_cloak') ? 'Packed' : 'None'}</strong><br>Hide coat: <strong>${game.s.player.coat ? 'Worn' : 'Packed or absent'}</strong><br>Explorer boots: <strong>${game.s.player.boots ? 'Worn' : 'Packed or absent'}</strong></p><div class="note-block">Food and boiled water age in your pack, even while this record is closed. An icebox supplied with ice slows spoilage nearby.</div>${state.farm ? '<h3>Farm plot · Choose a seed</h3><div class="farm-choice"><button class="tiny-button" data-plant="herb">HERB</button><button class="tiny-button" data-plant="wheat">WHEAT</button><button class="tiny-button" data-plant="potato">POTATO</button></div>' : ''}${
    state.chest
      ? `<h3>Field chest</h3><p>Stowed here: ${
          Object.entries(state.chest.store)
            .map(([id, n]) => `${n} ${pretty(id)}`)
            .join(' · ') || 'Nothing yet.'
        }</p><div class="chest-actions"><select id="chest-item">${[...new Set([...items.map((e) => e.id), ...Object.keys(state.chest.store)])].map((id) => `<option value="${id}">${pretty(id)}</option>`).join('')}</select><button data-store>STOW 1</button><button data-take>TAKE 1</button></div>`
      : ''
  }`;
  const order = [
    'weapon',
    'tool',
    'armor',
    'accessory',
    'ammo',
    'potion',
    'clothing',
    'food',
    'water',
    'medicine',
    'ore',
    'metal',
    'material',
    'trophy',
    'key',
    'block',
    'structure',
  ];
  // Perishables of a kind share a row: the count, and the freshness of the oldest.
  const shown: typeof items = [];
  for (const e of items) {
    const same = e.fresh !== undefined && shown.find((x) => x.id === e.id && x.fresh !== undefined);
    if (same) {
      same.qty += e.qty;
      same.fresh = Math.min(same.fresh!, e.fresh!);
    } else shown.push({ ...e });
  }
  const groups = [...new Set(items.map((e) => D.ITEMS[e.id][1]))].sort(
    (a, b) => order.indexOf(a) - order.indexOf(b),
  );
  const load = game.inventory.load(),
    cap = game.inventory.capacity();
  right.innerHTML = `<h2>Contents</h2><p class="lede">${items.reduce((n, e) => n + e.qty, 0)} objects in the field pack.</p><div class="vital-row" title="Carry more than this and you slow down and tire. A satchel, pack, or expedition frame raises it."><span>Load (kg)</span><span class="mini-track"><i style="width:${clamp((load / cap) * 100, 0, 100)}%;${load > cap ? 'background:#b2402e' : ''}"></i></span><b>${Math.round(load)}/${cap}</b></div>${load > cap ? '<p class="warn-line">Overloaded: you move slowly and tire fast. Drop or store something.</p>' : ''}${
    groups
      .map(
        (category) =>
          `<h3>${category}</h3><div class="book-list">${shown
            .filter((e) => D.ITEMS[e.id][1] === category)
            .sort((a, b) => pretty(a.id).localeCompare(pretty(b.id)))
            .map((e) => {
              const use = itemUseLabel(e.id),
                fresh = freshness(e);
              const weapon = D.WEAPONS[e.id] && game.armoury.known(e.id),
                q = weapon ? D.QUALITIES[game.armoury.entry(e.id).q] : null;
              const stow = state.larder && D.ITEMS[e.id]?.[2];
              return `<div class="book-row"><div class="with-icon">${icon(e.id)}<div><strong ${q && q.id !== 'common' ? `style="color:${q.color}"` : ''}>${weapon ? game.armoury.title(e.id) : pretty(e.id)}</strong>${fresh}${game.durability.wears(e.id) && game.durability.wear(e.id) >= 1 ? `<small>${wearText(e.id).replace(/^ · /, '')}</small>` : ''}</div></div><div><span class="qty">×${e.qty}</span>${stow ? `<button data-stow="${e.id}">STOW</button>` : use ? `<button data-use="${e.id}">${use}</button>` : ''}</div></div>`;
            })
            .join('')}</div>`,
      )
      .join('') || '<p>Only the journal remains. Gather what the meadow offers.</p>'
  }`;
  const desk = state.research;
  if (desk) {
    const tally = game.s.tutorial.tally,
      fresh = [...new Set(game.s.inventory.map((e) => e.id))].filter(
        (id) => !(tally['study:' + id] > 0) && id !== 'coin',
      );
    left.innerHTML = `<h2>Research desk</h2><p class="lede">Study a thing and learn what it is for: what it goes into, and how a weapon may grow. Studying uses one up, and every study earns renown.</p><p class="muted">${Object.keys(tally).filter((k) => k.startsWith('study:')).length} things studied.</p><div class="book-list">${
      fresh
        .map(
          (id) =>
            `<div class="book-row"><div class="with-icon">${icon(id)}<div><strong>${pretty(id)}</strong><small>${D.RECIPES.filter((r) => r.cost[id]).length} known uses</small></div></div><button data-study="${id}">STUDY</button></div>`,
        )
        .join('') || '<p>Nothing new in your pack to study.</p>'
    }</div><div class="book-actions"><button class="quiet" data-close-desk>CLOSE</button></div>`;
    left.querySelectorAll<HTMLButtonElement>('[data-study]').forEach(
      (b) =>
        (b.onclick = () => {
          const r = game.crafting.study(b.dataset.study ?? '');
          if (!r.ok) message(r.reason);
          renderJournal();
          updateUI(true);
        }),
    );
    left.querySelector<HTMLButtonElement>('[data-close-desk]')!.onclick = () => {
      state.research = null;
      renderJournal();
    };
  }
  const shelf = state.shelf;
  if (shelf) {
    const held = Object.keys(shelf.store).filter((id) => D.RELIC_EFFECTS[id]),
      carried = game.s.inventory.filter((e) => D.RELIC_EFFECTS[e.id]).map((e) => e.id);
    left.innerHTML = `<h2>Relic shelf</h2><p class="lede">Relics set here lend their gifts wherever you roam. At renown ${game.skills.level()} the shelf holds ${game.skills.shelfSlots()}.</p><h3>On the shelf · ${Math.min(held.length, game.skills.shelfSlots())} / ${game.skills.shelfSlots()}</h3><div class="book-list">${
      held
        .map(
          (id) =>
            `<div class="book-row"><div class="with-icon">${icon(id)}<div><strong>${pretty(id)}</strong><small>${D.relicText(id)}</small></div></div><button data-unshelve="${id}">TAKE</button></div>`,
        )
        .join('') || '<p>Empty.</p>'
    }</div><h3>Carried relics</h3><div class="book-list">${
      carried
        .map(
          (id) =>
            `<div class="book-row"><div class="with-icon">${icon(id)}<div><strong>${pretty(id)}</strong><small>${D.relicText(id)}</small></div></div><button data-shelve="${id}">SET</button></div>`,
        )
        .join('') || '<p>Relics are won from realm bosses; great trophies rest here too.</p>'
    }</div><div class="book-actions"><button class="quiet" data-close-shelf>CLOSE</button></div>`;
    const act = (r: { ok: boolean; reason?: string }) => {
      if (!r.ok) message(r.reason);
      renderJournal();
      updateUI(true);
    };
    left
      .querySelectorAll<HTMLButtonElement>('[data-shelve]')
      .forEach((b) => (b.onclick = () => act(game.skills.shelve(shelf, b.dataset.shelve ?? ''))));
    left
      .querySelectorAll<HTMLButtonElement>('[data-unshelve]')
      .forEach(
        (b) => (b.onclick = () => act(game.skills.unshelve(shelf, b.dataset.unshelve ?? ''))),
      );
    left.querySelector<HTMLButtonElement>('[data-close-shelf]')!.onclick = () => {
      state.shelf = null;
      renderJournal();
    };
  }
  const larder = state.larder;
  if (larder) {
    left.innerHTML = larderPanel(larder);
    const act = (r: { ok: boolean; reason?: string }) => {
      if (!r.ok) message(r.reason);
      renderJournal();
      updateUI(true);
    };
    left
      .querySelector<HTMLButtonElement>('[data-refuel]')
      ?.addEventListener('click', () => act(game.larder.refuel(larder)));
    left
      .querySelectorAll<HTMLButtonElement>('[data-take]')
      .forEach((b) => (b.onclick = () => act(game.larder.take(larder, b.dataset.take ?? ''))));
    left.querySelector<HTMLButtonElement>('[data-close-larder]')!.onclick = () => {
      state.larder = null;
      renderJournal();
    };
    right
      .querySelectorAll<HTMLButtonElement>('[data-stow]')
      .forEach((b) => (b.onclick = () => act(game.larder.stow(larder, b.dataset.stow ?? ''))));
  }
  right.querySelectorAll<HTMLButtonElement>('[data-use]').forEach(
    (b) =>
      (b.onclick = () => {
        const r = game.use(b.dataset.use ?? '');
        if (!r.ok) message(r.reason);
        else {
          sound('page');
          if (game.s.placing) toggleJournal(false);
          else renderJournal();
        }
        updateUI(true);
      }),
  );
  left.querySelectorAll<HTMLButtonElement>('[data-plant]').forEach(
    (b) =>
      (b.onclick = () => {
        const farm = state.farm;
        if (!farm) return;
        const r = game.plant(farm, b.dataset.plant ?? '');
        if (!r.ok) message(r.reason);
        else {
          state.farm = null;
          sound('pluck');
          renderJournal();
        }
      }),
  );
  const chest = state.chest;
  if (chest) {
    const choose = () => left.querySelector<HTMLSelectElement>('#chest-item')?.value ?? '';
    left.querySelector<HTMLButtonElement>('[data-store]')!.onclick = () => {
      const r = game.storeInChest(chest, choose());
      if (!r.ok) message(r.reason);
      else {
        sound('page');
        renderJournal();
      }
    };
    left.querySelector<HTMLButtonElement>('[data-take]')!.onclick = () => {
      const r = game.takeFromChest(chest, choose());
      if (!r.ok) message(r.reason);
      else {
        sound('page');
        renderJournal();
      }
    };
  }
}
function renderRecipes(left: HTMLElement, right: HTMLElement) {
  const selected = D.RECIPES.find((r) => r.id === state.selectedRecipe) || D.RECIPES[0];
  const affordable = game.canAfford(selected.cost),
    atStation = !selected.station || !!game.near(selected.station);
  left.innerHTML = `<h2>Making Things</h2><p class="lede">Tools open harder ground. Stations let simple parts become something more.</p>${sketch('tool')}<h3>${pretty(selected.id)}</h3><p>${selected.station ? 'Made at a ' + pretty(selected.station).toLowerCase() : 'Made by hand'} · Tier ${selected.tier}</p><div class="book-list">${Object.entries(
    selected.cost,
  )
    .map(
      ([id, n]) =>
        `<div class="book-row"><span class="with-icon">${icon(id)}${pretty(id)}</span><span class="qty ${game.count(id) < n ? 'red' : ''}">${game.count(id)} / ${n}</span></div>`,
    )
    .join(
      '',
    )}</div><div class="note-block">${!atStation ? 'Stand beside a ' + pretty(selected.station ?? '').toLowerCase() + '.' : !affordable ? 'Gather the remaining materials.' : 'Everything needed is at hand.'}</div>`;
  const recipes = [...D.RECIPES].sort((a, b) => a.tier - b.tier);
  right.innerHTML = `<h2>Recipes</h2><p class="lede">Select a recipe, then make it when its station and materials are within reach.</p>${recipes
    .map(
      (r, i) =>
        `${i === 0 || recipes[i - 1].tier !== r.tier ? `<h3 class="recipe-group">Tier ${r.tier} · ${['', 'First fire', 'Copper age', 'Iron age', 'Forgework', 'Black glass', 'Effergy'][r.tier]}</h3>` : ''}<div class="recipe-row"><div class="recipe-head"><strong class="with-icon">${icon(r.id)}${pretty(r.id)}</strong><button data-craft="${r.id}" ${game.canCraft(r.id) ? '' : 'disabled'}>${game.dev.unlocked.has(r.id) ? 'MAKE ✦' : 'MAKE'}</button></div><small>${Object.entries(
          r.cost,
        )
          .map(([id, n]) => `${n} ${pretty(id).toLowerCase()}`)
          .join(
            ' · ',
          )}</small><small>${r.station ? 'AT ' + pretty(r.station).toUpperCase() : 'BY HAND'} · <a href="#" data-select="${r.id}">DETAILS</a></small></div>`,
    )
    .join('')}`;
  right.querySelectorAll<HTMLButtonElement>('[data-craft]').forEach(
    (b) =>
      (b.onclick = () => {
        const scroll = right.scrollTop;
        const r = game.craft(b.dataset.craft ?? '');
        if (!r.ok) message(r.reason);
        else {
          if (game.s.placing) toggleJournal(false);
          else {
            renderJournal();
            right.scrollTop = scroll;
          }
        }
        updateUI(true);
      }),
  );
  right.querySelectorAll<HTMLAnchorElement>('[data-select]').forEach(
    (a) =>
      (a.onclick = (e) => {
        e.preventDefault();
        state.selectedRecipe = a.dataset.select ?? state.selectedRecipe;
        const scroll = right.scrollTop;
        renderJournal();
        right.scrollTop = scroll;
      }),
  );
}
/** The journal's diagnosis: each ailment with its stage, symptoms, treatment, and clock. */
function ailmentNotes() {
  const list = game.ailments.list(),
    t = game.s.elapsed;
  if (!list.length) return '<p>Nothing ails you.</p>';
  return list
    .map((a) => {
      const d = D.DISEASES[a.id];
      if (a.stage === 0)
        return `<div class="disease-note"><strong>Something is wrong</strong><p>You feel a little off. It has not shown itself yet.</p></div>`;
      const pips = [1, 2, 3].map((i) => `<i class="${i <= a.stage ? 'on' : ''}"></i>`).join('');
      const left = Math.max(0, Math.round(a.next - t));
      return `<div class="disease-note stage-${a.stage}"><strong>${d.name} <span class="pips">${pips}</span></strong><p>${D.STAGE_NAMES[a.stage]}: ${d.symptoms[a.stage - 1]}. Treat with ${d.treat.toLowerCase()}${game.count(d.item) ? ` (you carry ${pretty(d.item).toLowerCase()})` : ''}.${a.stage < 3 ? ` Worsens in about ${left}s untreated.` : ' It will not wait long.'} Likely cause: ${d.cause.toLowerCase()}.</p></div>`;
    })
    .join('');
}
function renderVitals(left: HTMLElement, right: HTMLElement) {
  const v = game.s.vitals,
    current = game.biome(),
    symptoms = game.vitalReasons();
  left.innerHTML = `<h2>The Body</h2><p class="lede">Warmth, food, water, and rest pull each other out of balance.</p><h3>Ailments</h3>${ailmentNotes()}<h3>Exposure</h3><p>Air: <strong>${game.temperature().toFixed(0)}°C</strong> in the ${D.BIOMES.some((b) => b.id === current.id) ? current.name.toLowerCase() : current.name}<br>Body: <strong>${v.bodyTemp.toFixed(1)}°C</strong><br>Weather: <strong>${game.s.weather}</strong> · ${game.isNight() ? 'night' : 'day'}</p><h3>Diet</h3><p>${(() => {
    const d = game.survival.diet();
    return d.state === 'malnourished'
      ? '<strong>Malnourished</strong>: the same food over and over. Stamina returns slowly, and you tire. Eat other kinds of food.'
      : d.state === 'balanced'
        ? `<strong>Balanced</strong>: ${d.groups} kinds of food in recent meals. Stamina returns faster.`
        : `${d.groups} kind${d.groups === 1 ? '' : 's'} of food in the last ${d.meals} meals. Four or more kinds keep you strong: meat, fish, grain, fruit, greens, fungus, sweets.`;
  })()}</p><div class="note-block">${symptoms.map((s) => `<div>• ${s}</div>`).join('')}</div><div class="book-actions"><button data-wash ${game.count('wild_water') + game.count('boiled_water') ? '' : 'disabled'}>WASH · 1 WATER</button></div><h3>Recovery</h3><p>Good food, safe water, warmth, and rest slowly restore health. A bedroll sharply reduces fatigue. Shelter keeps off rain; a lit fire helps dry and warm you.</p>`;
  const labels: [keyof Vitals, string][] = [
    ['health', 'Health'],
    ['hydration', 'Hydration'],
    ['calories', 'Calories'],
    ['protein', 'Protein'],
    ['vitamins', 'Vitamins'],
    ['stamina', 'Stamina'],
    ['fatigue', 'Fatigue'],
    ['wetness', 'Wetness'],
    ['illness', 'Illness'],
    ['infection', 'Infection'],
    ['hygiene', 'Hygiene'],
    ['morale', 'Morale'],
  ];
  right.innerHTML = `<h2>Vitals</h2><p class="lede">Read the whole body, not only the wound.</p>${labels
    .map(([id, label]) => {
      const val = Math.round(v[id]);
      const bad = ['fatigue', 'wetness', 'illness', 'infection'].includes(id) ? val > 60 : val < 25;
      return `<div class="vital-row ${bad ? 'danger' : ''}"><span>${label}</span><span class="mini-track"><i style="width:${val}%"></i></span><b>${val}</b></div>`;
    })
    .join('')}<small>These are game systems, not real-world medical guidance.</small>`;
  left.querySelector<HTMLButtonElement>('[data-wash]')!.onclick = () => {
    const r = game.wash();
    if (!r.ok) message(r.reason);
    else {
      sound('page');
      renderJournal();
    }
    updateUI(true);
  };
}
function renderNotes(left: HTMLElement, right: HTMLElement) {
  const biome = game.biome(),
    t = game.s.tutorial,
    current = D.TUTORIAL[t.step];
  left.innerHTML = `<h2>Field Notes</h2><p class="lede">Nine regions across the surface, the mines and hell beneath, four dungeons, and three worlds behind the Rift.</p><canvas id="atlas-map" class="atlas-map" width="300" height="150" aria-label="Side elevation of the regions, depths, dungeons, and dimensions"></canvas><h3>Current ground · ${biome.name}</h3><p>${biome.note}</p><p>Typical resources: ${[...new Set(biome.resources)].map(pretty).join(', ')}.</p><div class="book-actions"><button data-save>SAVE RECORD</button><button class="quiet" data-menu>MAIN MENU</button></div>`;
  right.innerHTML = `<h2>Lessons &amp; sightings</h2><p class="lede">${current ? current[0] + ' · ' + Math.min(current[2], t.tally[current[1]] || 0) + '/' + current[2] : 'The first field lessons are complete.'}</p><ol class="objective-list">${D.TUTORIAL.map(([label], i) => `<li class="${i < t.step ? 'done' : i === t.step ? 'current' : ''}">${label}</li>`).join('')}</ol><h3>Expedition chapters</h3><ol class="objective-list">${D.CHAPTERS.map(([label], i) => `<li class="${i < game.s.chapter ? 'done' : i === game.s.chapter ? 'current' : ''}">${label}</li>`).join('')}</ol><h3>Biome ledger</h3>${D.BIOMES.map((b) => `<div class="biome-entry ${b.id === biome.id ? 'current' : ''}"><strong>${b.name}</strong><small>${b.note}</small></div>`).join('')}<h3>Controls</h3><p>A / D move · W / Space jump and climb · S descend · E gather or interact · F strike · R / click mine · G fish · J / I journal · M map · Esc pause · 1–5 turn pages.</p>`;
  left.querySelector<HTMLButtonElement>('[data-save]')!.onclick = () => {
    game.save();
    sound('page');
    updateUI(true);
  };
  left.querySelector<HTMLButtonElement>('[data-menu]')!.onclick = () => {
    game.save(localStorage, true);
    toggleJournal(false);
    state.playing = false;
    $('hud').classList.add('hidden');
    $('menu').classList.remove('hidden');
    $<HTMLButtonElement>('continue-game').disabled = false;
    state.chest = null;
    state.larder = null;
  };
  drawAtlas();
}
/** Every creature, bosses last, with how many the player has slain. */
const bestiary = () =>
  Object.keys(D.MOBS)
    .filter((id) => !D.SETTLER_IDS.includes(id))
    .map((id) => ({ id, kills: game.s.tutorial.tally['kill:' + id] ?? 0 }))
    .sort((a, b) => Number(!!D.MOBS[a.id].boss) - Number(!!D.MOBS[b.id].boss));
let atlasLand: HTMLCanvasElement | null = null;
/** The field atlas: a pixel side-elevation of the overworld, its dungeons, and the worlds beyond. */
function drawAtlas() {
  const map = $<HTMLCanvasElement>('atlas-map'),
    ink = map.getContext('2d')!;
  const w = map.width,
    h = map.height,
    worldH = 112;
  ink.imageSmoothingEnabled = false;
  ink.fillStyle = '#d8caa4';
  ink.fillRect(0, 0, w, h);
  const X = (x: number) => Math.floor((x / D.OVERWORLD_W) * w),
    Y = (y: number) => Math.floor((y / D.WORLD_H) * worldH) + 4;
  const dot = (x: number, y: number, c: string) => {
    ink.fillStyle = c;
    ink.fillRect(x, y, 1, 1);
  };
  // The land never changes shape on this scale, so it is surveyed once and reused.
  if (atlasLand) ink.drawImage(atlasLand, 0, 0);
  else {
    // Each column: sky above the surface, then the layer inks, caves carved in light.
    for (let px = 0; px < w; px++) {
      const x = ((px + 0.5) / w) * D.OVERWORLD_W,
        top = Y(D.surfaceAt(x));
      for (let py = top; py < worldH + 4; py++) {
        const y = ((py - 4 + 0.5) / worldH) * D.WORLD_H;
        const cave = D.caveAt(x, y),
          lava = D.lavaAt(x, y);
        dot(
          px,
          py,
          lava
            ? '#e8702a'
            : cave
              ? '#c8b890'
              : y >= D.LAYERS[4].top
                ? '#6e3434'
                : y >= D.LAYERS[3].top
                  ? '#8d5a4a'
                  : y >= D.LAYERS[2].top
                    ? '#6f7483'
                    : py === top
                      ? (ART[D.biomeAt(x, 0).id]?.grass[1] ?? '#6a8a4a')
                      : '#8a8667',
        );
      }
    }
    atlasLand = document.createElement('canvas');
    atlasLand.width = w;
    atlasLand.height = h;
    atlasLand.getContext('2d')!.drawImage(map, 0, 0);
  }
  // Dungeons are marked as walled boxes in their brick colour.
  for (const d of D.DUNGEONS) {
    const x0 = X(d.tx0 * D.TILE),
      x1 = X((d.tx0 + d.cols) * D.TILE),
      y0 = Y(d.ty0 * D.TILE),
      y1 = Y((d.ty0 + d.rows) * D.TILE),
      seen = game.s.discoveries.includes(d.def.id);
    ink.fillStyle = seen ? (GROUND[d.def.brick]?.base ?? '#555') : '#5a5048';
    ink.fillRect(x0, y0, x1 - x0, y1 - y0);
    ink.fillStyle = '#2e2419';
    ink.fillRect(x0, y0, x1 - x0, 1);
    ink.fillRect(x0, y1 - 1, x1 - x0, 1);
    ink.fillRect(x0, y0, 1, y1 - y0);
    ink.fillRect(x1 - 1, y0, 1, y1 - y0);
    if (game.s.bosses[d.def.boss]) dot(Math.floor((x0 + x1) / 2), y1 - 3, '#fff0a0');
  }
  // The three dimensions, known once visited.
  const dimY = worldH + 10,
    dimW = Math.floor((w - 16) / 3);
  D.DIMENSIONS.forEach((dim, i) => {
    const x0 = 4 + i * (dimW + 4),
      seen = game.s.discoveries.includes(dim.id),
      colors: Record<string, [string, string]> = {
        mycelia: ['#1c3a3a', '#58e0d0'],
        skyreach: ['#8ab8e0', '#f4f4f8'],
        void: ['#1a0f2a', '#b36cff'],
      };
    const [bg, fg] = colors[dim.id];
    ink.fillStyle = seen ? bg : '#8a7a5a';
    ink.fillRect(x0, dimY, dimW, h - dimY - 4);
    if (seen)
      for (let k = 0; k < 14; k++)
        dot(x0 + 2 + ((k * 37) % (dimW - 4)), dimY + 2 + ((k * 23) % (h - dimY - 8)), fg);
    ink.fillStyle = '#2e2419';
    ink.fillRect(x0, dimY, dimW, 1);
    ink.fillRect(x0, h - 5, dimW, 1);
    if (D.regionAt(game.s.player.x) === dim.id) {
      const px = x0 + Math.floor(((game.s.player.x - dim.start) / (dim.end - dim.start)) * dimW);
      ink.fillStyle = '#a34d3f';
      ink.fillRect(px - 1, dimY + 4, 3, 3);
    }
  });
  // You are here.
  if (D.regionAt(game.s.player.x) === 'overworld') {
    const px = X(game.s.player.x),
      py = Y(game.s.player.y);
    ink.fillStyle = '#1a1410';
    ink.fillRect(px - 2, py - 2, 5, 5);
    ink.fillStyle = '#e8475a';
    ink.fillRect(px - 1, py - 1, 3, 3);
  }
}
function renderBeasts(left: HTMLElement, right: HTMLElement) {
  const a = game.s.altar,
    cfg = D.BOSSES[a.level - 1],
    owned = game.s.structures.some((st) => st.type === 'effergy'),
    near = !!game.near('effergy', 135);
  left.innerHTML = `<h2>Beasts</h2><p class="lede">The Effergy binds a hunt to the oldest shapes in the dark.</p>${sketch('beast')}<div class="folio-stamp">${owned ? 'FOLIO UNSEALED' : 'FOLIO SEALED'}</div><h3>Wolf attunement</h3><p>${owned ? 'The wolf sigil is ready. Wolf kills fill the counter after attunement. Return to the altar when the Direwolf appears.' : 'Craft the Effergy at a forge, then place it to unseal this folio.'}</p><div class="note-block">A black-glass weapon, obsidian tier or greater, is required to wound any Direwolf variant.</div><p class="muted">Future attunement capacity: ${a.level} sigil${a.level > 1 ? 's' : ''}. Only wolves are recorded in this volume.</p><div class="book-actions"><button data-codex>THE CODEX ›</button></div>`;
  left.querySelector<HTMLButtonElement>('[data-codex]')!.onclick = () => {
    state.beastsView = 'codex';
    renderJournal();
  };
  right.innerHTML = `<h2>The Hunt</h2><p class="lede">Level ${a.level} · ${cfg.name}</p><div class="book-list"><div class="book-row"><span>Attuned</span><strong>${a.attuned === 'wolf' ? 'Wolves' : 'None'}</strong></div><div class="book-row"><span>Wolf kills</span><strong>${a.kills} / ${cfg.kills}</strong></div><div class="book-row"><span>Effergy XP</span><strong>${a.xp}</strong></div><div class="book-row"><span>Direwolf health</span><strong>${cfg.hp}</strong></div><div class="book-row"><span>Bite damage</span><strong>${cfg.bite}</strong></div></div><h3>Victory spoils</h3><p>${Object.entries(
    cfg.rewards,
  )
    .map(([id, n]) => `${n} ${pretty(id)}`)
    .join(
      ' · ',
    )} · ${cfg.xp} XP.</p><div class="book-actions"><button data-attune ${!owned || !near || a.activeBoss ? 'disabled' : ''}>ATTUNE TO WOLVES</button>${a.level < 3 ? `<button data-upgrade ${!owned || !near || a.activeBoss || a.xp < (a.level === 1 ? 100 : 250) ? 'disabled' : ''}>UPGRADE · ${a.level === 1 ? 100 : 250} XP</button>` : ''}</div>${a.activeBoss ? '<div class="disease-note">The Direwolf has been summoned. Return to the altar and finish the hunt.</div>' : ''}<h3>Later inscriptions</h3><p>Level 2: Ember Direwolf, nine kills. Level 3: Void Direwolf, twelve kills. Each level deepens the altar and expands its future sigil capacity.</p><h3>Bestiary · ${bestiary().filter((b) => b.kills).length} / ${bestiary().length}</h3><div class="book-list">${bestiary()
    .map(
      (b) =>
        `<div class="book-row"><div class="with-icon"><span class="icon-slot portrait"><img src="${b.kills ? mobPortrait(b.id) : ''}" alt="" ${b.kills ? '' : 'hidden'}></span><div><strong>${b.kills ? D.MOBS[b.id].name : '???'}</strong><small>${b.kills ? (D.MOBS[b.id].boss ? 'Slain ' + b.kills + '×' : b.kills + ' slain') + ' · ' + D.MOBS[b.id].hp + ' health' : 'Not yet met'}</small></div></div></div>`,
    )
    .join('')}</div>`;
  const attune = right.querySelector<HTMLButtonElement>('[data-attune]'),
    upgrade = right.querySelector<HTMLButtonElement>('[data-upgrade]');
  if (attune)
    attune.onclick = () => {
      const r = game.attune();
      if (!r.ok) message(r.reason);
      else {
        sound('boss');
        renderJournal();
      }
      updateUI(true);
    };
  if (upgrade)
    upgrade.onclick = () => {
      const r = game.upgradeAltar();
      if (!r.ok) message(r.reason);
      else {
        sound('victory');
        renderJournal();
      }
      updateUI(true);
    };
}
function renderGear(left: HTMLElement, right: HTMLElement) {
  const eq = game.equipment,
    p = game.s.player,
    set = eq.fullSet(),
    setInfo = set ? D.ARMOR_SETS.find((x) => x.key === set) : null;
  const slot = (label: string, id?: string) =>
    `<div class="book-row"><div class="with-icon">${id ? icon(id) : '<span class="icon-slot"></span>'}<div><strong>${id ? pretty(id) : 'Empty'}</strong><small>${label}${id && D.ARMOR[id] ? ' · ' + D.ARMOR[id].defense + ' defense' : ''}</small></div></div>${id ? `<button data-wear="${id}">REMOVE</button>` : ''}</div>`;
  const buffs = Object.entries(game.s.buffs)
    .filter(([id]) => id !== 'potion_sickness')
    .map(
      ([id, left]) =>
        `<div>• ${D.BUFFS[id]?.name ?? id} · ${D.BUFFS[id]?.text ?? ''} (${Math.ceil(left)}s)</div>`,
    )
    .join('');
  left.innerHTML = `<h2>Gear</h2><p class="lede">What you wear decides what you survive.</p><h3>Armour</h3><div class="book-list">${slot('Head', p.armor?.head)}${slot('Body', p.armor?.body)}${slot('Legs', p.armor?.legs)}</div><h3>Accessories · ${game.s.accessories.length} / 3</h3><div class="book-list">${[0, 1, 2].map((i) => slot('Accessory', game.s.accessories[i])).join('')}</div><h3>Standing</h3><p>Health <strong>${Math.round(game.s.vitals.health)} / ${eq.maxHealth()}</strong> · Mana <strong>${Math.round(game.s.mana)} / ${eq.maxMana()}</strong><br>Defense <strong>${eq.defense()}</strong> · Damage <strong>×${eq.damageBonus().toFixed(2)}</strong> · Speed <strong>×${eq.speedBonus().toFixed(2)}</strong></p>${setInfo ? `<div class="note-block">${setInfo.name} set · ${setInfo.bonusText}</div>` : ''}${buffs ? `<h3>Effects</h3><div class="note-block">${buffs}</div>` : ''}<div class="book-actions"><button data-armoury>THE ARMOURY ›</button><button data-skills>SKILLS ›</button></div>`;
  left.querySelector<HTMLButtonElement>('[data-skills]')!.onclick = () => {
    state.gearView = 'skills';
    renderJournal();
  };
  left.querySelector<HTMLButtonElement>('[data-armoury]')!.onclick = () => {
    state.gearView = 'armoury';
    if (D.WEAPONS[game.s.player.weapon] && game.s.player.weapon !== 'fists')
      state.armourySel = game.s.player.weapon;
    renderJournal();
  };
  const wearables = game.s.inventory.filter(
    (e) => ['armor', 'accessory'].includes(D.ITEMS[e.id]?.[1] ?? '') || D.CLOTHING[e.id],
  );
  const shield = game.equipment.clothingShield(),
    mend = game.durability.mendable();
  right.innerHTML = `<h2>Wardrobe</h2><p class="lede">Armour, charms, and clothing in the pack. Clothing is worn in three layers (under, mid, outer) and wears through in hard weather.</p><p class="muted">Clothing keeps out ${shield.insul}° of cold and ${shield.heat}° of heat, and ${Math.round(shield.water * 100)}% of the rain.</p>${
    mend.length
      ? `<div class="book-list">${mend
          .map(
            (id) =>
              `<div class="book-row"><div class="with-icon">${icon(id)}<div><strong>${pretty(id)}</strong><small>${Math.round(game.durability.wear(id))}% worn · mend: ${Object.entries(
                game.durability.cost(id),
              )
                .map(([k, n]) => `${n} ${pretty(k).toLowerCase()}`)
                .join(', ')}</small></div></div><button data-mend="${id}">MEND</button></div>`,
          )
          .join('')}</div>`
      : ''
  }<div class="book-list">${
    wearables
      .map(
        (e) =>
          `<div class="book-row"><div class="with-icon">${icon(e.id)}<div><strong>${pretty(e.id)}</strong><small>${D.ARMOR[e.id] ? D.ARMOR[e.id].defense + ' defense · ' + D.ARMOR[e.id].slot : D.CLOTHING[e.id] ? `${D.CLOTHING[e.id].layer} layer · ${D.CLOTHING[e.id].text.toLowerCase()}${wearText(e.id)}` : (D.ACCESSORIES[e.id]?.text ?? '')}</small></div></div><button data-wear="${e.id}">${worn(e.id) ? 'REMOVE' : 'WEAR'}</button></div>`,
      )
      .join('') || '<p>No armour yet. Forge it from ingots at a workbench, forge, or starforge.</p>'
  }</div><h3>Quick slots</h3><p class="muted">Numbers 1–0 or the mouse wheel choose a slot; click to use what it holds. Assign a slot from here:</p><div class="book-list">${game.s.hotbar
    .map(
      (id, i) =>
        `<div class="book-row"><span class="with-icon"><b class="qty">${(i + 1) % 10}</b>&nbsp;${id ? icon(id) + pretty(id) : '<span class="muted">empty</span>'}</span>${id ? `<button data-clear="${i}">CLEAR</button>` : ''}</div>`,
    )
    .join('')}</div>`;
  right.querySelectorAll<HTMLButtonElement>('[data-mend]').forEach(
    (b) =>
      (b.onclick = () => {
        const r = game.durability.repair(b.dataset.mend ?? '');
        if (!r.ok) message(r.reason);
        renderJournal();
      }),
  );
  for (const root of [left, right])
    root.querySelectorAll<HTMLButtonElement>('[data-wear]').forEach(
      (b) =>
        (b.onclick = () => {
          const r = game.use(b.dataset.wear ?? '');
          if (!r.ok) message(r.reason);
          renderJournal();
          updateUI(true);
        }),
    );
  right.querySelectorAll<HTMLButtonElement>('[data-clear]').forEach(
    (b) =>
      (b.onclick = () => {
        game.equipment.assign(Number(b.dataset.clear), null);
        renderJournal();
        updateUI(true);
      }),
  );
}
function renderRift(left: HTMLElement, right: HTMLElement) {
  const gate = game.s.structures.find((st) => st.type === 'rift_gate'),
    near = gate && Math.hypot(gate.x - game.s.player.x, gate.y - game.s.player.y) < 170,
    sigils = game.s.rift.sigils;
  const sigil = (id: string) =>
    `<div class="book-row"><div class="with-icon">${icon(id)}<div><strong>${pretty(id)}</strong><small>${D.DUNGEONS.find((d) => d.def.boss === D.MOBS_BY_SIGIL[id])?.def.name ?? ''}</small></div></div><span class="qty">${sigils.includes(id) ? 'SET' : game.count(id) ? 'CARRIED' : '—'}</span></div>`;
  left.innerHTML = `<h2>The Rift</h2><p class="lede">Four dungeons keep four sigils. Set them in the Rift Gate and it opens onto other worlds.</p><h3>Sigils</h3><div class="book-list">${['sigil_crypt', 'sigil_frost', 'sigil_sun', 'sigil_cinder'].map(sigil).join('')}</div><h3>Dungeons</h3>${D.DUNGEONS.map((d) => `<div class="biome-entry"><strong>${d.def.name}</strong><small>${d.def.note} ${game.s.bosses[d.def.boss] ? '· Its master is slain.' : ''}</small></div>`).join('')}`;
  right.innerHTML = `<h2>Destinations</h2><p class="lede">${gate ? (near ? 'The Gate hums beside you.' : 'Stand at your Rift Gate to travel.') : 'Build a Rift Gate at a forge: obsidian, crystal, hellstone, and grave dust from the Crypt.'}</p>${D.DIMENSIONS.map(
    (dim) => {
      const need = ({ mycelia: 1, skyreach: 2, void: 4 } as Record<string, number>)[dim.id] ?? 99,
        open = sigils.length >= need,
        biome = D.BIOMES.find((b) => b.id === dim.id);
      return `<div class="recipe-row"><div class="recipe-head"><strong>${dim.name}</strong><button data-travel="${dim.id}" ${open && near ? '' : 'disabled'}>TRAVEL</button></div><small>${biome?.note ?? ''}</small><small>${open ? 'OPEN' : 'NEEDS ' + need + ' SIGILS'} · ${game.s.discoveries.includes(dim.id) ? 'VISITED' : 'UNVISITED'}</small></div>`;
    },
  ).join(
    '',
  )}<div class="note-block">In each world a portal by the arrival point leads home to the Gate.</div><div class="book-actions"><button class="quiet" data-view-realms>‹ THE REALMS</button></div>`;
  right.querySelector<HTMLButtonElement>('[data-view-realms]')!.onclick = () => {
    state.atlasView = 'realms';
    renderJournal();
  };
  right.querySelectorAll<HTMLButtonElement>('[data-travel]').forEach(
    (b) =>
      (b.onclick = () => {
        const r = game.realms.travel(b.dataset.travel ?? '');
        if (!r.ok) message(r.reason);
        else toggleJournal(false);
        updateUI(true);
      }),
  );
}
function renderTown(left: HTMLElement, right: HTMLElement) {
  const town = game.town,
    here = new Set(town.settlers().map((a) => a.settler)),
    coins = game.count('coin');
  const hint = (st: (typeof D.SETTLERS)[number]) => {
    const [key, n] = st.unlock;
    if (key === 'sigils') return 'Comes once a sigil is set in the Rift Gate.';
    if (key === 'coin') return `Comes once you have earned ${n} silver marks.`;
    const [verb, what] = key.split(':');
    const thing = pretty(what).toLowerCase();
    if (verb === 'place')
      return `Comes once you build ${/^[aeiou]/.test(thing) ? 'an' : 'a'} ${thing}.`;
    if (verb === 'craft') return `Comes once you smelt ${pretty(what).toLowerCase()}.`;
    if (verb === 'visit')
      return `Comes once you have been to ${D.BIOMES.find((b) => b.id === what)?.name ?? D.DUNGEONS.find((d) => d.def.id === what)?.def.name ?? what}.`;
    return '';
  };
  left.innerHTML = `<h2>The Town</h2><p class="lede">Build rooms with back walls, a door, a seat, a table, and a light, and settlers will move in.</p><p>Purse: <strong>${coins} silver marks</strong></p><h3>Settlers · ${here.size} / ${D.SETTLERS.length}</h3><div class="book-list">${D.SETTLERS.map(
    (st) => {
      const status = here.has(st.id) ? 'HOME' : town.unlocked(st.id) ? 'WAITING' : '—';
      return `<div class="book-row"><div class="with-icon"><div><strong>${st.name} ${st.title}</strong><small>${here.has(st.id) ? st.stock.length + ' wares for sale' : town.unlocked(st.id) ? 'Needs a free home.' : hint(st)}</small></div></div><div><span class="qty">${status}</span>${here.has(st.id) ? `<button data-shop="${st.id}">WARES</button>` : ''}</div></div>`;
    },
  ).join(
    '',
  )}</div><div class="note-block">Hold a chair or table and use it to check a room. A hammer takes down walls and furniture.</div>`;
  const who = state.shop ? D.settlerById(state.shop) : null,
    near = (id: string) =>
      town
        .settlers()
        .some(
          (a) => a.settler === id && Math.hypot(a.x - game.s.player.x, a.y - game.s.player.y) < 160,
        ),
    anyNear = town
      .settlers()
      .some((a) => Math.hypot(a.x - game.s.player.x, a.y - game.s.player.y) < 160);
  const sellable = game.s.inventory
    .filter((e) => e.id !== 'coin' && !D.ITEMS[e.id]?.[1]?.startsWith('key'))
    .sort((a, b) => town.sellPrice(b.id) - town.sellPrice(a.id));
  right.innerHTML = `<h2>${who ? who.name + ' ' + who.title : 'Trade'}</h2><p class="lede">${who ? (near(who.id) ? 'What will it be?' : 'Stand beside ' + who.name + ' to trade.') : 'Talk to a settler to see their wares.'}</p>${
    who
      ? `<h3>For sale</h3><div class="book-list">${who.stock
          .map(
            ([id, price]) =>
              `<div class="book-row"><div class="with-icon">${icon(id)}<div><strong>${pretty(id)}</strong><small>${price} marks</small></div></div><div><button data-buy="${id}" ${near(who.id) && coins >= price ? '' : 'disabled'}>BUY</button></div></div>`,
          )
          .join('')}</div>`
      : ''
  }<h3>Sell</h3><div class="book-list">${
    sellable
      .map(
        (e) =>
          `<div class="book-row"><div class="with-icon">${icon(e.id)}<div><strong>${pretty(e.id)}</strong><small>${town.sellPrice(e.id)} marks each</small></div></div><div><span class="qty">×${e.qty}</span><button data-sell="${e.id}" ${anyNear ? '' : 'disabled'}>SELL</button></div></div>`,
      )
      .join('') || '<p>Nothing to sell.</p>'
  }</div>`;
  left.querySelectorAll<HTMLButtonElement>('[data-shop]').forEach(
    (b) =>
      (b.onclick = () => {
        state.shop = b.dataset.shop ?? null;
        renderJournal();
      }),
  );
  const act = (r: { ok: boolean; reason?: string }) => {
    if (!r.ok) message(r.reason);
    renderJournal();
    updateUI(true);
  };
  right
    .querySelectorAll<HTMLButtonElement>('[data-buy]')
    .forEach((b) => (b.onclick = () => act(town.buy(state.shop ?? '', b.dataset.buy ?? ''))));
  right
    .querySelectorAll<HTMLButtonElement>('[data-sell]')
    .forEach((b) => (b.onclick = () => act(town.sell(b.dataset.sell ?? ''))));
}
function renderSkills(left: HTMLElement, right: HTMLElement) {
  const sk = game.skills,
    tree = D.TREES.find((t) => t.id === state.skillTree) ?? D.TREES[0],
    spent = sk.spentIn(tree.id);
  left.innerHTML = `<h2>Skills</h2><div class="farm-choice">${D.TREES.map((t) => `<button class="tiny-button ${t.id === tree.id ? 'active' : ''}" data-tree="${t.id}">${t.name.toUpperCase()} ${sk.spentIn(t.id) || ''}</button>`).join('')}</div><p class="lede">${tree.text}. ${spent} point${spent === 1 ? '' : 's'} spent here.</p>${[
    1, 2, 3, 4, 5,
  ]
    .map((row) => {
      const open = spent >= D.ROW_POINTS[row];
      return `<h3>${row === 5 ? 'Keystones' : 'Row ' + row}${open ? '' : ` · opens at ${D.ROW_POINTS[row]} points`}</h3><div class="skill-row">${D.SKILLS.filter(
        (n) => n.tree === tree.id && n.row === row,
      )
        .map((n) => {
          const has = sk.has(n.id),
            why = sk.blocked(n.id);
          return `<button class="skill ${has ? 'learned' : !why ? 'ready' : ''} ${n.keystone ? 'key' : ''}" data-learn="${n.id}" title="${n.name}: ${n.text}${n.cost > 1 ? ' (' + n.cost + ' points)' : ''}${why && !has ? ' · ' + why : ''}"><strong>${n.name}</strong><small>${n.text}</small></button>`;
        })
        .join('')}</div>`;
    })
    .join('')}<div class="book-actions"><button class="quiet" data-gear>‹ GEAR</button></div>`;
  const [into, need] = sk.progress();
  right.innerHTML = `<h2>Renown ${sk.level()}</h2><p class="lede">Everything you do earns renown: slaying, making, finding, clearing realms. Each level is a skill point. Renown never fades.</p><div class="vital-row"><span>Next level</span><span class="mini-track"><i style="width:${clamp((into / need) * 100, 0, 100)}%"></i></span><b>${Math.round(into)}/${need}</b></div><p><strong>${sk.points()}</strong> point${sk.points() === 1 ? '' : 's'} to spend · relic shelf holds <strong>${sk.shelfSlots()}</strong></p><h3>Weapon mastery</h3><div class="book-list">${D.FAMILIES.map(
    (f) => {
      const lvl = sk.mastery(f.id);
      return `<div class="book-row" title="Mastery ${D.PERK_LEVEL}: ${D.MASTERY_PERKS[f.id]}. Mastery ${D.SHINE_LEVEL}: the weapon glints in your hand."><div><strong>${f.name}</strong><small>${D.masteryTitle(lvl)}${lvl >= D.PERK_LEVEL ? ' · ' + D.MASTERY_PERKS[f.id] : ''}</small></div><span class="qty">${lvl} / ${D.MAX_MASTERY}</span></div>`;
    },
  ).join(
    '',
  )}</div><p class="muted">Each mastery level adds 1% damage with that family; 5 steadies a blade's combo, 10 adds 5% critical chance, 15 quickens, and 20 adds another 10% and makes it glint. At 10 each family also learns a move of its own (hover a family to see it).</p><div class="book-actions"><button class="quiet" data-respec>UNLEARN ALL · 3 FALLEN STARS, 200 MARKS</button></div>`;
  left.querySelectorAll<HTMLButtonElement>('[data-tree]').forEach(
    (b) =>
      (b.onclick = () => {
        state.skillTree = b.dataset.tree ?? 'warfare';
        renderJournal();
      }),
  );
  const act = (r: { ok: boolean; reason?: string }) => {
    if (!r.ok) message(r.reason);
    renderJournal();
    updateUI(true);
  };
  left
    .querySelectorAll<HTMLButtonElement>('[data-learn]')
    .forEach((b) => (b.onclick = () => act(sk.learn(b.dataset.learn ?? ''))));
  left.querySelector<HTMLButtonElement>('[data-gear]')!.onclick = () => {
    state.gearView = 'gear';
    renderJournal();
  };
  right.querySelector<HTMLButtonElement>('[data-respec]')!.onclick = () => act(sk.respec());
}
function renderCodex(left: HTMLElement, right: HTMLElement) {
  const sk = game.skills,
    done = D.CODEX.filter((p) => sk.pageDone(p)).length;
  left.innerHTML = `<h2>The Codex</h2><p class="lede">What the expedition has learned. ${done} of ${D.CODEX.length} pages complete; each grants a lasting gift.</p>${(
    ['Creatures', 'Places', 'Lore'] as const
  )
    .map(
      (group) =>
        `<h3>${group}</h3><div class="book-list">${D.CODEX.filter((p) => p.group === group)
          .map((p) => {
            const [a, b] = sk.page(p);
            return `<div class="book-row ${state.codexPage === p.id ? 'selected' : ''}"><div><strong>${p.name}</strong><small>${a >= b ? '✓ ' : ''}${p.bonusText}</small></div><div><span class="qty">${a}/${b}</span><button data-page="${p.id}">READ</button></div></div>`;
          })
          .join('')}</div>`,
    )
    .join(
      '',
    )}<div class="book-actions"><button class="quiet" data-beasts>‹ BEASTS</button><button data-feats>FEATS ›</button></div>`;
  const p = D.CODEX.find((x) => x.id === state.codexPage) ?? D.CODEX[0],
    tally = game.s.tutorial.tally,
    [a, b] = sk.page(p);
  const entry = (e: string) => {
    const found = (tally[p.prefix + e] ?? 0) > 0,
      mob = p.prefix === 'kill:' && D.MOBS[e],
      name = mob
        ? D.MOBS[e].name
        : (D.BIOMES.find((x) => x.id === e)?.name ??
          D.DUNGEONS.find((d) => d.def.id === e)?.def.name ??
          D.realmById(e)?.name ??
          (D.ITEMS[e] ? pretty(e) : e[0].toUpperCase() + e.slice(1)));
    const pic = mob
      ? `<span class="icon-slot portrait"><img src="${found ? mobPortrait(e) : ''}" alt="" ${found ? '' : 'hidden'}></span>`
      : D.ITEMS[e]
        ? icon(e)
        : '<span class="icon-slot"></span>';
    const traits = mob && found ? D.resistText(e) : '';
    return `<div class="book-row"><div class="with-icon">${pic}<div><strong>${found ? name : '???'}</strong><small>${found ? (traits ? traits[0].toUpperCase() + traits.slice(1) : 'Recorded') : 'Not yet'}</small></div></div></div>`;
  };
  const counted = p.count
    ? Object.keys(tally)
        .filter((k) => k.startsWith(p.prefix) && tally[k] > 0)
        .map((k) => k.slice(p.prefix.length))
    : [];
  right.innerHTML = `<h2>${p.name}</h2><p class="lede">${a} of ${b} · ${a >= b ? 'complete: ' : 'when complete: '}${p.bonusText}.</p><div class="book-list">${
    p.count
      ? counted.map(entry).join('') + (a < b ? `<p class="muted">${b - a} more to find.</p>` : '')
      : p.entries.map(entry).join('')
  }</div>`;
  left.querySelectorAll<HTMLButtonElement>('[data-page]').forEach(
    (btn) =>
      (btn.onclick = () => {
        state.codexPage = btn.dataset.page ?? 'wilds';
        renderJournal();
      }),
  );
  left.querySelector<HTMLButtonElement>('[data-beasts]')!.onclick = () => {
    state.beastsView = 'beasts';
    renderJournal();
  };
  left.querySelector<HTMLButtonElement>('[data-feats]')!.onclick = () => {
    state.beastsView = 'feats';
    renderJournal();
  };
}
function renderFeats(left: HTMLElement, right: HTMLElement) {
  const feats = game.feats,
    c = feats.ctx(),
    done = feats.earned();
  const groups = [...new Set(D.FEATS.map((f) => f.group))];
  left.innerHTML = `<h2>Feats</h2><p class="lede">${done.length} of ${D.FEATS.length} deeds done. Each leaves a small gift for good, and a title you may wear.</p>${groups
    .map(
      (g) =>
        `<h3>${g}</h3><div class="book-list">${D.FEATS.filter((f) => f.group === g)
          .map((f) => {
            const [have, need] = f.measure(c),
              got = done.includes(f.id);
            return `<div class="book-row ${got ? '' : 'muted-row'}"><div><strong>${got ? '✓ ' : ''}${f.name}</strong><small>${f.text} · ${f.perkText}</small></div><span class="qty">${got ? 'DONE' : `${Math.floor(have)}/${need}`}</span></div>`;
          })
          .join('')}</div>`,
    )
    .join(
      '',
    )}<div class="book-actions"><button class="quiet" data-codex>‹ THE CODEX</button></div>`;
  const worn = feats.title();
  right.innerHTML = `<h2>Titles</h2><p class="lede">${worn ? `You are known as <strong>${worn}</strong>.` : 'You wear no title yet.'}</p><div class="book-list">${
    done
      .map((id) => D.featById(id))
      .map(
        (f) =>
          f &&
          `<div class="book-row ${feats.title() === f.title ? 'selected' : ''}"><div><strong>${f.title}</strong><small>${f.name}</small></div><button data-wear="${f.id}">WEAR</button></div>`,
      )
      .join('') || '<p>Do something worth remembering.</p>'
  }</div>${worn ? '<div class="book-actions"><button class="quiet" data-unwear>WEAR NO TITLE</button></div>' : ''}`;
  left.querySelector<HTMLButtonElement>('[data-codex]')!.onclick = () => {
    state.beastsView = 'codex';
    renderJournal();
  };
  right.querySelectorAll<HTMLButtonElement>('[data-wear]').forEach(
    (b) =>
      (b.onclick = () => {
        feats.wear(b.dataset.wear ?? null);
        renderJournal();
        updateUI(true);
      }),
  );
  const off = right.querySelector<HTMLButtonElement>('[data-unwear]');
  if (off)
    off.onclick = () => {
      feats.wear(null);
      renderJournal();
      updateUI(true);
    };
}
function renderArmourForge(left: HTMLElement, right: HTMLElement) {
  const forge = game.armourForge,
    pieces = [...new Set(game.s.inventory.map((e) => e.id))].filter((id) => D.ARMOR[id]);
  if (!pieces.includes(state.armourSel)) state.armourSel = pieces[0] ?? '';
  left.innerHTML = `<h2>The Armoury</h2><div class="farm-choice"><button class="tiny-button" data-mode="weapons">WEAPONS</button><button class="tiny-button active">ARMOUR</button></div><p class="lede">Armour has its own line: up to +${D.ARMOR_MAX_LEVEL} at the anvil (+1 defense each), a gem in each socket (two in a chestplate), and one infusion per piece.</p><div class="book-list">${
    pieces
      .map((id) => {
        const m = forge.mods(id);
        return `<div class="book-row ${state.armourSel === id ? 'selected' : ''}"><div class="with-icon">${icon(id)}<div><strong>${pretty(id)}${m.lvl ? ' +' + m.lvl : ''}</strong><small>${D.ARMOR[id].defense + m.lvl} defense${m.gems.length ? ' · ' + m.gems.map(pretty).join(', ') : ''}${m.inf ? ' · ' + m.inf : ''}${worn(id) ? ' · worn' : ''}</small></div></div><button data-piece="${id}">WORK</button></div>`;
      })
      .join('') || '<p>No armour in the pack.</p>'
  }</div><div class="book-actions"><button class="quiet" data-gear>‹ GEAR</button></div>`;
  const id = state.armourSel;
  if (id) {
    const m = forge.mods(id),
      gems = Object.keys(D.ARMOR_GEMS).filter((g) => game.count(g) || game.dev.god),
      infs = D.INFUSIONS.filter(
        (i) => D.ARMOR_INFUSIONS[i.id] && (game.count(i.item) || game.dev.god),
      );
    const cost = Object.entries(forge.cost(id))
      .map(([k, n]) => `${n} ${pretty(k).toLowerCase()}`)
      .join(', ');
    right.innerHTML = `<h2>${pretty(id)}${m.lvl ? ' +' + m.lvl : ''}</h2><p class="lede">${D.ARMOR[id].slot} · ${D.ARMOR[id].defense + m.lvl} defense.</p><p>Sockets: <strong>${m.gems.map((g) => `${pretty(g)} (${D.ARMOR_GEMS[g].text})`).join(', ') || '—'}</strong> (${m.gems.length}/${forge.sockets(id)})<br>Infusion: <strong>${m.inf ? `${m.inf} · ${D.ARMOR_INFUSIONS[m.inf].text}` : 'none'}</strong></p>${
      m.lvl < D.ARMOR_MAX_LEVEL
        ? `<div class="book-actions"><button data-armup>STRENGTHEN TO +${m.lvl + 1}</button></div><p class="muted">${cost} at a ${pretty(forge.station(id)).toLowerCase()}.</p>`
        : ''
    }${gems.length && m.gems.length < forge.sockets(id) ? `<h3>Socket a gem</h3><div class="farm-choice">${gems.map((g) => `<button class="tiny-button" data-armgem="${g}" title="${D.ARMOR_GEMS[g].text}">${pretty(g).toUpperCase()}</button>`).join('')}</div>` : ''}${infs.length ? `<h3>Infuse</h3><div class="farm-choice">${infs.map((i) => `<button class="tiny-button" data-arminf="${i.id}" title="${D.ARMOR_INFUSIONS[i.id].text}">${i.name.toUpperCase()}</button>`).join('')}</div>` : ''}`;
  } else right.innerHTML = '<h2>Armour</h2><p>Carry a piece of armour to work it.</p>';
  const act = (r: { ok: boolean; reason?: string }) => {
    if (!r.ok) message(r.reason);
    renderJournal();
    updateUI(true);
  };
  left.querySelectorAll<HTMLButtonElement>('[data-piece]').forEach(
    (b) =>
      (b.onclick = () => {
        state.armourSel = b.dataset.piece ?? '';
        renderJournal();
      }),
  );
  left.querySelector<HTMLButtonElement>('[data-mode]')!.onclick = () => {
    state.armouryMode = 'weapons';
    state.armourySel = game.s.player.weapon !== 'fists' ? game.s.player.weapon : 'iron_sword';
    renderJournal();
  };
  left.querySelector<HTMLButtonElement>('[data-gear]')!.onclick = () => {
    state.gearView = 'gear';
    renderJournal();
  };
  right
    .querySelector<HTMLButtonElement>('[data-armup]')
    ?.addEventListener('click', () => act(forge.upgrade(id)));
  right
    .querySelectorAll<HTMLButtonElement>('[data-armgem]')
    .forEach((b) => (b.onclick = () => act(forge.socket(id, b.dataset.armgem ?? ''))));
  right
    .querySelectorAll<HTMLButtonElement>('[data-arminf]')
    .forEach((b) => (b.onclick = () => act(forge.infuse(id, b.dataset.arminf ?? ''))));
}
/** Side by side against the weapon in hand: damage per second, reach, and critical chance. */
function compareText(id: string) {
  const other = game.s.player.weapon;
  if (!other || other === id || !D.WEAPONS[other]) return '';
  const a = game.armoury.stats(id),
    b = game.armoury.stats(other);
  const dps = (w: typeof a, wid: string) => w.damage / ((D.RANGED[wid]?.delay ?? 0.45) * w.pace);
  const row = (label: string, x: number, y: number, fmtN: (n: number) => string) => {
    const d = x - y,
      arrow = Math.abs(d) < 1e-6 ? '=' : d > 0 ? '▲' : '▼';
    return `<div class="book-row"><span>${label}</span><span class="qty ${d > 0 ? 'better' : d < 0 ? 'worse' : ''}">${fmtN(x)} ${arrow} ${fmtN(y)}</span></div>`;
  };
  return `<h3>Against ${pretty(other).toLowerCase()} in hand</h3><div class="book-list compare">${row('Damage each second', dps(a, id), dps(b, other), (n) => String(Math.round(n)))}${row('Damage a blow', a.damage, b.damage, (n) => String(Math.round(n)))}${D.RANGED[id] || D.RANGED[other] ? '' : row('Reach', a.reach, b.reach, (n) => String(Math.round(n)))}${row('Critical chance', a.crit, b.crit, (n) => Math.round(n * 100) + '%')}</div>`;
}
function renderArmoury(left: HTMLElement, right: HTMLElement) {
  if (state.armouryMode === 'armour') return renderArmourForge(left, right);
  const arm = game.armoury,
    owned = (id: string) => game.count(id) > 0;
  const cell = (id: string, tier: number) => {
    const has = owned(id),
      known = arm.known(id),
      craftable = !!D.RECIPES.find((r) => r.id === id);
    return `<button class="armoury-cell ${has ? 'owned' : known ? 'known' : ''} ${state.armourySel === id ? 'active' : ''}" data-weapon="${id}" title="${pretty(id)} · tier ${tier}${craftable ? '' : ' · found, not made'}"><img src="${iconURL(id)}" alt=""></button>`;
  };
  const sig = Object.keys(D.SIGNATURE).filter((id) => owned(id) || arm.known(id));
  left.innerHTML = `<h2>The Armoury</h2><div class="farm-choice"><button class="tiny-button active">WEAPONS</button><button class="tiny-button" data-mode="armour">ARMOUR</button></div><p class="lede">Ten families by twelve tiers; each weapon climbs to +10.</p><div class="armoury-grid"><span></span>${D.FAMILIES.map((f) => `<span class="armoury-head" title="${f.name}: ${f.text}">${f.name.slice(0, 4).toUpperCase()}</span>`).join('')}${D.TIERS.map(
    (t) =>
      `<span class="armoury-tier" title="${t.name}">${t.tier}</span>${D.FAMILIES.map((f) => {
        const w = D.GRID.find((g) => g.tier === t.tier && g.family === f.id)!;
        return cell(w.id, t.tier);
      }).join('')}`,
  ).join(
    '',
  )}</div>${sig.length ? `<h3>Signature weapons</h3><div class="armoury-sig">${sig.map((id) => cell(id, D.SIGNATURE[id][1])).join('')}</div>` : ''}<div class="book-actions"><button class="quiet" data-gear>‹ GEAR</button></div>`;
  const id = state.armourySel,
    [family, tier] = arm.classOf(id),
    fam = D.familyById(family)!,
    e = arm.entry(id),
    st = arm.stats(id),
    q = D.QUALITIES[e.q],
    has = owned(id),
    recipe = D.RECIPES.find((r) => r.id === id),
    ranged = D.RANGED[id],
    stage = arm.pendingEvolution(id),
    evos = D.EVOLUTIONS[family];
  const costText = (cost: Record<string, number>) =>
    Object.entries(cost)
      .map(([k, n]) => `${n} ${pretty(k).toLowerCase()}`)
      .join(', ');
  const infusions = D.INFUSIONS.filter((i) => game.count(i.item) > 0 || game.dev.god),
    gems = Object.keys(D.GEMS).filter((g) => game.count(g) > 0 || game.dev.god);
  right.innerHTML = `<h2 style="color:${has ? q.color : 'inherit'}">${has || arm.known(id) ? arm.title(id) : pretty(id)}</h2><p class="lede">${fam.name} · tier ${tier} (${D.tierOf(tier).name}) · ${fam.text}.</p><p>Damage <strong>${Math.round(st.damage)}</strong>${ranged ? ` · ${ranged.kind === 'bow' ? 'shots' : 'mana ' + Math.max(1, Math.round((ranged.mana ?? 5) * st.mana))} every ${(ranged.delay * st.pace).toFixed(2)}s` : ` · reach ${Math.round(st.reach)} · swing ×${st.pace.toFixed(2)}`} · crit ${Math.round(st.crit * 100)}%${st.defense ? ` · +${st.defense} defense` : ''}</p>${
    (has ? compareText(id) : '') +
    (has
      ? `<div class="book-actions"><button data-ready ${game.s.player.weapon === id ? 'disabled' : ''}>${game.s.player.weapon === id ? 'IN HAND' : 'READY IT'}</button></div><p>Quality <strong style="color:${q.color}">${q.name}</strong> (×${q.mult}) · level <strong>+${e.lvl}</strong> / ${D.MAX_LEVEL} · infusion <strong>${e.inf ? D.infusionById(e.inf)?.name : 'none'}</strong> · sockets <strong>${e.gems.map((g) => D.GEMS[g].name).join(', ') || '—'}</strong> (${e.gems.length}/${q.sockets})</p>${
          stage >= 0
            ? `<h3>Evolve · choose a path</h3><div class="book-list">${evos[stage === 1 ? 1 : 0]
                .map(
                  (ev, i) =>
                    `<div class="book-row"><div><strong>${ev.name}</strong><small>${ev.text}</small></div><button data-evolve="${i}">CHOOSE</button></div>`,
                )
                .join('')}</div>`
            : e.lvl < D.MAX_LEVEL
              ? `${game.durability.wear(id) >= 1 ? `<p class="muted">${Math.round(game.durability.wear(id))}% worn${game.durability.broken(id) ? ' (blunted: half damage)' : ''} · mend at a ${pretty(game.durability.station(id)).toLowerCase()}: ${costText(game.durability.cost(id))}</p><div class="book-actions"><button data-mend>MEND</button></div>` : ''}<div class="book-actions"><button data-upgrade>UPGRADE TO +${e.lvl + 1}</button><button class="quiet" data-reforge>REFORGE</button>${game.count('fracture_shard') ? '<button class="quiet" data-shard>REFORGE · SHARD</button>' : ''}</div><p class="muted">+${e.lvl + 1}: ${costText(D.upgradeCost(tier, e.lvl))} at a ${pretty(D.anvilFor(tier)).toLowerCase()} · reforge rerolls quality: ${costText(D.reforgeCost(tier))}.</p>`
              : `<div class="book-actions"><button class="quiet" data-reforge>REFORGE</button>${game.count('fracture_shard') ? '<button class="quiet" data-shard>REFORGE · SHARD</button>' : ''}</div>`
        }${
          e.evo.length
            ? `<p class="muted">Evolved: ${e.evo.map((x) => evos.flat().find((v) => v.id === x)?.name).join(' → ')}.</p>`
            : `<p class="muted">At +5: ${evos[0].map((v) => v.name).join(' or ')}. At +10: ${evos[1].map((v) => v.name).join(' or ')}.</p>`
        }${infusions.length ? `<h3>Infuse</h3><div class="farm-choice">${infusions.map((i) => `<button class="tiny-button" data-infuse="${i.id}" title="${i.text}">${i.name.toUpperCase()}</button>`).join('')}</div>` : ''}${gems.length && e.gems.length < q.sockets ? `<h3>Socket a gem</h3><div class="farm-choice">${gems.map((g) => `<button class="tiny-button" data-gem="${g}" title="${D.GEMS[g].text}">${D.GEMS[g].name.toUpperCase()}</button>`).join('')}</div>` : ''}`
      : `<div class="note-block">${recipe ? `Made ${recipe.station ? 'at a ' + pretty(recipe.station).toLowerCase() : 'by hand'} from ${costText(recipe.cost)}.` : 'Not made by any hand: it must be found.'} Its quality is rolled when it first comes to you.</div>`)
  }`;
  left.querySelector<HTMLButtonElement>('[data-mode]')!.onclick = () => {
    state.armouryMode = 'armour';
    renderJournal();
  };
  left.querySelectorAll<HTMLButtonElement>('[data-weapon]').forEach(
    (b) =>
      (b.onclick = () => {
        state.armourySel = b.dataset.weapon ?? id;
        renderJournal();
      }),
  );
  left.querySelector<HTMLButtonElement>('[data-gear]')!.onclick = () => {
    state.gearView = 'gear';
    renderJournal();
  };
  const act = (r: { ok: boolean; reason?: string }) => {
    if (!r.ok) message(r.reason);
    renderJournal();
    updateUI(true);
  };
  const on = (sel: string, fn: (b: HTMLButtonElement) => { ok: boolean; reason?: string }) =>
    right.querySelectorAll<HTMLButtonElement>(sel).forEach((b) => (b.onclick = () => act(fn(b))));
  on('[data-upgrade]', () => arm.upgrade(id));
  on('[data-reforge]', () => arm.reforge(id));
  on('[data-shard]', () => arm.reforge(id, true));
  on('[data-mend]', () => game.durability.repair(id));
  on('[data-evolve]', (b) => arm.evolve(id, Number(b.dataset.evolve) as 0 | 1));
  on('[data-infuse]', (b) => arm.infuse(id, b.dataset.infuse ?? ''));
  on('[data-gem]', (b) => arm.socket(id, b.dataset.gem ?? ''));
  on('[data-ready]', () => {
    game.s.player.weapon = id;
    sound('equip');
    return { ok: true };
  });
}
/** What protects against a realm's hazard: its armour set and any charm that carries the ward. */
function wardText(ward: string) {
  const sets = D.ARMOR_SETS.filter((x) => x.bonus === ward).map((x) => `the ${x.name} set`),
    charms = Object.entries(D.ACCESSORIES)
      .filter(([, a]) => a.effects.includes(ward))
      .map(([id]) => `the ${pretty(id)}`);
  const all = [...sets, ...charms];
  return all.length ? ` <em>Ward: ${all.join(' or ')}.</em>` : '';
}
function renderAtlas(left: HTMLElement, right: HTMLElement) {
  const pocket = game.pocket,
    open = game.s.pocket,
    stone = pocket.waystoneNear();
  const tier = (t: number) => D.tierName(t);
  left.innerHTML = `<h2>The Atlas</h2><p class="lede">Each realm lies behind its own key. Turn one in a Waystone and the realm is built anew: its tier sets how hard it bites and how much it gives.</p>${
    open
      ? `<div class="note-block">Open now: <strong>${D.templateOf(open)?.name}</strong> · Tier ${tier(open.tier)}${open.mods.length ? ' · ' + open.mods.map((m) => D.modById(m)?.name).join(', ') : ''}${open.cleared ? ' · its master is slain' : ''}.</div>`
      : ''
  }<h3>Realms</h3><div class="book-list">${D.REALMS.map((r) => {
    const rec = pocket.record(r.id);
    return `<div class="book-row ${state.atlasRealm === r.id ? 'selected' : ''}"><div class="with-icon">${icon(r.key)}<div><strong>${r.name}</strong><small>Band ${tier(r.band)} · ${rec.visits ? 'best tier ' + (rec.best ? tier(rec.best) : '—') : 'unvisited'}${rec.relic ? ' · relic found' : ''}</small></div></div><div><span class="qty">×${game.count(r.key)}</span><button data-realm="${r.id}">VIEW</button></div></div>`;
  }).join(
    '',
  )}</div><div class="book-actions"><button class="quiet" data-view-rift>THE RIFT GATE ›</button></div>`;
  const r = D.realmById(state.atlasRealm) ?? D.REALMS[0],
    rec = pocket.record(r.id),
    max = pocket.maxTier(r.id);
  state.atlasTier = Math.min(Math.max(1, state.atlasTier), max);
  const keys = game.count(r.key),
    canOpen = (!!stone || game.dev.god) && (keys > 0 || game.dev.god);
  right.innerHTML = `<h2>${r.name}</h2><p class="lede">${r.note}</p><p>Hazard: <strong>${r.hazard.name}</strong> · ${r.hazard.text}${wardText(r.hazard.ward)}</p><p>Great foe: <strong>${D.MOBS[r.boss]?.name}</strong> · relic: <strong>${pretty(r.relic)}</strong>${rec.relic ? ' (found)' : ''}<br>Signature: <strong>${pretty(r.material)}</strong> · Temperature ${r.temp}°C</p><h3>Tier</h3><div class="farm-choice">${Array.from(
    { length: 5 },
    (_, i) => i + Math.max(1, Math.min(max, state.atlasTier) - 2),
  )
    .map(
      (t) =>
        `<button class="tiny-button ${t === state.atlasTier ? 'active' : ''}" data-tier="${t}" ${t > max ? 'disabled' : ''}>${tier(t)}</button>`,
    )
    .join(
      '',
    )}</div><p class="muted">Monsters ×${D.TIER_SCALE.hp(state.atlasTier).toFixed(2)} health, ×${D.TIER_SCALE.damage(state.atlasTier).toFixed(2)} harm · loot ×${D.TIER_SCALE.loot(state.atlasTier).toFixed(2)} · ${state.atlasTier - 1} modifier${state.atlasTier === 2 ? '' : 's'}.</p><div class="book-actions"><button data-open-realm ${canOpen ? '' : 'disabled'}>OPEN · 1 KEY</button>${open ? `<button data-resume ${stone || game.dev.god ? '' : 'disabled'}>RETURN TO ${D.realmById(open.realm)?.name.toUpperCase()}</button>` : ''}</div><div class="note-block">${stone ? 'The Waystone hums beside you.' : 'Stand at a Waystone to open a realm. Build one at a workbench: stone, iron ingots, and crystal.'} ${
    r.id === 'fractured'
      ? 'Keys: four fracture shards at a Waystone. Shards fall from the great foes of Band V, and from the Fractured Realms themselves.'
      : `Keys: three ${pretty(r.fragment).toLowerCase()}s at a Waystone. Fragments are made at a ${D.RECIPES.find((x) => x.id === r.fragment)?.station ?? 'workbench'}${r.band > 1 ? ` from the spoils of Band ${D.tierName(r.band - 1)} realms` : ''}, or found in the realms.`
  }</div>${
    open?.realm === r.id && open.mods.length
      ? `<h3>This expedition</h3><div class="book-list">${open.mods
          .map((m) => D.modById(m))
          .map(
            (m) =>
              `<div class="book-row"><div><strong>${m?.name}</strong><small>${m?.text}</small></div><span class="qty">${m?.kind === 'boon' ? 'BOON' : 'BANE'}</span></div>`,
          )
          .join('')}</div>`
      : ''
  }`;
  left.querySelectorAll<HTMLButtonElement>('[data-realm]').forEach(
    (b) =>
      (b.onclick = () => {
        state.atlasRealm = b.dataset.realm ?? 'orchard';
        renderJournal();
      }),
  );
  left.querySelector<HTMLButtonElement>('[data-view-rift]')!.onclick = () => {
    state.atlasView = 'rift';
    renderJournal();
  };
  right.querySelectorAll<HTMLButtonElement>('[data-tier]').forEach(
    (b) =>
      (b.onclick = () => {
        state.atlasTier = Number(b.dataset.tier);
        renderJournal();
      }),
  );
  const go = (r2: { ok: boolean; reason?: string }) => {
    if (!r2.ok) message(r2.reason);
    else toggleJournal(false);
    updateUI(true);
  };
  const openBtn = right.querySelector<HTMLButtonElement>('[data-open-realm]');
  if (openBtn) openBtn.onclick = () => go(pocket.open(r.id, state.atlasTier));
  const resume = right.querySelector<HTMLButtonElement>('[data-resume]');
  if (resume) resume.onclick = () => go(pocket.resume());
}
/** Redraws the quick slots when their contents change. */
function renderHotbar() {
  const s = game.s,
    sig =
      s.hotbar.map((id) => (id ? id + ':' + game.count(id) : '-')).join(',') + '|' + s.hotbarIndex;
  if (sig === state.hotbarSig) return;
  state.hotbarSig = sig;
  $('hotbar').innerHTML = s.hotbar
    .map((id, i) => {
      const n = id ? game.count(id) : 0;
      return `<div class="slot ${i === s.hotbarIndex ? 'active' : ''}" data-slot="${i}" title="${id ? pretty(id) : ''}"><b>${(i + 1) % 10}</b>${id ? `<img src="${iconURL(id)}" alt="">` : ''}${n > 1 ? `<small>${n}</small>` : ''}</div>`;
    })
    .join('');
  $('hotbar')
    .querySelectorAll<HTMLElement>('[data-slot]')
    .forEach((el) => (el.onclick = () => game.equipment.select(Number(el.dataset.slot))));
  const held = game.equipment.held();
  $('hotbar-name').textContent = held ? pretty(held) : '';
}
/** Dresses the boss bar in the colours, pattern, and lettering of the foe it belongs to. */
function styleBossHud(key: string, face?: number) {
  const hud = $('boss-hud'),
    st = BOSS_STYLES[key] ?? DEFAULT_BOSS_STYLE,
    fill = key === 'four_faced_warden' && face !== undefined ? WARDEN_FACES[face] : st.fill,
    sig = key + ':' + fill.join();
  if (hud.dataset.sig === sig) return;
  hud.dataset.sig = sig;
  hud.dataset.pattern = st.pattern;
  hud.dataset.font = st.font;
  hud.dataset.shape = st.shape;
  hud.style.setProperty('--boss-a', fill[0]);
  hud.style.setProperty('--boss-b', fill[1]);
  hud.style.setProperty('--boss-track', st.track);
  hud.style.setProperty('--boss-frame', st.frame);
  hud.style.setProperty('--boss-name', st.name);
  $('boss-glyph-l').textContent = st.glyphs[0];
  $('boss-glyph-r').textContent = st.glyphs[1];
  $('boss-epithet').textContent = st.epithet;
}
function updateUI(force = false) {
  if (!state.playing) return;
  const now = performance.now();
  if (!force && now - state.lastUI < UI_RULES.hudRefreshMs) return;
  state.lastUI = now;
  const v = game.s.vitals;
  // The fever-dream lies: the record shows numbers that drift from the truth.
  const dream = game.pocket.dreaming();
  (['health', 'hydration', 'calories', 'stamina'] as (keyof Vitals)[]).forEach((id, i) => {
    const most = id === 'health' ? game.maxHealth() : 100,
      shown = dream
        ? clamp(v[id] + Math.sin(now / 700 + i * 2.3) * 35 + Math.sin(now / 230 + i) * 8, 0, most)
        : v[id];
    $(id + '-bar').style.width = clamp((shown / most) * 100, 0, 100) + '%';
    $(id + '-value').textContent =
      dream && Math.sin(now / 400 + i) > 0.6 ? '??' : String(Math.round(shown));
  });
  $('hud').classList.toggle('dreaming', dream);
  const air = game.pocket.air();
  $('air-stat').classList.toggle('hidden', !air);
  if (air) {
    $('air-bar').style.width = clamp((air[0] / air[1]) * 100, 0, 100) + '%';
    $('air-value').textContent = String(Math.ceil(air[0]));
  }
  const maxMana = game.equipment.maxMana();
  $('mana-bar').style.width = clamp((game.s.mana / maxMana) * 100, 0, 100) + '%';
  $('mana-value').textContent = String(Math.round(game.s.mana));
  $('defense-value').textContent = String(game.equipment.defense());
  const [into, need] = game.skills.progress();
  $('renown-value').textContent = String(game.skills.level());
  const title = game.feats.title();
  $('renown-points').textContent =
    game.skills.points() > 0
      ? `· ${game.skills.points()} TO SPEND`
      : title
        ? `· ${title.toUpperCase()}`
        : '';
  $('renown-bar').style.width = clamp((into / need) * 100, 0, 100) + '%';
  $('buffs').innerHTML = Object.entries(game.s.buffs)
    .map(
      ([id, left]) =>
        `<span style="color:${D.BUFFS[id]?.color ?? '#fff'}">${(D.BUFFS[id]?.name ?? id).toUpperCase()} ${Math.ceil(left)}s</span>`,
    )
    .join(' ');
  renderHotbar();
  const layer = game.layer(),
    place = game.realms.placeName();
  $('biome-name').textContent = place
    ? place.toUpperCase()
    : layer.id === 'surface'
      ? game.biome().name.toUpperCase()
      : layer.id === 'upper_mines'
        ? game.biome().name.toUpperCase() + ' · ' + layer.name.toUpperCase()
        : layer.name.toUpperCase();
  $('world-time').textContent = timeText();
  $('condition-line').textContent = game.vitalReasons()[0];
  // A strip of ailments showing, each with its stage.
  const chips = game.ailments
    .showing()
    .map(
      (a) =>
        `<span class="ail stage-${a.stage}" title="${D.DISEASES[a.id].name}: ${D.DISEASES[a.id].symptoms[a.stage - 1]}">${D.DISEASES[a.id].name.toUpperCase()} ${'●'.repeat(a.stage)}${'○'.repeat(3 - a.stage)}</span>`,
    )
    .join('');
  const off = game.ailments.list().some((a) => a.stage === 0)
    ? '<span class="ail off">FEELING OFF</span>'
    : '';
  $('ailments').innerHTML = chips + off;
  $('weapon-name').textContent =
    game.s.player.weapon === 'fists' ? pretty('fists') : game.armoury.title(game.s.player.weapon);
  const step = D.TUTORIAL[game.s.tutorial.step] || D.CHAPTERS[game.s.chapter];
  $('objective-text').textContent = step ? step[0] : 'The final folio is complete.';
  $('objective-progress').textContent = step
    ? `${Math.min(step[2], game.s.tutorial.tally[step[1]] || 0)} / ${step[2]}`
    : 'EXPEDITION COMPLETE';
  const near = game.nearestInteractable();
  let prompt = '';
  const held = game.equipment.held();
  if (game.s.placing) prompt = `<b>CLICK</b> Place ${pretty(game.s.placing)} · Esc cancels`;
  else if (
    near &&
    near.type === 'structure' &&
    ['dungeon_chest', 'boss_altar', 'rift_gate', 'portal', 'waystone', 'shrine'].includes(
      near.object.type,
    )
  )
    prompt = `<b>E</b> ${
      near.object.type === 'dungeon_chest'
        ? 'Open the chest'
        : near.object.type === 'boss_altar'
          ? game.bosses.active()
            ? 'The altar burns'
            : 'Call ' + D.MOBS[near.object.kind ?? '']?.name
          : near.object.type === 'portal'
            ? game.pocket.here(near.object.x)
              ? 'Return to your Waystone'
              : 'Return home through the portal'
            : near.object.type === 'waystone'
              ? 'Open the Atlas'
              : near.object.type === 'shrine'
                ? near.object.crop === 'spent'
                  ? 'The shrine is quiet'
                  : 'Pray at the shrine'
                : 'Open the Rift'
    }`;
  else if (near && near.type === 'settler') {
    const who = D.settlerById(near.object.settler ?? '');
    prompt = `<b>E</b> Talk to ${who ? who.name + ' ' + who.title : 'the settler'}`;
  } else if (near) {
    const action =
      near.type === 'node'
        ? near.object.kind === 'water'
          ? 'Collect wild water'
          : D.nodeForm(near.object.kind) === 'tree'
            ? `Chop tree (${near.object.hp} more)`
            : D.nodeForm(near.object.kind) === 'mineral'
              ? `Mine ${pretty(near.object.kind).toLowerCase()} (${near.object.hp} more)`
              : 'Gather ' + pretty(near.object.kind)
        : near.type === 'cache'
          ? 'Open field cache'
          : near.object.type === 'effergy'
            ? 'Open Beasts folio'
            : near.object.type === 'farm_plot'
              ? 'Tend farm plot'
              : near.object.type === 'bedroll'
                ? 'Rest'
                : near.object.type === 'bed'
                  ? 'Sleep'
                  : near.object.type === 'door'
                    ? near.object.crop === 'open'
                      ? 'Close the door'
                      : 'Open the door'
                    : near.object.type === 'chair' || near.object.type === 'table'
                      ? 'Check the room'
                      : D.STORAGE[near.object.type]
                        ? 'Open the ' + D.STORAGE[near.object.type].name.toLowerCase()
                        : near.object.type === 'campfire'
                          ? 'Add wood'
                          : 'Use ' + pretty(near.object.type);
    prompt = `<b>E</b> ${action}`;
  } else
    prompt = held
      ? `<b>CLICK</b> ${game.hands.describe(cursorWorld())}`
      : '<b>E</b> Explore and gather';
  $('interaction-prompt').innerHTML = prompt;
  const boss =
    game.s.animals.find((a) => a.id === game.s.altar.activeBoss && !a.deadUntil) ??
    game.bosses.active();
  $('boss-hud').classList.toggle('hidden', !boss);
  $('hud').classList.toggle('boss-fight', !!boss);
  if (boss) {
    const key = boss.type === 'boss' ? 'direwolf' + game.s.altar.level : boss.type;
    styleBossHud(key, boss.timers?.face);
    $('boss-name').textContent = (
      boss.type === 'boss' ? D.BOSSES[game.s.altar.level - 1].name : D.MOBS[boss.type].name
    ).toUpperCase();
    $('boss-bar').style.width = clamp((boss.hp / boss.maxHp) * 100, 0, 100) + '%';
    $('boss-value').textContent = `${Math.ceil(boss.hp)} / ${boss.maxHp}`;
    $('boss-hud').classList.toggle('enraged', boss.hp < boss.maxHp / 2);
  }
  // A banner names a realm for a few seconds after you step into it.
  const b = game.pocket.banner,
    showBanner = !!b && game.s.elapsed - b.at < 5 && game.pocket.here();
  $('realm-banner').classList.toggle('hidden', !showBanner);
  if (showBanner && $('realm-banner').dataset.at !== String(b.at)) {
    $('realm-banner').dataset.at = String(b.at);
    $('realm-banner').innerHTML =
      `<small>TIER ${D.tierName(b.tier)}</small><strong>${b.name.toUpperCase()}</strong>${b.mods.length ? `<span>${b.mods.map((m) => D.modById(m)?.name).join(' · ')}</span>` : ''}<em>${D.realmById(game.s.pocket?.realm ?? '')?.hazard.name ?? ''}</em>`;
  }
  const msg = game.messages[0];
  if (msg && msg !== state.seenMessage) {
    state.seenMessage = msg;
    $('toast').textContent = msg.message;
    $('toast').classList.add('visible');
    setTimeout(() => {
      if (state.seenMessage === msg) $('toast').classList.remove('visible');
    }, 3000);
    if (msg.tone === 'victory') sound('victory');
  }
  if (game.s.dead) {
    $('death').classList.remove('hidden');
    state.journal = false;
    $('journal').classList.add('hidden');
  }
}
function camera() {
  const p = game.s.player;
  const [lo, hi] = D.regionBounds(p.x);
  state.camera.x = clamp(p.x - view.worldW / 2, lo, Math.max(lo, hi - view.worldW));
  state.camera.y = clamp(p.y - 24 - view.worldH / 2, 0, Math.max(0, D.WORLD_H - view.worldH));
}
/** How loud each ambient bed should be for where the player stands. */
function ambienceLevels(): AmbienceLevels {
  const p = game.s.player,
    layer = game.layer().id,
    biome = game.biome().id,
    surface = layer === 'surface',
    weather = game.s.weather,
    wet = weather === 'rain' ? 0.7 : weather === 'storm' ? 1 : 0,
    day = !game.isNight();
  let fire = 0;
  for (const st of game.s.structures)
    if (st.type === 'campfire' && st.fuel > 0)
      fire = Math.max(fire, 1 - Math.hypot(st.x - p.x, st.y - p.y) / 420);
  let lava = 0;
  if (layer.endsWith('hell')) {
    let nearest = Infinity;
    for (let dx = -14; dx <= 14; dx += 2)
      for (let dy = -8; dy <= 8; dy += 2) {
        const x = p.x + dx * D.TILE,
          y = p.y + dy * D.TILE;
        if (D.lavaAt(x, y)) nearest = Math.min(nearest, Math.hypot(x - p.x, y - p.y));
      }
    lava = clamp(1 - nearest / 520, 0, 1);
  }
  return {
    rain: surface ? wet * (game.sheltered() ? 0.5 : 1) : 0,
    wind: surface
      ? weather === 'storm'
        ? 1
        : ['tundra', 'alpine', 'taiga'].includes(biome)
          ? 0.6
          : 0.12
      : 0,
    fire,
    lava,
    cave: layer.endsWith('mines') ? 1 : layer === 'upper_hell' ? 0.3 : 0,
    hell: layer === 'upper_hell' ? 0.55 : layer === 'lower_hell' ? 1 : 0,
    birds:
      surface && day && !wet && ['meadow', 'forest', 'coast', 'marsh', 'taiga'].includes(biome)
        ? 0.8
        : 0,
    surf: surface && biome === 'coast' ? clamp(1 - p.x / 1600, 0, 1) : 0,
    night: surface && !day && !wet ? 0.8 : 0,
  };
}
/** Thunder rolls now and then while a storm is overhead. */
function maybeThunder(now: number) {
  if (game.s.weather !== 'storm' || game.layer().id !== 'surface' || now < state.nextThunder)
    return;
  state.nextThunder = now + 7000 + Math.random() * 14000;
  const p = game.s.player;
  Audio.effect('thunder', { x: p.x + (Math.random() - 0.5) * 900, y: p.y - 150 }, 1.6);
}
function drawWorld(now = performance.now()) {
  camera();
  if (!state.playing) {
    state.camera.x = clamp(
      3600 + Math.sin(performance.now() / 12000) * 380 - view.worldW * 0.2,
      0,
      D.WORLD_W - view.worldW,
    );
    state.camera.y = clamp(
      D.surfaceAt(UI_RULES.menuFocalX) - view.worldH * 0.62,
      0,
      D.WORLD_H - view.worldH,
    );
  }
  const events = game.takeEvents();
  if (events.length) {
    spawnEffects(game, events);
    for (const e of events)
      if (e.type === 'sfx') Audio.effect(e.kind, e, e.v);
      else if (e.type === 'fell')
        setTimeout(() => Audio.effect('timber', { x: e.x + (e.dir ?? 1) * 70, y: e.y }), 950);
  }
  if (state.playing) {
    Audio.setListener(game.s.player.x, game.s.player.y - 20);
    if (now - state.lastAmbience > 250) {
      state.lastAmbience = now;
      Audio.setAmbience(ambienceLevels());
      maybeThunder(now);
    }
  } else Audio.setAmbience(SILENCE);
  draw(
    ctx,
    game,
    state.camera,
    view,
    !state.playing,
    state.playing && state.pointer.inside && !state.journal ? cursorWorld() : null,
  );
}
function frame(now: number) {
  const dt = Math.min((now - state.lastFrame) / 1000, UI_RULES.maxFrameSeconds);
  state.lastFrame = now;
  if (state.playing && !state.journal && !game.s.dead) {
    const dx =
        (keys.has('d') || keys.has('arrowright') ? 1 : 0) -
        (keys.has('a') || keys.has('arrowleft') ? 1 : 0),
      dy =
        (keys.has('s') || keys.has('arrowdown') ? 1 : 0) -
        (keys.has('w') || keys.has('arrowup') || keys.has(' ') ? 1 : 0);
    game.move(dx, dy, dt);
    game.tick(dt);
    if (state.using) useHeld();
    if (!game.s.dead && game.s.elapsed - state.lastAuto > UI_RULES.autoSaveSeconds) {
      game.save(localStorage, true);
      state.lastAuto = game.s.elapsed;
    }
  }
  Audio.setScene(
    musicScene({
      playing: state.playing,
      dead: game.s.dead,
      boss: !!game.s.altar.activeBoss || !!game.bosses.active(),
      bossType: game.bosses.active()?.type ?? null,
      dungeon: D.dungeonAt(game.s.player.x, game.s.player.y - 20)?.def.id ?? null,
      layer: game.layer().id,
      weather: game.s.weather,
      biome: game.biome().id,
      night: game.isNight(),
      town: game.town.townNear(),
    }),
  );
  Audio.setMuffled(state.playing && state.journal);
  drawWorld();
  updateUI();
  requestAnimationFrame(frame);
}
// Browsers only allow sound after a gesture; the first one starts the title theme.
for (const type of ['pointerdown', 'keydown'])
  addEventListener(type, () => Audio.start(), { once: true, capture: true });
addEventListener('beforeunload', () => {
  if (state.playing && !game.s.dead) game.save(localStorage, true);
});
requestAnimationFrame(frame);
window.Wildlands = { game, enterGame, renderJournal, state };
