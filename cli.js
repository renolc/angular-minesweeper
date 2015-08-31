'use strict';

var _ = require('underscore');

var game  = require('./components/game');
var board = game();

// print the board
window.printBoard = function() {
  var string = _.reduce(board, function(result, row) {
    return result + _.reduce(row, function(result, cell) {
      return result + (cell.revealed ? cell.value : cell.flagged ? '?' : '-');
    }, '') + '\n';
  }, '') + '\n';

  console.log(string);
}

// reveal a cell, then print the board agaim
window.reveal = function(row, col) {
  game.reveal(row, col);
  printBoard();
}

window.toggleFlag = function(row, col) {
  game.toggleFlag(row, col);
  printBoard();
}

printBoard();
