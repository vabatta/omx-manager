// @flow

import { describe, it } from 'mocha'
import chai from 'chai'
import Iterable from '../lib/iterable'

const expect = chai.expect

describe('Iterable', () => {
  describe('#get()', () => {
    it('should return the current element', () => {
      let loopFiles = new Iterable(['a', 'b', 'c'])
      expect(loopFiles.get()).to.equal('a')
      loopFiles.next()
      expect(loopFiles.get()).to.equal('b')
    })
  })

  describe('#next()', () => {
    it('should move the current element to next', () => {
      let loopFiles = new Iterable(['a', 'b', 'c'])
      loopFiles.next()
      loopFiles.next()
      expect(loopFiles.get()).to.equal('c')
    })
  })

  describe('#setLoop()', () => {
    it('should wrap after set the loop', () => {
      let loopFiles = new Iterable(['a', 'b', 'c'])
      expect(loopFiles.get()).to.equal('a')
      loopFiles.next()
      expect(loopFiles.get()).to.equal('b')
      loopFiles.next()
      expect(loopFiles.get()).to.equal('c')
      loopFiles.next()
      expect(loopFiles.get()).to.not.equal('a')
      loopFiles.setLoop()
      expect(loopFiles.get()).to.equal('a')
    })
  })

  describe('#getCurrentIndex()', () => {
    it('should return the current index (array based)', () => {
      let loopFiles = new Iterable(['a', 'b', 'c'])
      expect(loopFiles.get()).to.equal('a')
      expect(loopFiles.getCurrentIndex()).to.equal(0)
      loopFiles.next()
      expect(loopFiles.get()).to.equal('b')
      expect(loopFiles.getCurrentIndex()).to.equal(1)
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
