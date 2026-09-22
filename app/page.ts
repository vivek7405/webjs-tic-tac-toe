import { html } from '@webjsdev/core';
// Importing the component registers its tag. The page itself is server-only
// HTML: all the interactivity lives inside the element.
import '#modules/tic-tac-toe/components/tic-tac-toe-board.ts';

export const metadata = {
  title: 'Tic Tac Toe',
  description: 'A two-player tic tac toe game. X opens, O follows, three in a row wins.',
};

export default function Home() {
  return html`
    <div class="flex flex-col items-center gap-8">
      <header class="flex flex-col items-center gap-2 text-center">
        <h1 class="m-0 text-3xl font-bold tracking-tight">Tic Tac Toe</h1>
        <p class="m-0 text-sm text-muted-foreground">
          Two players, one board. X opens, three in a row wins.
        </p>
      </header>

      <!-- Size the HOST, not only an inner wrapper: the custom element is the
           box this centering column lays out. -->
      <tic-tac-toe-board class="w-full max-w-[420px]"></tic-tac-toe-board>
    </div>
  `;
}
