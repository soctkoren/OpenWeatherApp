let IndexCtrl = app.controller('IndexCtrl', ['$http', '$q', '$scope',
    'YouTubeService', function($http, $q, $scope, YouTubeService) {
  /** @const {string} */
  const WEATHER_API_KEY = '659f89cf0dd4f5c254d169cafbc41e9f';

  /** @const {string} */
  const WEATHER_API_URL = 'https://api.forecast.io/forecast/';

  /** @const {string} */
  const MAPS_API_KEY = 'AIzaSyDvnLSkKRqub80ezSWW6K6TArPe-N29iuQ';

  /** @const {string} */
  const MAPS_API_URL =
      'https://maps.googleapis.com/maps/api/geocode/json?latlng=';

  /** @type {boolean} */
  this.isFahrenheit = true;

  /** @type {boolean} */
  this.isReady = false;

  /** @type {boolean} */
  this.isMuted;

  /** @type {!Object} */
  this.weatherObj = {
    humidity: '',
    temp: '',
    tempCelsius: '',
    tempFahrenheit: '',
    city: '',
    description: '',
    icon: ''
  };

  // Watches and changes isMuted as necessary.
  $scope.$watch(function() {
    return YouTubeService.getMuteStatus();
  }, function(newMuteStatus, oldMuteStatus) {
    if (newMuteStatus !== oldMuteStatus) {
      this.isMuted = newMuteStatus;
    }
  }.bind(this));

  /**
   * Gets latitude and longitude information from the browser then passes them
   * into the API functions.
   */
  navigator.geolocation.getCurrentPosition(function(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    $q.all([this.getWeather_(latitude, longitude),
           this.getCity_(latitude, longitude)])
        .then(function() {
          this.isReady = true;
        }.bind(this));
  }.bind(this), function(error) {
    // Default to Sunnyvale on error.
    let latitude = 37.3688;
    let longitude = -122.0363;

    $q.all([this.getWeather_(latitude, longitude),
           this.getCity_(latitude, longitude)])
        .then(function() {
          this.isReady = true;
        }.bind(this));
  }.bind(this));

  /**
   * Gets weather information from the weather API.
   * @private
   * @param {number} latitude
   * @param {number} longitude
   * @return {!angular.$q.Promise}
   */
  this.getWeather_ = function(latitude, longitude) {
    return $http.jsonp(WEATHER_API_URL + WEATHER_API_KEY + '/' + latitude +
                       ',' + longitude + '?callback=JSON_CALLBACK')
        .then(function(response) {
          this.weatherObj.humidity = response.data.currently.humidity;
          this.weatherObj.tempFahrenheit =
              Math.round(response.data.currently.temperature);
          this.weatherObj.tempCelsius =
              fahrenheitToCelsius_(response.data.currently.temperature);
          this.weatherObj.temp = this.weatherObj.tempFahrenheit;
          this.weatherObj.description = response.data.currently.summary;
          this.weatherObj.icon = response.data.currently.icon;
        }.bind(this));
  };

  /**
   * Gets the city from the Maps API.
   * @private
   * @param {number} latitude
   * @param {number} longitude
   * @return {!angular.$q.Promise}
   */
  this.getCity_ = function(latitude, longitude) {
    return $http.get(MAPS_API_URL + latitude + ',' + longitude + '&key=' +
                     MAPS_API_KEY)
        .then(function(response) {
          let city;

          outerLoop:
          for (let i = 0; i < response.data.results.length; i++) {
            let address_components =
                response.data.results[i].address_components;

            for (let j = 0; j < address_components.length; j++) {
              if (address_components[j].types.indexOf('locality') >= 0) {
                city = address_components[j].long_name;
                break outerLoop;
              }
            }
          }

          this.weatherObj.city = city;
        }.bind(this));
  };

  /**
   * Converts temperature from Fahrenheit to Celsius.
   * @private
   * @param {number} temp
   * @return {number}
   */
  let fahrenheitToCelsius_ = function(temp) {
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

  /**
   * Mutes or unmutes the audio.
   */
  this.mute = function() {
    YouTubeService.mute();
  };
}]);
