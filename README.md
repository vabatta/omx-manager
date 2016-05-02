# Module omx-manager
  1. [Presentation](#presentation)
  2. [Features](#features)
  3. [Usage](#usage)
    1. [Basic usage](#basicusage)
    2. [Multiple files](#multiple)
    3. [Loop support](#loop)
    4. [Arguments](#arguments)
    5. [Status](#status)
    6. [Videos directory](#videosdirectory)
    7. [Videos extension](#videosextension)
    8. [Omx command](#omxcommand)
    9. [Other methods](#othermethods)
    10. [Events](#events)
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
    * Provide a fallback **as** `omxplayer` doesn't support it natively
 * Supports loop (see [below](#loop))
    * Provide a fallback **if** `omxplayer` doesn't support it natively
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
var camera = manager.create('video.avi'); // OmxInstance
camera.play(); // Will start the process to play videos
```
**Note:** Whenever you `create()` something through the manager, you will get back an `OmxInstance` which serves to control the actual underlaying process.


<a name="multiple"></a>
### Multiple files
```javascript
manager.create(['video.avi', 'anothervideo.mp4', 'video.mkv']);
```

**WARNING:** at this time multiple files playing is not supported by *official* `omxplayer`, so `omx-manager` will handle it.

<a name="loop"></a>
### Loop support
*Official* `omxplayer` supports native loop with `--loop` flag (but only for 1 video), this means that the `--loop` flag will be appended to the process **ONLY** if the videos argument contains exactly **one** video:
```javascript
manager.enableNativeLoop();
manager.create('video.avi', {'--loop': true});
// this will start omxplayer with '--loop'
```
So will be the `omxplayer` process itself to handle the loop for the video. <br />
**WARNING:** this means that you **won't** get events `play` and `stop` because the underlaying process cannot notify `omx-manager` of the new start. For uniformity you *shouldn't* use the native loop.

Otherwise, when you pass **more than one video** with a loop flag **or** you **didn't enable** the `nativeLoop`, `omx-manager` will **ignore** that flag and provide a built-in fallback:
```javascript
// manager.enableNativeLoop();
manager.create('video.avi', {'--loop': true});
manager.enableNativeLoop();
manager.create(['video.avi', 'anothervideo.avi'], {'--loop': true});
// both will start omxplayer without '--loop'
```
So will be the `omx-manager` to handle the loop, providing a fallback (see below).

#### Loop fallback
*Official* `omxplayer` **doesn't** supports native loop over **multiple files**, so `omx-manager` provide a fallback: once a video is ended, another process is spawned.


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
manager.create('video.mp4', {'-p': true}); // enables audio passthrough
manager.create('video.mp4', {'-o': 'hdmi'}); // HDMI audio output
```


<a name="status"></a>
### Status
```javascript
var status = camera.getStatus();
```

Return an object with the current status.

Composition
```javascript
{
  pid: number|null,
  videos: Array<string>,    // videos array passed to play(videos, args)
  current: string, // current video playing
  args: object,  // args object passed to play(videos, args)
  playing: boolean  // true if not paused, false if paused
}
```


<a name="videosdirectory"></a>
### Videos directory
```javascript
manager.setVideosDirectory('my/base/path');
```
Set where to look for videos. Useful when all videos are in the same directory.
Default to  `./`

Instead of this:
```javascript
manager.create(['/home/pi/videos/foo.mp4', '/home/pi/videos/bar.mp4', '/home/pi/videos/baz.mp4']);
```

It's possible to use this shortcut:
```javascript
manager.setVideosDirectory('/home/pi/videos/');
manager.create(['foo.mp4', 'bar.mp4', 'baz.mp4']);
```


<a name="videosextension"></a>
### Videos extension
```javascript
manager.setVideosExtension('.extension');
```
Set an extension for videos. Useful when all videos share the same format.
Default to  `''`

**Note:** You must set a full extension **including** initial dot. In fact, this is just a *post-fix* to every path.

Instead of this:
```javascript
manager.create(['foo.mp4', 'bar.mp4', 'baz.mp4']);
```

It's possible to use this shortcut:
```javascript
manager.setVideosExtension('.mp4');
manager.create(['foo', 'bar', 'baz']);
```


<a name="omxcommand"></a>
### Omx command
```javascript
manager.setOmxCommand('/path/to/my/command');
```
Set the default command to spawn.
Default to  `omxplayer`

Useful when `omxplayer` isn't in your path or you want to specify a different name for the spawn.
```javascript
manager.setOmxCommand('/usr/local/bin/omxplayer-fork');
manager.create('video.avi'); // the process is spawned calling '/usr/local/bin/omxplayer-fork'
```


<a name="othermethods"></a>
### Other methods
Refer to [documentation](http://vabatta.github.io/omx-manager/) for complete information about api.


<a name="events"></a>
### Events
```javascript
// successfully started a video or resumed from pause
camera.on('play', function(video) {});  

// successfully paused a video
camera.on('pause', function() {});

// successfully stopped a video (omxplayer process ends)
camera.on('stop', function() {});

// videos to play are ended (never called if you are in a loop condition)
camera.on('end', function() {});
```

Refer to [documentation](http://vabatta.github.io/omx-manager/) for complete information about events.


<a name="todo"></a>
## TODO

Your suggestions are welcome!

 * Syncing videos between different devices through a custom server (built-in)
