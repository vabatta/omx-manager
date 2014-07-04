# omx-manager

omx-manager is a Nodejs module providing a simple and complete interface to *official* [omxplayer](https://github.com/popcornmix/omxplayer).

Supports multiple files and loop. 
Supports `omxplayer` native loop (with some condition, see [below](#nativeloop)).
Otherwise if `omxplayer` doesn't support loops, this module handles loops respawning omxplayer process.
In addition it supports any valid arguments to use when spawning (you can find it on  [omxplayer](https://github.com/popcornmix/omxplayer) repo).

## Usage

### Basic usage

    var omx = require('omx-manager');
    omx.play('video.avi');

### Multiple files

    omx.play(['video.avi', 'anothervideo.mp4', 'video.mkv']);

**WARNING:** at this time, multiple files playing is not supported by *official* **omxplayer**, so omx-manager will handle it.

### Arguments

Any valid arguments declared in the [omxplayer](https://github.com/popcornmix/omxplayer) repo.
This is an object, and to set an arg with value use key: value, otherwise use key: true to enable it.

Note: About **loop** see [below](#nativeloop).

#### Example object

    {
      '--vol': 13,
      '-p': true
    }

#### Example play

    omx.play('video.mp4', {'-p': true}); // enables audio passthrough
    omx.play('video.mp4', {'-o': 'local'}); // analog audio output

<a name="nativeloop"></a>
### Native loop support

*Official*`omxplayer` supports native loop with `--loop` flag (but only for 1 video), you can enable it by calling:

    var omx = require('omx-manager').enableNativeLoop();
    omx.play('video.avi', {'--loop': true}); // this will start omx player with '--loop'

In case you pass more than 1 video with a loop flag, omx-manager will handle loop:

    var omx = require('omx-manager');
    omx.play(['video.avi', 'anothervideo.avi'], {'--loop': true}); 
    // this will start omx player without '--loop', and omx-manager will handle loop

### Loop fallback

*Official* `omxplayer` **doesn't** supports native loop over **multiple files**, so omx-manager provide a fallback:
once a video is ended, another process of omxplayer is spawned. (Looper lib)

### Status

    omx.getStatus()

Return an object with current status.

If process is not running:

    { loaded: false }

If process is running:

    {
      loaded: true,
      videos: <Array>,    // videos array passed to play(videos, options)
      current: <String>, // current video playing
      args: <Object>,  // default settings or options object passed to play(videos, options)
      playing: <boolean>  // true if not paused, false if paused
    }

### Videos directory

    omx.setVideosDirectory(path);

Set where to look for videos. Useful when all videos are in the same directory.

Instead of this:

    omx.play(['/home/pi/videos/foo.mp4', '/home/pi/videos/bar.mp4', '/home/pi/videos/baz.mp4']);

It's possible to use this shortcut:

    omx.setVideosDirectory('/home/pi/videos/');
    omx.play(['foo.mp4', 'bar.mp4', 'baz.mp4']);

### Videos extension

    omx.setVideosExtension(extension);

Set an extension for videos. Useful when all videos share the same format.

Instead of this:

    omx.play(['foo.mp4', 'bar.mp4', 'baz.mp4']);

It's possible to use this shortcut:

    omx.setVideosExtension('.mp4');
    omx.play(['foo', 'bar', 'baz']);

### Omx command

    omx.setOmxCommand(command);
    
Set the default command to spawn. Useful when `omxplayer` isn't in your path or you want to specify a different name for the spawn.

    omx.setOmxCommand('/usr/local/bin/mxplayer');
    omx.play('video.avi'); // the process is spawned calling '/usr/local/bin/mxplayer'

### Other methods

    omx.pause();     // pause the video
    omx.play();      // resume video playing
    omx.stop();      // stop video playing and terminate omxplayer process
    omx.isLoaded();  // return true if omxprocess is running
    omx.isPlaying(); // return true if omxprocess is running and video is not paused

### Events

    omx.on('load', function(videos, args) {}); // videos successfully loaded and started (omxprocess starts)
    omx.on('play', function() {});  // when successfully started a video or resumed from pause
    omx.on('pause', function() {}); // when successfully paused
    omx.on('stop', function() {});  // when successfully stopped (omxplayer process ends)
    omx.on('end', function() {}); // when videos to play are ended

## TODO

 - Implement forward/backward.
