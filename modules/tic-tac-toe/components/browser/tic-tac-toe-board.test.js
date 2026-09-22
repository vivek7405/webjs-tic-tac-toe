// Co-located browser test for the board component. It runs in real Chromium
// against the real SSR output and its hydration. The runner's mocha UI is `tdd`
// (suite/test) and there is no assertion library in the importmap, so a tiny
// inline assert is used.
import { html } from '@webjsdev/core';
import { ssrFixture } from '@webjsdev/core/testing';
import '../tic-tac-toe-board.ts';

const assert = (cond, msg) => { if (!cond) throw new Error(msg || 'assertion failed'); };

// The component is styled with Tailwind utilities, so the geometry test below
// needs the real compiled stylesheet. It is served by the same webjs pipeline
// that serves the modules (run `npm run css:build` if it is missing).
async function loadStylesheet() {
  if (document.querySelector('link[data-test-tailwind]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/public/tailwind.css';
  link.dataset.testTailwind = '';
  const loaded = new Promise((resolve, reject) => {
    link.addEventListener('load', resolve, { once: true });
    link.addEventListener('error', () => reject(new Error('public/tailwind.css did not load; run npm run css:build')), { once: true });
  });
  document.head.appendChild(link);
  await loaded;
}

const squares = (el) => [...el.querySelectorAll('[role=group] button')];
const marks = (el) => squares(el).map((b) => b.textContent.trim());
const statusText = (el) => el.querySelector('[aria-live=polite]').textContent.trim();

// Play a sequence of square indices in order, waiting for each re-render.
async function playAll(el, indices) {
  for (const index of indices) {
    squares(el)[index].click();
    await el.updateComplete;
  }
}

suite('tic-tac-toe-board', () => {
  test('SSRs nine empty squares with X to play', async () => {
    const el = await ssrFixture(html`<tic-tac-toe-board></tic-tac-toe-board>`);
    assert(squares(el).length === 9, 'nine squares render');
    assert(marks(el).every((m) => m === ''), 'every square starts empty');
    assert(statusText(el) === 'X to play', 'X opens, got: ' + statusText(el));
  });

  test('alternates marks and announces the turn', async () => {
    const el = await ssrFixture(html`<tic-tac-toe-board></tic-tac-toe-board>`);
    await playAll(el, [4]);
    assert(marks(el)[4] === 'X', 'the first click plays X');
    assert(statusText(el) === 'O to play', 'the turn passes to O');
    await playAll(el, [0]);
    assert(marks(el)[0] === 'O', 'the second click plays O');
    assert(statusText(el) === 'X to play', 'the turn passes back to X');
  });

  test('ignores a click on a taken square', async () => {
    const el = await ssrFixture(html`<tic-tac-toe-board></tic-tac-toe-board>`);
    await playAll(el, [4]);
    squares(el)[4].click(); // disabled, so this is a no-op
    await el.updateComplete;
    assert(marks(el)[4] === 'X', 'the square keeps its mark');
    assert(statusText(el) === 'O to play', 'the turn did not advance');
  });

  test('a win highlights the line, freezes the board, and New game resets it', async () => {
    const el = await ssrFixture(html`<tic-tac-toe-board></tic-tac-toe-board>`);
    await playAll(el, [0, 3, 1, 4, 2]); // X takes the top row
    assert(statusText(el) === 'X wins', 'the winner is announced, got: ' + statusText(el));

    const won = squares(el);
    assert([0, 1, 2].every((i) => won[i].className.includes('bg-primary')), 'the winning line is highlighted');
    assert(won.every((b) => b.disabled), 'every square is frozen once the game is over');

    await playAll(el, [5]);
    assert(marks(el)[5] === '', 'no further mark can be played');

    el.querySelectorAll('button')[9].click(); // the New game button follows the nine squares
    await el.updateComplete;
    assert(marks(el).every((m) => m === ''), 'the board is cleared');
    assert(statusText(el) === 'X to play', 'X opens the new game');
  });

  test('draws a full board with no winner', async () => {
    const el = await ssrFixture(html`<tic-tac-toe-board></tic-tac-toe-board>`);
    await playAll(el, [4, 0, 1, 7, 5, 3, 6, 2, 8]);
    assert(statusText(el) === 'Draw', 'a full undecided board is a draw, got: ' + statusText(el));
  });

  test('keeps every square the same size as the board fills', async () => {
    await loadStylesheet();
    const el = await ssrFixture(html`<tic-tac-toe-board class="block w-[300px]"></tic-tac-toe-board>`);
    await el.updateComplete;

    const sizes = () => squares(el).map((b) => b.getBoundingClientRect());
    const empty = sizes();
    assert(empty[0].width > 50, 'the squares have real size, got: ' + empty[0].width);
    for (const box of empty) {
      assert(Math.abs(box.width - empty[0].width) < 1, 'every square is the same width');
      assert(Math.abs(box.height - empty[0].height) < 1, 'every square is the same height');
      assert(Math.abs(box.width - box.height) < 1, 'every square is square');
    }

    await playAll(el, [0, 4, 8, 1]);

    // The mark scales with the square. A collision in the merged class string
    // (a dropped font-size) would leave it at the inherited body size.
    const markSize = parseFloat(getComputedStyle(squares(el)[0]).fontSize);
    assert(markSize > 24, 'the mark is sized to the square, got: ' + markSize);

    const filled = sizes();
    for (let i = 0; i < filled.length; i++) {
      assert(Math.abs(filled[i].width - empty[i].width) < 1, 'square ' + i + ' did not resize');
      assert(Math.abs(filled[i].height - empty[i].height) < 1, 'square ' + i + ' did not reflow');
    }
  });
});
