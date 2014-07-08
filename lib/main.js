/*---- Require ----*/
var child_process = require('child_process');
var spawn = child_process.spawn;
var exec = child_process.exec;
var path = require('path');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var Looper = require('./looper');


/*---- Prototype ----*/
var _this = Object.create(EventEmitter.prototype);


/*---- Members ----*/
var _videosDirectory = './';
var _videosExtension = '';
var _omxCommand = 'omxplayer';
var _supportsMultipleNativeLoop = false;
var _handleHanging = false;

var _hanging = {
  'timeout': null,
  'videoDuration': null,
  'videoStarted': null,
  'videoRemaining': null,
  'exitFunction': null
};

var _currentVideos = [];
var _currentVideo = null;
var _currentArgs = {};

var _looper = null;
var _omxProcess = null;
var _paused = false;

var _commands = {
  'decreaseSpeed': '1',
  'increaseSpeed': '2',
  'previousAudioStream': 'j',
  'nextAudioStream': 'k',
  'previousChapter': 'i',
  'nextChapter': 'o',
  'previousSubtitleStream': 'n',
  'nextSubtitleStream': 'm',
  'toggleSubtitles': 's',
  'increaseSubtitleDelay': 'd',
  'decreaseSubtitleDelay': 'f',
  'increaseVolume': '+',
  'decreaseVolume': '-',
  'seekForward': '\x5B\x43',
  'seekBackward': '\x5B\x44',
  'seekFastForward': '\x5B\x41',
  'seekFastBackward': '\x5B\x42'
};

/*---- Private Functions ----*/
/**
 * @private
 * @function OmxManager._sendAction
 * @description Sends an action (key).
 * @param key {String} - The key to send
 */
var _sendAction = function (key) {
  if (_omxProcess) {
    _omxProcess.stdin.write(key, function (err) {
      if (err) {
        // Report/Emit this error?
        // This error was never fired during my tests on Rpi
        //_this.emit('error', err);
      }
    });
  }
};


/**
 * @private
 * @function OmxManager._resolveVideosPath
 * @description Resolve path of videos and returns only valid and existent videos array.
 * @param videos {Array} - Videos to check
 * @returns {Array} Valid videos
 */
var _resolveVideosPath = function (videos) {
  var ret = [];
  videos.forEach(function (video) {
    var realPath = path.resolve(_videosDirectory, video + _videosExtension);

    if (fs.existsSync(realPath)) {
      ret.push(realPath);
    } else {
      var err = { 
        error: new Error('File not found: ' + realPath),
        notFound: true
      };

      // Report/Emit this error?
      //_this.emit('error', err);
    }
  });
  return ret;
};


/**
 * @private
 * @function OmxManager._startup
 * @description Startup the player.
 * @param videos {Array} - Videos to play
 * @param args {Object} - Args to use for playing
 * @param loop {Boolean} - If must loop videos
 * @fires OmxManager#load
 */
var _startup = function (videos, args, loop) {
  // reset videos with only valid and existent videos
  _currentVideos = _resolveVideosPath(videos);

  _currentArgs = args;

  // We start from first video
  _currentVideo = _currentVideos[0];
  _looper = null;

  // Spawn arguments
  var argsToSpawn = [];
  for (var key in args) {
    if (args.hasOwnProperty(key) && args[key]) {
      if (key === '--loop') {
        if (_supportsMultipleNativeLoop || (_currentVideos.length === 1 && !loop)) {
          argsToSpawn.push(key);
        }
      } else {
        argsToSpawn.push(key);

        // If is an option with a value (eg.: -o hdmi), we should push also the value
        var val = args[key];
        if (typeof val === 'string') {
          argsToSpawn.push(val);
        } 
        else if (typeof val === 'number') {
          argsToSpawn.push(val.toString());
        }
      }
    }
  }

  if (_supportsMultipleNativeLoop) {
    argsToSpawn.push.apply(argsToSpawn, _currentVideos);
  } else {
    argsToSpawn.push(_currentVideo);
  }

  var respawn;
  if (!_supportsMultipleNativeLoop && (loop || _currentVideos.length > 1)) {
    _looper = Looper(_currentVideos, loop);
    // move the looper to next, we added it before
    _looper.getNext();

    respawn = function () {
      if (_handleHanging && _hanging.timeout) {
        clearTimeout(_hanging.timeout);
        _hanging.timeout = null;
      }
      _this.emit('stop');

      // if looper is null, omx manager is stopped
      if (!_looper) {
        _this.emit('end');
        return;
      }

      var nextVideo = _looper.getNext();
      if (nextVideo) {
        // Setting current video
        _currentVideo = nextVideo;
        argsToSpawn[argsToSpawn.length - 1] = nextVideo;

        if (_handleHanging) {
          _hanging.exitFunction = respawn;
          _hanging.videoStarted = new Date();
          _setHangingHandler(_hanging.videoStarted);
        }
        
        _omxProcess = spawn(_omxCommand, argsToSpawn, {
          stdio: ['pipe', null, null]
        });
        _omxProcess.once('exit', respawn);
        _this.emit('play', _currentVideo);
      } else {
        // Stop with looper null the respawn
        _looper = null;
        _this.emit('end');
      }
    };

    if (_handleHanging) {
      _hanging.exitFunction = respawn;
      _hanging.videoStarted = new Date();
      _setHangingHandler(_hanging.videoStarted);
    }

    _omxProcess = spawn(_omxCommand, argsToSpawn, {
      stdio: ['pipe', null, null]
    });
    _omxProcess.once('exit', respawn);
  } else {
    var exitFunction = function () {
      _omxProcess = null;
      _this.emit('stop');
      _this.emit('end');
    };

    if (_handleHanging) {
      _hanging.exitFunction = exitFunction;
      _hanging.videoStarted = new Date();
      _setHangingHandler(_hanging.videoStarted);
    }

    _omxProcess = spawn(_omxCommand, argsToSpawn, {
      stdio: ['pipe', null, null]
    });
    _omxProcess.once('exit', exitFunction);
  }

  _this.emit('load', _currentVideos, _currentArgs);
  _this.emit('play', _currentVideo);
};


/**
 * @private
 * @function OmxManager._omxKiller
 * @description Kill all omxplayer processes.
 * @param callback {Function} - Callback when finishes
 */
var _omxKiller = function (callback) {
  exec('pkill ' + _omxCommand, function () {
    callback();
  });
};


/**
 * @private
 * @function OmxManager._getVideoDuration
 * @description Get video duration.
 * @param video {String} - Path of the video
 * @param callback {Function} - Callback when finishes with first argument as duration in seconds or null.
 */
var _getVideoDuration = function (video, callback) {
  exec(_omxCommand + ' --info ' + video, function (err, stdout, stderr) {
    if (!err) {
      var duration = /(Duration:\s)([\d.:]+)/g.exec(stderr);
      if (duration) {
        var durationArray = duration[2].split(':');
        var seconds = Math.ceil(durationArray[0]) * 60 * 60 + Math.ceil(+durationArray[1]) * 60 + Math.ceil(+durationArray[2]);
        callback(seconds);
      } else {
        // couldn't find duration for some reason
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

/**
 * @private
 * @function OmxManager._setHangingHandler
 * @description Create timeout for 'omxplayer' hanging fix (https://github.com/popcornmix/omxplayer/issues/124).
 * @param when {Date} - When set hanging is called (for right video remaining calculation)
 */
var _setHangingHandler = function (when) {
  _getVideoDuration(_currentVideo, function (duration) {
    if (duration) {
      // Add 5 sec for delay
      _hanging.videoDuration = (duration + 5) * 1000;
      _hanging.videoRemaining = _hanging.videoDuration - Math.floor((when - _hanging.videoStarted) / 1000);

      // Sets timeout to video duration (plus 5 sec delay) in order to kill hanging omxplayer
      _hanging.timeout = setTimeout(function () {
        _omxKiller(function () {
          //_hanging.exitFunction();
        });
      }, _hanging.videoRemaining);
    }
  });
};


/*---- Public Functions ----*/
/* Functions builded inside constructor */

/**
 * @function OmxManager.decreaseSpeed
 * @description Decrease speed (sends key '1').
 */

/**
 * @function OmxManager.increaseSpeed
 * @description Increase speed (sends key '2').
 */

/**
 * @function OmxManager.previousAudioStream
 * @description Gets previous audio stream (sends key 'j').
 */

/**
 * @function OmxManager.nextAudioStream
 * @description Gets next audio stream (sends key 'k').
 */

/**
 * @function OmxManager.previousChapter
 * @description Get previous chapter (sends key 'i').
 */

/**
 * @function OmxManager.nextChapter
 * @description Get next chapter (sends key 'o').
 */

/**
 * @function OmxManager.previousSubtitleStream
 * @description Gets previous subtitle stream (sends key 'n').
 */

/**
 * @function OmxManager.nextSubtitleStream
 * @description Gets next subtitle stream (sends key 'm').
 */

/**
 * @function OmxManager.toggleSubtitles
 * @description Toggles subtitles (sends key 's').
 */

/**
 * @function OmxManager.increaseSubtitleDelay
 * @description Increase subtitle delay (sends key 'd').
 */

/**
 * @function OmxManager.decreaseSubtitleDelay
 * @description Decrease subtitle delay (sends key 'f').
 */

/**
 * @function OmxManager.increaseVolume
 * @description Increase volume (sends key '+').
 */

/**
 * @function OmxManager.decreaseVolume
 * @description Decrease volume (sends key '-').
 */

/**
 * @function OmxManager.seekForward
 * @description Seek +30 s (sends '[C').
 */

/**
 * @function OmxManager.seekBackward
 * @description Seek -30 s (sends '[D').
 */

/**
 * @function OmxManager.seekFastForward
 * @description Seek +600 s (sends '[A').
 */

/**
 * @function OmxManager.seekFastBackward
 * @description Seek -600 s (sends '[B').
 */


/**
 * @function OmxManager.stop
 * @description Stops current Omx process (sends key 'q').
 * @fires OmxManager#stop
 */
_this.stop = function () {
  /* ignore if process isn't running */
  if (!_omxProcess) return;

  _sendAction('q');
  // handle with timeout
  if (_handleHanging && _hanging.timeout) {
    clearTimeout(_hanging.timeout);
  }
  _looper = null;
  _omxProcess = null;
};


/**
 * @function OmxManager.pause
 * @description Pauses video (sends key 'p').
 * @fires OmxManager#pause
 */
_this.pause = function () {
  if (_paused) return;
  /* ignore if process isn't running */
  if (!_omxProcess) return;

  _sendAction('p');
  if (_handleHanging && _hanging.timeout) {
    clearTimeout(_hanging.timeout);
  }
  _paused = true;
  _this.emit('pause');
};


/**
 * @function OmxManager.play
 * @description Play current Omx process or play the videos with passed args (sends key 'p').<br /><b>Note:</b> videos arg will be checked for existent videos.
 * @param [videos=null] {String|Array} - Video or videos to play
 * @param [args=null] {Object} - Args to use for playing
 * @param [loop=false] {Boolean} - If must loop videos
 * @throws {TypeError} Argument "videos" must be a String or an Array
 * @throws {Error} Argument "videos" cannot be an empty Array
 * @throws {TypeError} Argument "args" must be an Object
 * @fires OmxManager#play
 * @fires OmxManager#load
 */
_this.play = function (videos, args, loop) {
  if (_omxProcess) {
    if (_paused) {
      _sendAction('p');
      if (_handleHanging) {
        _setHangingHandler(new Date());
      }
      _paused = false;
      _this.emit('play', _currentVideo);
    }
  } else {
    if (typeof videos !== 'string' && !(videos instanceof Array)) throw new TypeError('Argument "videos" must be a String or an Array!');
    if (!videos) throw new Error('Argument "videos" cannot be an empty Array!');
    if (typeof args === 'undefined') args = {};
    if (typeof args !== 'object') throw new TypeError('Argument "args" must be an object!');
    if (typeof loop === 'undefined') loop = false;

    // Convert video string to an array for underlying startup
    if (typeof videos === 'string') {
      videos = [videos];
    }
    _startup(videos, args, loop);
  }
};


/**
 * @function OmxManager.setVideosDirectory
 * @description Sets the default videos directory.
 * @default './'
 * @param directory {String} - The default videos directory to prepend
 * @throws {TypeError} Argument "directory" must be a String
 */
_this.setVideosDirectory = function (directory) {
  if (typeof directory !== 'string') throw new TypeError('Argument "directory" must be a String!');

  _videosDirectory = directory;
};


/** 
 * @function OmxManager.setVideosExtension
 * @description Sets the default videos extension (this is just an append to filename).
 * @default ''
 * @param extension {String} - The default videos extension to append
 * @throws {TypeError} Argument "extension" must be a String
 */
_this.setVideosExtension = function (extension) {
  if (typeof extension !== 'string') throw new TypeError('Argument "extension" must be a String!');

  _videosExtension = extension;
};


/**
 * @function OmxManager.setOmxCommand
 * @description Sets the default omxplayer executable path.
 * @default 'omxplayer'
 * @param command {String} - The default command to spawn
 * @throws {TypeError} Argument "command" must be a String
 */
_this.setOmxCommand = function (command) {
  if (typeof command !== 'string') throw new TypeError('Argument "command" must be a String!');

  _omxCommand = command;
};


/**
 * @function OmxManager.enableMultipleNativeLoop
 * @default false
 * @description Sets that omxplayer supports multiple native loop.
 */
_this.enableMultipleNativeLoop = function () {
  _supportsMultipleNativeLoop = true;
};


/**
 * @function OmxManager.enableHangingHandler
 * @default false
 * @description Enable if 'omx-manager' should handle 'omxplayer' hanging ({@link https://github.com/popcornmix/omxplayer/issues/124}).
 */
_this.enableHangingHandler = function () {
  _handleHanging = true;
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
 * @property current {?String} - Current video playing
 * @property args {?Object} - Current args
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
      current: _currentVideo,
      args: _currentArgs,
      playing: _this.isPlaying(),
      loaded: true
    };
  }

  return {
    loaded: false
  };
};


/**
 * @event OmxManager#load
 * @description 'omx-manager' successfully loaded and started at first time
 * @param videos {Array} - Videos that are in playing list
 * @param arguments {Object} - Arguments supplied to the spawn of Omx process
 */

/**
 * @event OmxManager#play
 * @description Successfully started a video or resumed from pause
 * @param video {String} - Currently playing video
 */

/**
 * @event OmxManager#pause
 * @description Successfully paused a video
 */

/**
 * @event OmxManager#stop
 * @description Successfully stopped a video (omxplayer process ends)
 */

/**
 * @event OmxManager#end
 * @description Videos to play are ended (never called if you are in looping condition)
 */

/** 
 * @class
 * @static
 * @description 
 * This is the main 'omx-manager' class. <br />
 * This class is <b>static</b>.
 */
var OmxManager = function () {
  for (var action in _commands) {
    if (_commands.hasOwnProperty(action)) {
      (function(key) {
        _this[action] = function () {
          if (!_omxProcess) return;

          _sendAction(key);
        };
      })(_commands[action]);
    }
  }

  return _this;
};

module.exports = OmxManager();