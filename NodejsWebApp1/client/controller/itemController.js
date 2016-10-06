var myApp = angular.module('myApp');

myApp.controller('itemController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){
        console.log('itemController is loaded finally');
            $scope.getItems = function(){
                $http.get('/viewItem').success(function(response){
                     $scope.returnedItems = response;                                
            });
        }
         
            $scope.salesItems = [];
            
            $scope.calculatePrice=function(item, itemQuantity){
                $scope.price = item.price;
				if(itemQuantity == undefined){
					$scope.quantity = 1;
				}
				else{
					$scope.quantity = itemQuantity;
				}
                $scope.itemName = item.name;
                var total;
                $scope.total = $scope.price * $scope.quantity;
                
                //add to array of sales items
                $scope.salesItems = $scope.salesItems.concat ([
                {"name" : $scope.itemName, "totalPrice" : $scope.total}
                ]);
                
                
                $scope.totalSalePrice = 0;
                console.log($scope.totalSalePrice);
                
                for (var i = 0; i < $scope.salesItems.length; i++)
                    {
                        $scope.totalSalePrice += $scope.salesItems[i].totalPrice;
                    }
                
                console.log($scope.total);
                console.log($scope.totalSalePrice);
            }
            
            
}]);