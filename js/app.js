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
app.controller('HomeCtrl', function ($scope, $location, $http , $timeout) {
    
            var rowCount = 30;
            var colCount = 76;
            var initialRandomLife = [];
            var generationDurationInMs = 50;
            
            $scope.generationCount = 0;
            $scope.numberOfGenerations = 50000;
            $scope.numberOfSpontaneousLifeforms = 30;
            
            var getNeighborCoordinates = function(x, y) {
                var loc_1 = { x: x + 1, y: y };
                var loc_2 = { x: x, y: y + 1 };
                var loc_3 = { x: x - 1, y: y };
                var loc_4 = { x: x, y: y - 1 };
                var loc_5 = { x: x + 1, y: y - 1 };
                var loc_6 = { x: x + 1, y: y + 1 };
                var loc_7 = { x: x - 1, y: y - 1 };
                var loc_8 = { x: x - 1, y: y + 1 };
                
                var allCoordinates = [loc_1, loc_2, loc_3, loc_4, loc_5, loc_6, loc_7, loc_8];
                var properLocations = [];
                for(var i = 0; i < allCoordinates.length; i++) {
                    var coord = allCoordinates[i];
                    if(coord.x >= 0 && coord.y >= 0 && coord.x < rowCount && coord.y < colCount) {
                        properLocations.push(coord);
                    }
                }              
                return properLocations;
            };
            
            var getRandomNumber = function(low, high) {
                return Math.floor(Math.random() * high) + low;
            };
            
            var runNextGeneration = function() {
                console.log('generation ' + $scope.generationCount.toString() + ' started');
                for(var i = 0; i < rowCount; i++) {
                    for(var j = 0; j < colCount; j++) {
                        
                        // get neighbors
                        var neighbors = getNeighborCoordinates(i, j);
                        var numberOfNeighborsAlive = 0;
                        for(var k = 0; k < neighbors.length; k++) {
                            var neighbor = $scope.rows[neighbors[k].x][neighbors[k].y];
                            if(neighbor.isAlive === true) {
                                numberOfNeighborsAlive++;
                            }
                        }
                        
                        // apply rules    
                        if($scope.rows[i][j].isAlive === true) {
                            // rule 1: Any live cell with fewer than two live neighbors 
                            // dies, as if caused by under-population.  
                            if(numberOfNeighborsAlive < 2) {
                                $scope.rows[i][j].isAlive = false;
                            }
                            
                            // rule 2: Any live cell with two or three live neighbors 
                            // lives on to the next generation.
                            // do nothing
                            
                            // rule 3: ny live cell with more than three live neighbors 
                            // dies, as if by overcrowding.
                            if(numberOfNeighborsAlive > 3) {
                                $scope.rows[i][j].isAlive = false;
                            }
                        }
                        else {
                            // rule 4: Any dead cell with exactly three live neighbors 
                            // becomes a live cell, as if by reproduction.
                            if(numberOfNeighborsAlive == 3) {
                                $scope.rows[i][j].isAlive = true;
                            }
                        }
                    }
                }
                
                $scope.$apply();
                $scope.generationCount++;
                if($scope.generationCount < $scope.numberOfGenerations) {
                    $timeout(runNextGeneration, generationDurationInMs);
                }
            };

            $scope.start = function() {
                
                $scope.rows = [];
            
                // setup board
                for(var i = 0; i < rowCount; i++) {
                    $scope.rows.push([]);
                    for(var j = 0; j < colCount; j++) {
                        var id = i.toString() + j.toString();
                        var isAlive = false;
                        var cell = {
                            id: id,
                            isAlive: isAlive
                        };
                        $scope.rows[i].push(cell);
                    }
                }
                
                // all coordinates of lifeforms
                var coordinatesOfLifeforms = [];
                
                // generate random life
                for(var i = 0; i < $scope.numberOfSpontaneousLifeforms; i++) {
                    var randomX = getRandomNumber(0, rowCount);
                    var randomY = getRandomNumber(0, colCount);
                    coordinatesOfLifeforms.push({
                        x: randomX,
                        y: randomY
                    });
                }
                
                // update cells in board
                for(var i = 0; i < rowCount; i++) {
                    for(var j = 0; j < colCount; j++) {
                        // check if in coordinates of life forms
                        for(var k = 0; k < coordinatesOfLifeforms.length; k++) {
                            if(coordinatesOfLifeforms[k].x == i && coordinatesOfLifeforms[k].y == j) {
                                var neighbors = getNeighborCoordinates(i, j);
                                var randomNeighbor1 = neighbors[getRandomNumber(0, neighbors.length)];
                                var randomNeighbor2 = neighbors[getRandomNumber(0, neighbors.length)];
                                
                                $scope.rows[i][j].isAlive = true;
                                $scope.rows[randomNeighbor1.x][randomNeighbor1.y].isAlive = true;
                                $scope.rows[randomNeighbor2.x][randomNeighbor2.y].isAlive = true;
                            }
                        }
                    }   
                }
                
                $scope.randomColor = function (cell) {
                  var selected;
                  var colors = ['blue', 'green', 'pink', 'red', 'orange', 'yellow'];
                  if (cell.isAlive) {
                    selected = colors[Math.floor(Math.random() * colors.length)];
                  };
                  return selected;
                }

                // kick off generation cycles
                $timeout(runNextGeneration, generationDurationInMs); 
            }
});