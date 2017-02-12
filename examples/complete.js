var OmxManager = require('../lib/OmxManager');

var config = {
  videosDirectory: './examples',
  videosExtension: '.mp4',
  // omxCommand: 'omxplayer',
  dbusController: true
};

var omx = new OmxManager(config);
var instance = omx.create('sample1', {});

instance._spawnProcess();
console.log(instance.getStatus());
// Object.keys(omx.getConfigurations()).forEach(function (key) {
//   console.log(key, omx.getConfigurations()[key]);
// });
