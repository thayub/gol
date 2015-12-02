/**
 * AngularJS Web Application for conway's Game of Life implementation
 */
var app = angular.module('mainApp', [
  'ngRoute'
]);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when("/", {templateUrl: "partials/home.html", controller: "HomeCtrl"})
    // error page
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "HomeCtrl"});
}]);

/**
 * Controls all other Pages
 */
app.controller('HomeCtrl', function ($scope, $location, $http) {
  alert("The controller is loading");
});