
var Meter = require( 'fps' )
var fit = require( 'canvas-fit' )

const PI2 = Math.PI * 2

// Create elements
function createElements( id = 'fps', shape ) {
  var wrap = document.createElement( 'div' )
  wrap.setAttribute( 'id', id )
  Object.assign( wrap.style, {
    position: 'absolute',
    top: '0px',
    right: '0px',
    zIndex: '1000',
    width: shape[ 0 ] + 'px',
    height: shape[ 1 ] + 'px'
  })

  var title = document.createElement( 'span' )
  Object.assign( title.style, {
    position: 'absolute',
    top: '0px',
    left: '0px',
    right: '0px',
    zIndex: '10',
    height: '12px',
    fontSize: '12px',
    lineHeight: '1',
    fontFamily: 'sans-serif',
    textAlign: 'right'
  })

  var canvas = document.createElement( 'canvas' )

  window.addEventListener( 'resize', fit( canvas, wrap, window.devicePixelRatio ), false )

  wrap.appendChild( title )
  wrap.appendChild( canvas )
  document.body.appendChild( wrap )

  return { wrap, title, canvas }
}

module.exports = class FPS {
  constructor( opts ) {
    this.width = 128
    this.height = 64
    this.shape = [ 128, 64 ]

    this.dom = createElements( 'fps', this.shape )
    this.meter = new Meter({
      every: 10,
      decay: .25
    })

    this.meter.on( 'data', this.update.bind( this ) )

    this.ctx = this.dom.canvas.getContext( '2d' )
    this.history = []

    for ( var i = 0; i < 63; i++ ) {
      this.history.push( 0 )
    }

  }

  update( fps ) {
    this.history.pop()
    this.history.unshift( fps )
    this.render()
  }

  tick() {
    this.meter.tick()
  }

  render() {
    this.dom.title.innerHTML = this.history[ 0 ].toFixed( 1 )

    this.ctx.clearRect( 0, 0, ...this.shape )
    this.ctx.fillStyle = 'rgba(255,128,0,.85)'

    for ( var i = 0; i < this.history.length; i++ ) {
      if ( this.history[ i ] ) {
        this.renderFrame( i * 2 + 1, this.history[ i ] )
      }
    }
  }

  renderFrame( x, y ) {
    this.ctx.beginPath()
    this.ctx.arc( x, this.shape[ 1 ] - ( y / 100 * this.shape[ 1 ] ), 2, 0, PI2 )
    this.ctx.fill()
  }
}
