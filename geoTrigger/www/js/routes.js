angular.module('app.routes', ['restangular'])

.config(function($stateProvider, $urlRouterProvider, RestangularProvider) {

  RestangularProvider.setBaseUrl('http://54.244.107.56');
  RestangularProvider.setDefaultHttpFields({cache: false});

  $stateProvider

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })
  .state('location', {
    cache: false,
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
  .state('myLocations', {
    cache: false,
    url: '/myLocations',
    templateUrl: 'templates/userLocations.html',
    controller: 'userLocationsCtrl'
  })
  .state('viewLocation/:id', {
    cache: false,
    url: '/viewLocation/:id',
    templateUrl: 'templates/viewLocation.html',
    controller: 'viewLocationCtrl'
  })
  .state('seeBeers', {
    cache: false,
    url: '/beer',
    templateUrl: 'templates/beers.html',
    controller: 'beersCtrl'
  })
  .state('myBeers', {
    cache: false,
    url: '/myBeers',
    templateUrl: 'templates/myBeers.html',
    controller: 'userBeerCtrl'
  })
  .state('addBeer', {
    url: '/create/beer/',
    templateUrl: 'templates/addBeer.html',
    controller: 'addBeerCtrl'
  })
  .state('viewBeers/:id', {
    cache: false,
    url: '/viewBeer/:id',
    templateUrl: 'templates/viewBeer.html',
    controller: 'viewBeerCtrl'
  })
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  .state('logout', {
    url: '/logout',
    templateUrl: 'templates/logout.html',
    controller: 'logoutCtrl'
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
