import test from 'japa'
import { Iterable } from '../src/Iterable'

test.group('Iterable', () => {
  test('+get() should return the current element', assert => {
    const loopFiles = new Iterable(['a', 'b', 'c'], false)
    assert.equal(loopFiles.get(), 'a')
    loopFiles.next()
    assert.equal(loopFiles.get(), 'b')
  })

  test('+next() should move the current element to next', assert => {
    const loopFiles = new Iterable(['a', 'b', 'c'], false)
    loopFiles.next()
    loopFiles.next()
    assert.equal(loopFiles.get(), 'c')
  })

  test('+setLoop() should wrap after set the loop', assert => {
    const loopFiles = new Iterable(['a', 'b', 'c'], false)
    assert.equal(loopFiles.get(), 'a')
    loopFiles.next()
    assert.equal(loopFiles.get(), 'b')
    loopFiles.next()
    assert.equal(loopFiles.get(), 'c')
    loopFiles.next()
    assert.equal(loopFiles.get(), null)
    loopFiles.setLoop()
    assert.equal(loopFiles.get(), 'a')
  })

  test('+getCurrentIndex() should return the current index (array based)', assert => {
    const loopFiles = new Iterable(['a', 'b', 'c'], true)
    assert.equal(loopFiles.get(), 'a')
    assert.equal(loopFiles.getCurrentIndex(), 0)
    loopFiles.next()
    assert.equal(loopFiles.get(), 'b')
    assert.equal(loopFiles.getCurrentIndex(), 1)
    loopFiles.next()
    assert.equal(loopFiles.get(), 'c')
    assert.equal(loopFiles.getCurrentIndex(), 2)
    loopFiles.next()
    assert.equal(loopFiles.get(), 'a')
    assert.equal(loopFiles.getCurrentIndex(), 0)
  })

  test('+toArray() should return the underlaying array', assert => {
    const underlayingArray = ['a', 'b', 'c']
    const loopFiles = new Iterable(underlayingArray, false)
    let newArray = loopFiles.toArray()
    assert.deepEqual(newArray, underlayingArray)
    assert.isArray(loopFiles.toArray())
    newArray[1] = 'a'
    assert.notDeepEqual(newArray, underlayingArray)
  })
})
