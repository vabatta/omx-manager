// @flow

import { EventEmitter } from 'events'
import ChildProcess from 'child_process'
import OmxManager from './omxmanager'
import Iterable from './iterable'

const spawn = ChildProcess.spawn

/**
 * @class
 * @description This class represents a single ```omxplayer``` instance.
 *
 * @fires OmxInstance#play
 * @fires OmxInstance#pause
 * @fires OmxInstance#stop
 * @fires OmxInstance#end
 */
class OmxInstance extends EventEmitter {
  /**
   * @private
   * @description Reference to the parent manager.
   * @type {OmxManager|null}
   */
  _parentManager: OmxManager|null = null;

  /**
   * @private
   * @description Command used to spawn the process.
   * @type {string}
   */
  _spawnCommand: string;

  /**
   * @private
   * @description Videos path to play.
   * @type {Iterable}
   */
  _videos: Iterable;

  /**
   * @private
   * @description Arguments passed to the spawn command.
   * @type {Array<any>}
   */
  _args: Array<any>;

  /**
   * @private
   * @description Support to native loop flag.
   * @type {boolean}
   */
  _nativeLoop: boolean = false;

  /**
   * @private
   * @description Should handle loop.
   * @type {boolean}
   */
  _handleLoop: boolean = false;

  /**
   * @private
   * @description Reference to the current spawned process.
   * @type {any|null}
   */
  _process: any|null = null;

  /**
   * @private
   * @description Contains the current state for the instance.
   * @type {StatusObject}
   */
  _status: StatusObject = {
    pid: null,
    videos: [],
    args: {},
    current: '',
    playing: false
  };

  /**
   * Create a new instance.
   * @param  {OmxManager} manager Reference to the parent manager.
   * @param  {string} cmd Command used to spawn the process.
   * @param  {Array<string>} videos Videos to play.
   * @param  {object} args Arguments passed to the spawn command.
   * @param  {boolean} nativeLoop If native loop is supported and should be used when possible.
   * @return {OmxInstance} New ```omxplayer``` instance.
   */
  constructor (manager: OmxManager, cmd: string, videos: Array<string>, args: object,
      nativeLoop: boolean) {
    super()

    this._parentManager = manager
    this._nativeLoop = nativeLoop
    this._spawnCommand = cmd
    this._videos = new Iterable(videos)
    this._args = this._buildArgsToSpawn(args)

    // If we need to handle loop (after built arguments), Iterable should cycle
    if (this._handleLoop) {
      this._videos.setLoop()
    }

    this._status.videos = this._videos.toArray()
    this._status.args = args
  }

  /**
   * @private
   * @description Set the state to end and emit event.
   */
  _setEndState () {
    this._status.pid = null
    this._status.videos = []
    this._status.args = {}
    this._status.current = ''
    this._status.playing = false
    this.emit('end')
  }

  /**
   * @private
   * @description Set the state to stop and emit event.
   */
  _setStopState () {
    this._status.current = ''
    this._status.playing = false
    this.emit('stop')
  }

  /**
   * @private
   * @description Set the state to play and emit event.
   */
  _setPlayState () {
    this._status.current = this._videos.get()
    this._status.playing = true
    this.emit('play', this._status.current)
  }

  /**
   * @private
   * @description Spawn the underlaying process.
   */
  _spawnProcess () {
    this._process = spawn(this._spawnCommand, this._args, {
      stdio: ['pipe', null, null]
    })
    this._status.pid = this._process.pid
    // attach controller
  }

  /**
   * @private
   * @description Startup a process to play videos.
   */
  _startup () {
    // Spawn the main process
    this._spawnProcess()
    // Play state
    this._setPlayState()
    // Move to next video
    this._videos.next()

    // Need to respawn
    if (this._handleLoop) {
      const respawn = () => {
        // Stop state
        this._setStopState()

        // Next video if any
        const nextVideo = this._videos.get()

        // Need to stop recursion only if we're not looping in multiple files compatibility
        // otherwise, in case we need to handle the loop, in constructor we set the Iterable
        // to loop through all videos cycling, which prevents to end
        if (nextVideo === null) {
          // End state
          this._setEndState()
        } else {
          // Change last video to current
          this._args[this._args.length - 1] = nextVideo

          // Play state
          this._setPlayState()
          // Move to next video
          this._videos.next()

          // Respawn the process
          this._spawnProcess()

          // Add respawn on process terminate recursively
          if (this._process !== null) this._process.once('exit', respawn)
        }
      }

      // Add respawn on main process terminate
      if (this._process !== null) this._process.once('exit', respawn)
    } else {
      const exitFunction = () => {
        this._process = null

        // End state
        this._setEndState()
      }

      // Add exit on process terminate
      if (this._process !== null) this._process.once('exit', exitFunction)
    }
  }

  /**
   * @private
   * @description Build arguments array to spawn.
   * @param  {object} args Arguments to spawn.
   * @return {Array<any>}
   */
  _buildArgsToSpawn (args: object): Array<any> {
    let argsToSpawn: Array<any> = []

    for (let key in args) {
      if (args.hasOwnProperty(key) && args[key]) {
        // Filter the --loop flag
        if (key === '--loop') {
          // If supports native loop and we have only 1 video,
          // otherwise we should handle looping
          if (this._nativeLoop && this._videos.length === 1) {
            argsToSpawn.push(key)
          } else {
            this._handleLoop = true
          }
        } else {
          argsToSpawn.push(key)

          // If is an option with a value (eg.: -o hdmi), we should push also the value
          let val = args[key]
          if (typeof val === 'string') {
            argsToSpawn.push(val)
          } else if (typeof val === 'number') {
            argsToSpawn.push(val.toString())
          }
        }
      }
    }

    // Start from first video
    argsToSpawn.push(this._videos.get())

    return argsToSpawn
  }

  /**
   * Returns the current status object.
   * @return {StatusObject}
   */
  getStatus (): StatusObject {
    return this._status
  }

  /**
   * @abstract
   * @description Play the current video in the serie.
   */
  play () {};

  /**
   * @abstract
   * @description Stop the current video.
   */
  stop () {};

  /**
   * @abstract
   * @description Pause the current video.
   */
  pause () {};

  /**
   * @abstract
   * @description Decrease speed (sends key '1').
   */
  decreaseSpeed () {};

  /**
   * @abstract
   * @description Increase speed (sends key '2').
   */
  increaseSpeed () {};

  /**
   * @abstract
   * @description Rewind (sends key '<').
   */
  rewind () {};

  /**
   * @abstract
   * @description Fast forward (sends key '>').
   */
  fastForward () {};

  /**
   * @abstract
   * @description Gets previous audio stream (sends key 'j').
   */
  previousAudioStream () {};

  /**
   * @abstract
   * @description Gets next audio stream (sends key 'k').
   */
  nextAudioStream () {};

  /**
   * @abstract
   * @description Get previous chapter (sends key 'i').
   */
  previousChapter () {};

  /**
   * @abstract
   * @description Get next chapter (sends key 'o').
   */
  nextChapter () {};

  /**
   * @abstract
   * @description Gets previous subtitle stream (sends key 'n').
   */
  previousSubtitleStream () {};

  /**
   * @abstract
   * @description Gets next subtitle stream (sends key 'm').
   */
  nextSubtitleStream () {};

  /**
   * @abstract
   * @description Toggles subtitles (sends key 's').
   */
  toggleSubtitles () {};

  /**
   * @abstract
   * @description Show subtitles (sends key 'w').
   */
  showSubtitles () {};

  /**
   * @abstract
   * @description Hide subtitles (sends key 'x').
   */
  hideSubtitles () {};

  /**
   * @abstract
   * @description Increase subtitle delay (sends key 'd').
   */
  increaseSubtitleDelay () {};

  /**
   * @abstract
   * @description Decrease subtitle delay (sends key 'f').
   */
  decreaseSubtitleDelay () {};

  /**
   * @abstract
   * @description Increase volume (sends key '+').
   */
  increaseVolume () {};

  /**
   * @abstract
   * @description Decrease volume (sends key '-').
   */
  decreaseVolume () {};

  /**
   * @abstract
   * @description Seek +30 s (sends '[C').
   */
  seekForward () {};

  /**
   * @abstract
   * @description Seek -30 s (sends '[D').
   */
  seekBackward () {};

  /**
   * @abstract
   * @description Seek +600 s (sends '[A').
   */
  seekFastForward () {};

  /**
   * @abstract
   * @description Seek -600 s (sends '[B').
   */
  seekFastBackward () {};

  /**
   * @event OmxInstance#play
   * @description Successfully started a video or resumed from pause
   * @param video {String} - Currently playing video
   */

  /**
   * @event OmxInstance#pause
   * @description Successfully paused a video
   */

  /**
   * @event OmxInstance#stop
   * @description Successfully stopped a video (omxplayer process ends)
   */

  /**
   * @event OmxInstance#end
   * @description Videos to play are ended (never called if you are in looping condition)
   */
}

// Export class
export default OmxInstance
