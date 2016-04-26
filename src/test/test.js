// @flow

import { describe, it } from 'mocha'
import chai from 'chai'
import Iterable from '../lib/iterable'

const expect = chai.expect

describe('Iterable', () => {
  describe('#getNext()', () => {
    it('should return the first element', () => {
      let loopFiles = new Iterable(['a', 'b', 'c'])
      expect(loopFiles.getNext()).to.equal('a')
    })

    it('should return all the elements', () => {
      let loopFiles = new Iterable(['a', 'b', 'c'])
      expect(loopFiles.getNext()).to.equal('a')
      expect(loopFiles.getNext()).to.equal('b')
      expect(loopFiles.getNext()).to.equal('c')
    })

    it('should return the first on after reaching end', () => {
      let loopFiles = new Iterable(['a', 'b', 'c'], true)
      expect(loopFiles.getNext()).to.equal('a')
      expect(loopFiles.getNext()).to.equal('b')
      expect(loopFiles.getNext()).to.equal('c')
      expect(loopFiles.getNext()).to.equal('a')
    })
  })

  describe('#get()', () => {
    it('should return the current element', () => {
      let loopFiles = new Iterable(['a', 'b', 'c'])
      expect(loopFiles.getNext()).to.equal('a')
      expect(loopFiles.get()).to.equal('b')
      expect(loopFiles.get()).to.equal('b')
    })
  })

  describe('#setLoop()', () => {
    it('should wrap after set the loop', () => {
      let loopFiles = new Iterable(['a', 'b', 'c'])
      expect(loopFiles.getNext()).to.equal('a')
      expect(loopFiles.getNext()).to.equal('b')
      expect(loopFiles.getNext()).to.equal('c')
      expect(loopFiles.getNext()).to.not.equal('a')
      loopFiles.setLoop()
      expect(loopFiles.getNext()).to.equal('a')
    })
  })

  describe('#getCurrentIndex()', () => {
    it('should return the current index (array based)', () => {
      let loopFiles = new Iterable(['a', 'b', 'c'])
      expect(loopFiles.getNext()).to.equal('a')
      expect(loopFiles.getNext()).to.equal('b')
      expect(loopFiles.getCurrentIndex()).to.equal(2)
    })
  })

  describe('#toArray()', () => {
    it('should return the underlaying array', () => {
      let underlayingArray = ['a', 'b', 'c']
      let loopFiles = new Iterable(underlayingArray)
      expect(loopFiles.toArray()).to.equal(underlayingArray)
      expect(loopFiles.toArray()).to.be.a('array')
    })
  })

  describe('@length', () => {
    it('should be the length of the underlaying array', () => {
      let underlayingArray = ['a', 'b', 'c']
      let loopFiles = new Iterable(underlayingArray)
      expect(loopFiles.length).to.equal(underlayingArray.length)
    })
  })
})
