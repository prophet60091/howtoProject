angular.module('app.routes', ['restangular'])

.config(function($stateProvider, $urlRouterProvider, RestangularProvider) {

  RestangularProvider.setBaseUrl('http://54.244.107.56');

  $stateProvider

      .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('location', {
    url: '/location',
    templateUrl: 'templates/location.html',
    controller: 'locationCtrl'
  })

  .state('addLocation', {
    url: '/create/location/:address/{noClue}',
    templateUrl: 'templates/addLocation.html',
    controller: 'addLocationCtrl',
    address:null,
    noClue: null
  })
  .state('userLocations', {
    url: '/myLocations',
    templateUrl: 'templates/userLocations.html',
    controller: 'userLocationsCtrl'
  })
  .state('seeBeers', {
    url: '/beer',
    templateUrl: 'templates/beers.html',
    controller: 'beersCtrl'
  })
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  .state('register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'RegisterCtrl'
  })
    .state('wall', {
      url: '/wall',
      templateUrl: 'templates/wall.html',
      controller: 'WallCtrl'
    });


$urlRouterProvider.otherwise('/login')


})

.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
    if (!AuthService.isAuthenticated()) {
      console.log(next.name);
      if (next.name !== 'login' && next.name !== 'register') {
        event.preventDefault();
        $state.go('login');
      }
    }else{
      console.log("authorized")
    }
  });
});
