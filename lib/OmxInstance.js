/* Import statements */
var fs = require('fs');
var path = require('path');
var util = require('util');
var crypto = require('crypto');
var ChildProcess = require('child_process');
var EventEmitter = require('events').EventEmitter;
var is = require('is_js');
var Iterable = require('./Iterable');

/**
 * Represents a single `omxplayer` instance.
 * @class OmxInstance
 * @param {OmxManager} parentManager Reference to the parent manager.
 * @param {string} omxCommand Command used to spawn instances.
 * @param {Array<string>} videos Videos to play.
 * @param {Array<any>} args Arguments passed to the spawn command.
 * @param {boolean} dbusController If DBUS controller is enabled.
 * @return {OmxInstance} New instance.
 * @fires OmxInstance#play
 * @fires OmxInstance#pause
 * @fires OmxInstance#stop
 * @fires OmxInstance#end
 */
var OmxInstance = function OmxInstance(parentManager, omxCommand, videos, args, dbusController) {
  // Initialize EventEmitter constuctor
  EventEmitter.call(this);

  // Initialize members
  /**
   * Contains the current configurations of the instance.
   * @private
   * @member {OmxInstance.configurations}
   */
  this._configurations = {
    args: args,
    videos: videos,
    loop: false,
    pid: null,
    dbusName: null
  };

  /**
   * Contains the current playback status of the instance.
   * @private
   * @member {OmxInstance.playback}
   */
  this._playback = {
    current: '',
    playing: false
  };

  /**
   * Reference to the current spawned process.
   * @private
   * @member {ChildProcess|null}
   */
  this._process = null;

  /**
   * Reference to the parent manager.
   * @private
   * @member {OmxManager}
   */
  this._parentManager = parentManager;

  /**
   * Command used to spawn instances.
   * @private
   * @member {string}
   */
  this._omxCommand = omxCommand;

  /**
   * Videos to play.
   * @private
   * @member {Iterable}
   */
  this._videos = new Iterable(videos, true);

  /**
   * If DBUS controller is enabled.
   * @private
   * @member {boolean}
   */
  this._dbusController = dbusController;

  /**
   * Arguments passed to the spawn command.
   * @private
   * @member {Array<string>}
   */
  this._args = this._buildArgsToSpawn(args);

  // Back reference to the instance
  var self = this;
  // Build up the default keyboard actions
  Object.keys(OmxInstance._actionsKeybindings).forEach(function forEachActionKey(action) {
    /* eslint-disable func-names */
    (function (key) {
      // Create the function dynamically
      self[action] = function () {
        self._writeKey(key);
      };
      // Assign the name for better stack traces
      Object.defineProperty(self[action], 'name', { value: action });
    }(OmxInstance._actionsKeybindings[action]));
    /* eslint-enable func-names */
  });

  // Return reference for instantiation
  return this;
};

/**
 * Return if the DBUS controller is enabled or not.
 * @return {boolean} If DBUS controller is enabled.
 */
OmxInstance.prototype.getDbusControllerEnabled = function getDbusControllerEnabled() {
  return this._dbusController;
};

/**
 * Returns the current configurations object.
 * @return {OmxInstance.configurations}
 */
OmxInstance.prototype.getConfigurations = function getConfigurations() {
  return this._configurations;
};

/**
 * Returns the current playback status object.
 * @return {OmxInstance.playback}
 */
OmxInstance.prototype.getPlayback = function getPlayback() {
  return this._playback;
};

/**
 * Build arguments array to spawn and setup loop, key config and DBUS.
 * @private
 * @param  {object} args Arguments to spawn.
 * @return {Array<string>}
 */
OmxInstance.prototype._buildArgsToSpawn = function _buildArgsToSpawn(args) {
  // Back reference to the instance
  var self = this;
  // Arguments to return
  var argsToSpawn = [];
  // Filter the --loop and --key-config flags as the library provide alternatives to them to work
  var keysIgnored = ['--loop', '--key-config', '--dbus_name'];

  Object.keys(args).forEach(function forEachArgsKey(key) {
    // Get the value of the key
    var value = args[key];
    // Validity check to push only string, number and boolean values command line arguments
    var validValue = is.string(value) || is.number(value) || is.boolean(value);
    // Validity check
    if (validValue && is.truthy(value)) {
      // Check for custom handling keys
      if (is.not.inArray(key, keysIgnored)) {
        // Push the key
        argsToSpawn.push(key);
        // Push value for string and number values
        if (is.string(value)) argsToSpawn.push(value);
        else if (is.number(value)) argsToSpawn.push(value.toString());
      }
      // Check if should handle loop
      else if (is.equal(key, '--loop')) {
        self._configurations.loop = true;
      }
    }
  });

  // Add provided key bindings file
  argsToSpawn.push('--key-config');
  argsToSpawn.push(path.resolve(__dirname, './keys.txt'));

  // If need to handle dbus name
  if (this._dbusController) {
    // Generate the DBUS name and save it
    this._configurations.dbusName = OmxInstance.constants.DBUS_PREFIX + crypto.randomBytes(OmxInstance.constants.DBUS_ID_LEN).toString('hex');
    // Push it!
    argsToSpawn.push('--dbus_name');
    argsToSpawn.push(this._configurations.dbusName);
  }

  // Start from first video
  argsToSpawn.push(this._videos.get());

  // Return the arguments
  return argsToSpawn;
};

/**
 * Write a key to the underlaying process (to trigger actions).
 * @private
 * @param {String} key The key to write.
 */
OmxInstance.prototype._writeKey = function _writeKey(key) {
  if (this._process) this._process.stdin.write(key);
};

/**
 * Spawn the underlaying process.
 * @private
 */
OmxInstance.prototype._spawnProcess = function _spawnProcess() {
  // Save back reference
  var self = this;
  // Spawn the instance
  this._process = ChildProcess.spawn(this._omxCommand, this._args, {
    stdio: 'pipe'
  })
  // Clear if the process terminates
  .on('exit', function processExits() {
    self._configurations.pid = null;
    self._process = null;
  });
  // Save the PID
  this._configurations.pid = this._process.pid;
};

/**
 * Kill the underlaying instance.
 * @private
 */
OmxInstance.prototype._killProcess = function _killProcess() {
  if (this._process) this._process.kill('SIGTERM');
};

/**
 * @typedef {object} OmxInstance.configurations
 * @desc Object containing current instance configurations.
 * @prop {object} args Arguments used to spawn process.
 * @prop {Array<string>} videos Videos to play.
 * @prop {boolean} loop If it's in a loop condition.
 * @prop {number|null} pid The process identifier (PID) of the underlaying OmxInstance process.
 * @prop {string|null} dbusName DBUS name of this instance.
 */

/**
 * @typedef {object} OmxInstance.playback
 * @desc Object containing current playback status.
 * @prop {string} current Current playing video's path.
 * @prop {boolean} playing If currently playing or stopped.
 */

/**
 * @event OmxInstance#play
 * @desc Successfully started a video or resumed from pause
 * @param video {String} - Currently playing video
 */

/**
 * @event OmxInstance#pause
 * @desc Successfully paused a video
 */

/**
 * @event OmxInstance#stop
 * @desc Successfully stopped a video (omxplayer process ends)
 */

/**
 * @event OmxInstance#end
 * @desc Videos to play are ended (never called if you are in looping condition)
 */

// Inherits EventEmitter
util.inherits(OmxInstance, EventEmitter);

/**
 * Constants defined by the library.
 * @namespace OmxInstance.constants
 */
OmxInstance.constants = {
  /**
   * DBUS name prefix.
   * @type {string}
   */
  DBUS_PREFIX: 'MediaPlayer2.omxplayer.OmxManager.instance',

  /**
   * DBUS id length.
   * @type {number}
   */
  DBUS_ID_LEN: 20
};

/**
 * @function OmxInstance.prototype.decreaseSpeed
 * @description Decrease speed (sends key '1').
 */

/**
 * @function OmxInstance.prototype.increaseSpeed
 * @description Increase speed (sends key '2').
 */

/**
 * @function OmxInstance.prototype.previousAudioStream
 * @description Gets previous audio stream (sends key 'j').
 */

/**
 * @function OmxInstance.prototype.nextAudioStream
 * @description Gets next audio stream (sends key 'k').
 */

/**
 * @function OmxInstance.prototype.previousChapter
 * @description Get previous chapter (sends key 'i').
 */

/**
 * @function OmxInstance.prototype.nextChapter
 * @description Get next chapter (sends key 'o').
 */

/**
 * @function OmxInstance.prototype.previousSubtitleStream
 * @description Gets previous subtitle stream (sends key 'n').
 */

/**
 * @function OmxInstance.prototype.nextSubtitleStream
 * @description Gets next subtitle stream (sends key 'm').
 */

/**
 * @function OmxInstance.prototype.toggleSubtitles
 * @description Toggles subtitles (sends key 's').
 */

/**
 * @function OmxInstance.prototype.increaseSubtitleDelay
 * @description Increase subtitle delay (sends key 'd').
 */

/**
 * @function OmxInstance.prototype.decreaseSubtitleDelay
 * @description Decrease subtitle delay (sends key 'f').
 */

/**
 * @function OmxInstance.prototype.increaseVolume
 * @description Increase volume (sends key '+').
 */

/**
 * @function OmxInstance.prototype.decreaseVolume
 * @description Decrease volume (sends key '-').
 */

/**
 * @function OmxInstance.prototype.seekForward
 * @description Seek +30 s (sends '[C').
 */

/**
 * @function OmxInstance.prototype.seekBackward
 * @description Seek -30 s (sends '[D').
 */

/**
 * @function OmxInstance.prototype.seekFastForward
 * @description Seek +600 s (sends '[A').
 */

/**
 * @function OmxInstance.prototype.seekFastBackward
 * @description Seek -600 s (sends '[B').
 */

/**
 * Actions keybindings.
 * @private
 * @namespace OmxInstance._actionsKeybindings
 */
OmxInstance._actionsKeybindings = {
  decreaseSpeed: '1',
  increaseSpeed: '2',
  previousAudioStream: 'j',
  nextAudioStream: 'k',
  previousChapter: 'i',
  nextChapter: 'o',
  previousSubtitleStream: 'n',
  nextSubtitleStream: 'm',
  toggleSubtitles: 's',
  increaseSubtitleDelay: 'd',
  decreaseSubtitleDelay: 'f',
  increaseVolume: '+',
  decreaseVolume: '-',
  seekForward: '\x5B\x43',
  seekBackward: '\x5B\x44',
  seekFastForward: '\x5B\x41',
  seekFastBackward: '\x5B\x42'
};

// Expose the class
module.exports = OmxInstance;
