'use strict';

var _mocha = require('mocha');

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _iterable = require('../lib/iterable');

var _iterable2 = _interopRequireDefault(_iterable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = _chai2.default.expect;

(0, _mocha.describe)('Iterable', function () {
  (0, _mocha.describe)('#getNext()', function () {
    (0, _mocha.it)('should return the first element', function () {
      var loopFiles = new _iterable2.default(['a', 'b', 'c']);
      expect(loopFiles.getNext()).to.equal('a');
    });

    (0, _mocha.it)('should return all the elements', function () {
      var loopFiles = new _iterable2.default(['a', 'b', 'c']);
      expect(loopFiles.getNext()).to.equal('a');
      expect(loopFiles.getNext()).to.equal('b');
      expect(loopFiles.getNext()).to.equal('c');
    });

    (0, _mocha.it)('should return the first on after reaching end', function () {
      var loopFiles = new _iterable2.default(['a', 'b', 'c'], true);
      expect(loopFiles.getNext()).to.equal('a');
      expect(loopFiles.getNext()).to.equal('b');
      expect(loopFiles.getNext()).to.equal('c');
      expect(loopFiles.getNext()).to.equal('a');
    });
  });

  (0, _mocha.describe)('#get()', function () {
    (0, _mocha.it)('should return the current element', function () {
      var loopFiles = new _iterable2.default(['a', 'b', 'c']);
      expect(loopFiles.getNext()).to.equal('a');
      expect(loopFiles.get()).to.equal('b');
      expect(loopFiles.get()).to.equal('b');
    });
  });
});