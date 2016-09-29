// @flow

import { EventEmitter } from 'events'
import OmxInstance from './omxinstance'

const COMMANDS = {
  'decreaseSpeed': '1',
  'increaseSpeed': '2',
  'rewind': '<',
  'fastForward': '>',
  'previousAudioStream': 'j',
  'nextAudioStream': 'k',
  'previousChapter': 'i',
  'nextChapter': 'o',
  'previousSubtitleStream': 'n',
  'nextSubtitleStream': 'm',
  'toggleSubtitles': 's',
  'showSubtitles': 'w',
  'hideSubtitles': 'x',
  'decreaseSubtitleDelay': 'd',
  'increaseSubtitleDelay': 'f',
  'quit': 'q',
  'play': 'p',
  'pause': 'p',
  'increaseVolume': '+',
  'decreaseVolume': '-',
  'seekForward': '\x5B\x43',
  'seekBackward': '\x5B\x44',
  'seekFastForward': '\x5B\x41',
  'seekFastBackward': '\x5B\x42'
}

class KeyboardController extends OmxInstance {

  /**
   * @private
   * @description Sends an action (key).
   * @param key {string} - The key to send
   */
  _sendAction (key: string) {
    if (this._process) {
      this._process.stdin.write(key, (err) => {
        if (err) {
          // Report/Emit this error?
          // This error was never fired during my tests on Rpi
          // this._instance.emit('error', err)
        }
      })
    }
  }

  play () {
    if (this._process) {
      if (!this._status.playing) {
        this._sendAction(COMMANDS['play'])
        this._status.playing = true
      }
    } else {
      this._startup()
    }
  }

  stop () {
    if (this._process) {
      if (this._handleLoop) this._process.removeAllListeners('exit')
      this._sendAction(COMMANDS['quit'])
    }
  }

  pause () {
    if (this._process) {
      if (this._status.playing) {
        this._sendAction(COMMANDS['pause'])
        this._status.playing = false
      }
    }
  }

  decreaseSpeed () {
    if (this._process) this._sendAction(COMMANDS['decreaseSpeed'])
  }

  increaseSpeed () {
    if (this._process) this._sendAction(COMMANDS['increaseSpeed'])
  }

  rewind () {
    if (this._process) this._sendAction(COMMANDS['rewind'])
  }

  fastForward () {
    if (this._process) this._sendAction(COMMANDS['fastForward'])
  }

  previousAudioStream () {
    if (this._process) this._sendAction(COMMANDS['previousAudioStream'])
  }

  nextAudioStream () {
    if (this._process) this._sendAction(COMMANDS['nextAudioStream'])
  }

  previousChapter () {
    if (this._process) this._sendAction(COMMANDS['previousChapter'])
  }

  nextChapter () {
    if (this._process) this._sendAction(COMMANDS['nextChapter'])
  }

  previousSubtitleStream () {
    if (this._process) this._sendAction(COMMANDS['previousSubtitleStream'])
  }

  nextSubtitleStream () {
    if (this._process) this._sendAction(COMMANDS['nextSubtitleStream'])
  }

  toggleSubtitles () {
    if (this._process) this._sendAction(COMMANDS['toggleSubtitles'])
  }

  showSubtitles () {
    if (this._process) this._sendAction(COMMANDS['showSubtitles'])
  }

  hideSubtitles () {
    if (this._process) this._sendAction(COMMANDS['hideSubtitles'])
  }

  increaseSubtitleDelay () {
    if (this._process) this._sendAction(COMMANDS['increaseSubtitleDelay'])
  }

  decreaseSubtitleDelay () {
    if (this._process) this._sendAction(COMMANDS['decreaseSubtitleDelay'])
  }

  increaseVolume () {
    if (this._process) this._sendAction(COMMANDS['increaseVolume'])
  }

  decreaseVolume () {
    if (this._process) this._sendAction(COMMANDS['decreaseVolume'])
  }

  seekForward () {
    if (this._process) this._sendAction(COMMANDS['seekForward'])
  }

  seekBackward () {
    if (this._process) this._sendAction(COMMANDS['seekBackward'])
  }

  seekFastForward () {
    if (this._process) this._sendAction(COMMANDS['seekFastForward'])
  }

  seekFastBackward () {
    if (this._process) this._sendAction(COMMANDS['seekFastBackward'])
  }
}

export default KeyboardController
