/*---- Require ----*/
var EventEmitter = require('events').EventEmitter;
var Looper = require('./looper');


/*---- Prototype ----*/
var _this = Object.create(EventEmitter.prototype);


/*---- Members ----*/
var _videosDirectory = './';
var _videosExtension = '';
var _omxCommand = 'omxplayer';

var _currentVideos = [];
var _currentSettings = {};

var _looper = null;
var _omxProcess = null;
var _paused = false;

/**
 * @typedef {Object} OmxManager.Commands
 * @property pause {String} - Rapresents the pause command key: 'p'
 * @property quit {String} - Rapresents the quit command key: 'q'
 */
var _commands = {
  'pause': 'p',
  'quit': 'q'
};


/*---- Functions ----*/
/**
 * @function OmxManager.setVideosDirectory
 * @description Sets the default videos directory.
 * @param directory {String} - The default videos directory 
 * @throws {TypeError} Argument "directory" must be a {String}
 */
_this.setVideosDirectory = function (directory) {
  if (typeof directory !== 'string') throw new TypeError('Argument "directory" must be a string!');

  _videosDirectory = directory;
};


/** 
 * @function OmxManager.setVideosExtension
 * @description Sets the default videos extension (this is just an append to filename).
 * @param extension {String} - The default videos extension
 * @throws {TypeError} Argument "extension" must be a {String}
 */
_this.setVideosExtension = function (extension) {
  if (typeof extension !== 'string') throw new TypeError('Argument "extension" must be a string!');

  _videosExtension = extension;
};


/**
 * @description Sets the default omxplayer executable path.
 * @param command {String} - The default command to spawn
 * @throws {TypeError} Argument "command" must be a {String}
 */
_this.setOmxCommand = function (command) {
  if (typeof command !== 'string') throw new TypeError('Argument "command" must be a string!');

  _omxCommand = command;
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
 * Current Status Object of omx manager if loaded
 * @typedef {Object} OmxManager.StatusObject
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
  if (isLoaded()) {
    return {
      videos: _currentVideos,
      settings: _currentSettings,
      playing: isPlaying(),
      loaded: true
    };
  }

  return {
    loaded: false
  };
};


/**
 * @function OmxManager.sendAction
 * @description Sends an action reported in {OmxManager.Commands}.
 * @param action {String} - The action to send
 * @throws {TypeError} Argument "action" must be a {String}
 */
_this.sendAction = function (action) {
  if (typeof action !== 'string') throw new TypeError('Argument "action" must be a string!');
  
  if (_commands[action] && _omxProcess) {
    omxProcess.stdin.write(_commands[action], function (err) {
      // Report this error?
    });
  }
};


/** @constructor */
var OmxManager = function () {
  return _this;
};

module.exports = OmxManager;