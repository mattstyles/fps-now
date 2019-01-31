
/**
 * Pretty much a direct port of [fps](https://github.com/hughsk/fps)
 * The performance.now stuff was causing issues so had to rewrite
 */

import EventEmitter from 'eventemitter3'

var now = window && window.performance
  ? window.performance.now.bind(window.performance)
  : Date.now || function () { return +new Date() }

export class Meter extends EventEmitter {
  constructor (opts) {
    super()
    this.options = {
      decay: 1,
      every: 1
    }
    Object.assign(this.options, opts)

    this.rate = 0
    this.time = 0
    this.ticks = 0
    this.last = now()
  }

  tick = () => {
    var time = now()
    var fps = time - this.last

    this.ticks++
    this.last = time
    this.time += (fps - this.time) * this.options.decay
    this.rate = 1000 / this.time
    if (!(this.ticks % this.every)) {
      this.emit('data', this.rate)
    }
  }
}
