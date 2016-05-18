// @flow

import { EventEmitter } from 'events'
import path from 'path'
import fs from 'fs'
import OmxInstance from './omxinstance'
import KeyboardController from './keyboardcontroller'

const URI_REGEX = /^(.+):\/\//g

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
   * @private
   * Resolve path of videos and returns only valid and existent videos array.
   * @param videos {Array<string>} - Videos to check
   * @returns {Array<string>} Valid videos
   */
  _resolveVideosPath (videos: Array<string>): Array<string> {
    let ret: Array<string> = []
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i]

      // Check if path is URI, otherwise treat as path
      if (video.match(URI_REGEX)) {
        ret.push(video)
      } else {
        const realPath = path.resolve(this._videosDirectory, video + this._videosExtension)

        if (fs.existsSync(realPath)) {
          ret.push(realPath)
        } else {
          const err = {
            error: new Error('File not found: ' + realPath)
          }

          // Report/Emit this error?
          this.emit('error', err)
        }
      }
    }

    return ret
  }

  /**
   * Create a new instance and returns it.
   * @param  {Array<string>|string} videos Videos to play.
   * @param  {object} [args={}] Arguments passed to the process.
   * @return {OmxInstance|null} The instance object or null if empty.
   */
  create (videos: Array<string>|string, args: object = {}): OmxInstance|null {
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

    // Create the instance
    const instance = new KeyboardController(this, this._spawnCommand, videos, args, this._nativeLoop)

    // Return back
    return instance
  }
}

// Export class
export default OmxManager