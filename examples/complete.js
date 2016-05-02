'use strict';

var _main = require('../lib/main');

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var manager1 = new _main2.default();
manager1.setVideosDirectory('/home/pi/videos');
manager1.setVideosExtension('.mkv');

var instance = manager1.create(['sample', 'sample2'], { '-b': true, '--loop': true });
instance.on('play', function (video) {
  console.log('play', video, instance.getStatus());
});
instance.on('pause', function () {
  console.log('pause');
});
instance.on('stop', function () {
  console.log('stop');
});
instance.on('end', function () {
  console.log('end');
});

console.log(instance.getStatus());

instance.play();