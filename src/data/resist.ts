// What each creature shrugs off and what it fears. A blow's kind is its weapon's infusion (fire,
// frost, venom, void, holy, storm), else arcane for staves and tomes, else plain physical. Values
// are the share of damage resisted: positive resists, negative is a weakness.
import { MOBS } from './mobs.ts';
import { UNDEAD } from './weapons.ts';

export type DamageKind =
  'physical' | 'arcane' | 'fire' | 'frost' | 'venom' | 'void' | 'holy' | 'storm';
export type Resists = Partial<Record<DamageKind, number>>;

/** Families of creature, by what their names give away, and what each resists or fears. */
const KINDS: [RegExp, Resists][] = [
  [
    /ember|kiln|cinder|magma|hell|imp|archdemon|anvil|forge|slag|heart|ash_|steppe|drake|wyrm/,
    { fire: 0.6, frost: -0.3 },
  ],
  [/frost|rime|snow|ice_|choir|cantor|hymnal|wraith_?|colossus_rime/, { frost: 0.6, fire: -0.3 }],
  [/void|watcher|unmaker|star_|constellation|astronomer|comet|moon/, { void: 0.6, holy: -0.3 }],
  [
    /golem|colossus|sentry|cog_|tin_|brass|clockwork|gear_|juggernaut|engine|lens|orrery|guard/,
    { venom: 0.8, storm: -0.3, physical: 0.1 },
  ],
  [/slime|glassling/, { physical: 0.2, fire: -0.2 }],
  [/plague|rot|fever|bog_|mosquito|toad|ivory/, { venom: 0.6, fire: -0.2 }],
  [
    /eel|crab|angler|jelly|leviathan|drowned|diver|abyss|tide|orchard_mother/,
    { storm: -0.4, fire: 0.3 },
  ],
  [/glass|prism|lumen|crystal/, { storm: 0.3, arcane: -0.3 }],
  [/salt|mirage|sand_/, { frost: -0.3, fire: 0.3 }],
  [/thorn|bramble|season|bloom|petal|harvest|warden/, { fire: -0.3, venom: 0.3 }],
];

const cache = new Map<string, Resists>();
/** What a creature resists and fears. */
export function resistOf(type: string): Resists {
  const hit = cache.get(type);
  if (hit) return hit;
  const out: Resists = {};
  for (const [re, r] of KINDS)
    if (re.test(type)) for (const [k, v] of Object.entries(r)) out[k as DamageKind] = v;
  // The dead cannot be poisoned; holy light is dealt with elsewhere (it burns them).
  if (UNDEAD.has(type)) out.venom = Math.max(out.venom ?? 0, 0.6);
  // Great foes resist a little of everything.
  if (MOBS[type]?.boss) for (const k of Object.keys(out) as DamageKind[]) out[k] = out[k]! * 0.8;
  cache.set(type, out);
  return out;
}
/** A creature's strengths and weaknesses in a few words, for the Codex. */
export function resistText(type: string) {
  const r = resistOf(type),
    strong = Object.entries(r)
      .filter(([, v]) => v >= 0.3)
      .map(([k]) => k),
    weak = Object.entries(r)
      .filter(([, v]) => v < 0)
      .map(([k]) => k);
  return [
    strong.length ? 'resists ' + strong.join(', ') : '',
    weak.length ? 'weak to ' + weak.join(', ') : '',
  ]
    .filter(Boolean)
    .join('; ');
}

// ─── Armour: levels, sockets, and infusions ───────────────────────────────────
export const ARMOR_MAX_LEVEL = 5;
/** What a gem does set in armour. */
export const ARMOR_GEMS: Record<string, { text: string }> = {
  ruby: { text: '+3% damage' },
  sapphire: { text: '+10 mana' },
  emerald: { text: '+2% critical chance' },
  topaz: { text: '+2% speed' },
  onyx: { text: '+1 defense' },
  opal: { text: 'Slowly regenerate health' },
};
/** What an infusion does worked into armour. */
export const ARMOR_INFUSIONS: Record<string, { text: string }> = {
  fire: { text: 'Burns cannot take hold; lava bites less' },
  frost: { text: 'Shrug off 2° of cold' },
  venom: { text: 'Poison cannot take hold' },
  void: { text: 'Void rot cannot take hold' },
  holy: { text: 'The undead strike 10% softer' },
  storm: { text: '+3% speed' },
};
