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

// enums
var CELL_VALUE = Object.freeze({
  blank : ' ',
  bomb  : 'x'
});

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
        row      : row,
        col      : col,
        value    : CELL_VALUE.blank,
        revealed : false,
        flagged  : false
      };
    });
  });
}

// place bombs randomly on the board
function placeBombs() {
  var cells = _.sample(_.flatten(state.board), bombCount);
  _.each(cells, function(cell) {
    cell.value = CELL_VALUE.bomb;
  });
}

// set the cell value of non bomb cells to be the number of adjacent bombs
function setNumbers() {
  _.each(getUnrevealedNonBombCells(), function(cell) {
    var adjacentBombs = _.where(getSurroundingCells(cell), { value: CELL_VALUE.bomb });
    cell.value = adjacentBombs.length > 0 ? adjacentBombs.length : CELL_VALUE.blank;
  });
}

// get a 1D array of all current blank cells
function getUnrevealedNonBombCells() {
  return _.filter(_.flatten(state.board), function(cell) {
    return cell.value !== CELL_VALUE.bomb && !cell.revealed;
  });
}

// get all cells surrounding a given cell (including itself)
function getSurroundingCells(cell) {
  var cells = [];

  _.each(_.range(-1, 2), function(i) {
    _.each(_.range(-1, 2), function(j) {
      var row = state.board[cell.row + i];
      var col = cell.col + j;

      // _.isUndefined(row) ? _.noop() : _.isUndefined(row[col]) ? _.noop() : cells.push(row[col]);
      if (!_.isUndefined(row) && !_.isUndefined(row[col])) {
        cells.push(row[col]);
      }
    });
  });

  return cells;
}

// reveal a cell
function reveal(row, col) {
  if (state.gameOver) return;

  var cell = _.findWhere(_.flatten(state.board), { row: row, col: col });
  cell.revealed = true;

  // if this cell is blank, reveal all adjacent cells
  if (cell.value === CELL_VALUE.blank) {
    _.each(_.where(getSurroundingCells(cell), { revealed: false, flagged: false }), function(adjacentCell) {
      reveal(adjacentCell.row, adjacentCell.col);
    });
  }

  // game over if we revealed a bomb
  state.gameOver = cell.value === CELL_VALUE.bomb || getUnrevealedNonBombCells().length === 0;
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
