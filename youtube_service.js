let YouTubeService = app.factory('YouTubeService', ['$window',
    function($window) {
  /** @type {boolean} */
  this.isMuted = false;

  // This code loads the IFrame Player API code asynchronously.
  let tag = document.createElement('script');

  tag.src = 'https://www.youtube.com/iframe_api';
  let firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // This function creates an <iframe> (and YouTube player) after the API code
  // downloads.
  let player;
  $window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', {
      height: '10',
      width: '10',
      videoId: 'lasWefVUCsI',
      events: {
        'onReady': onPlayerReady,
      }
    });
  };

  // The API will call this function when the video player is ready.
  let onPlayerReady = function(event) {
    event.target.playVideo();
  };

  /**
   * @return {boolean}
   */
  this.getMuteStatus = function() {
    return this.isMuted;
  };

  /**
   * Mutes or unmutes the audio.
   */
  this.mute = function() {
    if (this.isMuted) {
      player.unMute();
    } else {
      player.mute();
    }
    this.isMuted = !this.isMuted;
  };

  return this;
}]);