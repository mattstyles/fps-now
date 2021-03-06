
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
  static of (opts) {
    return new FPS(opts)
  }

  constructor (opts) {
    super()

    this.opts = Object.assign(defaultOptions, opts)
    this.shape = this.opts.shape || [this.opts.x, this.opts.y]

    this.dom = this.opts.visual && createElements('fps', this.shape)
    this.meter = new Meter({
      every: 1,
      decay: 0.15
    })

    this.meter.on('data', this.update)
    this.meter.once('data', this.start)

    if (this.opts.visual) {
      this.ctx = this.dom.canvas.getContext('2d')
    }

    this.history = new Array(this.shape[0]).fill(0)

    this.engine = loop(() => {
      this.meter.tick()
      if (this.opts.visual) {
        this.render()
      }

      this.emit('tick', this.opts.averageFPS ? average(this.history) : this.history)
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
    this.dom.title.innerHTML = this.getFps().toFixed(1)
    renderGraph(this.ctx, this.shape, this.history)
  }

  getFps = () => {
    return this.opts.averageFPS
      ? average(this.history)
      : tail(this.history)
  }
}
