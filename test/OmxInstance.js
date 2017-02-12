/* Tests imports */
var chai = require('chai');
var expect = chai.expect;

/* Library imports */
var path = require('path');
var is = require('is_js');
var OmxManager = require('../lib/OmxManager');

/* Tests */
describe('OmxInstance', function () {
  var testConfig = {
    videosDirectory: './examples/',
    videosExtension: '.mp4'
  };

  var testOmx = new OmxManager(testConfig);

  describe('-buildArgumentsToSpawn', function () {
    it('should clean arguments to spawn', function () {
      var config = {
        videosDirectory: './examples/',
        videosExtension: '.mp4'
      };

      var args = {
        '--loop': true,
        '-o': 'hdmi',
        '-p': true,
        '--vol': 13,
        '-p': true,
        '-a': false,
        '--key-config': 'mycustom.txt',
        '--argument-that-doesnt-exists': true
      };

      var omx = new OmxManager(config);
      var instance = omx.create(['sample1', 'sample2'], args);

      var spawnArgs = instance._buildArgsToSpawn(args);
      expect(spawnArgs).to.include.members(['-o', 'hdmi', '-p', '--vol', '13', '--argument-that-doesnt-exists']);
      expect(spawnArgs).to.not.include.members(['--loop', '-a', 'mycustom.txt']);
      expect(instance.getConfigurations().loop).to.equal(true);
    });
  });

  describe('-spawnProcess', function () {
    it('should spawn the underlaying process', function () {
      var instance = testOmx.create('sample1', {});
      instance._spawnProcess();
      expect(instance.getConfigurations().pid).to.be.a('number');
      instance._killProcess();
      // expect(instance.getConfigurations().pid).to.equal(null);
    });
  });

  describe('+getDbusControllerEnabled', function () {
    it('should return if the DBUS controller is enabled', function () {
      var omx = new OmxManager();
      omx.setDbusController(true);
      var instance = omx.create('./examples/sample1.mp4', {});
      expect(instance.getDbusControllerEnabled()).to.equal(true);
      expect(instance.getConfigurations().dbusName).to.be.a('string');
    });
  });

  describe('+getConfigurations', function () {
    it('should return the configurations of the instance', function () {
      var startingConfig = {
        args: {},
        videos: ['./examples/sample1.mp4'],
        loop: false,
        pid: null,
        dbusName: null
      };

      var instance = testOmx.create('sample1', {});
      var instanceStatus = instance.getConfigurations();
      expect(instanceStatus).to.have.all.keys(startingConfig);
      expect(instanceStatus.args).to.be.instanceOf(Object);
      expect(instanceStatus.videos).to.be.instanceOf(Array);
      expect(instanceStatus).to.have.property('loop', false);
      expect(instanceStatus).to.have.property('pid', null);
      expect(instanceStatus).to.have.property('dbusName', null);
    });
  });

  describe('+getPlayback', function () {
    it('should return the playback status of the instance', function () {
      var startingPlayback = {
        current: '',
        playing: false
      };

      var instance = testOmx.create('sample1', {});
      var playbackStatus = instance.getPlayback();
      expect(playbackStatus).to.have.all.keys(startingPlayback);
      expect(playbackStatus).to.have.property('current', '');
      expect(playbackStatus).to.have.property('playing', false);
    });
  });
});
