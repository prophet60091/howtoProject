angular.module('app.controllers', ['ngCordova',])

  .controller('menuCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams) {


    }])

  .controller('addTriggerCtrl', ['$scope', '$stateParams', 'GoogleAddress',

    function ($scope, $stateParams, GoogleAddress) {
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

            //not that we know where we are give it some meaning
            var geocoder = new google.maps.Geocoder;
            GoogleAddress.latLng = new google.maps.LatLng(GoogleAddress.lat, GoogleAddress.lng);

            //Ask google where we are?
            geocoder.geocode({'location': GoogleAddress.latLng}, function(results, status) {
              if (status === 'OK') {

                $scope.display.currentLocation = results[0].formatted_address;
                GoogleAddress.address = results[0];
                GoogleAddress.currentLocation = results[0].formatted_address;

                $scope.$apply();
                // //console.log("resulting address", GoogleAddress.address);
              }

              //update the text field in the search bar
              //$scope.searchEntry = GoogleAddress.currentLocation;
              //$scope.$apply(); // sometimes necessary to update the screen with new info
            });

          }, function (err) {
            console.log("google", err);

          }, posOptions);
      };

      /**
       *
       */
      $scope.displayMap = function() {

        //Make sure we have a legit latitude longitude
        if(GoogleAddress.latLng != null ) {
          console.log("loading map..");
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
       *
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



    }]);
