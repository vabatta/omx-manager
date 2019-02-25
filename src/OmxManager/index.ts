import is from 'is_js'
import fs from 'fs'
import path from 'path'
import { spawnSync } from 'child_process'
import { OmxInstance } from '../OmxInstance'

/**
 * @description Object containing current manager configurations.
 * @interface OmxManagerConfigurations
 */
export interface OmxManagerConfigurations {
  /**
   * @description Shared base directory for the videos.
   * @defaults ["./"]{@link OmxManager.config.videosDirectory}
   * @type {string}
   * @memberof OmxManagerConfigurations
   */
  videosDirectory: string;

  /**
   * @description Shared extensions for the videos.
   * @defaults [""]{@link OmxManager.config.videosExtension}
   * @type {string}
   * @memberof OmxManagerConfigurations
   */
  videosExtension: string;

  /**
   * @description The path to the executable omxplayer.
   * @defaults ["omxplayer"]{@link OmxManager.config.omxCommand}
   * @type {string}
   * @memberof OmxManagerConfigurations
   */
  omxCommand: string;

  /**
   * @description The path to the executable to communicate through DBUS.
   * @defaults ["dbus-send"]{@link OmxManager.config.dbusCommand}
   * @type {string}
   * @memberof OmxManagerConfigurations
   */
  dbusCommand: string;

  /**
   * @description Timeout for DBUS replies (ms).
   * @defaults [500]{@link OmxManager.config.dbusTimeout}
   * @type {number}
   * @memberof OmxManagerConfigurations
   */
  dbusTimeout: number;

  /**
   * @description Interval to synchronize OmxInstance with the underlaying process (ms).
   * @defaults [500]{@link OmxManager.config.syncInterval}
   * @type {number}
   * @memberof OmxManagerConfigurations
   */
  syncInterval: number;
}

/**
 * @description Constants defined and used by the library.
 * @interface OmxManagerConstants
 */
interface OmxManagerConstants {
  /**
   * @description Regex used to check if is a URI.
   * @defaults {@link OmxManager.constants.URI_REGEX}
   * @readonly
   * @type {RegExp}
   * @memberof OmxManagerConstants
   */
  URI_REGEX: RegExp;
}

/**
 * @description Orchestrator for multiple omx instances.
 * @export
 * @class OmxManager
 */
export class OmxManager {
  private readonly constants: OmxManagerConstants = {
    URI_REGEX: /^(.+):\/\//g
  }

  private config: OmxManagerConfigurations = {
    videosDirectory: './',
    videosExtension: '',
    omxCommand: 'omxplayer',
    dbusCommand: 'dbus-send',
    dbusTimeout: 500,
    syncInterval: 500
  }

  /**
   * Creates an instance of OmxManager.
   * @param {Partial<OmxManagerConfigurations>} config
   * @memberof OmxManager
   */
  public constructor (config?: Partial<OmxManagerConfigurations>) {
    // if the config is not supplied, proxy to an empty object
    if (is.undefined(config)) config = {}
    // clone and set the configurations
    this.setConfigurations(Object.assign(this.config, config))
  }

  /**
   * @description Returns a copy of the current configurations.
   * @returns {OmxManagerConfigurations}
   * @memberof OmxManager
   */
  public getConfigurations (): OmxManagerConfigurations {
    // return a new object clone
    return Object.assign({}, this.config)
  }

  /**
   * @description Sets the configurations which new {@link OmxInstance} will be spawned with.
   * @param {Partial<OmxManagerConfigurations>} config
   * @throws {TypeError} Invalid parameters.
   * @memberof OmxManager
   */
  public setConfigurations (config: Partial<OmxManagerConfigurations>): void {
    // parameters checking
    if (!is.object(config)) throw new TypeError('config: must be an object')
    // redirect methods
    if (!is.undefined(config.videosDirectory)) this.setVideosDirectory(config.videosDirectory)
    if (!is.undefined(config.videosDirectory)) this.setVideosDirectory(config.videosDirectory)
    if (!is.undefined(config.videosExtension)) this.setVideosExtension(config.videosExtension)
    if (!is.undefined(config.omxCommand)) this.setOmxCommand(config.omxCommand)
    if (!is.undefined(config.dbusCommand)) this.setDbusCommand(config.dbusCommand)
    if (!is.undefined(config.dbusTimeout)) this.setDbusTimeout(config.dbusTimeout)
    if (!is.undefined(config.syncInterval)) this.setSyncInterval(config.syncInterval)
  }

  /**
   * @description Set the shared base directory for the videos.
   * @see {@link OmxManagerConfigurations.videosDirectory}
   * @param {string} directory
   * @throws {TypeError} Invalid parameters.
   * @throws {Error} Impossible to access folder.
   * @memberof OmxManager
   */
  public setVideosDirectory (directory: string): void {
    // parameters checking
    if (!is.string(directory)) throw new TypeError('directory: must be a string')
    else if (!fs.lstatSync(directory).isDirectory()) throw new TypeError('directory: must be a directory')
    fs.accessSync(directory, fs.constants.R_OK)
    // set the value
    this.config.videosDirectory = path.normalize(directory)
  }

  /**
   * @description Set the shared extension for the videos.
   * @see {@link OmxManagerConfigurations.videosExtension}
   * @param {string} ext
   * @throws {TypeError} Invalid parameters.
   * @memberof OmxManager
   */
  public setVideosExtension (ext: string): void {
    // parameters checking
    if (!is.string(ext)) throw new TypeError('ext: must be a string')
    // set the value
    this.config.videosExtension = ext
  }

  /**
   * @description Sets the path to the executable omxplayer.
   * @see {@link OmxManagerConfigurations.omxCommand}
   * @param {string} cmd
   * @throws {TypeError} Invalid parameters.
   * @throws {Error} Command not found.
   * @memberof OmxManager
   */
  public setOmxCommand (cmd: string): void {
    // parameters checking
    if (!is.string(cmd)) throw new TypeError('cmd: must be a string')
    else if (!is.equal(spawnSync('which', [cmd]).status, 0)) throw new Error('cmd: command not found')
    // set the value
    this.config.omxCommand = cmd
  }

  /**
   * @description Sets the path to the executable to communicate through DBUS.
   * @see {@link OmxManagerConfigurations.dbusCommand}
   * @param {string} cmd
   * @throws {TypeError} Invalid parameters.
   * @throws {Error} Command not found.
   * @memberof OmxManager
   */
  public setDbusCommand (cmd: string): void {
    // parameters checking
    if (!is.string(cmd)) throw new TypeError('cmd: must be a string')
    else if (!is.equal(spawnSync('which', [cmd]).status, 0)) throw new Error('cmd: command not found')
    // set the value
    this.config.dbusCommand = cmd
  }

  /**
   * @description Sets the timeout for DBUS replies (ms).
   * @see {@link OmxManagerConfigurations.dbusTimeout}
   * @param {number} timeout
   * @throws {TypeError} Invalid parameters.
   * @memberof OmxManager
   */
  public setDbusTimeout (timeout: number): void {
    // REVIEW timeout minimum threshold
    // parameters checking
    if (!is.number(timeout)) throw new TypeError('timeout: must be a number')
    else if (is.negative(timeout)) throw new TypeError('timeout: must be positive')
    // set the value
    this.config.dbusTimeout = timeout
  }

  /**
   * @description Sets the interval to synchronize OmxInstance with the underlaying process (ms).
   * @see {@link OmxManagerConfigurations.syncInterval}
   * @param {number} interval
   * @throws {TypeError} Invalid parameters.
   * @memberof OmxManager
   */
  public setSyncInterval (interval: number): void {
    // REVIEW interval minimum threshold
    // parameters checking
    if (!is.number(interval)) throw new TypeError('interval: must be a number')
    else if (is.negative(interval)) throw new TypeError('interval: must be positive')
    // set the value
    this.config.syncInterval = interval
  }

  /**
   * @description Enable support for native omxplayer --loop flag.
   * @deprecated Deprecated in version <code>0.3.0</code>. It will be removed in future releases.
   * @memberof OmxManager
   */
  public enableNativeLoop (): void {
    console.warn('OmxManager.enableNativeLoop() is deprecated. It will be removed in future releases.')
  }

  /**
   * @description Resolve path of videos and returns only valid and existent videos array.
   * @protected
   * @param {string[]} videos
   * @throws {Error} File not found.
   * @returns {string[]}
   * @memberof OmxManager
   */
  protected resolveVideosPath (videos: string[]): string[] {
    // return array
    let cleaned: string[] = []
    // iterate over it
    videos.forEach(video => {
      // Check if path is URI
      if (video.match(this.constants.URI_REGEX)) cleaned.push(video)
      // otherwise treat as path
      else {
        // Resolve the video path
        var realPath = path.resolve(this.config.videosDirectory, video + this.config.videosExtension)

        // Add if it's available or throw an error
        // fs.accessSync(realPath, fs.constants.R_OK);
        // REVIEW possiblity to disable exists check
        if (!is.empty(video) && fs.lstatSync(realPath).isFile()) cleaned.push(realPath)
        else throw new Error(`file not found: ${realPath}`)
      }
    })
    // Return back the cleaned videos
    return cleaned
  }

  /**
   * @description Create a new {@link OmxInstance} with the current {@link OmxManagerConfigurations}.
   * @param {(string[] | string)} videos
   * @param {object} [args]
   * @throws {TypeError} Invalid parameters.
   * @returns {OmxInstance}
   * @memberof OmxManager
   */
  public create (videos: string[] | string, args?: object): OmxInstance {
    // Wrap videos to array if it's a string (sort of overload)
    if (is.string(videos)) videos = [videos]
    else if (!is.array(videos)) throw new TypeError('videos: must be a string array')
    else if (!is.all.string(videos)) throw new TypeError('videos: must be a string array')

    // Check for the paths
    videos = this.resolveVideosPath(videos)

    // If passed an empty array throw an error
    if (is.equal(videos.length, 0)) throw new TypeError('videos: array must not be empty')

    // Check for arguments parameter
    if (is.undefined(args)) args = {}
    else if (!is.object(args)) throw new TypeError('args: must be an object')

    // Return the instance
    return new OmxInstance() // (this, videos, args, this.getConfigurations())
  }
}
