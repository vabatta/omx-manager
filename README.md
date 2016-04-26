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
 * Supports multiple files (see [below](#multiple))
    * Provide a fallback if `omxplayer` doesn't support it natively
 * Supports loop (see [below](#loop))
    * Provide a fallback if `omxplayer` doesn't support it natively
 * Supports all arguments
    * Simply it doesn't filter any arguments
 * Built-in fix for `omxplayer` hanging (reported [here](https://github.com/popcornmix/omxplayer/issues/124))


<a name="usage"></a>
## Usage

<a name="basicusage"></a>
### Basic usage
```javascript
var OmxManager = require('omx-manager');
var manager = new OmxManager(); // OmxManager
var camera = manager.play('video.avi'); // OmxInstance
```
**Note:** Whenever you `play()` something through the manager, you will get back an `OmxInstance` which serves to control the actual underlaying process.


<a name="multiple"></a>
### Multiple files
```javascript
manager.play(['video.avi', 'anothervideo.mp4', 'video.mkv']);
```

**WARNING:** at this time, multiple files playing is not supported by *official* `omxplayer`, so `omx-manager` will handle it.

If your `omxplayer` fork supports it natively, you can enable the native support (and disable the internal fallback) with the following call:
```javascript
manager.enableNativeMultipleFiles();
```

<a name="loop"></a>
### Loop support
*Official* `omxplayer` supports native loop with `--loop` flag (but only for 1 video), this means that the `--loop` flag will be appended to the process **ONLY** if the videos argument contains exactly **one** video:
```javascript
manager.enableNativeLoop();
manager.play('video.avi', {'--loop': true});
// this will start omxplayer with '--loop'
```
So will be the `omxplayer` process itself to handle the loop for the video.

Otherwise, when you pass more than 1 video with a loop flag **or** you didn't enabled the `nativeLoop`, `omx-manager` will **ignore** that flag and provide a built-in fallback:
```javascript
// manager.enableNativeLoop();
manager.play('video.avi', {'--loop': true});
manager.play(['video.avi', 'anothervideo.avi'], {'--loop': true});
// this will start omxplayer without '--loop'
```
So will be the `omx-manager` to handle the loop, providing a fallback (see below).

#### Loop fallback
*Official* `omxplayer` **doesn't** supports native loop over **multiple files**, so `omx-manager` provide a fallback:
once a video is ended, another omx process is spawned.


<a name="arguments"></a>
### Arguments
Any arguments declared in the `omxplayer` repository.<br />
To set an argument with value use `'argument': <value>` otherwise, if argument doesn't have a value, use `'argument': true`.

**Note**: If you set an argument that `omxplayer` doesn't support or declare, `omx-manager` will anyway add it to the omx process spawn.
This mean that will be the `omxplayer` itself to handle the argument.

**WARNING:** About **loop** see [above](#loop).

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
manager.play('video.mp4', {'-p': true}); // enables audio passthrough
manager.play('video.mp4', {'-o': 'hdmi'}); // HDMI audio output
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
manager.setVideosDirectory('my/base/path');
```

Set where to look for videos. Useful when all videos are in the same directory.

Instead of this:
```javascript
manager.play(['/home/pi/videos/foo.mp4', '/home/pi/videos/bar.mp4', '/home/pi/videos/baz.mp4']);
```

It's possible to use this shortcut:
```javascript
manager.setVideosDirectory('/home/pi/videos/');
manager.play(['foo.mp4', 'bar.mp4', 'baz.mp4']);
```


<a name="videosextension"></a>
### Videos extension
```javascript
manager.setVideosExtension('.extension');
```

Set an extension for videos. Useful when all videos share the same format.

**Note:** You must set a full extension **including** initial dot. In fact, this is just a *post-fix* to every path.

Instead of this:
```javascript
manager.play(['foo.mp4', 'bar.mp4', 'baz.mp4']);
```

It's possible to use this shortcut:
```javascript
manager.setVideosExtension('.mp4');
manager.play(['foo', 'bar', 'baz']);
```


<a name="omxcommand"></a>
### Omx command
```javascript
manager.setOmxCommand('/path/to/my/command');
```

Set the default command to spawn.

Useful when `omxplayer` isn't in your path or you want to specify a different name for the spawn.
```javascript
manager.setOmxCommand('/usr/local/bin/omxplayer-fork');
manager.play('video.avi'); // the process is spawned calling '/usr/local/bin/omxplayer-fork'
```


<a name="othermethods"></a>
### Other methods
```javascript
camera.play();
camera.pause();
camera.stop();
camera.increaseSpeed();
camera.decreaseSpeed();
camera.nextAudioStream();
camera.previousAudioStream();
camera.nextChapter();
camera.previousChapter();
camera.nextSubtitleStream();
camera.previousSubtitleStream();
camera.toggleSubtitles();
camera.increaseSubtitleDelay();
camera.decreaseSubtitleDelay();
camera.increaseVolume();
camera.decreaseVolume();
camera.seekForward();
camera.seekBackward();
camera.seekFastForward();
camera.seekFastBackward();

var loaded = camera.isLoaded();
var playing = camera.isPlaying();
```

Refer to [documentation](http://vabatta.github.io/omx-manager/) for complete information about api.


<a name="events"></a>
### Events
```javascript
// 'omx-manager' successfully loaded and started at first time
// (when called 'play()' for the first time, but you still have a fire of 'play' event for first video)
camera.on('load', function(videos, arguments) {});

// successfully started a video or resumed from pause
camera.on('play', function(video) {});  

// successfully paused a video
camera.on('pause', function() {});

// successfully stopped a video (omxplayer process ends)
camera.on('stop', function() {});

// videos to play are ended (never called if you are in looping condition)
camera.on('end', function() {});
```

Refer to [documentation](http://vabatta.github.io/omx-manager/) for complete information about events.


<a name="todo"></a>
## TODO

Your suggestions are welcome!

 * Syncing videos between different devices through a custom server (built-in) 
