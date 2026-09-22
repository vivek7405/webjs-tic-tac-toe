// Pure game rules, with no DOM and no server dependency, so the board
// component stays a thin shell over them and every rule is unit-testable.
import type { Board, Cell, Line, Mark } from '#modules/tic-tac-toe/types.ts';

/** The eight ways to win: three rows, three columns, two diagonals. */
export const LINES: readonly Line[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/** A fresh nine-square board. */
export function emptyBoard(): Cell[] {
  return Array.from({ length: 9 }, () => null);
}

/** Whose turn it is. X opens, and the marks alternate from there. */
export function turnOf(board: Board): Mark {
  const played = board.filter((cell) => cell !== null).length;
  return played % 2 === 0 ? 'X' : 'O';
}

/** The three indices of the winning line, or null while nobody has three in a row. */
export function winningLine(board: Board): Line | null {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (board[a] !== null && board[a] === board[b] && board[a] === board[c]) return line;
  }
  return null;
}

/** The winner's mark, or null while the game is undecided. */
export function winnerOf(board: Board): Mark | null {
  const line = winningLine(board);
  return line ? board[line[0]] : null;
}

/** A full board that nobody won. */
export function isDraw(board: Board): boolean {
  return winningLine(board) === null && board.every((cell) => cell !== null);
}

/**
 * The board after playing `index`, or the SAME board when that move is not
 * legal (the square is taken, or the game is already decided). Returning the
 * same reference lets the caller skip a re-render on a rejected tap.
 */
export function play(board: Board, index: number): Board {
  if (index < 0 || index >= 9) return board;
  if (board[index] !== null || winningLine(board) !== null) return board;
  const next = board.slice();
  next[index] = turnOf(board);
  return next;
}
