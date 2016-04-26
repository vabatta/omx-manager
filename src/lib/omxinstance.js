// @flow

type object = { [key:string]: object|any }

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
  _args: Array<any> = [];

  /**
   * @private
   * If supports native loop or need a wrapper for videos.
   * @type {boolean}
   */
  _nativeLoop: boolean = false;

  /**
   * @private
   * If need to handle loop with Iterable.
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
   * The process identifier (PID) of the omx instance process.
   * @type {number|null}
   */
  _pid: number|null = null;

  /**
   * @private
   * Contains the current state for the instance.
   * @type {object}
   */
  _state: object = { loaded: false };

  /**
   * Create a new instance.
   * @param  {OmxManager} manager Reference to the parent manager.
   * @param  {string} cmd Command used to spawn the process.
   * @param  {Array<string>} videos Videos to play.
   * @param  {object} args Arguments passed to the spawn command.
   * @param  {boolean} nativeLoop If native loop is supported.
   * @param  {boolean} handleLoop If we need to handle loop with Iterable.
   * @return {OmxInstance} New ```omxplayer``` instance.
   */
  constructor (manager: OmxManager, cmd: string, videos: Array<string>, args: object,
      nativeLoop: boolean, handleLoop: boolean) {
    super()

    this._parentManager = manager
    this._nativeLoop = nativeLoop
    this._handleLoop = handleLoop
    this._spawnCommand = cmd
    this._videos = new Iterable(videos)
    this._args = this._buildArgsToSpawn(args)
  }

  /**
   * Start to play videos.
   */
  play () {
    // TODO: start to play videos
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
          if (this._nativeLoop || (this._videos.length === 1 && !this._handleLoop)) {
            argsToSpawn.push(key)
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

    // If native loop is enabled (multiple files native supported), we push every videos
    // to the arguments to spawn, otherwise just the first
    if (this._nativeLoop) {
      argsToSpawn.push.apply(argsToSpawn, this._videos.toArray())
    } else {
      argsToSpawn.push(this._videos.get())
    }

    return argsToSpawn
  }
}

export default OmxInstance
