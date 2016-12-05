angular.module('app.services', ['restangular'])

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}])
.service('GoogleAddress', [function(){
  this.currentLocation = null;
  this.address = null;
  this.lat = null;
  this.lng = null;
  this.latLng = null;
}])

//Sets up restangular to get the id parameter correct it expects id not _id
.factory('BeerRestangular', function(Restangular) {
  return Restangular.withConfig(function(RestangularConfigurer) {
    RestangularConfigurer.setRestangularFields({
      id: '_id'
    });
  });
})
//get Beer s
  .factory('Beer', function(BeerRestangular){
    return BeerRestangular.service('beer'); // The actual api resource from whence it pulls
  })
  .factory('MyBeers', function(BeerRestangular){
    return BeerRestangular.service('mybeers'); // The actual api resource from whence it pulls
  })
  //get Locations
  .factory('Location', function(BeerRestangular){
    return BeerRestangular.service('location'); // The actual api resource from whence it pulls
  })
  //get My Locations
  .factory('MyLocations', function(BeerRestangular){
    return BeerRestangular.service('mylocations'); // The actual api resource from whence it pulls
  })
  // .factory('Login', function(BeerRestangular){
  //   return BeerRestangular.service(''); // The actual api resource from whence it pulls
  // })
  //Credit to http://devdactic.com/restful-api-user-authentication-2/

  //the Authorization Services for JWT based authentication
  .service('AuthService', function($q, $http, API_ENDPOINT) {
    var LOCAL_TOKEN_KEY = 'yourTokenKey';
    var isAuthenticated = false;
    var authToken;

    function loadUserCredentials() {
      var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
      if (token) {
        useCredentials(token);
      }
    }

    function storeUserCredentials(token) {
      window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
      useCredentials(token);
    }

    function useCredentials(token) {
      isAuthenticated = true;
      authToken = token;

      // Set the token as header for your requests!
      $http.defaults.headers.common.Authorization = authToken;
    }

    function destroyUserCredentials() {
      authToken = undefined;
      isAuthenticated = false;
      $http.defaults.headers.common.Authorization = undefined;
      window.localStorage.removeItem(LOCAL_TOKEN_KEY);
    }

    var register = function(user) {
      return $q(function(resolve, reject) {
        $http.post( API_ENDPOINT.url + '/signup', user).then(function(result) {
          if (result.data.success) {
            resolve(result.data.msg);
          } else {
            reject(result.data.msg);
          }
        });
      });
    };

    var login = function(user) {
      return $q(function(resolve, reject) {
        $http.post(API_ENDPOINT.url + '/authorize', user).then(function(result) {
          if (result.data.success) {
            storeUserCredentials(result.data.token);
            resolve(result.data.msg);
          } else {
            reject(result.data.msg);
          }
        });
      });
    };

    var logout = function() {
      destroyUserCredentials();
    };

    loadUserCredentials();

    return {
      login: login,
      register: register,
      logout: logout,
      isAuthenticated: function() {return isAuthenticated;}
    };
  })

  .factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
    return {
      responseError: function (response) {
        $rootScope.$broadcast({
          401: AUTH_EVENTS.notAuthenticated
        }[response.status], response);
        return $q.reject(response);
      }
    };
  })
  .service('LocationManipulators', function(Location, $location) {

    this.removeit = function (obj) {
      console.log("removing ", obj._id);

      Location.one(obj._id).remove().then(function (response) {
        $location.path('/myLocations');

      }, function (response) {

        //we got a bad response - i.e. something what not filled out
        if (response.status == 400) {
          //do some stuff with it like yell at the user for sending you shit data

        }
      });
    };

    this.edit = function (obj) {
      obj.put().then(function(response) {
        $location.path('/myLocations');

        console.log("data to be edited", obj)

      }, function (response) {

        //we got a bad response - i.e. something what not filled out
        if (response.status == 400) {
          //do some stuff with it like yell at the user for sending you shit data

        }
      });

    };
  })
  .service('BeerManipulators', function(Beer, $location) {

    this.addToCollection = function (obj) {
      console.log("adding ", obj._id);

      obj.save().then(function (response) {
        $location.path('/myBeers');

      }, function (response) {

        //we got a bad response - i.e. something what not filled out
        if (response.status == 400) {
          //do some stuff with it like yell at the user for sending you shit data

        }
      });
    };

    this.removeit = function (obj) {
      console.log("removing ", obj._id);

      Beer.one(obj._id).remove().then(function (response) {
        $location.path('/myBeers');

      }, function (response) {

        //we got a bad response - i.e. something what not filled out
        if (response.status == 400) {
          //do some stuff with it like yell at the user for sending you shit data

        }
        if (response.status == 404) {
          //do some stuff with it like yell at the user for sending you shit data
          console.log('all is well');
        }
      });
    };
    this.edit = function (obj) {
      obj.put().then(function(response) {
        $location.path('/myBeers');

      }, function (response) {

        //we got a bad response - i.e. something what not filled out
        if (response.status == 400) {
          //do some stuff with it like yell at the user for sending you shit data

        }
      });
    };
  })
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  });
