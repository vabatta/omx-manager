'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _omxinstance = require('./omxinstance');

var _omxinstance2 = _interopRequireDefault(_omxinstance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var COMMANDS = {
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
};

var KeyboardController = function (_OmxInstance) {
  _inherits(KeyboardController, _OmxInstance);

  function KeyboardController() {
    _classCallCheck(this, KeyboardController);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(KeyboardController).apply(this, arguments));
  }

  _createClass(KeyboardController, [{
    key: '_sendAction',
    value: function _sendAction(key) {
      if (this._process) {
        this._process.stdin.write(key, function (err) {
          if (err) {}
        });
      }
    }
  }, {
    key: 'play',
    value: function play() {
      if (this._process) {
        if (!this._status.playing) {
          this._sendAction(COMMANDS['play']);
          this._status.playing = true;
        }
      } else {
        this._startup();
      }
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (this._process) {
        this._sendAction(COMMANDS['quit']);
      }
    }
  }, {
    key: 'pause',
    value: function pause() {
      if (this._process) {
        if (this._status.playing) {
          this._sendAction(COMMANDS['pause']);
          this._status.playing = false;
        }
      }
    }
  }, {
    key: 'decreaseSpeed',
    value: function decreaseSpeed() {
      if (this._process) this._sendAction(COMMANDS['decreaseSpeed']);
    }
  }, {
    key: 'increaseSpeed',
    value: function increaseSpeed() {
      if (this._process) this._sendAction(COMMANDS['increaseSpeed']);
    }
  }, {
    key: 'rewind',
    value: function rewind() {
      if (this._process) this._sendAction(COMMANDS['rewind']);
    }
  }, {
    key: 'fastForward',
    value: function fastForward() {
      if (this._process) this._sendAction(COMMANDS['fastForward']);
    }
  }, {
    key: 'previousAudioStream',
    value: function previousAudioStream() {
      if (this._process) this._sendAction(COMMANDS['previousAudioStream']);
    }
  }, {
    key: 'nextAudioStream',
    value: function nextAudioStream() {
      if (this._process) this._sendAction(COMMANDS['nextAudioStream']);
    }
  }, {
    key: 'previousChapter',
    value: function previousChapter() {
      if (this._process) this._sendAction(COMMANDS['previousChapter']);
    }
  }, {
    key: 'nextChapter',
    value: function nextChapter() {
      if (this._process) this._sendAction(COMMANDS['nextChapter']);
    }
  }, {
    key: 'previousSubtitleStream',
    value: function previousSubtitleStream() {
      if (this._process) this._sendAction(COMMANDS['previousSubtitleStream']);
    }
  }, {
    key: 'nextSubtitleStream',
    value: function nextSubtitleStream() {
      if (this._process) this._sendAction(COMMANDS['nextSubtitleStream']);
    }
  }, {
    key: 'toggleSubtitles',
    value: function toggleSubtitles() {
      if (this._process) this._sendAction(COMMANDS['toggleSubtitles']);
    }
  }, {
    key: 'showSubtitles',
    value: function showSubtitles() {
      if (this._process) this._sendAction(COMMANDS['showSubtitles']);
    }
  }, {
    key: 'hideSubtitles',
    value: function hideSubtitles() {
      if (this._process) this._sendAction(COMMANDS['hideSubtitles']);
    }
  }, {
    key: 'increaseSubtitleDelay',
    value: function increaseSubtitleDelay() {
      if (this._process) this._sendAction(COMMANDS['increaseSubtitleDelay']);
    }
  }, {
    key: 'decreaseSubtitleDelay',
    value: function decreaseSubtitleDelay() {
      if (this._process) this._sendAction(COMMANDS['decreaseSubtitleDelay']);
    }
  }, {
    key: 'increaseVolume',
    value: function increaseVolume() {
      if (this._process) this._sendAction(COMMANDS['increaseVolume']);
    }
  }, {
    key: 'decreaseVolume',
    value: function decreaseVolume() {
      if (this._process) this._sendAction(COMMANDS['decreaseVolume']);
    }
  }, {
    key: 'seekForward',
    value: function seekForward() {
      if (this._process) this._sendAction(COMMANDS['seekForward']);
    }
  }, {
    key: 'seekBackward',
    value: function seekBackward() {
      if (this._process) this._sendAction(COMMANDS['seekBackward']);
    }
  }, {
    key: 'seekFastForward',
    value: function seekFastForward() {
      if (this._process) this._sendAction(COMMANDS['seekFastForward']);
    }
  }, {
    key: 'seekFastBackward',
    value: function seekFastBackward() {
      if (this._process) this._sendAction(COMMANDS['seekFastBackward']);
    }
  }]);

  return KeyboardController;
}(_omxinstance2.default);

exports.default = KeyboardController;
module.exports = exports['default'];