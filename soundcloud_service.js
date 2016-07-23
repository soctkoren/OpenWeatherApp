let SoundCloudService = app.factory('SoundCloudService', ['$window',
    function($window) {
  /** @type {boolean} */
  this.isPaused = false;

  let player;

  let CLIENT_ID = '37b82b36d149205f71271ba1e4f08cda';

  this.init = function(songID) {
    $window.SC.initialize({
      client_id: CLIENT_ID
    });

    $window.SC.stream('/tracks/' + songID).then(function(scPlayer){
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
