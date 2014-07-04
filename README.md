# Module omx-manager

`omx-manager` is a Nodejs module providing a simple and complete interface to *official* [omxplayer](https://github.com/popcornmix/omxplayer).
**Note:** You can also use a fork version, but you should adjust `omx-manager` according to your version.
**Note 2:** This README is made with *official* [omxplayer](https://github.com/popcornmix/omxplayer) in mind.


## Features
 * Supports multiple files 
 * Supports loop
 * Supports `omxplayer` native loop (with some conditions, see [below](#nativeloop))
 * Provide a fallback if `omxplayer` doesn't support loop natively
 * Can take any arguments to use when spawning

**Note**: Complete **doc** can be found on [github repo pages](http://vabatta.github.io/omx-manager/).
 

## Usage

### Basic usage
```javascript
var omx = require('omx-manager');
omx.play('video.avi');
```


### Multiple files
```javascript
omx.play(['video.avi', 'anothervideo.mp4', 'video.mkv']);
```
    
**WARNING:** at this time, multiple files playing is not supported by *official* `omxplayer`, so `omx-manager` will handle it.


<a name="nativeloop"></a>
### Native loop support

*Official*`omxplayer` supports native loop with `--loop` flag (but only for 1 video):
```javascript
var omx = require('omx-manager');
omx.play('video.avi', {'--loop': true}); 
// this will start omxplayer with '--loop'
```

In case you pass more than 1 video with a loop flag, `omx-manager` will ignore flag:
```javascript
var omx = require('omx-manager');
omx.play(['video.avi', 'anothervideo.avi'], {'--loop': true});
// this will start omxplayer ignoring '--loop'
```

If you want that `omx-manager` doesn't ignore loop flag with multiple file, just enable it:
```javascript
var omx = require('omx-manager');
omx.enableMultipleNativeLoop();
omx.play(['video.avi', 'anothervideo.avi'], {'--loop': true});
// this will start omxplayer with flag '--loop'
```

Otherwise, if you want loop but your `omxplayer` doesn't support it natively, pass an extra argument `true`:
```javascript
var omx = require('omx-manager');
omx.play(['video.avi', 'anothervideo.avi'], {}, true);
// this will start omxplayer and omx-manager will handle looping
// Note: a '--loop' flag will be ignored if passed in args
```
    
**WARNING**

If you `enableMultipleNativeLoop` and use loop flag while passing the argument `loop=true` in `play` method, `omx-manager` will **ignore** the **argument** `loop=true`:

```javascript
var omx = require('omx-manager');
omx.enableMultipleNativeLoop();
omx.play(['video.avi', 'anothervideo.avi'], { '--loop': true }, true);
// last argument in play will be ignored
```

Otherwise, if you pass the argument `loop=true` to `play` method and the loop flag without `enableMultipleNativeLoop`, will **ignore** the **flag**:

```javascript
var omx = require('omx-manager');
omx.play(['video.avi', 'anothervideo.avi'], { '--loop': true }, true);
// flag '--loop' will be ignored
```

#### How works loop fallback

*Official* `omxplayer` **doesn't** supports native loop over **multiple files**, so `omx-manager` provide a fallback:
once a video is ended, another omx process is spawned.


### Arguments

Any arguments declared in the `omxplayer` repository.
This is an object, and to set an argument with value use `'argument': <value>` otherwise use `'argument': true` to enable it.

**Note**: If you set an argument that `omxplayer` doesn't support or declare, `omx-manager` will anyway add it to the spawn. This mean that will be the `omxplayer` itself to handle the argument.

Note: About **loop** see [above](#nativeloop).

#### Example object
```javascript
{
  '-o': 'hdmi',
  '-p': true,
  '--vol': 13,
  '-p': true,
  '--argument-that-doesnt-exists': true //this will be passed to omx process
}
```

#### Example play
```javascript
omx.play('video.mp4', {'-p': true}); // enables audio passthrough
omx.play('video.mp4', {'-o': 'hdmi'}); // HDMI audio output
```


### Status
```javascript
var status = omx.getStatus();
```

Return an object with current status.

If process is not running:
```javascript
{ loaded: false }
```

If process is running:
```javascript
{
  loaded: true,
  videos: <Array>,    // videos array passed to play(videos, options)
  current: <String>, // current video playing
  args: <Object>,  // default settings or options object passed to play(videos, options)
  playing: <Boolean>  // true if not paused, false if paused
}
```


### Videos directory
```javascript
omx.setVideosDirectory('my/base/path');
```

Set where to look for videos. Useful when all videos are in the same directory.

Instead of this:
```javascript
omx.play(['/home/pi/videos/foo.mp4', '/home/pi/videos/bar.mp4', '/home/pi/videos/baz.mp4']);
```

It's possible to use this shortcut:
```javascript
omx.setVideosDirectory('/home/pi/videos/');
omx.play(['foo.mp4', 'bar.mp4', 'baz.mp4']);
```


### Videos extension
```javascript
omx.setVideosExtension('.extension');
```

Set an extension for videos. Useful when all videos share the same format.

Instead of this:
```javascript
omx.play(['foo.mp4', 'bar.mp4', 'baz.mp4']);
```

It's possible to use this shortcut:
```javascript
omx.setVideosExtension('.mp4');
omx.play(['foo', 'bar', 'baz']);
```


### Omx command
```javascript
omx.setOmxCommand('/path/to/my/command');
```

Set the default command to spawn. Useful when `omxplayer` isn't in your path or you want to specify a different name for the spawn.
```javascript
omx.setOmxCommand('/usr/local/bin/mxplayer');
omx.play('video.avi'); // the process is spawned calling '/usr/local/bin/mxplayer'
```


### Other methods
```javascript
omx.pause(); // pause the video
omx.play();  // resume playing video
omx.stop();  // stop playing video and terminate omxplayer process

var loaded = omx.isLoaded();   // return true if omxprocess is running
var playing = omx.isPlaying(); // return true if omxprocess is running and video is not paused
```


### Events
```javascript
// videos successfully loaded and started (first time start)
omx.on('load', function(videos, args) {});
    
// when successfully started a video or resumed from pause
omx.on('play', function(video) {});  
    
// when successfully paused
omx.on('pause', function() {}); 
    
// when successfully stopped (omxplayer process ends)
omx.on('stop', function() {}); 
    
// when videos to play are ended (never called if you are in looping condition)
omx.on('end', function() {}); 
```


## TODO

 - Implement forward/backward.
