// child_process.spawn('omxplayer', ['--win', '0 0 960 436', '--nativedeinterlace', '../Sintel_DivXPlus_6500kbps.mkv'], { cwd: process.cwd(), stdio: ['pipe', null, null] })
// child_process.spawn('omxplayer', ['--win', '960 0 1920 436', '--nativedeinterlace', '../Sintel_DivXPlus_6500kbps.mkv'], { cwd: process.cwd(), stdio: ['pipe', null, null] })

import ChildProcess from 'child_process'
import async from 'async-es'

const exec = ChildProcess.exec

class DBusController {
  attach () {
    async.series([
      (cb) => {
        exec('OMXPLAYER_DBUS_ADDR="/tmp/omxplayerdbus.${USER}"', (error) => {
          if (error) {
            cb(error)
          }
        })
      },
      (cb) => {
        exec('OMXPLAYER_DBUS_PID="/tmp/omxplayerdbus.${USER}.pid"', (error) => {
          if (error) {
            cb(error)
          }
        })
      },
      (cb) => {
        exec('export DBUS_SESSION_BUS_ADDRESS=`cat $OMXPLAYER_DBUS_ADDR`', (error) => {
          if (error) {
            cb(error)
          }
        })
      },
      (cb) => {
        exec('export DBUS_SESSION_BUS_PID=`cat $OMXPLAYER_DBUS_PID`', (error) => {
          if (error) {
            cb(error)
          }
        })
      },
      (cb) => {
        exec('[ -z "$DBUS_SESSION_BUS_ADDRESS" ] && { echo "Must have DBUS_SESSION_BUS_ADDRESS" >&2; }', (error) => {
          if (error) {
            cb(error)
          }
        })
      }
    ],
    (error, results) => {
      console.log(error)
    })
  }
}

export default DBusController
