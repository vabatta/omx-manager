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
   * If command supports multiple native loop.
   * @type {boolean}
   */
  _nativeLoop: boolean = false;

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
   * Sets that ```omxplayer``` supports multiple native loop.
   * @default false
   */
  enableMultipleNativeLoop () {
    this._nativeLoop = true
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
   * @param  {Array<string>} videos Videos to play.
   * @param  {object} [args={}] Arguments passed to the process.
   * @param  {boolean} [handleLoop=false] If need to handle multiple files loop.
   * @return {OmxInstance} The instance object.
   */
  start (videos: Array<string>, args: object = {}, handleLoop: boolean = false): OmxInstance {
    videos = this._resolveVideosPath(videos)

    let instance = new OmxInstance(this, this._spawnCommand, videos, args, this._nativeLoop, handleLoop)
    instance.play()

    return instance
  }
}

// Export class
export default OmxManager
