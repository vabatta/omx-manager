"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Iterable = function () {
  function Iterable(array) {
    var loop = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    _classCallCheck(this, Iterable);

    this._array = [];
    this._loop = false;
    this._current = 0;

    this._array = array;
    this._loop = loop;
    this.length = array.length;
  }

  _createClass(Iterable, [{
    key: "get",
    value: function get() {
      if (this._current === this._array.length) {
        if (this._loop) {
          this._current = 0;
        } else {
          return null;
        }
      }

      return this._array[this._current];
    }
  }, {
    key: "next",
    value: function next() {
      this._current++;
    }
  }, {
    key: "toArray",
    value: function toArray() {
      return this._array;
    }
  }, {
    key: "getCurrentIndex",
    value: function getCurrentIndex() {
      return this._current;
    }
  }, {
    key: "setLoop",
    value: function setLoop() {
      this._loop = true;
    }
  }]);

  return Iterable;
}();

exports.default = Iterable;
module.exports = exports["default"];