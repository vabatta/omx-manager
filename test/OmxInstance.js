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
        '--key-config': 'mycustom.txt',
        '--argument-that-doesnt-exists': true
      };

      var omx = new OmxManager(config);
      var instance = omx.create(['sample1', 'sample2'], args);

      var spawnArgs = instance._buildArgsToSpawn(args);
      expect(spawnArgs).to.include.members(['-o', 'hdmi', '-p', '--vol', '13', '--argument-that-doesnt-exists']);
      expect(spawnArgs).to.not.include.members(['--loop', 'mycustom.txt']);
      expect(instance.getStatus().loop).to.equal(true);
    });
  });

  describe('-spawnProcess', function () {
    it('should spawn the underlaying process', function () {
      var instance = testOmx.create('sample1', {});
      instance._spawnProcess();
      expect(instance.getStatus().pid).to.be.a('number');
    });
  });

  describe('+getDbusControllerEnabled', function () {
    it('should return if the DBUS controller is enabled', function () {
      var omx = new OmxManager();
      omx.setDbusController(true);
      var instance = omx.create('./examples/sample1.mp4', {});
      expect(instance.getDbusControllerEnabled()).to.equal(true);
    });
  });

  describe('+getStatus', function () {
    it('should return the status of the instance', function () {
      var startingStatus = {
        args: {},
        videos: ['./examples/sample1.mp4'],
        current: '',
        playing: false,
        loop: false,
        pid: null
      };

      var instance = testOmx.create('sample1', {});
      var instanceStatus = instance.getStatus();
      expect(instanceStatus).to.have.all.keys(startingStatus);
      expect(instanceStatus).to.have.property('pid', null);
      expect(instanceStatus.videos).to.be.instanceOf(Array);
      expect(instanceStatus.args).to.be.instanceOf(Object);
      expect(instanceStatus).to.have.property('current', '');
      expect(instanceStatus).to.have.property('playing', false);
    });
  });
});
