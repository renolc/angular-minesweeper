'use strict';

module.exports = function($scope, game) {
  $scope.game = game.simulation;

  // init the game
  $scope.game();
};
