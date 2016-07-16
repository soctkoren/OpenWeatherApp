var IndexCtrl = app.controller('IndexCtrl', ['$http', function($http) {
  /** @const {string} */
  const API_KEY = '659f89cf0dd4f5c254d169cafbc41e9f';

  /** @const {string} */
  const API_URL = 'https://api.forecast.io/forecast/';

  /** @type {boolean} */
  this.isFahrenheit = true;

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
  }.bind(this), function(error) {
    // Default to Sunnyvale on error.
    let latitude = 37.3688;
    let longitude = -122.0363;
    this.apiCall_(latitude, longitude);
  }.bind(this));

  /**
   * Gets weather information from the API.
   * @private
   * @param {number} latitude
   * @param {number} longitude
   */
  this.apiCall_ = function(latitude, longitude) {
    $http.get(API_URL + API_KEY + '/' + latitude + ',' + longitude)
        .then(function(response) {
          console.log(response);
          this.weatherObj.humidity = response.data.currently.humidity;
          this.weatherObj.tempFahrenheit =
              Math.round(response.data.currently.temperature);
          this.weatherObj.tempCelsius =
              fahrenheitToCelsius_(response.data.currently.temperature);
          this.weatherObj.temp = this.weatherObj.tempFahrenheit;
          this.weatherObj.name = response.data.timezone;
          this.weatherObj.description = response.data.currently.summary;
          this.weatherObj.icon = response.data.currently.icon;

          console.log(this.weatherObj);
          this.isReady = true;
        }.bind(this));
  };

  /**
   * Converts temperature in Fahrenheit to Celsius.
   * @private
   * @param {number} temp
   * @return {number}
   */
  var fahrenheitToCelsius_ = function(temp) {
    return Math.round((temp - 32) / 1.8);
  };

  /**
   * Switches between displaying the temperature in Celsius and Fahrenheit.
   */
  this.toggleTemp = function() {
    if (this.isFahrenheit) {
      this.weatherObj.temp = this.weatherObj.tempCelsius;
    } else {
      this.weatherObj.temp = this.weatherObj.tempFahrenheit;
    }

    this.isFahrenheit = !this.isFahrenheit;
  };
}]);
