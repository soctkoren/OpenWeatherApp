let app = angular.module('mainApp', [
  'ngMaterial',
  'ui.router'
]);

app.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('home', {
      url: '/',
      views: {
        '': {
          controller: 'IndexCtrl',
          controllerAs: 'IndexCtrl'
        }
      }
    });
  }
]);
