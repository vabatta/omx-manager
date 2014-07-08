# Module omx-manager
  1. [Presentation](#presentation)
  2. [Features](#features)
  3. [Usage](#usage)
    1. [Basic usage](#basicusage)
    2. [Multiple files](#multiple)
    3. [Loop support](#loop)
    4. [Arguments](#arguments)
    5. [Built-in fix for omxplayer hanging](#omxhanging)
    6. [Status](#status)
    7. [Videos directory](#videosdirectory)
    8. [Videos extension](#videosextension)
    9. [Omx command](#omxcommand)
    10. [Other methods](#othermethods)
    11. [Events](#events)
  4. [Todo](#todo)

**Note**: Complete **documentation** can be found on [github repo pages](http://vabatta.github.io/omx-manager/).


<a name="presentation"></a>
## Presentation
`omx-manager` is a Nodejs module providing a simple and complete interface to *official* [omxplayer](https://github.com/popcornmix/omxplayer). <br />
You can install through npm with `$> npm install omx-manager`. <br />
**Note:** You can also use a fork version, but you should adjust `omx-manager` according to your version. <br />
**Note 2:** This README is made with *official* [omxplayer](https://github.com/popcornmix/omxplayer) in mind.


<a name="features"></a>
## Features
 * Supports multiple files
 * Supports loop
    * Supports `omxplayer` muliple native loop (in case you have it, see [below](#loop))
    * Provide a fallback if `omxplayer` doesn't support loop natively
 * Supports all arguments
 * Built-in fix for `omxplayer` hanging (reported [here](https://github.com/popcornmix/omxplayer/issues/124))


<a name="usage"></a>
## Usage

<a name="basicusage"></a>
### Basic usage
```javascript
var omx = require('omx-manager');
omx.play('video.avi');
```


<a name="multiple"></a>
### Multiple files
```javascript
omx.play(['video.avi', 'anothervideo.mp4', 'video.mkv']);
```
    
**WARNING:** at this time, multiple files playing is not supported by *official* `omxplayer`, so `omx-manager` will handle it.


<a name="loop"></a>
### Loop support
*Official* `omxplayer` supports native loop with `--loop` flag (but only for 1 video):
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
// argument loop in play will be ignored
// will spawn omx process with '--loop'
```

Otherwise, if you don't `enableMultipleNativeLoop` and use loop flag while passing the argument `loop=true` to `play` method, `omxmanager` will **ignore** the **flag** `--loop`:

```javascript
var omx = require('omx-manager');
omx.play(['video.avi', 'anothervideo.avi'], { '--loop': true }, true);
// flag '--loop' will be ignored
// will spawn omx process without '--loop' and 'omx-manager' will handle loop
```

#### How works loop fallback
*Official* `omxplayer` **doesn't** supports native loop over **multiple files**, so `omx-manager` provide a fallback:
once a video is ended, another omx process is spawned.


<a name="arguments"></a>
### Arguments
Any arguments declared in the `omxplayer` repository.<br />
To set an argument with value use `'argument': <value>` otherwise, if argument doesn't have a value, use `'argument': true`.

**Note**: If you set an argument that `omxplayer` doesn't support or declare, `omx-manager` will anyway add it to the omx process spawn. 
This mean that will be the `omxplayer` itself to handle the argument.

Note: About **loop** see [above](#loop).

#### Example object
```javascript
{
  '-o': 'hdmi',
  '-p': true,
  '--vol': 13,
  '-p': true,
  '--argument-that-doesnt-exists': true //this will be passed to omx process (see note above)
}
```

#### Example play
```javascript
omx.play('video.mp4', {'-p': true}); // enables audio passthrough
omx.play('video.mp4', {'-o': 'hdmi'}); // HDMI audio output
```


<a name="omxhanging"></a>
### Built-in fix for omxplayer hanging
*Official* `omxplayer` could hang randomly while playing video (reported [here](https://github.com/popcornmix/omxplayer/issues/124)), so `omx-manager` have a built-in fix for this.

To enable it, just use:
```javascript
omx.enableHangingHandler();
```

This is a timeout sending a `pkill <omxcommand>`.


<a name="status"></a>
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
  videos: <Array>,    // videos array passed to play(videos, args)
  current: <String>, // current video playing
  args: <Object>,  // args object passed to play(videos, args)
  playing: <Boolean>  // true if not paused, false if paused
}
```


<a name="videosdirectory"></a>
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


<a name="videosextension"></a>
### Videos extension
```javascript
omx.setVideosExtension('.extension');
```

Set an extension for videos. Useful when all videos share the same format.

**Note:** You must set a full extension including initial dot.

Instead of this:
```javascript
omx.play(['foo.mp4', 'bar.mp4', 'baz.mp4']);
```

It's possible to use this shortcut:
```javascript
omx.setVideosExtension('.mp4');
omx.play(['foo', 'bar', 'baz']);
```


<a name="omxcommand"></a>
### Omx command
```javascript
omx.setOmxCommand('/path/to/my/command');
```

Set the default command to spawn. 

Useful when `omxplayer` isn't in your path or you want to specify a different name for the spawn.
```javascript
omx.setOmxCommand('/usr/local/bin/mxplayer');
omx.play('video.avi'); // the process is spawned calling '/usr/local/bin/mxplayer'
```


<a name="othermethods"></a>
### Other methods
```javascript
omx.play();
omx.pause();
omx.stop();
omx.increaseSpeed();
omx.decreaseSpeed();
omx.nextAudioStream();
omx.previousAudioStream();
omx.nextChapter();
omx.previousChapter();
omx.nextSubtitleStream();
omx.previousSubtitleStream();
omx.toggleSubtitles();
omx.increaseSubtitleDelay();
omx.decreaseSubtitleDelay();
omx.increaseVolume();
omx.decreaseVolume();
omx.seekForward();
omx.seekBackward();
omx.seekFastForward();
omx.seekFastBackward();

var loaded = omx.isLoaded(); 
var playing = omx.isPlaying();
```

Refer to [documentation](http://vabatta.github.io/omx-manager/) for complete information about api.


<a name="events"></a>
### Events
```javascript
// 'omx-manager' successfully loaded and started at first time
// (when called 'play()' for the first time, but you still have a fire of 'play' event for first video)
omx.on('load', function(videos, arguments) {});
    
// successfully started a video or resumed from pause
omx.on('play', function(video) {});  
    
// successfully paused a video
omx.on('pause', function() {}); 
    
// successfully stopped a video (omxplayer process ends)
omx.on('stop', function() {}); 
    
// videos to play are ended (never called if you are in looping condition)
omx.on('end', function() {}); 
```

Refer to [documentation](http://vabatta.github.io/omx-manager/) for complete information about events.


<a name="todo"></a>
## TODO

Your suggestions are welcome!
