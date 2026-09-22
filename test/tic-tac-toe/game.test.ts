import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Board } from '#modules/tic-tac-toe/types.ts';
import {
  emptyBoard,
  isDraw,
  play,
  turnOf,
  winnerOf,
  winningLine,
} from '#modules/tic-tac-toe/utils/game.ts';

// A board written the way it reads on screen, with '.' for an empty square.
function boardOf(rows: string): Board {
  const cells = rows.replace(/\s/g, '').split('');
  assert.equal(cells.length, 9, 'a board has nine squares');
  return cells.map((c) => (c === 'X' || c === 'O' ? c : null));
}

test('a fresh board is empty and X opens', () => {
  const board = emptyBoard();
  assert.equal(board.length, 9);
  assert.ok(board.every((cell) => cell === null));
  assert.equal(turnOf(board), 'X');
});

test('turns alternate from X', () => {
  assert.equal(turnOf(boardOf('X.. ... ...')), 'O');
  assert.equal(turnOf(boardOf('XO. ... ...')), 'X');
});

test('play puts the current mark on an empty square', () => {
  const first = play(emptyBoard(), 4);
  assert.equal(first[4], 'X');
  assert.equal(play(first, 0)[0], 'O');
});

test('play rejects a taken square and leaves the board untouched', () => {
  const board = play(emptyBoard(), 4);
  assert.equal(play(board, 4), board, 'the same board comes back');
});

test('play rejects a move once the game is won', () => {
  const won = boardOf('XXX OO. ...');
  assert.equal(play(won, 5), won);
});

test('a completed row, column, or diagonal wins', () => {
  assert.deepEqual(winningLine(boardOf('XXX OO. ...')), [0, 1, 2]);
  assert.deepEqual(winningLine(boardOf('OOX ..X ..X')), [2, 5, 8]);
  assert.deepEqual(winningLine(boardOf('X.O .XO ..X')), [0, 4, 8]);
  assert.equal(winnerOf(boardOf('X.O .XO ..X')), 'X');
});

test('an undecided board has no winner and is no draw', () => {
  const board = boardOf('XO. .X. ...');
  assert.equal(winningLine(board), null);
  assert.equal(winnerOf(board), null);
  assert.equal(isDraw(board), false);
});

test('a full board nobody won is a draw', () => {
  const board = boardOf('XOX XOO OXX');
  assert.equal(winnerOf(board), null);
  assert.equal(isDraw(board), true);
});

test('a full board with a winner is not a draw', () => {
  assert.equal(isDraw(boardOf('XXX OOX OXO')), false);
});
