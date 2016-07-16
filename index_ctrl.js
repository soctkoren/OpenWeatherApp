var IndexCtrl = app.controller('IndexCtrl', ['$http', function($http) {
  /** @const {string} */
  // const API_KEY = '8f6c3116d20a6fa29db7e883b0f7e179';
  const API_KEY = '659f89cf0dd4f5c254d169cafbc41e9f';

  /** @const {string} */
  // const API_URL = 'http://api.openweathermap.org/data/2.5/weather?lat=';
  const API_URL = 'https://api.forecast.io/forecast/';

  /** @type {boolean} */
  this.isCelsius = true;

  /** @type {boolean} */
  this.isReady = false;

  /** @type {!Object} */
  this.weatherObj = {
    humidity: '',
    temp: '',
    tempCelsius: '',
    tempFahrenheit: '',
    name: '',
    description: '',
    icon: ''
  };

  /**
   * Gets latitude and longitude information from the browser then passes them
   * into apiCall.
   */
  navigator.geolocation.getCurrentPosition(function(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    this.apiCall_(latitude, longitude);
  }.bind(this));

  /**
   * Gets weather information from the API.
   * @private
   * @param {number} latitude
   * @param {number} longitude
   */
  this.apiCall_ = function(latitude, longitude) {
    // $http.get(API_URL + latitude + '&lon=' + longitude + '&APPID=' + API_KEY)
    $http.get(API_URL + API_KEY + '/' + latitude + ',' + longitude)
        .then(function(response) {
          console.log(response);
          this.weatherObj.humidity = response.data.main.humidity;
          this.weatherObj.tempCelsius =
              kelvinToCelsius_(response.data.main.temp);
          this.weatherObj.tempFahrenheit =
              celsiusToFahrenheit_(this.weatherObj.tempCelsius);
          this.weatherObj.temp = this.weatherObj.tempCelsius;
          this.weatherObj.name = response.data.name;
          this.weatherObj.description = response.data.weather[0].description;
          this.weatherObj.icon = response.data.weather[0].icon;

          this.isReady = true;
        }.bind(this));
  };

  /**
   * Converts temperature in Celsius to Fahrenheit.
   * @private
   * @param {number} temp
   * @return {number}
   */
  var celsiusToFahrenheit_ = function(temp) {
    return Math.round(temp * 1.8 + 32);
  };

  /**
   * Converts temperature in Kelvin to Celsius.
   * @private
   * @param {number} temp
   * @return {number}
   */
  var kelvinToCelsius_ = function(temp) {
    return Math.round(temp - 273.15);
  };

  /**
   * Switches between displaying the temperature in Celsius and Fahrenheit.
   */
  this.toggleTemp = function() {
    if (this.isCelsius) {
      this.weatherObj.temp = this.weatherObj.tempFahrenheit;
    } else {
      this.weatherObj.temp = this.weatherObj.tempCelsius;
    }

    this.isCelsius = !this.isCelsius;
  };
}]);
