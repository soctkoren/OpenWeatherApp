var IndexCtrl = app.controller('IndexCtrl', ['$http', '$q', function($http, $q) {
    var API_KEY = '8f6c3116d20a6fa29db7e883b0f7e179';

    var lat;
    var lon;

    //get lats and lons
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log('lo');
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      this.apiCall();
    }.bind(this));

    //get weather API call
    this.apiCall = function() {
      $http.get('http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&APPID='+API_KEY)
        .then(function(response) {
          console.log(response);
      });
    };

  console.log("yo");

  this.test = function() {
    console.log('it is working');
  };
}]);
