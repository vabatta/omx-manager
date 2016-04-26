// @flow

import OmxManager from '../lib/main'

const manager1 = new OmxManager()
manager1.setVideosDirectory('/home/pi/videos')
manager1.setVideosExtension('.mkv')

const instance = manager1.play('clash', { '-b': true })
instance.on('load', (videos, args) => { console.log(videos, args) })
instance.on('play', (video) => { console.log(video) })
// instance.on('pause', () => { console.log('pause') })
// instance.on('stop', () => { console.log('stop') })
instance.on('end', () => { console.log('end') })
