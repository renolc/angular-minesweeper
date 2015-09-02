'use strict';

var _ = require('underscore');

// game state
var state = {
  board     : [],
  gameOver  : false,
  flagsLeft : 0
};

// properties
var boardSize;
var bombCount;

// init game and return the board
function game(size, bombs) {
  boardSize = size  || 9;
  bombCount = bombs || 10;

  reset();

  return state;
}

// build out the board 2d array
function buildBoard() {
  state.board = _.times(boardSize, function(row) {
    return _.times(boardSize, function(col) {
      return {
        row           : row,
        col           : col,
        revealed      : false,
        flagged       : false,
        isBomb        : false,
        adjacentBombs : null
      };
    });
  });
}

// place bombs randomly on the board
function placeBombs() {
  var cells = _.sample(_.flatten(state.board), bombCount);
  _.each(cells, function(cell) {
    cell.isBomb = true;
  });
}

// set the cell adjacentBomb count of non bomb cells to be the number of adjacent bombs
function setNumbers() {
  _.each(getUnrevealedNonBombCells(), function(cell) {
    var adjacentBombs  = _.where(getSurroundingCells(cell), { isBomb: true });
    cell.adjacentBombs = adjacentBombs.length > 0 ? adjacentBombs.length : null;
  });
}

// get a 1D array of all current unrevealed non bomb cells
function getUnrevealedNonBombCells() {
  return _.where(_.flatten(state.board), { isBomb: false, revealed: false });
}

// get all cells surrounding a given cell (including itself)
function getSurroundingCells(cell) {
  var cells = [];

  _.each(_.range(-1, 2), function(i) {
    _.each(_.range(-1, 2), function(j) {
      var row = state.board[cell.row + i];
      var col = cell.col + j;

      // if cell is valid, add to list
      (_.isUndefined(row) || _.isUndefined(row[col])) ? _.noop() : cells.push(row[col]);
    });
  });

  return cells;
}

// reveal a cell
function reveal(row, col) {
  if (state.gameOver) return;

  var flatBoard = _.flatten(state.board);
  var cell      = _.findWhere(flatBoard, { row: row, col: col });
  cell.revealed = true;

  // if this cell is blank, reveal all adjacent cells
  var toReveal = (!cell.isBomb && cell.adjacentBombs === null) ?
                   _.where(getSurroundingCells(cell), { revealed: false, flagged: false }) : [];

  // if this cell is a bomb, reveal all other bombs
  toReveal = (cell.isBomb) ? _.where(flatBoard, { revealed: false, isBomb: true, flagged: false }) : toReveal;

  // cascade reveal
  _.each(toReveal, function(cell) {
    reveal(cell.row, cell.col);
  });

  // game over if we revealed a bomb
  state.gameOver = cell.isBomb || getUnrevealedNonBombCells().length === 0;
  return state.gameOver;
}

// toggle the flagged state of a cell
function toggleFlag(row, col) {
  if (state.gameOver) return;

  var cell = _.findWhere(_.flatten(state.board), { row: row, col: col });

  if (state.flagsLeft === 0 && !cell.flagged) return;

  cell.flagged = !cell.flagged;
  state.flagsLeft -= cell.flagged ? 1 : -1;
}

// reset state of game back to beginning
function reset() {
  buildBoard();
  placeBombs();
  setNumbers();

  state.gameOver  = false;
  state.flagsLeft = bombCount;
}

game.state      = state;
game.reveal     = reveal;
game.toggleFlag = toggleFlag;
game.reset      = reset;

module.exports = game;
