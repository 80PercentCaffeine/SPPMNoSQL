var myApp = angular.module('myApp',['ngRoute']);

myApp.config(function($routeProvider){
    $routeProvider.when('/?Page=ManageItems',{
        controller:'itemController',
        templateUrl:'itemManager.ejs'
    })
    .when('/?Page=MakeSales',{
        controller:'itemController',
        templateUrl:'makeSales.ejs'
    })
    
    .when('/',{
        controller: 'itemController',
        templateUrl: 'index.html'
    });
    
});