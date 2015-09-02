# angular-minesweeper

Navigate to [http://renolc.github.io/angular-minesweeper/](http://renolc.github.io/angular-minesweeper/) for a live
example of the app.

- Left Click  - reveal a cell
- Right Click - flag/unflag a cell

## Setup

```bash
git clone git@github.com:renolc/angular-minesweeper.git
cd angular-minesweeper
npm i
```

## CLI mode

Run the game in a simple command line mode with trimmed down features.

```bash
npm run cli
```
Navigate to [http://localhost:9966](http://localhost:9966) and open the JS console.

### Commands

```javascript
help();               // print game commands
reveal(row, col);     // reveal a cell at position (row, col)
toggleFlag(row, col); // toggle the flagged status at position (row, col)
reset();              // reset (start a new game)
printBoard();         // reprint the board
```

## Local web app mode

Run the game as a web app with a visual interface.

```bash
npm start
```
Navigate to [http://localhost:9966](http://localhost:9966) and open the JS console.
