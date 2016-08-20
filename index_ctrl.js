let IndexCtrl = app.controller('IndexCtrl', [
    '$element', '$http', '$q', '$scope', 'constants', 'SoundCloudService',
    function($element, $http, $q, $scope, constants, SoundCloudService) {
  /** @type {boolean} */
  this.isFahrenheit = true;

  /** @type {boolean} */
  this.isReady = false;

  /** @type {boolean} */
  this.isPaused = SoundCloudService.getPauseStatus();

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

  /**
   * Gets latitude and longitude information from the browser then passes them
   * into the API functions.
   */
  navigator.geolocation.getCurrentPosition((position) => {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    $q.all([this.getWeather_(latitude, longitude),
           this.getCity_(latitude, longitude)])
        .then(() => {
          this.isReady = true;
        });
  }, (error) => {
    // Default to Sunnyvale on error.
    let latitude = 37.3688;
    let longitude = -122.0363;

    $q.all([this.getWeather_(latitude, longitude),
           this.getCity_(latitude, longitude)])
        .then(() => {
          this.isReady = true;
        });
  });

  /**
   * Gets weather information from the weather API.
   * @param {number} latitude
   * @param {number} longitude
   * @return {!angular.$q.Promise}
   * @private
   */
  this.getWeather_ = function(latitude, longitude) {
    return $http.jsonp(constants.API_URL.WEATHER + constants.API_KEY.WEATHER +
        '/' + latitude + ',' + longitude + '?callback=JSON_CALLBACK')
        .then((response) => {
          this.weatherObj.humidity = response.data.currently.humidity;
          this.weatherObj.tempFahrenheit =
              Math.round(response.data.currently.temperature);
          this.weatherObj.tempCelsius =
              fahrenheitToCelsius_(response.data.currently.temperature);
          this.weatherObj.temp = this.weatherObj.tempFahrenheit;
          this.weatherObj.description = response.data.currently.summary;
          this.weatherObj.icon = response.data.currently.icon;
          console.log(constants.ICON_TO_SONG_ID[this.weatherObj.icon][0]);
          SoundCloudService.init(
              constants.ICON_TO_SONG_ID[this.weatherObj.icon][0]);
          $element.css(
              {'background-image': 'url(' + constants.API_URL.IMAGES +
                  constants.ICON_TO_SONG_ID[this.weatherObj.icon][1] +
                  '/1600x900)'});
        });
  };

  /**
   * Gets the city from the Maps API.
   * @param {number} latitude
   * @param {number} longitude
   * @return {!angular.$q.Promise}
   * @private
   */
  this.getCity_ = function(latitude, longitude) {
    return $http.get(constants.API_URL.MAPS + latitude + ',' + longitude +
        '&key=' + constants.API_KEY.MAPS)
        .then((response) => {
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
        });
  };

  /**
   * Converts temperature from Fahrenheit to Celsius.
   * @param {number} temp
   * @return {number}
   * @private
   */
  let fahrenheitToCelsius_ = function(temp) {
    return Math.round((temp - 32) / 1.8);
  };

  let setBackground = function(){

  }

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
   * Pauses and resumes the soundcloud stream.
   */
  this.pause = function() {
    SoundCloudService.pause();
  };

  $scope.$watch(() => {
    return SoundCloudService.getPauseStatus();
  }, (newPauseStatus, oldPauseStatus) => {
    if (newPauseStatus !== oldPauseStatus) {
      this.isPaused = newPauseStatus;
    }
  });
}]);
