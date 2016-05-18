'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _asyncEs = require('async-es');

var _asyncEs2 = _interopRequireDefault(_asyncEs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var exec = _child_process2.default.exec;

var DBusController = function () {
  function DBusController() {
    _classCallCheck(this, DBusController);
  }

  _createClass(DBusController, [{
    key: 'attach',
    value: function attach() {
      _asyncEs2.default.series([function (cb) {
        exec('OMXPLAYER_DBUS_ADDR="/tmp/omxplayerdbus.${USER}"', function (error) {
          if (error) {
            cb(error);
          }
        });
      }, function (cb) {
        exec('OMXPLAYER_DBUS_PID="/tmp/omxplayerdbus.${USER}.pid"', function (error) {
          if (error) {
            cb(error);
          }
        });
      }, function (cb) {
        exec('export DBUS_SESSION_BUS_ADDRESS=`cat $OMXPLAYER_DBUS_ADDR`', function (error) {
          if (error) {
            cb(error);
          }
        });
      }, function (cb) {
        exec('export DBUS_SESSION_BUS_PID=`cat $OMXPLAYER_DBUS_PID`', function (error) {
          if (error) {
            cb(error);
          }
        });
      }, function (cb) {
        exec('[ -z "$DBUS_SESSION_BUS_ADDRESS" ] && { echo "Must have DBUS_SESSION_BUS_ADDRESS" >&2; }', function (error) {
          if (error) {
            cb(error);
          }
        });
      }], function (error, results) {
        console.log(error);
      });
    }
  }]);

  return DBusController;
}();

exports.default = DBusController;
module.exports = exports['default'];