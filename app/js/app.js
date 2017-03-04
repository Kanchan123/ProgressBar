var appRoot = angular.module('progressbar', ['ui.router']);

appRoot.config([ '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
    "use strict";
  $urlRouterProvider.otherwise('/');
  //
  // Now set up the states
  $stateProvider
    .state('progressBarList', {
      url: '/',
      templateUrl: "templates/mainViews/progressBarList.html"
    });
}]);