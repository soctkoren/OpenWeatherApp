var IndexCtrl = app.controller('IndexCtrl', ['$http', '$q', function($http, $q) {
    var API_KEY = '8f6c3116d20a6fa29db7e883b0f7e179';

    var lat;
    var lon;
    var obj;
    this.weatherObj = {
      humidity: '',
      temp: '',
      tempCelsius: '',
      tempFahrenheit: '',
      name: '',
      description: '',
      icon: ''
    };

    this.isCelsius = true;
    this.isReady = false;

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
          obj = response;
          this.weatherObj.humidity = obj.data.main.humidity;
          this.weatherObj.tempCelsius = kelvinToCelsius(obj.data.main.temp);
          this.weatherObj.tempFahrenheit = celsiusToFahrenheit(this.weatherObj.tempCelsius);
          this.weatherObj.temp = this.weatherObj.tempCelsius;
          this.weatherObj.name = obj.data.name;
          this.weatherObj.description = obj.data.weather[0].description;
          this.weatherObj.icon = obj.data.weather[0].icon;

          this.isReady = true;
      }.bind(this));
    };

  var celsiusToFahrenheit = function(temp) {
    return Math.round(temp * 1.8 + 32);
  };

  var kelvinToCelsius = function(temp) {
    return Math.round(temp - 273.15);
  };

  this.toggleTemp = function() {
    if (this.isCelsius) {
      this.weatherObj.temp = this.weatherObj.tempFahrenheit;
    } else {
      this.weatherObj.temp = this.weatherObj.tempCelsius;
    }

    this.isCelsius = !this.isCelsius;
  };

}]);