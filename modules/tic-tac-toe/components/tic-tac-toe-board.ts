// The game's one island: it owns the board state, the nine buttons, and their
// click handlers together. The rules themselves live in the pure utils module,
// so this file is only state plus markup.
import { WebComponent, signal, html } from '@webjsdev/core';
import { cn } from '#lib/utils/cn.ts';
import { buttonClass } from '#components/ui/button.ts';
import type { Board, Cell } from '#modules/tic-tac-toe/types.ts';
import {
  emptyBoard,
  isDraw,
  play,
  turnOf,
  winnerOf,
  winningLine,
} from '#modules/tic-tac-toe/utils/game.ts';

// Built outside the html template: a nested template literal inside one would
// close it (invariant 9), and these read better as plain strings anyway.
function squareLabel(cell: Cell, index: number): string {
  const position = 'Square ' + String(index + 1);
  return cell === null ? position + ', empty' : position + ', ' + cell;
}

function statusOf(board: Board): string {
  const winner = winnerOf(board);
  if (winner !== null) return winner + ' wins';
  if (isDraw(board)) return 'Draw';
  return turnOf(board) + ' to play';
}

const SQUARE =
  'grid place-items-center min-h-0 overflow-hidden rounded-xl border border-border ' +
  'text-[clamp(1.5rem,14cqi,4rem)] font-semibold leading-none transition-colors ' +
  'cursor-pointer disabled:cursor-default';

export class TicTacToeBoard extends WebComponent {
  // Instance signal: state local to this component, reset by the New game button.
  private board = signal<Board>(emptyBoard());

  private playSquare(index: number): void {
    this.board.set(play(this.board.get(), index));
  }

  private newGame(): void {
    this.board.set(emptyBoard());
  }

  render() {
    const board = this.board.get();
    const line = winningLine(board);
    const over = line !== null || isDraw(board);

    return html`
      <div class="flex flex-col gap-5">
        <p class="m-0 text-center text-lg font-medium tabular-nums" aria-live="polite">
          ${statusOf(board)}
        </p>

        <!-- @container makes the board itself the container-query context, so
             the cqi mark size scales with the board and not the viewport. The
             explicit 1fr rows AND columns plus aspect-square keep every square
             equal and stop the grid reflowing as it fills. -->
        <div
          class="@container grid gap-2 aspect-square [grid-template-columns:repeat(3,1fr)] [grid-template-rows:repeat(3,1fr)]"
          role="group"
          aria-label="Tic tac toe board"
        >
          ${board.map(
            (cell, index) => html`
              <button
                type="button"
                class=${cn(
                  SQUARE,
                  line?.includes(index)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-foreground enabled:hover:bg-accent',
                )}
                aria-label=${squareLabel(cell, index)}
                ?disabled=${cell !== null || over}
                @click=${() => this.playSquare(index)}
              >
                ${cell ?? ''}
              </button>
            `,
          )}
        </div>

        <button
          type="button"
          class=${cn(buttonClass({ variant: 'secondary' }), 'self-center')}
          @click=${() => this.newGame()}
        >
          New game
        </button>
      </div>
    `;
  }
}
TicTacToeBoard.register('tic-tac-toe-board');
