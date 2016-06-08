angular
  .module('GetARoundApp', ['angular-jwt', 'ngResource', 'ui.router'])
  .constant('API', 'http://localhost:3000/api')
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  })
  .config(MainRouter);

function MainRouter($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "views/home.html"
    })
    .state('login', {
      url: "/login",
      templateUrl: "views/login.html"
    })
    .state('register', {
      url: "/register",
      templateUrl: "views/register.html"
    })
    .state('event', {
      url: "/event",
      templateUrl: "views/event.html"
    })
    .state('history', {
      url: "/history",
      templateUrl: "views/history.html"
    });

  $urlRouterProvider.otherwise('/');
}