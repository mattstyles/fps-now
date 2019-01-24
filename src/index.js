
var Meter = require('./meter')
var fit = require('canvas-fit')
var loop = require('raf-loop')

const PI2 = Math.PI * 2
const scale = window && window.devicePixelRatio
  ? window.devicePixelRatio
  : 1

// Create elements
function createElements (id = 'fps', shape) {
  var wrap = document.createElement('div')
  wrap.setAttribute('id', id)
  Object.assign(wrap.style, {
    position: 'absolute',
    top: '3px',
    right: '3px',
    zIndex: '1000',
    width: shape[ 0 ] + 'px',
    height: shape[ 1 ] + 'px',
    background: 'rgba( 255, 255, 255, .95 )',
    border: '3px solid rgba( 255, 255, 255, 1 )'
  })

  var title = document.createElement('span')
  Object.assign(title.style, {
    position: 'absolute',
    top: '0px',
    left: '0px',
    right: '0px',
    zIndex: '10',
    height: '12px',
    fontSize: '12px',
    fontWeight: '600',
    lineHeight: '1',
    fontFamily: 'sans-serif',
    textAlign: 'right',
    boxSizing: 'border-box',
    padding: '2px'
  })

  var canvas = document.createElement('canvas')

  window.addEventListener('resize', fit(canvas, wrap, scale), false)

  wrap.appendChild(title)
  wrap.appendChild(canvas)
  document.body.appendChild(wrap)

  return { wrap, title, canvas }
}

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
  }

  start = () => {
    this.engine.start()
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
      // this.renderFrame(i * 2 + 1, this.history[ i ])
      this.ctx.lineTo(i * 2 + 1, this.history[ i ])
    }

    this.ctx.fill()

    this.ctx.restore()
  }

  // deprecated
  renderFrame (x, y) {
    this.ctx.beginPath()
    this.ctx.arc(x, y, 2, 0, PI2)
    this.ctx.fill()
  }

  normalize (fps) {
    return this.shape[ 1 ] - fps / 100 * this.shape[ 1 ]
  }
}
