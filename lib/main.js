var EventEmitter = require('events').EventEmitter;

/** @constructor */
var omxdirector = function () {
	var that = Object.create(EventEmitter.prototype);

	var videoDir = './';
  var videoSuffix = '';
  var omxCommand = 'omxplayer';

  var currentVideos = [];
  var currentSettings = {};

  var omxProcess = null;
  var paused = false;

  var resolveFilePaths = function (videos) {
    /* reset currentFiles, it will contain only valid videos */
    currentVideos = [];
    var ret = [];
    videos.forEach(function (video) {
      var realPath = path.resolve(videoDir, video + videoSuffix);
      if (fs.existsSync(realPath)) {
        ret.push(realPath);
        currentVideos.push(video);
      } else {
        //that.emit('error', new Error('File does not exist: ' + realPath));
      }
    });
    return ret;
  };

  /** 
   * Sets the default videos directory.
   * @param dir {string} - The default videos directory 
   */
  var setVideoDir = function(dir) {
  	if (typeof dir !== 'string') throw new TypeError('Video dir must be a string!');

  	videoDir = dir;
  };

  var setVideoSuffix = function(suffix, correct) {
  	if (typeof suffix !== 'string') throw new TypeError('Video suffix must be a string!');
  	if (typeof correct !== 'boolean') correct = false;

  	videoSuffix = ((correct)?'.':'') + suffix;
  };

  var startup = function() {
  	
  };

	return that;
};

module.exports = omxdirector();