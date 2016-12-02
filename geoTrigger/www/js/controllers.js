angular.module('app.controllers', ['restangular'])

.controller('menuCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {


    }])

.controller('addTriggerCtrl', ['$scope', '$stateParams', '$state', '$ionicLoading', '$ionicPlatform', 'GoogleAddress',

    function ($scope, $stateParams, $state, $ionicLoading, $ionicPlatform, GoogleAddress ) {
      var showLocation = false;
      $scope.search = {};
      $scope.display= {
        currentLocation: "",
        map: null
      };

      /**
       * GET the Current Location Of the user
       */
      $scope.getCurLocation = function() {
        console.log('getting location');
        //show the location
        this.showLocation = true; //toggles the card

        var posOptions = {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
          function (position) {
            GoogleAddress.lat = position.coords.latitude;
            GoogleAddress.lng = position.coords.longitude;
            //console.log(GoogleAddress.lat, GoogleAddress.lng);

            $ionicLoading.show({
              template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
            });

            //now that we know where we are give it some meaning
            var geocoder = new google.maps.Geocoder;
            GoogleAddress.latLng = new google.maps.LatLng(GoogleAddress.lat, GoogleAddress.lng);

            //Ask google where we are?
            geocoder.geocode({'location': GoogleAddress.latLng}, function(results, status) {
              if (status === 'OK') {

                $scope.display.currentLocation = results[0].formatted_address;//setting the address to be displayed
                //storing that result in our service
                GoogleAddress.address = results[0];
                GoogleAddress.currentLocation = results[0].formatted_address;

                $scope.$apply();
              }
              $ionicLoading.hide();
            });

          }, function (err) {
            console.log("google", err);

          }, posOptions);
      };

      /**
       * Display a google map
       */
      $scope.displayMap = function() {

        //Make sure we have a legit latitude longitude
        if(GoogleAddress.latLng != null ) {
          console.log("loading map..");
          // set the the of map to display and where to center it
          $scope.display.map = new google.maps.Map(document.getElementById('map'), {
            center: GoogleAddress.latLng,
            zoom: 20,
            mapTypeId: 'roadmap'
          });

          //set a marker
          var marker = new google.maps.Marker({
            position: GoogleAddress.latLng,
            map: $scope.display.map,
            title: "You are/want to be here"
          });
        }
        //we don't have it
        else{
          alert('Your location has not been set - you must set a location before requesting the map');
        }
      };

      /**
       * Autocomplete on the search bar
       * @param $event
       */
      $scope.autoComp =_.debounce(function ($event){

        //if ($event.which === 13) {

          //from https://developers.google.com/maps/documentation/javascript/examples/places-queryprediction
          $scope.displaySuggestions = function (predictions, status) {
            if (status != google.maps.places.PlacesServiceStatus.OK) {
              alert(status);
              return;
            }

            //angular list
            $scope.suggestions = predictions;

          };

          var service = new google.maps.places.AutocompleteService();
          service.getQueryPredictions({ input: $scope.search.entry},  $scope.displaySuggestions);

        $scope.showResults = true;

        },250);

      /**
       * Set the location from the search
       */
      $scope.setLocation = function(placeId) {
        console.log(placeId);
        $scope.showResults = false;
        //the placeId is set then...
        // we need to update the variables so that when we go to
        //display the map
        if( placeId != null){
          var geocoder = new google.maps.Geocoder;
          geocoder.geocode({'placeId': placeId}, function(results, status) {
            if (status === 'OK') {
              $scope.currentLocation = results[0].formatted_address;
              GoogleAddress.address = results[0];
              GoogleAddress.currentLocation = results[0].formatted_address;
              GoogleAddress.latLng = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
              //console.log(results[0].geometry.location.lng());
            }
            $scope.$apply();
          });

          this.displayMap();
        }
      };

      //Add Current location, or searched location to the list.
      $scope.addLocation = function(){
        showLocation = false;
        //console.log("address to be saved", address);
        $state.go('addLocation', {});
      };



    }])

.controller('addLocationCtrl', ['$scope', '$stateParams', 'Location', 'GoogleAddress', '$location', '$ionicPopup', '$timeout',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller

  function ($scope, $stateParams, Location, GoogleAddress, $location, $ionicPopup, $timeout,  AuthService) {

    $scope.failed = false;
    if(GoogleAddress.address != null){
      var addy = GoogleAddress.address.address_components; // just to shorten it up
      var location = {};
      var address = {};

      //populate the form
      if(addy != '' && addy != undefined){
        console.log("you got it!");
        location.name = '';
        location.type = '';
        address.number = addy[0].long_name;
        address.street = addy[1].long_name;
        address.unit = addy[2].long_name;
        address.city = addy[3].long_name;
        address.state = addy[5].long_name;
        address.zip = addy[7].long_name + '-' + addy[8].long_name;
        $scope.clocFormattedAddress = GoogleAddress.clocFormattedAddress;
        location.address = address;
        $scope.location = location;
      }
    }

    /**
     * Alert Popup
     * @param $msg The message received from the api
     * adapted from  https://ionicframework.com/docs/api/service/$ionicPopup/
     */
    // An alert dialog
    $scope.showAlert = function() {
      var alertPopup = $ionicPopup.alert({
        title: 'Bad input!',
        template: 'bad bad bad'
      });

      alertPopup.then(function(res) {
        console.log('fail');
      });
    };
    /**
     * Save the location
     */
    $scope.saveLocation= function() {
      Location.post($scope.location).then(function(response) {
        $location.path('/beers');
      },function(response){

        //we got a bad response - i.e. something what not filled out
        if(response.status == 400){
          //do some stuff with it
          $scope.failed = true;
          $scope.failMessage = response.data.errors.name.path + " is required";
          // angular.element('#form-'+ response.data.errors.name.path).addClass("missing");
          //showAlert(response.data.errors.name.path + " is required");
        }
      });
    };

  }])

.controller('beersCtrl', ['$scope', '$stateParams', 'Beer',
  function ($scope, $stateParams, Beer) {

    Beer.getList().then(function(data) {
      $scope.beers = data;

    },function(response){
      console.log("resp:" + response);
    });

  }])


.controller('LoginCtrl', function($scope, AuthService, $ionicPopup, $state,  AuthService) {
  $scope.user = {
    name: '',
    password: ''
  };

  $scope.login = function() {
    AuthService.login($scope.user).then(function(msg) {
      $state.go('wall.addTrigger');
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: errMsg
      });
    });
  };
})

  .controller('RegisterCtrl', function($scope, AuthService, $ionicPopup, $state,  AuthService) {
    $scope.user = {
      name: '',
      password: '',
      email: ''
    };

    $scope.signup = function() {
      AuthService.register($scope.user).then(function(msg) {
        $state.go('login');
        var alertPopup = $ionicPopup.alert({
          title: 'Register success!',
          template: msg
        });
      }, function(errMsg) {
        var alertPopup = $ionicPopup.alert({
          title: 'Register failed!',
          template: errMsg
        });
      });
    };
  })

  .controller('WallCtrl', function($scope, AuthService, $http, $state) {
    $scope.destroySession = function() {
      AuthService.logout();
    };

    $scope.logout = function() {
      AuthService.logout();
      $state.go('login');
    };
  })

  .controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
    $scope.$on(AUTH_EVENTS.notAuthenticated, function (event) {
      AuthService.logout();
      $state.go('login');
      var alertPopup = $ionicPopup.alert({
        title: 'Session Lost!',
        template: 'Sorry, You have to login again.'
      });
    })
  });
