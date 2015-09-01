'use strict';

var game = require('../modules/game');

module.exports = function() {
  this.board = game();

  this.reveal = function(row, col) {
    game.reveal(row, col);
  };

  this.toggleFlag = function(row, col) {
    game.toggleFlag(row, col);
  };

  this.reset = function() {
    game.reset();
  };
};
