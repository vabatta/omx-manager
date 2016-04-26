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
var exec = _child_process2.default.exec;

var OmxInstance = function (_EventEmitter) {
  _inherits(OmxInstance, _EventEmitter);

  function OmxInstance(manager, cmd, videos, args, nativeLoop, handleLoop) {
    _classCallCheck(this, OmxInstance);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(OmxInstance).call(this));

    _this._parentManager = null;
    _this._args = [];
    _this._nativeLoop = false;
    _this._handleLoop = false;
    _this._process = null;
    _this._pid = null;
    _this._state = { loaded: false };


    _this._parentManager = manager;
    _this._nativeLoop = nativeLoop;
    _this._handleLoop = handleLoop;
    _this._spawnCommand = cmd;
    _this._videos = new _iterable2.default(videos);
    _this._args = _this._buildArgsToSpawn(args);
    return _this;
  }

  _createClass(OmxInstance, [{
    key: 'play',
    value: function play() {}
  }, {
    key: 'stop',
    value: function stop() {}
  }, {
    key: 'pause',
    value: function pause() {}
  }, {
    key: '_buildArgsToSpawn',
    value: function _buildArgsToSpawn(args) {
      var argsToSpawn = [];

      for (var _key in args) {
        if (args.hasOwnProperty(_key) && args[_key]) {
          if (_key === '--loop') {
            if (this._nativeLoop || this._videos.length === 1 && !this._handleLoop) {
              argsToSpawn.push(_key);
            }
          } else {
            argsToSpawn.push(_key);

            var val = args[_key];
            if (typeof val === 'string') {
              argsToSpawn.push(val);
            } else if (typeof val === 'number') {
              argsToSpawn.push(val.toString());
            }
          }
        }
      }

      if (this._nativeLoop) {
        argsToSpawn.push.apply(argsToSpawn, this._videos.toArray());
      } else {
        argsToSpawn.push(this._videos.get());
      }

      return argsToSpawn;
    }
  }]);

  return OmxInstance;
}(_events.EventEmitter);

exports.default = OmxInstance;