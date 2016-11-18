angular.module('app.services', [])

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
}]);

