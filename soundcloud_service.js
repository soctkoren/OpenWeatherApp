let SoundCloudService = app.factory('SoundCloudService', [
    '$window', 'constants', function($window, constants) {
  /** @type {boolean} */
  this.isPaused = false;

  let player;

  this.init = function(songID) {
    $window.SC.initialize({
      client_id: constants.API_KEY.SOUNDCLOUD
    });

    $window.SC.stream('/tracks/' + songID).then((scPlayer) => {
      scPlayer.play();
      player = scPlayer;
    });
  };

  /**
   * @return {boolean}
   */
  this.getPauseStatus = function() {
    return this.isPaused;
  };

  /**
   * Pauses or plays the audio.
   */
  this.pause = function() {
    if (this.isPaused) {
      player.play();
    } else {
      player.pause();
    }

    this.isPaused = !this.isPaused;
  };

  return this;
}]);
