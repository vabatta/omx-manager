/*---- Require ----*/
var spawn = require('child_process').spawn;
var path = require('path');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var Looper = require('./looper');


/*---- Prototype ----*/
var _this = Object.create(EventEmitter.prototype);


/*---- Members ----*/
/**
 * @description Default directory to prepend to videos
 * @default 
 * @memberof OmxManager
 */
var _videosDirectory = './';

/**
 * @description Default extension to append to videos
 * @default ' '
 * @memberof OmxManager
 */
var _videosExtension = '';

/**
 * @description Default command to spawn
 * @default 
 * @memberof OmxManager
 */
var _omxCommand = 'omxplayer';

/**
 * @description Native loop argument support ('--loop')
 * @default
 * @memberof OmxManager
 */
var _supportsNativeLoop = false;

var _currentVideos = [];
var _currentVideo = null;
var _currentOptions = {};

var _looper = null;
var _omxProcess = null;
var _paused = false;

/**
 * @private
 * @typedef {Object} OmxManager.Commands
 * @description Rapresents the commands keys for Omxplayer
 * @property pause {String} - Key: 'p'
 * @property quit {String} - Key: 'q'
 */
var _commands = {
  'pause': 'p',
  'quit': 'q'
};


/*---- Private Functions ----*/
/**
 * @//private
 * @function _sendAction
 * @description Sends an action reported in {@link OmxManager.Commands}.
 * @param action {String} - The action to send
 * @throws {TypeError} Argument "action" must be a {String}
 * @throws {Error} "action" must be contained in {@link OmxManager.Commands}
 */
var _sendAction = function (action) {
  if (typeof action !== 'string') throw new TypeError('Argument "action" must be a String!');
  if (!_commands[action]) throw new Error('"action" must be contained in {Commands}');

  if (_omxProcess) {
    omxProcess.stdin.write(_commands[action], function (err) {
      if (err) {
        // Report/Emit this error?
        // This error was never fired during my tests on Rpi
      }
    });
  }
};


/**
 * @//private
 * @function _resolveVideosPath
 * @description Resolve path of videos and returns only valid and existent videos array
 * @param videos {Array} - Videos to check
 * @returns {Array} Valid videos
 */
var _resolveVideosPath = function (videos) {
  var ret = [];
  videos.forEach(function (video) {
    var realPath = path.resolve(_videosDirectory, video + _videosExtension);

    if (fs.existsSync(realPath)) {
      ret.push(realPath);
    /*} else {
      var err = { 
        error: new Error('File not found: ' + realPath),
        notFound: true
      };

      _this.emit('error', err);*/
    }
  });
  return ret;
};


/**
 * @//private
 * @function _startup
 * @description Startup the player
 * @param videos {Array} - Videos to play
 * @param options {Object} - Options to use for playing
 */
var _startup = function (videos, options) {
  /* reset videos with only valid and existent videos */
  _currentVideos = _resolveVideosPath(videos);

  _currentOptions = options;

  _currentVideo = null;
  _looper = null;

  // Spawn arguments
  var loopRequested = false;
  var args = [];
  for (var key in options) {
    if (options.hasOwnProperty(key)) {
      // Handle loop after 
      if(key === '--loop' && options[key]) {
        loopRequested = true;
      } else {
        args.push(key);

        // If is an option with a value (eg.: -o hdmi), we should push also the value
        var val = options[key];
        if (typeof val === 'string') {
          args.push(val);
        }
      }
    }
  }

  // Enable native loop only if enabled before and if videos are just 1
  var handleWithLooper = !(_supportsNativeLoop && _currentVideos.length === 1);
  if (loopRequested && !handleWithLooper) {
    args.push('--loop');
  }

  args.push(_currentVideos[0]);

  if (handleWithLooper) {
    _looper = Looper(_currentVideos, loopRequested);

    var respawn = function () {
      // if looper is null, omx manager is stopped
      if (!_looper) {
        _this.emit('stop');
        return;
      }

      var nextVideo = _looper.getNext();
      if (nextVideo) {
        // Setting current video
        _currentVideo = nextVideo;
        args[args.length - 1] = nextVideo;

        _omxProcess = spawn(_omxCommand, args, {
          stdio: ['pipe', null, null]
        });
        _omxProcess.once('exit', respawn);
        _this.emit('play', _currentVideo);
      } else {
        // Stop with looper null the respawn
        _looper = null;
        _this.emit('stop');
      }
    };

    _omxProcess = spawn(_omxCommand, args, {
      stdio: ['pipe', null, null]
    });
    _omxProcess.once('exit', respawn);
    _this.emit('play', _currentVideo);
  } else {
    _omxProcess = spawn(_omxCommand, args, {
      stdio: ['pipe', null, null]
    });
    _omxProcess.once('exit', function () {
      _omxProcess = null;
      _this.emit('stop');
    });
    _this.emit('play', _currentVideo);
  }
};


/*---- Public Functions ----*/
/**
 * @function OmxManager.setVideosDirectory
 * @description Sets the default videos directory.
 * @param directory {String} - The default videos directory to prepend
 * @throws {TypeError} Argument "directory" must be a {String}
 */
_this.setVideosDirectory = function (directory) {
  if (typeof directory !== 'string') throw new TypeError('Argument "directory" must be a String!');

  _videosDirectory = directory;
};


/** 
 * @function OmxManager.setVideosExtension
 * @description Sets the default videos extension (this is just an append to filename).
 * @param extension {String} - The default videos extension to append
 * @throws {TypeError} Argument "extension" must be a {String}
 */
_this.setVideosExtension = function (extension) {
  if (typeof extension !== 'string') throw new TypeError('Argument "extension" must be a String!');

  _videosExtension = extension;
};


/**
 * @function OmxManager.setOmxCommand
 * @description Sets the default omxplayer executable path.
 * @param command {String} - The default command to spawn
 * @throws {TypeError} Argument "command" must be a {String}
 */
_this.setOmxCommand = function (command) {
  if (typeof command !== 'string') throw new TypeError('Argument "command" must be a String!');

  _omxCommand = command;
};


/**
 * @function OmxManager.enableNativeLoop
 * @description Sets that omxplayer supports native loop.
 */
_this.enableNativeLoop = function () {
  _supportsNativeLoop = true;
};


/**
 * @function OmxManager.isPlaying
 * @description Returns if omx manager is playing.
 * @returns {Boolean}
 */
_this.isPlaying = function () {
  return _omxProcess && !_paused;
};


/**
 * @function OmxManager.isLoaded
 * @description Returns if omx manager is loaded (already spawned).
 * @returns {Boolean}
 */
_this.isLoaded = function () {
  return _omxProcess;
};


/**
 * @typedef {Object} OmxManager.StatusObject
 * @description Current Status Object of omx manager if loaded
 * @property videos {?Array} - Current videos array
 * @property settings {?Object} - Current settings
 * @property playing {?Boolean} - If is playing
 * @property loaded {Boolean} - If is loaded
 */

/**
 * @function OmxManager.getStatus
 * @description Returns current status of omx manager.
 * @returns {OmxManager.StatusObject}
 */
_this.getStatus = function () {
  if (_this.isLoaded()) {
    return {
      videos: _currentVideos,
      settings: _currentOptions,
      playing: _this.isPlaying(),
      loaded: true
    };
  }

  return {
    loaded: false
  };
};


/**
 * @function OmxManager.stop
 * @description Stops current Omx process
 */
_this.stop = function () {
  /* ignore if process isn't running */
  if (!_omxProcess) return;

  _sendAction('quit');
  // handle with timeout
  _looper = null;
  _omxProcess = null;
};


/**
 * @function OmxManager.pause
 * @description Pauses current Omx process
 */
_this.pause = function () {
  if (_paused) return;
  /* ignore if process isn't running */
  if (!_omxProcess) return;

  _sendAction('pause');
  _paused = true;
  _this.emit('pause');
};


/**
 * @function OmxManager.play
 * @description Play current Omx process or play the videos with passed options
 * @param [videos=null] {String|Array} - Video or videos to play
 * @param [options=null] {Object} - Options to use for playing
 * @throws {TypeError} Argument "videos" must be a {String} or an {Array}
 * @throws {TypeError} Argument "options" must be an {Object}
 */
_this.play = function (videos, options) {
  if (_omxProcess) {
    if (_paused) {
      _sendAction('pause');
      _paused = false;
      _this.emit('play', _currentVideo);
    }
  } else {
    if (typeof videos !== 'string' && !(videos instanceof Array)) throw new TypeError('Argument "videos" must be a String or an Array!');
    if (options === null) options = {};
    if (typeof options !== 'object') throw new TypeError('Argument "options" must be an object!');

    // Convert videos string to an array for underlying startup
    if (typeof videos === 'string') {
      videos = [videos];
    }
    _startup(videos, options);
  }
};


/** @constructor */
var OmxManager = function () {
  return _this;
};

module.exports = OmxManager;