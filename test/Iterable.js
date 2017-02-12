/* Tests imports */
var chai = require('chai');
var expect = chai.expect;

/* Library imports */
var Iterable = require('../lib/Iterable');

/* Tests */
describe('Iterable', function () {
  describe('#get()', function () {
    it('should return the current element', function () {
      var loopFiles = new Iterable(['a', 'b', 'c'], false);
      expect(loopFiles.get()).to.equal('a');
      loopFiles.next();
      expect(loopFiles.get()).to.equal('b');
    });
  });

  describe('#next()', function () {
    it('should move the current element to next', function () {
      var loopFiles = new Iterable(['a', 'b', 'c'], false);
      loopFiles.next();
      loopFiles.next();
      expect(loopFiles.get()).to.equal('c');
    });
  });

  describe('#setLoop()', function () {
    it('should wrap after set the loop', function () {
      var loopFiles = new Iterable(['a', 'b', 'c'], false);
      expect(loopFiles.get()).to.equal('a');
      loopFiles.next();
      expect(loopFiles.get()).to.equal('b');
      loopFiles.next();
      expect(loopFiles.get()).to.equal('c');
      loopFiles.next();
      expect(loopFiles.get()).to.not.equal('a');
      loopFiles.setLoop();
      expect(loopFiles.get()).to.equal('a');
    });
  });

  describe('#getCurrentIndex()', function () {
    it('should return the current index (array based)', function () {
      var loopFiles = new Iterable(['a', 'b', 'c'], false);
      expect(loopFiles.get()).to.equal('a');
      expect(loopFiles.getCurrentIndex()).to.equal(0);
      loopFiles.next();
      expect(loopFiles.get()).to.equal('b');
      expect(loopFiles.getCurrentIndex()).to.equal(1);
    });
  });

  describe('#toArray()', function () {
    it('should return the underlaying array', function () {
      var underlayingArray = ['a', 'b', 'c'];
      var loopFiles = new Iterable(underlayingArray, false);
      expect(loopFiles.toArray()).to.equal(underlayingArray);
      expect(loopFiles.toArray()).to.be.a('array');
    });
  });

  describe('@length', function () {
    it('should be the length of the underlaying array', function () {
      var underlayingArray = ['a', 'b', 'c'];
      var loopFiles = new Iterable(underlayingArray, false);
      expect(loopFiles.length).to.equal(underlayingArray.length);
    });
  });
});
