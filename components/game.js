'use strict';

var _ = require('underscore');

// game state
var board = [];

// enums
var CELL_VALUE = Object.freeze({
  blank : 0,
  bomb  : 'x'
});

// init game and return the board
function game(boardSize, bombCount) {
  boardSize = boardSize || 9;
  bombCount = bombCount || 10;

  board = _.times(boardSize, function(row) {
    return _.times(boardSize, function(col) {
      return {
        row      : row,
        col      : col,
        value    : CELL_VALUE.blank,
        revealed : false
      };
    });
  });

  placeBombs(bombCount);
  setNumbers();

  return board;
}

// place bombs randomly on the board
function placeBombs(bombCount) {
  var cells = _.sample(_.flatten(board), bombCount);
  _.each(cells, function(cell) {
    cell.value = CELL_VALUE.bomb;
  });
}

// set the cell value of non bomb cells to be the number of adjacent bombs
function setNumbers() {
  _.each(getBlankCells(), function(cell) {
    var adjacentBombs = _.where(getSurroundingCells(cell), { value: CELL_VALUE.bomb });
    cell.value = adjacentBombs.length;
  });
}

// get a 1D array of all current blank cells
function getBlankCells() {
  return _.where(_.flatten(board), { value: CELL_VALUE.blank });
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
  var cell = _.findWhere(_.flatten(board), { row: row, col: col });
  cell.revealed = true;

  // if this cell is blank, reveal all adjacent cells
  if (cell.value === CELL_VALUE.blank) {
    _.each(_.where(getSurroundingCells(cell), { revealed: false }), function(adjacentCell) {
      reveal(adjacentCell.row, adjacentCell.col);
    });
  }
}

game.reveal = reveal;

module.exports = game;
