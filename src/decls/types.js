/* eslint-disable no-undef */

/**
 * Javascript object definition.
 * @type {object}
 */
declare type object = { [key:string]: object|any }

/**
 * Represents the status of an OmxInstance.
 * @type {StatusObject}
 */
declare type StatusObject = {
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
