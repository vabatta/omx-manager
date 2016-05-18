'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _omxinstance = require('./omxinstance');

var _omxinstance2 = _interopRequireDefault(_omxinstance);

var _keyboardcontroller = require('./keyboardcontroller');

var _keyboardcontroller2 = _interopRequireDefault(_keyboardcontroller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var URI_REGEX = /^(.+):\/\//g;

var OmxManager = function (_EventEmitter) {
  _inherits(OmxManager, _EventEmitter);

  function OmxManager() {
    _classCallCheck(this, OmxManager);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(OmxManager).call(this));

    _this._videosDirectory = './';
    _this._videosExtension = '';
    _this._spawnCommand = 'omxplayer';
    _this._nativeLoop = false;
    return _this;
  }

  _createClass(OmxManager, [{
    key: 'setVideosDirectory',
    value: function setVideosDirectory(path) {
      this._videosDirectory = path;
    }
  }, {
    key: 'setVideosExtension',
    value: function setVideosExtension(ext) {
      this._videosExtension = ext;
    }
  }, {
    key: 'setOmxCommand',
    value: function setOmxCommand(cmd) {
      this._spawnCommand = cmd;
    }
  }, {
    key: 'enableNativeLoop',
    value: function enableNativeLoop() {
      this._nativeLoop = true;
    }
  }, {
    key: '_resolveVideosPath',
    value: function _resolveVideosPath(videos) {
      var ret = [];
      for (var i = 0; i < videos.length; i++) {
        var video = videos[i];

        if (video.match(URI_REGEX)) {
          ret.push(video);
        } else {
          var realPath = _path2.default.resolve(this._videosDirectory, video + this._videosExtension);

          if (_fs2.default.existsSync(realPath)) {
            ret.push(realPath);
          } else {
            var err = {
              error: new Error('File not found: ' + realPath)
            };

            this.emit('error', err);
          }
        }
      }

      return ret;
    }
  }, {
    key: 'create',
    value: function create(videos) {
      var args = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (typeof videos === 'string') {
        videos = [videos];
      }

      videos = this._resolveVideosPath(videos);

      if (videos.length === 0) {
        return null;
      }

      var instance = new _keyboardcontroller2.default(this, this._spawnCommand, videos, args, this._nativeLoop);

      return instance;
    }
  }]);

  return OmxManager;
}(_events.EventEmitter);

exports.default = OmxManager;
module.exports = exports['default'];