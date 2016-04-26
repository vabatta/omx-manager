// @flow

type object = { [key:string]: object|any }
type StatusObject = {
  /**
   * The process identifier (PID) of the omx instance process.
   * @type {number|null}
   */
  pid: number|null,

  /**
   * Array of current videos to play.
   * @type {Array<string>}
   */
  videos: Array<string>,

  /**
   * Arguments used to spawn process.
   * @type {object}
   */
  args: object,

  /**
   * Currently playing video.
   * @type {string}
   */
  current: string,

  /**
   * Currently playing.
   * @type {boolean}
   */
  playing: boolean
}

import { EventEmitter } from 'events'
import ChildProcess from 'child_process'
import OmxManager from './omxmanager'
import Iterable from './iterable'

const spawn = ChildProcess.spawn
const exec = ChildProcess.exec

/**
 * @class
 * @description
 * This class represents a single ```omxplayer``` instance.
 */
class OmxInstance extends EventEmitter {
  /**
   * @private
   * Reference to the parent manager.
   * @type {OmxManager|null}
   */
  _parentManager: OmxManager|null = null;

  /**
   * @private
   * Command used to spawn the process.
   * @type {string}
   */
  _spawnCommand: string;

  /**
   * @private
   * Videos path to play.
   * @type {Iterable}
   */
  _videos: Iterable;

  /**
   * @private
   * Arguments passed to the spawn command.
   * @type {Array<any>}
   */
  _args: Array<any>;

  /**
   * @private
   * Arguments passed to the constructor.
   * @type {object}
   */
  _originalArgs: object;

  /**
   * @private
   * Support to native loop flag.
   * @type {boolean}
   */
  _nativeLoop: boolean = false;

  /**
   * @private
   * Should handle loop.
   * @type {boolean}
   */
  _handleLoop: boolean = false;

  /**
   * @private
   * Reference to the current spawned process.
   * @type {any|null}
   */
  _process: any|null = null;

  /**
   * @private
   * Contains the current state for the instance.
   * @type {StatusObject}
   */
  state: StatusObject = {
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
    this._originalArgs = args
    this._args = this._buildArgsToSpawn(args)

    // If we need to handle loop (after built arguments), Iterable should cycle
    if (this._handleLoop) {
      this._videos.setLoop()
    }

    this.state.videos = this._videos.toArray()
    this.state.args = this._originalArgs
  }

  /**
   * @private
   * Set the state to end and emit event.
   */
  _setEndState () {
    this.state.pid = null
    this.state.videos = []
    this.state.args = {}
    this.state.current = ''
    this.state.playing = false
    this.emit('end')
  }

  /**
   * @private
   * Set the state to stop and emit event.
   */
  _setStopState () {
    this.state.current = ''
    this.state.playing = false
    this.emit('stop')
  }

  /**
   * @private
   * Set the state to play and emit event.
   */
  _setPlayState () {
    this.state.current = this._videos.get()
    this.state.playing = true
    this.emit('play', this.state.current)
  }

  /**
   * @private
   * Spawn the underlaying process.
   */
  _spawnProcess () {
    this._process = spawn(this._spawnCommand, this._args, {
      stdio: ['pipe', null, null]
    })
    this.state.pid = this._process.pid
  }

  /**
   * Start to play videos.
   */
  play () {
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
          this._process.once('exit', respawn)
        }
      }

      // Add respawn on main process terminate
      this._process.once('exit', respawn)
    } else {
      const exitFunction = () => {
        this._process = null

        // End state
        this._setEndState()
      }

      // Add exit on process terminate
      this._process.once('exit', exitFunction)
    }
  }

  /**
   * Stop playing video. Kill the process.
   */
  stop () {
    // TODO: stop current process
  }

  /**
   * Pausa playing video.
   */
  pause () {
    // TODO: pause playing video
  }

  /**
   * @private
   * Build arguments array to spawn.
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
}

// Export class
export default OmxInstance
