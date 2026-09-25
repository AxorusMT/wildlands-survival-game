import type { GameResult, Structure } from '../../core/types.ts';
import { CODEX, RELIC_EFFECTS, shelfSlots, type CodexPage } from '../../data/codex.ts';
import { itemName } from '../../data/items.ts';
import { MOBS } from '../../data/mobs.ts';
import { RECIPES } from '../../data/recipes.ts';
import {
  MAX_RENOWN,
  RESPEC_COST,
  ROW_POINTS,
  SKILLS,
  TREES,
  masteryLevel,
  masteryTitle,
  renownFor,
  renownLevel,
  skillById,
  type SkillKey,
  type SkillStats,
} from '../../data/skills.ts';

import { System } from './System.ts';

const ZERO = (): SkillStats =>
  Object.fromEntries(
    [
      ...new Set(SKILLS.flatMap((n) => Object.keys(n.stats))),
      ...CODEX.flatMap((p) => Object.keys(p.bonus)),
    ].map((k) => [k, 0]),
  ) as unknown as SkillStats;

/**
 * Lasting progress: renown from everything you do, skill points to spend across five trees,
 * mastery of each weapon family by use, and the Codex's finished pages. None of it resets.
 */
export class Skills extends System {
  private cache: { key: string; stats: SkillStats } | null = null;

  private get meta() {
    return (this.game.s.meta ??= { renown: 0, skills: [], mastery: {} });
  }

  // ─── Renown ────────────────────────────────────────────────────────────────
  renown() {
    return this.meta.renown;
  }
  level() {
    return renownLevel(this.meta.renown);
  }
  /** Renown into the current level, and what the level needs, for the bar. */
  progress(): [number, number] {
    const l = this.level();
    if (l >= MAX_RENOWN) return [1, 1];
    return [this.meta.renown - renownFor(l), renownFor(l + 1) - renownFor(l)];
  }
  points() {
    const spent = this.meta.skills.reduce((n, id) => n + (skillById(id)?.cost ?? 0), 0);
    return this.level() - 1 - spent;
  }
  gain(amount: number) {
    if (amount <= 0) return;
    const before = this.level();
    this.meta.renown += amount * (1 + this.get('xp'));
    const after = this.level();
    if (after > before) {
      this.game.sound('victory');
      this.game.say(
        `Renown ${after}! A skill point to spend (${this.points()} unspent) · Gear › Skills.`,
        'victory',
      );
    }
  }
  /** Renown for what the record notes: kills, crafts, places, bosses, and firsts. */
  noted(key: string, qty: number) {
    const [kind, what] = key.split(':'),
      first = (this.game.s.tutorial.tally[key] ?? 0) === qty ? 3 : 1;
    if (!what) return;
    let xp = 0;
    if (kind === 'kill') {
      const spec = MOBS[what];
      xp = Math.max(2, Math.round((spec?.hp ?? 40) / (spec?.boss ? 4 : 6))) * first;
    } else if (kind === 'boss') xp = 250;
    else if (kind === 'craft')
      xp = (3 + 2 * (RECIPES.find((r) => r.id === what)?.tier ?? 1)) * first;
    else if (kind === 'place') xp = 4 * first;
    else if (kind === 'visit') xp = 40;
    else if (kind === 'realm') xp = 15;
    else if (kind === 'clear' && what.startsWith('tier')) xp = 120 * Number(what.slice(4));
    else if (kind === 'upgrade') xp = 5 * Number(what);
    else if (kind === 'settler') xp = 60;
    else if (kind === 'cure') xp = 15;
    else if (kind === 'gather') xp = 1;
    else if (kind === 'eat' && first > 1) xp = 6;
    this.gain(xp * qty);
  }

  // ─── The trees ─────────────────────────────────────────────────────────────
  has(id: string) {
    return this.meta.skills.includes(id);
  }
  spentIn(tree: string) {
    return this.meta.skills
      .map((id) => skillById(id))
      .filter((n) => n?.tree === tree)
      .reduce((k, n) => k + (n?.cost ?? 0), 0);
  }
  /** Why a skill cannot be learned, or null. */
  blocked(id: string): string | null {
    const n = skillById(id);
    if (!n) return 'No such skill.';
    if (this.has(id)) return 'Already learned.';
    if (this.spentIn(n.tree) < ROW_POINTS[n.row])
      return `Spend ${ROW_POINTS[n.row]} points in ${TREES.find((t) => t.id === n.tree)?.name} first.`;
    if (this.points() < n.cost) return `It needs ${n.cost} skill point${n.cost > 1 ? 's' : ''}.`;
    return null;
  }
  learn(id: string): GameResult {
    const why = this.blocked(id);
    if (why) return { ok: false, reason: why };
    this.meta.skills.push(id);
    this.cache = null;
    const n = skillById(id)!;
    this.game.sound(n.keystone ? 'crystal' : 'page');
    this.game.say(`Learned ${n.name}: ${n.text}.`, n.keystone ? 'victory' : 'good');
    return { ok: true };
  }
  respec(): GameResult {
    if (!this.meta.skills.length) return { ok: false, reason: 'No skills to unlearn.' };
    if (!this.game.dev.god) {
      if (!this.game.canAfford(RESPEC_COST))
        return {
          ok: false,
          reason:
            'Unlearning costs ' +
            Object.entries(RESPEC_COST)
              .map(([k, n]) => `${n} ${itemName(k).toLowerCase()}`)
              .join(' and ') +
            '.',
        };
      for (const [k, n] of Object.entries(RESPEC_COST)) this.game.remove(k, n);
    }
    this.meta.skills = [];
    this.cache = null;
    this.game.say('Your skills are unlearned; every point is yours to spend again.', 'good');
    return { ok: true };
  }

  // ─── The Codex ─────────────────────────────────────────────────────────────
  /** How far a page has come: entries found, and needed. */
  page(p: CodexPage): [number, number] {
    const tally = this.game.s.tutorial.tally;
    if (p.count) {
      const n = Object.keys(tally).filter((k) => k.startsWith(p.prefix) && tally[k] > 0).length;
      return [Math.min(n, p.count), p.count];
    }
    return [p.entries.filter((e) => (tally[p.prefix + e] ?? 0) > 0).length, p.entries.length];
  }
  pageDone(p: CodexPage) {
    const [a, b] = this.page(p);
    return a >= b;
  }

  // ─── Everything added up ───────────────────────────────────────────────────
  stats(): SkillStats {
    const key = this.meta.skills.join(',') + '|' + Math.floor(this.game.s.elapsed / 2);
    if (this.cache?.key === key) return this.cache.stats;
    const out = ZERO();
    const add = (st: Partial<SkillStats>) => {
      for (const [k, v] of Object.entries(st) as [SkillKey, number][]) out[k] = (out[k] ?? 0) + v;
    };
    for (const id of this.meta.skills) {
      const n = skillById(id);
      if (n) add(n.stats);
    }
    for (const p of CODEX) if (this.pageDone(p)) add(p.bonus);
    this.cache = { key, stats: out };
    return out;
  }
  get(k: SkillKey) {
    return this.stats()[k] ?? 0;
  }
  flag(k: SkillKey) {
    return this.get(k) > 0;
  }

  // ─── The relic shelf ───────────────────────────────────────────────────────
  shelfSlots() {
    return shelfSlots(this.level());
  }
  /** Relics on every shelf, as many as renown allows. */
  shelved(): string[] {
    const out: string[] = [];
    for (const st of this.game.s.structures)
      if (st.type === 'relic_shelf')
        for (const id of Object.keys(st.store))
          if (RELIC_EFFECTS[id] && !out.includes(id)) out.push(id);
    return out.slice(0, this.shelfSlots());
  }
  shelve(st: Structure, id: string): GameResult {
    if (!RELIC_EFFECTS[id])
      return { ok: false, reason: 'Only relics and great trophies rest on the shelf.' };
    if (!this.game.count(id)) return { ok: false, reason: 'You do not carry it.' };
    if (this.shelved().length >= this.shelfSlots())
      return { ok: false, reason: `The shelf holds ${this.shelfSlots()} relics at your renown.` };
    this.game.remove(id);
    st.store[id] = 1;
    this.game.sound('crystal', st.x, st.y);
    this.game.say(`${itemName(id)} set on the shelf: its gift is yours wherever you roam.`, 'good');
    return { ok: true };
  }
  unshelve(st: Structure, id: string): GameResult {
    if (!st.store[id]) return { ok: false, reason: 'It is not on this shelf.' };
    delete st.store[id];
    this.game.add(id);
    return { ok: true };
  }

  // ─── Weapon mastery ────────────────────────────────────────────────────────
  masteryXp(family: string) {
    return this.meta.mastery[family] ?? 0;
  }
  mastery(family: string) {
    return masteryLevel(this.masteryXp(family));
  }
  /** Damage dealt trains the family that dealt it. */
  train(family: string, damage: number) {
    const before = this.mastery(family);
    this.meta.mastery[family] = this.masteryXp(family) + damage;
    const after = this.mastery(family);
    if (after > before) {
      const title = masteryTitle(after);
      this.game.say(
        `${family[0].toUpperCase() + family.slice(1)} mastery ${after}${after % 5 === 0 ? ' · ' + title : ''}.`,
        after % 5 === 0 ? 'victory' : 'good',
      );
    }
  }
}
