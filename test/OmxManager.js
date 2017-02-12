/* Tests imports */
var chai = require('chai');
var expect = chai.expect;

/* Library imports */
var path = require('path');
var OmxManager = require('../lib/OmxManager');

/* Tests */
describe('OmxManager', function () {
  describe('~constructor default', function () {
    it('should return an initialized instance with defaults', function () {
      var configDefault = {
        videosDirectory: './',
        videosExtension: '',
        omxCommand: 'omxplayer',
        dbusController: false
      };

      var omx = new OmxManager();
      expect(omx).not.to.be.equal(null);

      var instanceConfig = omx.getConfigurations();
      expect(instanceConfig).to.have.all.keys(configDefault);
      Object.keys(configDefault).forEach(function (key) {
        expect(instanceConfig).to.have.property(key, configDefault[key]);
      });
    });
  });

  describe('~constructor with configurations', function () {
    it('should return an initialized instance with custom configurations', function () {
      var config = {
        videosDirectory: path.normalize('./examples/'),
        videosExtension: '.flv',
        omxCommand: '/usr/bin/omxplayer',
        dbusController: true
      };

      var omx = new OmxManager(config);
      expect(omx).not.to.be.equal(null);

      var instanceConfig = omx.getConfigurations();
      expect(instanceConfig).to.have.all.keys(config);
      Object.keys(config).forEach(function (key) {
        expect(instanceConfig).to.have.property(key, config[key]);
      });
    });
  });

  describe('~multiple instances', function () {
    it('should be able to use multiple instances', function () {
      var config1 = {
        videosDirectory: path.normalize('./examples/'),
        dbusController: true
      };
      var config2 = {
        videosExtension: '.mp4'
      };

      var omx1 = new OmxManager(config1);
      expect(omx1).not.to.be.equal(null);

      var instanceConfig1 = omx1.getConfigurations();
      expect(instanceConfig1).to.have.any.keys(config1);
      Object.keys(config1).forEach(function (key) {
        expect(instanceConfig1).to.have.property(key, config1[key]);
      });

      var omx2 = new OmxManager(config2);
      expect(omx2).not.to.be.equal(null);

      var instanceConfig2 = omx2.getConfigurations();
      expect(instanceConfig2).to.have.any.keys(config2);
      Object.keys(config2).forEach(function (key) {
        expect(instanceConfig2).to.have.property(key, config2[key]);
      });
    });
  });

  describe('+setConfigurations', function () {
    it('should set configurations to the instance', function () {
      var config = {
        videosDirectory: path.normalize('./examples/'),
        videosExtension: '.flv',
        omxCommand: '/usr/bin/omxplayer',
        dbusController: true
      };

      var omx = new OmxManager();
      omx.setConfigurations(config);

      var instanceConfig = omx.getConfigurations();
      expect(instanceConfig).to.have.all.keys(config);
      Object.keys(config).forEach(function (key) {
        expect(instanceConfig).to.have.property(key, config[key]);
      });
    });
  });

  describe('+getConfigurations', function () {
    it('should return current configurations of the instance', function () {
      var config = {
        videosDirectory: path.normalize('./examples/'),
        videosExtension: '.flv',
        omxCommand: '/usr/bin/omxplayer',
        dbusController: true
      };

      var omx = new OmxManager();
      omx.setConfigurations(config);

      var instanceConfig = omx.getConfigurations();
      expect(instanceConfig).to.have.all.keys(config);
      Object.keys(config).forEach(function (key) {
        expect(instanceConfig).to.have.property(key, config[key]);
      });
    });
  });

  describe('+setVideosDirectory', function () {
    it('should set the shared videos directory', function () {
      var omx = new OmxManager();
      omx.setVideosDirectory('./examples');
      expect(omx.getConfigurations()).to.have.property('videosDirectory', path.normalize('./examples'));
    });
  });

  describe('+setVideosExtension', function () {
    it('should set the shared videos extension', function () {
      var omx = new OmxManager();
      omx.setVideosExtension('.flv');
      expect(omx.getConfigurations()).to.have.property('videosExtension', '.flv');
    });
  });

  describe('+setOmxCommand', function () {
    it('should set the omx command', function () {
      var omx = new OmxManager();
      omx.setOmxCommand('/usr/bin/omxplayer');
      expect(omx.getConfigurations()).to.have.property('omxCommand', '/usr/bin/omxplayer');
    });
  });

  describe('+setDbusController', function () {
    it('should set the dbus controller', function () {
      var omx = new OmxManager();
      omx.setDbusController(true);
      expect(omx.getConfigurations()).to.have.property('dbusController', true);
    });
  });

  describe('-resolveVideosPath', function () {
    it('should apply the current configurations correctly', function () {
      var config = {
        videosDirectory: './examples/',
        videosExtension: '.mp4'
      };

      var videos = ['sample1', 'stream://192.168.1.10:23839'];

      var omx = new OmxManager();
      omx.setConfigurations(config);
      var cleaned = omx._resolveVideosPath(videos);
      expect(cleaned[0]).to.match(/\/examples\/sample1.mp4$/);
      expect(cleaned[1]).to.equal('stream://192.168.1.10:23839');
    });
  });
});
