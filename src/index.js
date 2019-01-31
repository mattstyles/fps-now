
import loop from 'raf-loop'
import EventEmitter from 'eventemitter3'
import { Meter } from './meter'
import { createElements, renderGraph } from './dom'
import { tail, average } from './utils'

const defaultOptions = {
  x: 64,
  y: 32,
  shape: [64, 32],
  visual: true,
  averageFPS: false
}

module.exports = class FPS extends EventEmitter {
  constructor (opts = defaultOptions) {
    super()

    this.opts = opts
    this.shape = opts.shape || [opts.x, opts.y]

    this.dom = opts.visual && createElements('fps', this.shape)
    this.meter = new Meter({
      every: 1,
      decay: 0.15
    })

    this.meter.on('data', this.update)
    this.meter.once('data', this.start)

    if (opts.visual) {
      this.ctx = this.dom.canvas.getContext('2d')
    }

    this.history = new Array(this.shape[0]).fill(0)

    this.engine = loop(() => {
      this.meter.tick()
      if (opts.visual) {
        this.render()
      }

      this.emit('tick', this.history)
    })
  }

  start = () => {
    this.engine.start()
  }

  stop = () => {
    this.engine.stop()
  }

  update = fps => {
    this.history.push(fps)
    this.history.shift()
  }

  render = () => {
    // this.dom.title.innerHTML = tail(this.history).toFixed(1)
    this.dom.title.innerHTML = this.getFps().toFixed(1)
    renderGraph(this.ctx, this.shape, this.history)
  }

  getFps = () => {
    return this.opts.averageFPS
      ? average(this.history)
      : tail(this.history)
  }
}
