'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _omxmanager = require('./omxmanager');

var _omxmanager2 = _interopRequireDefault(_omxmanager);

var _iterable = require('./iterable');

var _iterable2 = _interopRequireDefault(_iterable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var spawn = _child_process2.default.spawn;

var OmxInstance = function (_EventEmitter) {
  _inherits(OmxInstance, _EventEmitter);

  function OmxInstance(manager, cmd, videos, args, nativeLoop) {
    _classCallCheck(this, OmxInstance);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(OmxInstance).call(this));

    _this._parentManager = null;
    _this._nativeLoop = false;
    _this._handleLoop = false;
    _this._process = null;
    _this._status = {
      pid: null,
      videos: [],
      args: {},
      current: '',
      playing: false
    };


    _this._parentManager = manager;
    _this._nativeLoop = nativeLoop;
    _this._spawnCommand = cmd;
    _this._videos = new _iterable2.default(videos);
    _this._args = _this._buildArgsToSpawn(args);

    if (_this._handleLoop) {
      _this._videos.setLoop();
    }

    _this._status.videos = _this._videos.toArray();
    _this._status.args = args;
    return _this;
  }

  _createClass(OmxInstance, [{
    key: '_setEndState',
    value: function _setEndState() {
      this._status.pid = null;
      this._status.videos = [];
      this._status.args = {};
      this._status.current = '';
      this._status.playing = false;
      this.emit('end');
    }
  }, {
    key: '_setStopState',
    value: function _setStopState() {
      this._status.current = '';
      this._status.playing = false;
      this.emit('stop');
    }
  }, {
    key: '_setPlayState',
    value: function _setPlayState() {
      this._status.current = this._videos.get();
      this._status.playing = true;
      this.emit('play', this._status.current);
    }
  }, {
    key: '_spawnProcess',
    value: function _spawnProcess() {
      this._process = spawn(this._spawnCommand, this._args, {
        stdio: ['pipe', null, null]
      });
      this._status.pid = this._process.pid;
    }
  }, {
    key: '_startup',
    value: function _startup() {
      var _this2 = this;

      this._spawnProcess();

      this._setPlayState();

      this._videos.next();

      if (this._handleLoop) {
        (function () {
          var respawn = function respawn() {
            _this2._setStopState();

            var nextVideo = _this2._videos.get();

            if (nextVideo === null) {
              _this2._setEndState();
            } else {
              _this2._args[_this2._args.length - 1] = nextVideo;

              _this2._setPlayState();

              _this2._videos.next();

              _this2._spawnProcess();

              if (_this2._process !== null) _this2._process.once('exit', respawn);
            }
          };

          if (_this2._process !== null) _this2._process.once('exit', respawn);
        })();
      } else {
        var exitFunction = function exitFunction() {
          _this2._process = null;

          _this2._setEndState();
        };

        if (this._process !== null) this._process.once('exit', exitFunction);
      }
    }
  }, {
    key: '_buildArgsToSpawn',
    value: function _buildArgsToSpawn(args) {
      var argsToSpawn = [];

      for (var key in args) {
        if (args.hasOwnProperty(key) && args[key]) {
          if (key === '--loop') {
            if (this._nativeLoop && this._videos.length === 1) {
              argsToSpawn.push(key);
            } else {
              this._handleLoop = true;
            }
          } else {
            argsToSpawn.push(key);

            var val = args[key];
            if (typeof val === 'string') {
              argsToSpawn.push(val);
            } else if (typeof val === 'number') {
              argsToSpawn.push(val.toString());
            }
          }
        }
      }

      argsToSpawn.push(this._videos.get());

      return argsToSpawn;
    }
  }, {
    key: 'getStatus',
    value: function getStatus() {
      return this._status;
    }
  }, {
    key: 'play',
    value: function play() {}
  }, {
    key: 'stop',
    value: function stop() {}
  }, {
    key: 'pause',
    value: function pause() {}
  }, {
    key: 'decreaseSpeed',
    value: function decreaseSpeed() {}
  }, {
    key: 'increaseSpeed',
    value: function increaseSpeed() {}
  }, {
    key: 'rewind',
    value: function rewind() {}
  }, {
    key: 'fastForward',
    value: function fastForward() {}
  }, {
    key: 'previousAudioStream',
    value: function previousAudioStream() {}
  }, {
    key: 'nextAudioStream',
    value: function nextAudioStream() {}
  }, {
    key: 'previousChapter',
    value: function previousChapter() {}
  }, {
    key: 'nextChapter',
    value: function nextChapter() {}
  }, {
    key: 'previousSubtitleStream',
    value: function previousSubtitleStream() {}
  }, {
    key: 'nextSubtitleStream',
    value: function nextSubtitleStream() {}
  }, {
    key: 'toggleSubtitles',
    value: function toggleSubtitles() {}
  }, {
    key: 'showSubtitles',
    value: function showSubtitles() {}
  }, {
    key: 'hideSubtitles',
    value: function hideSubtitles() {}
  }, {
    key: 'increaseSubtitleDelay',
    value: function increaseSubtitleDelay() {}
  }, {
    key: 'decreaseSubtitleDelay',
    value: function decreaseSubtitleDelay() {}
  }, {
    key: 'increaseVolume',
    value: function increaseVolume() {}
  }, {
    key: 'decreaseVolume',
    value: function decreaseVolume() {}
  }, {
    key: 'seekForward',
    value: function seekForward() {}
  }, {
    key: 'seekBackward',
    value: function seekBackward() {}
  }, {
    key: 'seekFastForward',
    value: function seekFastForward() {}
  }, {
    key: 'seekFastBackward',
    value: function seekFastBackward() {}
  }]);

  return OmxInstance;
}(_events.EventEmitter);

exports.default = OmxInstance;
module.exports = exports['default'];