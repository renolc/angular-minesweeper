'use strict';

var _ = require('underscore');

var game = require('./modules/game');

// init the game
game();

// print the board
window.printBoard = function() {
  var string = _.reduce(game.state.board, function(result, row) {
    return result + _.reduce(row, function(result, cell) {
      return result + (cell.revealed ? (cell.isBomb ? 'x' : cell.adjacentBombs || '.') : (cell.flagged ? '?' : '-'));
    }, '') + '\n';
  }, '') + '\n';

  console.log(string);
}

// reveal a cell, then reprint the board
window.reveal = function(row, col) {
  var ret = game.reveal(row, col);
  printBoard();
  return ret;
}

// flag a cell, then reprint board
window.toggleFlag = function(row, col) {
  game.toggleFlag(row, col);
  printBoard();
}

// reset the game, and print it
window.reset = function() {
  game.reset();
  printBoard();
}

// print commands
window.help = function() {
  console.log('> reveal(row, col)\n    reveal a cell value\n\n');
  console.log('> toggleFlag(row, col)\n    toggle a flag on a cell\n\n');
  console.log('> reset()\n    start a new game');
}

printBoard();
