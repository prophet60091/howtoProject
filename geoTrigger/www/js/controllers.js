angular.module('app.controllers', ['ngCordova'])

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
      var address = {};

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
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            console.log(lat, lng);

            //not that we know where we are give it some meaning
            var geocoder = new google.maps.Geocoder;
            var myLatlng = new google.maps.LatLng(lat, lng);

            //Ask google where we are?
            geocoder.geocode({'location': myLatlng}, function(results, status) {
              if (status === 'OK') {
                console.log('sok', address);
                $scope.clocFormattedAddress = results[0].formatted_address;
                GoogleAddress.address = results[0].address_components;
                GoogleAddress.clocFormattedAddress = results[0].formatted_address;
                //console.log("resulting address", address);

                $scope.$apply(); // sometimes necessary to update the screen with new info
              }
            });

          }, function (err) {
            console.log("google", err);

          }, posOptions);
      }


    }]);
