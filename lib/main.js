var util = require('util');
var EventEmitter = require('events').EventEmitter;

/** @constructor */
function OmxManager() {
  /** @default */
  this.videosDirectory = './';

  /** @default */
  this.videosExtension = '';

  /** @default */
  this.omxCommand = 'omxplayer';

  this.currentVideos = [];
  this.currentSettings = {};

  this.omxProcess = null;
  this.paused = false;
};

util.inherits(OmxManager, EventEmitter);


/**
 * Sets the default videos directory.
 * @param directory {String} - The default videos directory 
 * @throws {TypeError} Argument "directory" must be a string
 */
OmxManager.prototype.setVideosDirectory = function(directory) {
  if (typeof directory !== 'string') throw new TypeError('Argument "directory" must be a string!');

  this.videosDirectory = directory;
};


/** 
 * Sets the default videos extension (this is just an append to filename).
 * @param extension {String} - The default videos extension
 * @throws {TypeError} Argument "extension" must be a string
 */
OmxManager.prototype.setVideosExtension = function(extension) {
  if (typeof extension !== 'string') throw new TypeError('Argument "extension" must be a string!');

  this.videosExtension = extension;
};


/**
 * Sets the default omxplayer executable path.
 * @param command {String} - The default command to spawn
 * @throws {TypeError} Argument "command" must be a string
 */
OmxManager.prototype.setOmxCommand = function(command) {
  if (typeof command !== 'string') throw new TypeError('Argument "command" must be a string!');

  this.omxCommand = command;
};


/**
 * Returns if omx manager is currently playing.
 * @returns {Boolean}
 */
OmxManager.prototype.isPlaying = function () {
  return this.omxProcess && !this.paused;
};


/**
 * Returns if omx manager is loaded (already spawned).
 * @returns {Boolean}
 */
OmxManager.prototype.isLoaded = function () {
  return this.omxProcess;
};


/**
 * Current Status Object of omx manager
 * @typedef {Object} OmxManager.StatusObject
 * @property videos {Array} - Current videos array
 * @property settings {Object} - Current settings
 * @property playing {Boolean} - If is currently playing
 * @property loaded {Boolean} - If is currently loaded
 */

/**
 * Returns current status of omx manager.
 * @returns {OmxManager.StatusObject}
 */
OmxManager.prototype.getStatus = function () {
  if (this.isLoaded()) {
    return {
      videos: this.currentVideos,
      settings: this.currentSettings,
      playing: this.isPlaying(),
      loaded: true
    };
  }
  
  return {
    loaded: false
  };
};

module.exports = OmxManager;