import test from 'japa'
import sinon from 'sinon'
import path from 'path'
import childProcess from 'child_process'
import { OmxManager } from '../src/OmxManager'

test.group('OmxManager', group => {
  const pathToExamples = path.normalize('./examples')

  group.before(() => {
    // stub child_process
    const response = {
      pid: 2037,
      output: [],
      stdout: Buffer.from('/usr/bin/omxplayer'),
      stderr: Buffer.from(''),
      status: 0,
      signal: '',
      error: new Error()
    }
    sinon.stub(childProcess, 'spawnSync').returns(response)
  })

  group.after(() => {
    // restore the original method
    sinon.restore()
  })

  test('~constructor should set configurations and throw arguments type errors', assert => {
    // should return a new instance of the orchestrator
    const omx = new OmxManager()
    assert.notEqual(omx, null)
  })

  test('+getConfigurations should return current configurations of the instance', assert => {
    // test config
    const config = {
      videosDirectory: pathToExamples,
      videosExtension: '.flv',
      omxCommand: '/usr/bin/omxplayer'
    }

    // should return a new instance of the orchestrator
    const omx = new OmxManager(config)

    // should have the config set before
    const instanceConfig = omx.getConfigurations()
    assert.deepInclude(instanceConfig, config)
  })

  test('+setConfigurations should set configurations to the instance', assert => {
    // test config
    const config = {
      videosDirectory: pathToExamples,
      videosExtension: '.flv',
      omxCommand: '/usr/bin/omxplayer'
    }

    // should return a new instance of the orchestrator
    const omx = new OmxManager()
    omx.setConfigurations(config)

    // should have the config set before
    const instanceConfig = omx.getConfigurations()
    assert.deepInclude(instanceConfig, config)
  })

  test('+setVideosDirectory should set the shared videos directory', assert => {
    const omx = new OmxManager()
    omx.setVideosDirectory('./examples')
    assert.match(omx.getConfigurations().videosDirectory, /examples/)
  })

  test('+setVideosExtension should set the shared videos extension', assert => {
    const omx = new OmxManager()
    omx.setVideosExtension('.flv')
    assert.equal(omx.getConfigurations().videosExtension, '.flv')
  })

  test('+setOmxCommand should set the omx command', assert => {
    const omx = new OmxManager()
    omx.setOmxCommand('/usr/bin/omxplayer')
    assert.equal(omx.getConfigurations().omxCommand, '/usr/bin/omxplayer')
  })

  test('+setDbusCommand should set the dbus command', assert => {
    const omx = new OmxManager()
    omx.setDbusCommand('dbus-send')
    assert.equal(omx.getConfigurations().dbusCommand, 'dbus-send')
  })

  test('+setDbusTimeout should set the dbus timeout', assert => {
    const omx = new OmxManager()
    omx.setDbusTimeout(1000)
    assert.equal(omx.getConfigurations().dbusTimeout, 1000)
  })

  test('+setSyncInterval should set the sync interval', assert => {
    const omx = new OmxManager()
    omx.setSyncInterval(1000)
    assert.equal(omx.getConfigurations().syncInterval, 1000)
  })
})
