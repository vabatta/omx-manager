var chai = require('chai');

describe('Looper', function() {
  describe('#getNext()', function() {
    it('should return next in array', function() {
      var Looper = require('../lib/looper');

      var loopFiles = Looper(['a', 'b', 'c']);
      chai.expect(loopFiles.getNext()).to.equal('a');
    });
  });
});

describe('Looper', function() {
  describe('#getNext() over all the array', function() {
    it('should return all the elements in order', function() {
      var Looper = require('../lib/looper');

      var loopFiles = Looper(['a', 'b', 'c']);
      chai.expect(loopFiles.getNext()).to.equal('a');
      chai.expect(loopFiles.getNext()).to.equal('b');
      chai.expect(loopFiles.getNext()).to.equal('c');
    });
  });
});

describe('Looper', function() {
  describe('#getNext() with loop', function() {
    it('should return the first on array end', function() {
      var Looper = require('../lib/looper');

      var loopFiles = Looper(['a', 'b', 'c'], true);
      chai.expect(loopFiles.getNext()).to.equal('a');
      chai.expect(loopFiles.getNext()).to.equal('b');
      chai.expect(loopFiles.getNext()).to.equal('c');
      chai.expect(loopFiles.getNext()).to.equal('a');
    });
  });
});