angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}])
.service('GoogleAddress', [function(){
  this.clocFormattedAddress = null;
  this.address = null;
  this.lat = null;
  this.lng = null;
}]);

