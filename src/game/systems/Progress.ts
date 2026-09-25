import { CHAPTERS, TUTORIAL } from '../../data/progression.ts';
import { dungeonAt } from '../../data/world.ts';

import { System } from './System.ts';

export class Progress extends System {
  record(key: string, qty = 1) {
    this.game.s.tutorial.tally[key] = (this.game.s.tutorial.tally[key] || 0) + qty;
    this.game.skills.noted(key, qty);
    this.game.feats.check();
    this.advanceTutorial();
    this.advanceChapter();
  }
  advanceTutorial() {
    let step = this.game.s.tutorial.step;
    while (step < TUTORIAL.length) {
      const [, key, n] = TUTORIAL[step];
      if ((this.game.s.tutorial.tally[key] || 0) < n) break;
      step++;
      if (step < TUTORIAL.length) this.game.say('Field task complete · ' + TUTORIAL[step][0]);
      else this.game.say('Field apprenticeship complete. The wildlands are yours to cross.');
    }
    this.game.s.tutorial.step = step;
  }
  advanceChapter() {
    let step = this.game.s.chapter || 0;
    while (step < CHAPTERS.length) {
      const [, key, n] = CHAPTERS[step];
      if ((this.game.s.tutorial.tally[key] || 0) < n) break;
      step++;
      if (step < CHAPTERS.length)
        this.game.say('Next expedition: ' + CHAPTERS[step][0] + '.', 'good');
      else this.game.say('The final folio is complete. The wildlands are yours.', 'victory');
    }
    this.game.s.chapter = step;
  }
  // The first visit to each region is recorded as a discovery.
  discover() {
    const p = this.game.s.player,
      dungeon = dungeonAt(p.x, p.y - 20);
    if (dungeon && !this.game.s.discoveries.includes(dungeon.def.id)) {
      this.game.s.discoveries.push(dungeon.def.id);
      this.record('visit:' + dungeon.def.id);
      this.game.say('New field entry: ' + dungeon.def.name + '.', 'good');
    }
    const region = this.game.biome();
    if (this.game.s.discoveries.includes(region.id)) return;
    this.game.s.discoveries.push(region.id);
    this.record('visit:' + region.id);
    this.game.say('New field entry: ' + region.name + '.', 'good');
  }
}
