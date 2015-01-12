var app = angular.module('WikiReaderApp', ['ngRoute', 'ngAnimate', 'ngSanitize']);

app.config(['$routeProvider',
  function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/view/search',
                controller: 'SearchController'
            })
            .when('/search/:articleName', {
                templateUrl: '/view/search',
                controller: 'SearchController'
            })
            .when('/article/:articleName*', {
                templateUrl: '/view/article',
                controller: 'ArticleController'
            })
            .otherwise({
                redirectTo: '/'
            });
  }]);