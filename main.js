'use strict';

var angular = require('angular');
var app     = require('./modules/app');

// init directives
app.directive('ngRightClick', require('./directives/ngRightClick'));
app.directive('board',        require('./directives/board/board'));

// init controller
app.controller('GameCtrl', require('./controllers/game'));
