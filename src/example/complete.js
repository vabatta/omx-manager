// @flow

import OmxManager from '../lib/main'

const manager1 = new OmxManager()
manager1.setVideosDirectory('/home/pi/videos')
manager1.setVideosExtension('.mkv')

const instance = manager1.start(['sample', 'sample2'], { '-b': true, '--loop': true })
instance.on('play', (video) => { console.log('play', video, instance.state) })
instance.on('pause', () => { console.log('pause') })
instance.on('stop', () => { console.log('stop') })
instance.on('end', () => { console.log('end') })

console.log(instance.state)

instance.play()
