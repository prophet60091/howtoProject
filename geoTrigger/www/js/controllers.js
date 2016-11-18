angular.module('app.controllers', ['ngCordova',])

  .controller('menuCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams) {


    }])

  .controller('addTriggerCtrl', ['$scope', '$stateParams', 'GoogleAddress', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams, GoogleAddress) {
      var showLocation = false;

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
            console.log(GoogleAddress.lat, GoogleAddress.lng);

            //not that we know where we are give it some meaning
            var geocoder = new google.maps.Geocoder;
            var myLatlng = new google.maps.LatLng(GoogleAddress.lat, GoogleAddress.lng);

            //Ask google where we are?
            geocoder.geocode({'location': myLatlng}, function(results, status) {
              if (status === 'OK') {

                $scope.clocFormattedAddress = results[0].formatted_address;
                GoogleAddress.address = results[0];
                GoogleAddress.clocFormattedAddress = results[0].formatted_address;

                //console.log("resulting address", address);
                console.log('sok', results);
                $scope.$apply(); // sometimes necessary to update the screen with new info
              }
            });

          }, function (err) {
            console.log("google", err);

          }, posOptions);
      }

      $scope.getPlace = function() {

        $scope.map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: GoogleAddress.lat, lng: GoogleAddress.lng},
          zoom: 13,
          mapTypeId: 'roadmap'
        });

        var request = {
          location: $scope.map.getCenter(),
          radius: '10',
          query: GoogleAddress.clocFormattedAddress
        };

        var service = new google.maps.places.PlacesService($scope.map);
        service.textSearch(request, function(){
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            var marker = new google.maps.Marker({
              map: $scope.map,
              place: {
                placeId: results[0].place_id,
                location: results[0].geometry.location
              }
            });
            console.log(marker.place.placeId);
          }
        });

       /*
        GoogleAddress.address.place_id;
        var pyrmont = new google.maps.LatLng(-33.8665433,151.1956316);
        $scope.map = new google.maps.Map($scope.landKarte, {
          center: {lat: -33.8688, lng: 151.2195},
          zoom: 13,
          mapTypeId: 'roadmap'
        });
        var request = {
          location: pyrmont,
          radius: '500',
          query: 'restaurant'
        };

        var service = new google.maps.places.PlacesService($scope.map);
        service.getDetails(request, callback);

        function callback(place, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            createMarker(place);
            console.log("map mapm psdf")
          }
        }

        // var place = new google.maps.places.Plac
        // place.textSearch( "703 N tejon Colorado Springs, Co 80903",function(result, status){
        //   console.log(result);
        // })
        */
       // var map = new GoogleMap('#map');
        $scope.searchEntry = GoogleAddress.clocFormattedAddress;
        console.log($scope.searchEntry)
      }

      $scope.autoComp = function ($event){

        if ($event.which === 13) {
          //from https://developers.google.com/maps/documentation/javascript/examples/places-queryprediction
          $scope.displaySuggestions = function (predictions, status) {
            if (status != google.maps.places.PlacesServiceStatus.OK) {
              alert(status);
              return;
            }

            predictions.forEach(function (prediction) {
              var li = document.createElement('li');
              li.appendChild(document.createTextNode(prediction.description));
              document.getElementById('results').appendChild(li);
            });
          };
          var service = new google.maps.places.AutocompleteService();

          service.getQueryPredictions({ input: $scope.searchEntry },  $scope.displaySuggestions);
        }
      }




    }]);
