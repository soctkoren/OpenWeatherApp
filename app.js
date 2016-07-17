let app = angular.module('mainApp', [
  'ngMaterial',
  'ui.router'
]);

app.config([
  '$mdThemingProvider', '$stateProvider', '$urlRouterProvider',
  function($mdThemingProvider, $stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $mdThemingProvider.theme('default')
        .primaryPalette('indigo')
        .accentPalette('pink')
        .backgroundPalette('grey');

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
