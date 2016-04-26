// @flow

type object = { [key:string]: object|any }

import { EventEmitter } from 'events'
import path from 'path'
import fs from 'fs'
import OmxInstance from './omxinstance'

/**
 * @class
 * @description
 * This class is used to control multiple ```omxplayer``` instances.
 */
class OmxManager extends EventEmitter {
  /**
   * @private
   * Shared path for the videos.
   * @type {string}
   */
  _videosDirectory: string = './';

  /**
   * @private
   * Shared extension for the videos.
   * @type {string}
   */
  _videosExtension: string = '';

  /**
   * @private
   * Command used to spawn instances.
   * @type {string}
   */
  _spawnCommand: string = 'omxplayer';

  /**
   * @private
   * Support to native loop flag
   * @type {boolean}
   */
  _nativeLoop: boolean = false;

  /**
   * @private
   * Support to native multiple files spawn.
   * @type {boolean}
   */
  _nativeMultipleFiles: boolean = false;

  /**
   * New omxmanager instance.
   * @return {OmxManager}
   */
  constructor () {
    super()
  }

  /**
   * Set where to look for videos.
   * @default './'
   * @param {string} path Shared path.
   */
  setVideosDirectory (path: string) {
    this._videosDirectory = path
  }

  /**
   * Set an extension for videos.
   * @default ''
   * @param {string} ext Shared format.
   */
  setVideosExtension (ext: string) {
    this._videosExtension = ext
  }

  /**
   * Set the default command to spawn.
   * @default 'omxplayer'
   * @param {string} cmd The path to the executables to spawn for omxplayer.
   */
  setOmxCommand (cmd: string) {
    this._spawnCommand = cmd
  }

  /**
   * Sets support to native loop flag.
   * @default false
   */
  enableNativeLoop () {
    this._nativeLoop = true
  }

  /**
   * Sets support to native multiple files spawn.
   * @default false
   */
  enableNativeMultipleFiles () {
    this._nativeMultipleFiles = true
  }

  /**
   * @private
   * Resolve path of videos and returns only valid and existent videos array.
   * @param videos {Array<string>} - Videos to check
   * @returns {Array<string>} Valid videos
   */
  _resolveVideosPath (videos: Array<string>) {
    let ret: Array<string> = []
    videos.forEach(function (video) {
      var realPath = path.resolve(this._videosDirectory, video + this._videosExtension)

      if (fs.existsSync(realPath)) {
        ret.push(realPath)
      } else {
        const err = {
          error: new Error('File not found: ' + realPath)
        }

        // Report/Emit this error?
        this.emit('error', err)
      }
    })

    return ret
  }

  /**
   * Start a new instance and returns it.
   * @param  {Array<string>|string} videos Videos to play.
   * @param  {object} [args={}] Arguments passed to the process.
   * @return {OmxInstance|null} The instance object or null if empty.
   */
  start (videos: Array<string>|string, args: object = {}): OmxInstance|null {
    // Wrap videos to array if it's a string (sort of overload)
    if (typeof videos === 'string') {
      videos = [videos]
    }

    // Check for the paths
    videos = this._resolveVideosPath(videos)

    // If videos are empty, return null
    if (videos.length === 0) {
      return null
    }

    let instance = new OmxInstance(this, this._spawnCommand, videos, args, this._nativeLoop, this._nativeMultipleFiles)
    instance.play()

    return instance
  }
}

// Export class
export default OmxManager
