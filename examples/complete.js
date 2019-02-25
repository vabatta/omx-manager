const { OmxManager } = require('../dist')

const config = {
  videosDirectory: './examples',
  videosExtension: '.mp4'
  // omxCommand: 'omxplayer',
}

const omx = new OmxManager(config)
const instance = omx.create(['sample1', 'sample2'], {
  '-o': 'hdmi',
  '-p': true,
  '--loop': true
})

instance.on('play', function onPlay (video) {
  console.log('play event')
  // console.log(instance.getVideoInfo())
  instance.pause()
})

instance.on('pause', function onPause () {
  console.log('pause event')
  instance.stop()
})

instance.on('stop', function onStop () {
  console.log('stop event')
  instance.quit()
})

instance.on('end', function onEnd () {
  console.log('end event')
  instance.play()
})

instance.on('progress', function onEnd (position) {
  console.log('progress: ', position)
})

instance.on('info', function onEnd (info) {
  console.log('info: ', info)
})

instance.play()
// instance.pause();
// instance.stop();
// instance.quit();

// instance.play();
// instance.pause();
