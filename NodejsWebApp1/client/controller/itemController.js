var myApp = angular.module('myApp');

myApp.controller('itemController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){
        console.log('itemController is loaded finally');
            $scope.getItems = function(){
                $http.get('/viewItem').success(function(response){
                     $scope.returnedItems = response;                                
            });
        }
    
}]);