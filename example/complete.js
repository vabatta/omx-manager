var omx = require('./lib/main');
omx.setVideosDirectory('./video');
omx.enableHangingHandler();

omx.on('load', function(videos, args) { console.log(videos, args); });
omx.on('play', function(video) { console.log(video); });
omx.on('pause', function() { console.log('pause'); });
omx.on('stop', function() { console.log('stop'); });
omx.on('end', function() { console.log('end'); });

omx.play(['clash.mp4'], { '-b': true }, true);