import * as D from '../data/index.ts';
import { Game } from '../game/Game.ts';
import { draw } from '../renderer/Renderer.ts';
import { Audio } from '../audio/Audio.ts';
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
  camera: { x: 0, y: 0 },
  lastFrame: performance.now(),
  lastUI: 0,
  lastAuto: 0,
  seenMessage: null as GameMessage | null,
};
const UI_RULES = {
  seedRange: 1_000_000,
  maxPixelRatio: 2,
  hudRefreshMs: 170,
  autoSaveSeconds: 40,
  maxFrameSeconds: 0.1,
  menuFocalX: D.BIOME_CENTERS.meadow[0],
};
const pretty = (id: string) => D.ITEMS[id]?.[0] || id;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const fmt = (n: number) => String(Math.floor(n)).padStart(2, '0');
const timeText = () => {
  const t = game.timeOfDay();
  return `DAY ${game.s.day} · ${fmt(t / 60)}:${fmt(t % 60)} · ${game.s.weather.toUpperCase()}`;
};
const itemUseLabel = (id: string) =>
  D.ITEMS[id][1] === 'structure'
    ? 'PLACE'
    : D.WEAPONS[id]
      ? 'EQUIP'
      : ['direwolf_cloak', 'hide_coat', 'explorer_boots'].includes(id)
        ? 'WEAR'
        : id === 'fishing_rod'
          ? 'FISH'
          : ['food', 'water', 'medicine'].includes(D.ITEMS[id][1])
            ? 'USE'
            : '';
const sound = (kind: string) => Audio.effect(kind);
function resize() {
  const ratio = Math.min(devicePixelRatio || 1, UI_RULES.maxPixelRatio);
  canvas.width = Math.round(innerWidth * ratio);
  canvas.height = Math.round(innerHeight * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}
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
    `<h2>Sound & settings</h2><label>Music <input id="music-volume" type="range" min="0" max="100" value="${Math.round(a.music * 100)}"></label><label>Effects <input id="sfx-volume" type="range" min="0" max="100" value="${Math.round(a.sfx * 100)}"></label><p>The score and effects are made live by your browser. Your volume choices are saved here.</p><button id="panel-close" class="ink-button">Close this page</button>`;
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
      if (tab && ['pack', 'recipes', 'vitals', 'notes', 'beasts'].includes(tab)) state.tab = tab;
      sound('page');
      renderJournal();
    }),
);
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
    sound(result.action === 'beasts' ? 'boss' : result.action === 'recipes' ? 'page' : 'gather');
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
      state.tab = 'pack';
      toggleJournal(true);
    }
  }
  updateUI(true);
}
function doAttack() {
  const r = game.attack();
  if (r.ok) sound(r.hit ? 'hit' : 'page');
  else if (r.reason && r.reason !== 'Recovering from the last strike.') message(r.reason);
  updateUI(true);
}
function doMine(x: number, y: number) {
  const r = game.mineTileAt(x, y);
  if (r.ok) sound('mine');
  else message(r.reason);
  updateUI(true);
}
addEventListener('keydown', (e) => {
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
    const tabs = ['pack', 'recipes', 'vitals', 'notes', 'beasts'];
    if (/^[1-5]$/.test(key)) {
      state.tab = tabs[Number(key) - 1];
      renderJournal();
    }
    return;
  }
  if (key === 'e') doInteract();
  if (key === 'f') doAttack();
  if (key === 'r')
    doMine(game.s.player.x + Math.cos(game.s.player.face) * 54, game.s.player.y - 12);
  if (key === 'g') {
    const r = game.fish();
    if (!r.ok) message(r.reason);
    else sound('fish');
    updateUI(true);
  }
  if (key === ' ' || key === 'w' || key === 'arrowup') {
    if (game.jump()) sound('jump');
  }
});
addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));
addEventListener('blur', () => keys.clear());
canvas.addEventListener('click', (e) => {
  if (!state.playing || state.journal || game.s.dead) return;
  if (game.s.placing) {
    const rect = canvas.getBoundingClientRect(),
      x = e.clientX - rect.left + state.camera.x,
      y = e.clientY - rect.top + state.camera.y;
    const r = game.place(game.s.placing, x, y);
    if (!r.ok) message(r.reason);
    else sound('craft');
    updateUI(true);
  } else {
    const rect = canvas.getBoundingClientRect(),
      x = e.clientX - rect.left + state.camera.x,
      y = e.clientY - rect.top + state.camera.y;
    if (game.tileAt(Math.floor(x / D.TILE), Math.floor(y / D.TILE))) doMine(x, y);
    else doAttack();
  }
});
canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  if (state.playing && !state.journal) doAttack();
});
function renderJournal() {
  const tab = state.tab,
    left = $('page-left'),
    right = $('page-right');
  document
    .querySelectorAll<HTMLButtonElement>('.book-tabs button')
    .forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
  const page: Record<string, string> = {
    pack: '01',
    recipes: '02',
    vitals: '03',
    notes: '04',
    beasts: '05',
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
  if (tab === 'beasts') renderBeasts(left, right);
}
function sketch(type: string) {
  if (type === 'pack')
    return `<svg class="sketch" viewBox="0 0 440 150" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#57634f" stroke-linecap="round" stroke-linejoin="round"><path stroke-width="2" d="M167 129q-16-12-13-28l5-53q7-12 25-15l56 3q21 4 25 18l4 50q-2 21-17 25z"/><path stroke-width="1.5" d="M158 57q49-19 106 2m-96 2q46 24 87 1m-86-18q1-16 15-18l53 3q18 4 18 22M174 78l80 2-3 29q-37 18-78-3zM180 81l-1 22q28 10 65 2l2-23M192 88v19m44-21v20"/><path stroke-width="2.5" d="M183 38V19q30-12 52 0v18m-51-12q27-12 50 0m-44 2q-8 7-5 12m45-10q6 7 4 12M166 69l-11 41m110-41 12 42"/><path stroke-width="1" d="M186 50l57 1m-56 5 55 2m-74 61q42 13 83-1m-91-12 11 8m91-9-10 10M81 121q28-16 52 0m150 4q25-21 68-7M46 132q39-8 75 0m191 2q55-12 95-1"/><path stroke-width="1.3" d="M76 124l-8-18m8 18 7-21m17 23-4-15m14 17 7-22m232 18-10-16m10 16 12-22m15 20-2-17"/></g><g fill="#7d896d"><circle cx="182" cy="67" r="2"/><circle cx="251" cy="67" r="2"/><path d="M79 120q-18-15-20-24 17 0 20 24m272 2q10-18 29-22-7 18-29 22" opacity=".45"/></g><text x="18" y="25" fill="#7c624d" font-family="Caveat" font-size="19">straps repaired twice</text><path d="M115 26q28 4 45 22" fill="none" stroke="#7c624d"/><text x="279" y="58" fill="#7c624d" font-family="Caveat" font-size="18">keep dry</text><path d="M276 65q-13 7-18 22" fill="none" stroke="#7c624d"/></svg>`;
  if (type === 'beast')
    return `<svg class="sketch" viewBox="0 0 440 155" xmlns="http://www.w3.org/2000/svg"><circle cx="211" cy="74" r="63" fill="none" stroke="#afa085" stroke-width="1"/><g fill="none" stroke="#5d5147" stroke-linecap="round" stroke-linejoin="round"><path stroke-width="2.6" d="M91 123q21-29 52-34l23-34 18 14 22-43 17 42 26-20 8 30 37-6 43 28-39 14-14 21-40 11-80-15z"/><path stroke-width="1.7" d="M154 94l-22-11 11-26 20 20m66-15 27-20 14 38m-37 57q23-19 56-21m-117 10 39-11 31 10m57-30 22 7-20 5"/><path stroke-width="1" d="M127 112l31-18m-16 26 28-20m-3 26 27-27m-8 30 30-24m-6 28 30-28m-3 28 25-24m-4 22 23-17m-42-63 26 15m-59-35 24 27m-32-39 17 38m-47-12 22 21m-62 9 22 10m93 5 16-15"/><path stroke-width="1.5" d="M311 102q-8 14-25 19m-91-33q10-5 18-3m-19-3 14-10m33 31 6 17m6-15 8 16"/></g><path d="M278 88q8-6 15 1-9 7-15-1" fill="#954d45"/><circle cx="286" cy="88" r="2" fill="#f0dbc1"/><path d="M327 97l14 4-13 5z" fill="#5d5147"/><text x="19" y="31" fill="#7c624d" font-family="Caveat" font-size="22">the old wolf</text><path d="M90 37q23 15 37 35" fill="none" stroke="#7c624d"/><text x="313" y="142" fill="#7c624d" font-family="Caveat" font-size="18">eyes like embers</text></svg>`;
  return `<svg class="sketch" viewBox="0 0 440 145" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#66694f" stroke-linecap="round" stroke-linejoin="round"><path stroke-width="4" d="M167 121 278 17"/><path stroke-width="2" d="M163 119q-8 7-3 13 7 4 14-5l-7-8m103-99q19-15 42-11l27 24q-19 3-32 18l-37-17z"/><path stroke-width="1" d="M274 21q25 8 33 30m-15-40 19 30m-9-29 19 25m-71 25-11-14m8 18-11-14m7 20-12-13m6 18-11-13m-9 20-13-13m10 21-13-13m8 19-13-12m-23 23 12 12m90-80 20-15m-15 28 29-16m-25 26 30-14M62 120q40-17 86 0m197 4q26-11 58-3"/><path stroke-width="1.5" d="M52 125l-7-18m7 18 10-18m16 17-3-14m275 14-9-16m9 16 11-17"/></g><path d="M270 22l29-9 28 19-18 8z" fill="#a8a88a" opacity=".26"/><text x="35" y="37" fill="#7d624b" font-family="Caveat" font-size="22">stone edge</text><path d="M98 42q36-4 65 24" fill="none" stroke="#7d624b"/><text x="315" y="82" fill="#7d624b" font-family="Caveat" font-size="20">fiber binding</text><path d="M315 84q-27-6-49-15" fill="none" stroke="#7d624b"/></svg>`;
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
    'clothing',
    'food',
    'water',
    'medicine',
    'ore',
    'metal',
    'material',
    'trophy',
    'structure',
  ];
  const groups = [...new Set(items.map((e) => D.ITEMS[e.id][1]))].sort(
    (a, b) => order.indexOf(a) - order.indexOf(b),
  );
  right.innerHTML = `<h2>Contents</h2><p class="lede">${items.reduce((n, e) => n + e.qty, 0)} objects in the field pack.</p>${
    groups
      .map(
        (category) =>
          `<h3>${category}</h3><div class="book-list">${items
            .filter((e) => D.ITEMS[e.id][1] === category)
            .sort((a, b) => pretty(a.id).localeCompare(pretty(b.id)))
            .map((e) => {
              const use = itemUseLabel(e.id),
                fresh =
                  e.fresh === undefined
                    ? ''
                    : `<small class="${game.itemState(e)}">${game.itemState(e).toUpperCase()} · ${Math.max(0, Math.ceil(e.fresh / 60))} min</small>`;
              return `<div class="book-row"><div><strong>${pretty(e.id)}</strong>${fresh}</div><div><span class="qty">×${e.qty}</span>${use ? `<button data-use="${e.id}">${use}</button>` : ''}</div></div>`;
            })
            .join('')}</div>`,
      )
      .join('') || '<p>Only the journal remains. Gather what the meadow offers.</p>'
  }`;
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
          sound('craft');
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
        `<div class="book-row"><span>${pretty(id)}</span><span class="qty ${game.count(id) < n ? 'red' : ''}">${game.count(id)} / ${n}</span></div>`,
    )
    .join(
      '',
    )}</div><div class="note-block">${!atStation ? 'Stand beside a ' + pretty(selected.station ?? '').toLowerCase() + '.' : !affordable ? 'Gather the remaining materials.' : 'Everything needed is at hand.'}</div>`;
  const recipes = [...D.RECIPES].sort((a, b) => a.tier - b.tier);
  right.innerHTML = `<h2>Recipes</h2><p class="lede">Select a recipe, then make it when its station and materials are within reach.</p>${recipes
    .map(
      (r, i) =>
        `${i === 0 || recipes[i - 1].tier !== r.tier ? `<h3 class="recipe-group">Tier ${r.tier} · ${['', 'First fire', 'Copper age', 'Iron age', 'Forgework', 'Black glass', 'Effergy'][r.tier]}</h3>` : ''}<div class="recipe-row"><div class="recipe-head"><strong>${pretty(r.id)}</strong><button data-craft="${r.id}" ${!game.canAfford(r.cost) || (r.station && !game.near(r.station)) || (r.id === 'effergy' && (game.count('effergy') || game.s.structures.some((st) => st.type === 'effergy'))) ? 'disabled' : ''}>MAKE</button></div><small>${Object.entries(
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
          sound('craft');
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
function renderVitals(left: HTMLElement, right: HTMLElement) {
  const v = game.s.vitals,
    current = game.biome(),
    symptoms = game.vitalReasons();
  left.innerHTML = `<h2>The Body</h2><p class="lede">Warmth, food, water, and rest pull each other out of balance.</p>${sketch('tool')}<h3>Exposure</h3><p>Air: <strong>${game.temperature().toFixed(0)}°C</strong> in the ${current.name.toLowerCase()}<br>Body: <strong>${v.bodyTemp.toFixed(1)}°C</strong><br>Weather: <strong>${game.s.weather}</strong> · ${game.isNight() ? 'night' : 'day'}</p><div class="note-block">${symptoms.map((s) => `<div>• ${s}</div>`).join('')}</div><div class="book-actions"><button data-wash ${game.count('wild_water') + game.count('boiled_water') ? '' : 'disabled'}>WASH · 1 WATER</button></div><h3>Recovery</h3><p>Good food, safe water, warmth, and rest slowly restore health. A bedroll sharply reduces fatigue. Shelter keeps off rain; a lit fire helps dry and warm you.</p>`;
  const labels: [keyof Vitals, string][] = [
    ['health', 'Health'],
    ['hydration', 'Hydration'],
    ['calories', 'Calories'],
    ['protein', 'Protein'],
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
    .join(
      '',
    )}<h3>Diagnosis</h3>${game.s.disease ? `<div class="disease-note"><strong>${D.DISEASES[game.s.disease].name}</strong><p>Likely cause: ${D.DISEASES[game.s.disease].cause}. Field treatment: ${D.DISEASES[game.s.disease].treat}.</p></div>` : '<p>No active disease is recorded.</p>'}<small>These are game systems, not real-world medical guidance.</small>`;
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
  left.innerHTML = `<h2>Field Notes</h2><p class="lede">Nine regions across the surface; three winding cave roads beneath them.</p><canvas id="atlas-map" class="atlas-map" width="420" height="240" aria-label="Side elevation of the nine regions and cave passages"></canvas><h3>Current ground · ${biome.name}</h3><p>${biome.note}</p><p>Typical resources: ${[...new Set(biome.resources)].map(pretty).join(', ')}.</p><div class="book-actions"><button data-save>SAVE RECORD</button><button class="quiet" data-menu>MAIN MENU</button></div>`;
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
  };
  drawAtlas();
}
function drawAtlas() {
  const map = $<HTMLCanvasElement>('atlas-map'),
    ink = map.getContext('2d')!;
  const w = map.width,
    h = map.height;
  ink.fillStyle = '#ddcfaa';
  ink.fillRect(0, 0, w, h);
  ink.strokeStyle = '#8e795e';
  ink.lineWidth = 1;
  for (let y = 20; y < h; y += 25) {
    ink.beginPath();
    ink.moveTo(0, y);
    ink.lineTo(w, y);
    ink.stroke();
  }
  const X = (x: number) => (x / D.WORLD_W) * w,
    Y = (y: number) => (y / D.WORLD_H) * (h - 30) + 14;
  ink.fillStyle = '#8a8667';
  ink.beginPath();
  ink.moveTo(0, h);
  for (let x = 0; x <= D.WORLD_W; x += 25) ink.lineTo(X(x), Y(D.surfaceAt(x)));
  ink.lineTo(w, h);
  ink.fill();
  ink.strokeStyle = '#f1dfb3';
  ink.lineWidth = 3;
  for (let level = 1; level <= 3; level++) {
    ink.beginPath();
    for (let x = 0; x <= D.WORLD_W; x += 35) {
      const xx = X(x),
        yy = Y(D.caveY(x, level));
      if (!x) ink.moveTo(xx, yy);
      else ink.lineTo(xx, yy);
    }
    ink.stroke();
  }
  ink.font = 'bold 10px "EB Garamond", Georgia, serif';
  ink.textAlign = 'center';
  ink.fillStyle = '#322c24';
  D.SIDE_ORDER.forEach((id, i) => {
    const x = D.BIOME_CENTERS[id][0];
    ink.fillText(
      D.BIOMES.find((b) => b.id === id)!
        .name.slice(0, 4)
        .toUpperCase(),
      X(x),
      Y(D.surfaceAt(x)) - (i % 2 ? 26 : 13),
    );
  });
  const px = X(game.s.player.x),
    py = Y(game.s.player.y);
  ink.beginPath();
  ink.arc(px, py, 5, 0, 7);
  ink.fillStyle = '#a34d3f';
  ink.fill();
  ink.font = '18px Caveat, cursive';
  ink.textAlign = 'left';
  ink.fillText('you', Math.min(w - 24, px + 8), py - 7);
}
function renderBeasts(left: HTMLElement, right: HTMLElement) {
  const a = game.s.altar,
    cfg = D.BOSSES[a.level - 1],
    owned = game.s.structures.some((st) => st.type === 'effergy'),
    near = !!game.near('effergy', 135);
  left.innerHTML = `<h2>Beasts</h2><p class="lede">The Effergy binds a hunt to the oldest shapes in the dark.</p>${sketch('beast')}<div class="folio-stamp">${owned ? 'FOLIO UNSEALED' : 'FOLIO SEALED'}</div><h3>Wolf attunement</h3><p>${owned ? 'The wolf sigil is ready. Wolf kills fill the counter after attunement. Return to the altar when the Direwolf appears.' : 'Craft the Effergy at a forge, then place it to unseal this folio.'}</p><div class="note-block">A black-glass weapon, obsidian tier or greater, is required to wound any Direwolf variant.</div><p class="muted">Future attunement capacity: ${a.level} sigil${a.level > 1 ? 's' : ''}. Only wolves are recorded in this volume.</p>`;
  right.innerHTML = `<h2>The Hunt</h2><p class="lede">Level ${a.level} · ${cfg.name}</p><div class="book-list"><div class="book-row"><span>Attuned</span><strong>${a.attuned === 'wolf' ? 'Wolves' : 'None'}</strong></div><div class="book-row"><span>Wolf kills</span><strong>${a.kills} / ${cfg.kills}</strong></div><div class="book-row"><span>Effergy XP</span><strong>${a.xp}</strong></div><div class="book-row"><span>Direwolf health</span><strong>${cfg.hp}</strong></div><div class="book-row"><span>Bite damage</span><strong>${cfg.bite}</strong></div></div><h3>Victory spoils</h3><p>${Object.entries(
    cfg.rewards,
  )
    .map(([id, n]) => `${n} ${pretty(id)}`)
    .join(
      ' · ',
    )} · ${cfg.xp} XP.</p><div class="book-actions"><button data-attune ${!owned || !near || a.activeBoss ? 'disabled' : ''}>ATTUNE TO WOLVES</button>${a.level < 3 ? `<button data-upgrade ${!owned || !near || a.activeBoss || a.xp < (a.level === 1 ? 100 : 250) ? 'disabled' : ''}>UPGRADE · ${a.level === 1 ? 100 : 250} XP</button>` : ''}</div>${a.activeBoss ? '<div class="disease-note">The Direwolf has been summoned. Return to the altar and finish the hunt.</div>' : ''}<h3>Later inscriptions</h3><p>Level 2: Ember Direwolf, nine kills. Level 3: Void Direwolf, twelve kills. Each level deepens the altar and expands its future sigil capacity.</p>`;
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
function updateUI(force = false) {
  if (!state.playing) return;
  const now = performance.now();
  if (!force && now - state.lastUI < UI_RULES.hudRefreshMs) return;
  state.lastUI = now;
  const v = game.s.vitals;
  (['health', 'hydration', 'calories', 'stamina'] as (keyof Vitals)[]).forEach((id) => {
    $(id + '-bar').style.width = clamp(v[id], 0, 100) + '%';
    $(id + '-value').textContent = String(Math.round(v[id]));
  });
  $('biome-name').textContent = game.biome().name.toUpperCase();
  $('world-time').textContent = timeText();
  $('condition-line').textContent = game.vitalReasons()[0];
  $('weapon-name').textContent = pretty(game.s.player.weapon);
  const step = D.TUTORIAL[game.s.tutorial.step] || D.CHAPTERS[game.s.chapter];
  $('objective-text').textContent = step ? step[0] : 'The final folio is complete.';
  $('objective-progress').textContent = step
    ? `${Math.min(step[2], game.s.tutorial.tally[step[1]] || 0)} / ${step[2]}`
    : 'EXPEDITION COMPLETE';
  const near = game.nearestInteractable();
  let prompt = '';
  if (game.s.placing) prompt = `<b>CLICK</b> Place ${pretty(game.s.placing)} · Esc cancels`;
  else if (near) {
    const action =
      near.type === 'node'
        ? near.object.kind === 'water'
          ? 'Collect wild water'
          : 'Gather ' + pretty(near.object.kind)
        : near.type === 'cache'
          ? 'Open field cache'
          : near.object.type === 'effergy'
            ? 'Open Beasts folio'
            : near.object.type === 'farm_plot'
              ? 'Tend farm plot'
              : near.object.type === 'bedroll'
                ? 'Rest'
                : near.object.type === 'icebox'
                  ? 'Add ice'
                  : near.object.type === 'campfire'
                    ? 'Add wood'
                    : 'Use ' + pretty(near.object.type);
    prompt = `<b>E</b> ${action}`;
  } else prompt = '<b>E</b> Explore and gather';
  $('interaction-prompt').innerHTML = prompt;
  const boss = game.s.animals.find((a) => a.id === game.s.altar.activeBoss && !a.deadUntil);
  $('boss-hud').classList.toggle('hidden', !boss);
  if (boss) {
    $('boss-name').textContent = D.BOSSES[game.s.altar.level - 1].name.toUpperCase();
    $('boss-bar').style.width = clamp((boss.hp / boss.maxHp) * 100, 0, 100) + '%';
    $('boss-value').textContent = `${Math.ceil(boss.hp)} / ${boss.maxHp}`;
  }
  const msg = game.messages[0];
  if (msg && msg !== state.seenMessage) {
    state.seenMessage = msg;
    $('toast').textContent = msg.message;
    $('toast').classList.add('visible');
    setTimeout(() => {
      if (state.seenMessage === msg) $('toast').classList.remove('visible');
    }, 3000);
    if (msg.tone === 'danger') sound('hurt');
    if (msg.tone === 'victory') sound('victory');
  }
  if (game.s.dead) {
    $('death').classList.remove('hidden');
    state.journal = false;
    $('journal').classList.add('hidden');
    sound('hurt');
  }
}
function camera() {
  const p = game.s.player;
  state.camera.x = clamp(p.x - innerWidth / 2, 0, Math.max(0, D.WORLD_W - innerWidth));
  state.camera.y = clamp(p.y - innerHeight / 2, 0, Math.max(0, D.WORLD_H - innerHeight));
}
function drawWorld() {
  camera();
  if (!state.playing) {
    state.camera.x = clamp(
      3600 + Math.sin(performance.now() / 12000) * 380 - innerWidth * 0.2,
      0,
      D.WORLD_W - innerWidth,
    );
    state.camera.y = clamp(
      D.surfaceAt(UI_RULES.menuFocalX) - innerHeight * 0.62,
      0,
      D.WORLD_H - innerHeight,
    );
  }
  draw(ctx, game, state.camera, innerWidth, innerHeight, !state.playing);
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
    if (!game.s.dead && game.s.elapsed - state.lastAuto > UI_RULES.autoSaveSeconds) {
      game.save(localStorage, true);
      state.lastAuto = game.s.elapsed;
    }
  }
  Audio.setScene(
    !state.playing
      ? 'menu'
      : game.s.altar.activeBoss
        ? 'boss'
        : game.s.player.y > D.surfaceAt(game.s.player.x) + 70
          ? 'cave'
          : ['alpine', 'taiga', 'tundra'].includes(game.biome().id)
            ? 'cold'
            : ['desert', 'badlands'].includes(game.biome().id)
              ? 'desert'
              : game.biome().id === 'forest'
                ? 'forest'
                : 'meadow',
  );
  drawWorld();
  updateUI();
  requestAnimationFrame(frame);
}
addEventListener('beforeunload', () => {
  if (state.playing && !game.s.dead) game.save(localStorage, true);
});
requestAnimationFrame(frame);
window.Wildlands = { game, enterGame, renderJournal, state };
