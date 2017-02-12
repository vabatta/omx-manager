/* Import statements */
var fs = require('fs');
var path = require('path');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var ChildProcess = require('child_process');
var is = require('is_js');
var OmxInstance = require('./OmxInstance');

/**
 * Create an OmxManager instance.
 * @class OmxManager
 * @param {object} config Initial configuration.
 * @return {OmxManager} New instance.
 */
var OmxManager = function OmxManager(config) {
  // Initialize EventEmitter constuctor
  EventEmitter.call(this);

  // Initialize members
  /**
   * Shared path for the videos.
   * @private
   * @member {string}
   */
  this._videosDirectory = './';

  /**
   * Shared extension for the videos.
   * @private
   * @member {string}
   */
  this._videosExtension = '';

  /**
   * Command used to spawn instances.
   * @private
   * @member {string}
   */
  this._omxCommand = 'omxplayer';

  /**
   * If DBUS controller is enabled.
   * @private
   * @member {boolean}
   */
  this._dbusController = false;

  // Provide defaults if not passed
  var defaultConfig = {
    videosDirectory: this._videosDirectory,
    videosExtension: this._videosExtension,
    omxCommand: this._omxCommand,
    dbusController: this._dbusController
  };

  // Set the configurations
  this.setConfigurations(Object.assign(defaultConfig, config));

  // Return reference for instantiation
  return this;
};

/**
 * Set current manager configurations.
 * @param {object} config The configurations to be set.
 * @throws {TypeError} Invalid parameters.
 */
OmxManager.prototype.setConfigurations = function setConfigurations(config) {
  // Parameters checking
  if (is.not.object(config)) throw new TypeError('Error: config: must be an object.');
  // Redirect methods
  if (is.existy(config.videosDirectory)) this.setVideosDirectory(config.videosDirectory);
  if (is.existy(config.videosExtension)) this.setVideosExtension(config.videosExtension);
  if (is.existy(config.omxCommand)) this.setOmxCommand(config.omxCommand);
  if (is.existy(config.dbusController)) this.setDbusController(config.dbusController);
};

/**
 * @typedef {object} OmxManager.configurations
 * @desc Object containing current instance configurations.
 * @prop {string} videosDirectory Shared directory for the videos.
 * @prop {string} videosExtension Shared extension for the videos.
 * @prop {string} omxCommand The path to the executables to spawn for omxplayer.
 * @prop {boolean} dbusController If DBUS controller is enabled.
 */

/**
 * Returns current configurations.
 * @return {OmxManager.configurations}
 */
OmxManager.prototype.getConfigurations = function getConfigurations() {
  return {
    videosDirectory: this._videosDirectory,
    videosExtension: this._videosExtension,
    omxCommand: this._omxCommand,
    dbusController: this._dbusController
  };
};

/**
 * Set where to look for videos.
 * @default './'
 * @param {string} directory Shared directory.
 * @throws {TypeError} Invalid parameters.
 */
OmxManager.prototype.setVideosDirectory = function setVideosDirectory(directory) {
  // Parameters checking
  if (is.not.string(directory)) throw new TypeError('Error: directory: must be a string.');
  else if (!fs.lstatSync(directory).isDirectory()) throw new TypeError('Error: directory: must be a directory.');
  fs.accessSync(directory, fs.constants.R_OK);

  this._videosDirectory = path.normalize(directory);
};

/**
 * Set an extension for videos.
 * @default ''
 * @param {string} ext Shared format.
 * @throws {TypeError} Invalid parameters.
 */
OmxManager.prototype.setVideosExtension = function setVideosExtension(ext) {
  // Parameters checking
  if (is.not.string(ext)) throw new TypeError('Error: ext: must be a string.');

  this._videosExtension = ext;
};

/**
 * Set the default command to spawn.
 * @default 'omxplayer'
 * @param {string} cmd The path to the executables to spawn for omxplayer.
 * @throws {TypeError} Invalid parameters.
 */
OmxManager.prototype.setOmxCommand = function setOmxCommand(cmd) {
  // Parameters checking
  if (is.not.string(cmd)) throw new TypeError('Error: cmd: must be a string.');
  else if (is.not.equal(ChildProcess.spawnSync(cmd).status, 0)) throw new TypeError('Error: cmd: cannot execute command correctly.');
  // fs.accessSync(cmd, fs.constants.X_OK);

  this._omxCommand = cmd;
};

/**
 * Set if DBUS controller is enabled or not.
 * @default false
 * @param {boolean} controller If DBUS controller is enabled.
 */
OmxManager.prototype.setDbusController = function setDbusController(controller) {
  if (is.equal(controller, true)) this._dbusController = true;
  else this._dbusController = false;
};

/**
 * Sets support to native loop flag.
 * @deprecated Since version 0.2.0
 * @function OmxManager.prototype.enableNativeLoop
 * @default false
 */
// OmxManager.prototype.enableNativeLoop = function enableNativeLoop() {
//   console.warn('OmxManager.enableNativeLoop() is deprecated.');
// };

/**
 * @private
 * @desc Resolve path of videos and returns only valid and existent videos array.
 * @param videos {Array<string>} Videos to check.
 * @throws {Error} File not found.
 * @return {Array<string>} Valid videos.
 */
OmxManager.prototype._resolveVideosPath = function _resolveVideosPath(videos) {
  // Return array
  var cleaned = [];

  // Iterate over it
  for (var i = 0; i < videos.length; i += 1) {
    var video = videos[i];

    // Check if path is URI, otherwise treat as path
    if (video.match(OmxManager.constants.URI_REGEX)) {
      cleaned.push(video);
    }
    else {
      // Resolve the video path
      var realPath = path.resolve(this._videosDirectory, video + this._videosExtension);

      // Add if it's available or throw an error
      // fs.accessSync(realPath, fs.constants.F_OK);
      if (is.not.empty(video) && fs.lstatSync(realPath).isFile()) {
        cleaned.push(realPath);
      }
      else {
        throw new Error('File not found: ' + realPath);
      }
    }
  }

  // Return back the cleaned videos
  return cleaned;
};

/**
 * Create a new instance and returns it.
 * @param  {Array<string>|string} videos Videos to play.
 * @param  {object} [args={}] Arguments passed to the process.
 * @throws {TypeError} Invalid parameters.
 * @return {OmxInstance|null} The instance object or null if empty.
 */
OmxManager.prototype.create = function create(videos, args) {
  // Wrap videos to array if it's a string (sort of overload)
  if (is.string(videos)) videos = [videos];
  else if (is.not.array(videos)) throw new TypeError('Error: videos: must be a string array.');
  else if (!is.all.string(videos)) throw new TypeError('Error: videos: must be a string array.');

  // Check for the paths
  videos = this._resolveVideosPath(videos);

  // If passed an empty array throw an error
  if (videos.length === 0) throw new TypeError('Error: videos: array must not be empty.');

  // Check for arguments parameter
  if (is.not.object(args)) throw new TypeError('Error: args: must be an object.');

  // Return the instance
  return new OmxInstance(this, this._omxCommand, videos, args, this._dbusController);
};

// Inherits EventEmitter
util.inherits(OmxManager, EventEmitter);

/**
 * Constants defined by the library.
 * @namespace OmxManager.constants
 */
OmxManager.constants = {
  /**
   * Regex used to check if is a URI.
   */
  URI_REGEX: /^(.+):\/\//g
};

// Expose the class
module.exports = OmxManager;
