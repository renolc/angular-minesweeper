'use strict';

var angular = require('angular');
var app     = require('./modules/app');

// init directives
app.directive('ngRightClick', require('./directives/ngRightClick'));
app.directive('board',        require('./directives/board/board'));

// init services
app.service('game', require('./services/game'));

// init controller
app.controller('GameCtrl', require('./controllers/game'));
