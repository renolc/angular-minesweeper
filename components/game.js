'use strict';

var _ = require('underscore');

// game properties
var board     = [];
var boardSize = 10;
var bombCount = 10;

// init game and return the board
function game() {
  board = _.times(boardSize, function(row) {
    return _.times(boardSize, function(col) {
      return {
        row   : row,
        col   : col,
        value : 0
      };
    });
  });

  placeBombs();
  setNumbers();

  return board;
}

// place bombs randomly on the board
function placeBombs() {
  _.times(bombCount, function() {
    var blankCells = getBlankCells();
    blankCells[_.random(blankCells.length - 1)].value = 'x';
  });
}

// set the cell value of non bomb cells to be the number of adjacent bombs
function setNumbers() {
  _.each(getBlankCells(), function(cell) {
    var adjacentBombs = _.where(getSurroundingCells(cell), { value: 'x' });
    cell.value = adjacentBombs.length;
  });
}

// get a 1D array of all current blank cells
function getBlankCells() {
  return _.where(_.flatten(board), { value: 0 });
}

// get all cells surrounding a given cell (including itself)
function getSurroundingCells(cell) {
  var cells = [];

  _.each(_.range(-1, 2), function(i) {
    _.each(_.range(-1, 2), function(j) {
      var row = board[cell.row + i];
      var col = cell.col + j;

      _.isUndefined(row) ? _.noop() : _.isUndefined(row[col]) ? _.noop() : cells.push(row[col]);
    });
  });

  return cells;
}

// stringify the board
game.stringify = function() {
  var string = _.reduce(board, function(result, row) {
    return result + _.reduce(row, function(result, cell) {
      return result + cell.value;
    }, '') + '\n';
  }, '');

  return string;
}

module.exports = game;
