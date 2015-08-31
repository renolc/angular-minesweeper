'use strict';

var _ = require('underscore');

// game state
var board    = [];
var gameOver = false;

// properties
var boardSize = 9;
var bombCount = 10;

// enums
var CELL_VALUE = Object.freeze({
  blank : 0,
  bomb  : 'x'
});

// init game and return the board
function game(size, bombs) {
  boardSize = size  || boardSize;
  bombCount = bombs || bombCount;

  return reset();
}

// build out the board 2d array
function buildBoard() {
  board = _.times(boardSize, function(row) {
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
  var cells = _.sample(_.flatten(board), bombCount);
  _.each(cells, function(cell) {
    cell.value = CELL_VALUE.bomb;
  });
}

// set the cell value of non bomb cells to be the number of adjacent bombs
function setNumbers() {
  _.each(getUnrevealedNonBombCells(), function(cell) {
    var adjacentBombs = _.where(getSurroundingCells(cell), { value: CELL_VALUE.bomb });
    cell.value = adjacentBombs.length;
  });
}

// get a 1D array of all current blank cells
function getUnrevealedNonBombCells() {
  return _.filter(_.flatten(board), function(cell) {
    return cell.value !== CELL_VALUE.bomb && !cell.revealed;
  });
}

// get all cells surrounding a given cell (including itself)
function getSurroundingCells(cell) {
  var cells = [];

  _.each(_.range(-1, 2), function(i) {
    _.each(_.range(-1, 2), function(j) {
      var row = board[cell.row + i];
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
  if (gameOver) return;

  var cell = _.findWhere(_.flatten(board), { row: row, col: col });
  cell.revealed = true;

  // if this cell is blank, reveal all adjacent cells
  if (cell.value === CELL_VALUE.blank) {
    _.each(_.where(getSurroundingCells(cell), { revealed: false }), function(adjacentCell) {
      reveal(adjacentCell.row, adjacentCell.col);
    });
  }

  // game over if we revealed a bomb
  gameOver = cell.value === CELL_VALUE.bomb || getUnrevealedNonBombCells().length === 0;
  return gameOver;
}

// toggle the flagged state of a cell
function toggleFlag(row, col) {
  if (gameOver) return;

  var cell = _.findWhere(_.flatten(board), { row: row, col: col });
  cell.flagged = !cell.flagged;
}

// reset state of game back to beginning
function reset() {
  buildBoard();
  placeBombs();
  setNumbers();

  gameOver = false;

  return board;
}

game.reveal     = reveal;
game.toggleFlag = toggleFlag;
game.reset      = reset;

module.exports = game;
