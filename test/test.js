'use strict';

var _mocha = require('mocha');

var _chai = require('chai');

var _iterable = require('../lib/iterable');

var _iterable2 = _interopRequireDefault(_iterable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _mocha.describe)('Iterable', function () {
  (0, _mocha.describe)('#get()', function () {
    (0, _mocha.it)('should return the current element', function () {
      var loopFiles = new _iterable2.default(['a', 'b', 'c']);
      (0, _chai.expect)(loopFiles.get()).to.equal('a');
      loopFiles.next();
      (0, _chai.expect)(loopFiles.get()).to.equal('b');
    });
  });

  (0, _mocha.describe)('#next()', function () {
    (0, _mocha.it)('should move the current element to next', function () {
      var loopFiles = new _iterable2.default(['a', 'b', 'c']);
      loopFiles.next();
      loopFiles.next();
      (0, _chai.expect)(loopFiles.get()).to.equal('c');
    });
  });

  (0, _mocha.describe)('#setLoop()', function () {
    (0, _mocha.it)('should wrap after set the loop', function () {
      var loopFiles = new _iterable2.default(['a', 'b', 'c']);
      (0, _chai.expect)(loopFiles.get()).to.equal('a');
      loopFiles.next();
      (0, _chai.expect)(loopFiles.get()).to.equal('b');
      loopFiles.next();
      (0, _chai.expect)(loopFiles.get()).to.equal('c');
      loopFiles.next();
      (0, _chai.expect)(loopFiles.get()).to.not.equal('a');
      loopFiles.setLoop();
      (0, _chai.expect)(loopFiles.get()).to.equal('a');
    });
  });

  (0, _mocha.describe)('#getCurrentIndex()', function () {
    (0, _mocha.it)('should return the current index (array based)', function () {
      var loopFiles = new _iterable2.default(['a', 'b', 'c']);
      (0, _chai.expect)(loopFiles.get()).to.equal('a');
      (0, _chai.expect)(loopFiles.getCurrentIndex()).to.equal(0);
      loopFiles.next();
      (0, _chai.expect)(loopFiles.get()).to.equal('b');
      (0, _chai.expect)(loopFiles.getCurrentIndex()).to.equal(1);
    });
  });

  (0, _mocha.describe)('#toArray()', function () {
    (0, _mocha.it)('should return the underlaying array', function () {
      var underlayingArray = ['a', 'b', 'c'];
      var loopFiles = new _iterable2.default(underlayingArray);
      (0, _chai.expect)(loopFiles.toArray()).to.equal(underlayingArray);
      (0, _chai.expect)(loopFiles.toArray()).to.be.a('array');
    });
  });

  (0, _mocha.describe)('@length', function () {
    (0, _mocha.it)('should be the length of the underlaying array', function () {
      var underlayingArray = ['a', 'b', 'c'];
      var loopFiles = new _iterable2.default(underlayingArray);
      (0, _chai.expect)(loopFiles.length).to.equal(underlayingArray.length);
    });
  });
});