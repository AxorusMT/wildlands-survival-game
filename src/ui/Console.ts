// The field console: a small command line over the game for testing (toggle with `).
import type { Game } from '../game/Game.ts';

export class DevConsole {
  private readonly root: HTMLElement;
  private readonly log: HTMLElement;
  private readonly input: HTMLInputElement;
  private readonly history: string[] = [];
  private cursor = 0;
  private readonly game: Game;
  private readonly onRun: () => void;

  constructor(game: Game, onRun: () => void) {
    this.game = game;
    this.onRun = onRun;
    this.root = document.getElementById('dev-console')!;
    this.log = document.getElementById('dev-log')!;
    this.input = document.getElementById('dev-input') as HTMLInputElement;
    this.input.addEventListener('keydown', (e) => this.key(e));
    // Clicking anywhere in the console keeps typing in it.
    this.root.addEventListener('click', (e) => {
      if (e.target !== this.input && !window.getSelection()?.toString()) this.input.focus();
    });
    this.print(['Type help for commands.'], 'ok');
  }

  get open() {
    return !this.root.classList.contains('hidden');
  }

  toggle(force?: boolean) {
    const on = force ?? !this.open;
    this.root.classList.toggle('hidden', !on);
    if (on) setTimeout(() => this.input.focus(), 0);
    else this.input.blur();
  }

  private print(lines: string[], tone = '') {
    for (const text of lines) {
      const row = document.createElement('div');
      row.className = text.startsWith('!') ? 'err' : tone;
      // "name   description" rows (help, listings) line up in two columns: the pixel font is
      // not monospaced, so spaces alone cannot align them.
      const cols = !text.startsWith('!') && /^\s*(\S.*?)\s{2,}(\S.*)$/.exec(text);
      if (cols && tone === 'ok') {
        row.classList.add('cols');
        const [name, about] = [document.createElement('span'), document.createElement('span')];
        name.textContent = cols[1];
        about.textContent = cols[2];
        row.append(name, about);
      } else row.textContent = text.startsWith('!') ? text.slice(1).trim() : text;
      this.log.append(row);
    }
    while (this.log.childElementCount > 200) this.log.firstElementChild?.remove();
    this.log.scrollTop = this.log.scrollHeight;
  }

  private key(e: KeyboardEvent) {
    e.stopPropagation();
    if (e.key === '`' || e.key === 'Escape') {
      e.preventDefault();
      this.toggle(false);
    } else if (e.key === 'Enter') {
      const line = this.input.value.trim();
      this.input.value = '';
      if (!line) return;
      this.history.push(line);
      this.cursor = this.history.length;
      this.print(['› ' + line], 'cmd');
      if (line === 'clear') this.log.replaceChildren();
      else this.print(this.game.command(line), 'ok');
      this.onRun();
    } else if (e.key === 'PageUp' || e.key === 'PageDown') {
      e.preventDefault();
      this.log.scrollBy({ top: (e.key === 'PageUp' ? -1 : 1) * this.log.clientHeight * 0.8 });
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      this.cursor = Math.max(
        0,
        Math.min(this.history.length, this.cursor + (e.key === 'ArrowUp' ? -1 : 1)),
      );
      this.input.value = this.history[this.cursor] ?? '';
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const value = this.input.value,
        options = this.game.devtools.complete(value);
      if (options.length === 1) {
        const words = value.split(/\s+/);
        words[words.length - 1] = options[0];
        this.input.value = words.join(' ') + ' ';
      } else if (options.length > 1) this.print(['  ' + options.slice(0, 40).join('  ')]);
    }
  }
}
