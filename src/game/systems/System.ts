import type { Game } from '../Game.ts';

/**
 * A slice of game behaviour. Systems read and write the shared record through `game.s`
 * and reach each other through the Game, so a loaded save is picked up everywhere at once.
 */
export abstract class System {
  protected readonly game: Game;
  constructor(game: Game) {
    this.game = game;
  }
}
