
import loop from 'raf-loop'
import Meter from './meter'
import { createElements } from './dom'
import { scale } from './constants'

module.exports = class FPS {
  constructor (opts) {
    this.shape = [64, 32]
    this.current = 0

    this.dom = createElements('fps', this.shape)
    this.meter = new Meter({
      every: 1,
      decay: 0.15
    })

    this.meter.on('data', this.update)
    this.meter.once('data', this.start)

    this.ctx = this.dom.canvas.getContext('2d')
    this.history = []

    for (var i = 0; i < this.shape[ 0 ] / 2; i++) {
      this.history.push(0)
    }

    this.engine = loop(this.render)
    this.engine.on('tick', this.tick)
  }

  start = () => {
    this.engine.start()
  }

  stop = () => {
    this.engine.stop()
  }

  update = (fps) => {
    this.current = fps
    this.history.push(this.normalize(fps))
    this.history.shift()
  }

  tick = () => {
    this.meter.tick()
  }

  render = () => {
    this.dom.title.innerHTML = this.current.toFixed(1)

    this.ctx.save()
    this.ctx.scale(scale, scale)

    this.ctx.clearRect(0, 0, ...this.shape)
    this.ctx.fillStyle = 'rgba( 192, 192, 192, .95 )'

    this.ctx.beginPath()
    this.ctx.moveTo(this.shape[ 0 ], this.history[ this.history.length - 1 ])
    this.ctx.lineTo(this.shape[ 0 ], this.shape[ 1 ])
    this.ctx.lineTo(0, this.shape[ 1 ])
    this.ctx.lineTo(0, this.history[ 0 ])

    for (var i = 0; i < this.history.length - 1; i++) {
      this.history[ i ] = this.history[ i + 1 ]
      // this.ctx.lineTo(i * 2 + 1, this.history[ i ])
    }

    this.ctx.fill()

    this.ctx.restore()
  }

  normalize (fps) {
    return this.shape[ 1 ] - fps / 100 * this.shape[ 1 ]
  }
}
