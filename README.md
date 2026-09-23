# Tic Tac Toe

A very small two-player tic tac toe game, built with [WebJs](https://webjs.dev):
buildless native ES modules, server-rendered HTML, and one interactive web
component.

Live at [tic-tac-toe.pilotrun.app](https://tic-tac-toe.pilotrun.app).

X opens, the marks alternate, three in a row wins, and a full board with no
line is a draw. The winning line is highlighted, the board freezes once the
game is decided, and **New game** clears it.

## How it is put together

| Path | What it holds |
| --- | --- |
| `app/page.ts` | The home route. Server-only HTML that renders the board element. |
| `app/layout.ts` | The document shell and the design tokens, written once with CSS `light-dark()` so light and dark both come from one declaration. |
| `modules/tic-tac-toe/utils/game.ts` | The pure rules (turn order, legal moves, winning line, draw). No DOM, no server. |
| `modules/tic-tac-toe/components/tic-tac-toe-board.ts` | The one island. It owns the board state, the nine squares, and their click handlers. |
| `components/ui/button.ts` | The `@webjsdev/ui` button class helper, themed to the tokens above. |

The game keeps no data between visits, so it uses no database and no server
action. The page is fully server-rendered, and only the board component ships
JavaScript.

## Run it

```sh
npm install
npm run dev          # http://localhost:8080
```

## Tests and checks

```sh
npm test             # unit + browser tests
npm run ci           # every gate: checks, health, types, audit, all test layers
```

The rules are covered by unit tests (`test/tic-tac-toe/game.test.ts`) and the
component by a browser test in real Chromium
(`modules/tic-tac-toe/components/browser/`), which also measures the board
geometry so a square cannot silently resize as the board fills.

## License

MIT
