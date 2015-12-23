
var Meter = require( 'fps' )
var fit = require( 'canvas-fit' )

// Create elements
function createElements( id = 'fps' ) {
  var wrap = document.createElement( 'div' )
  wrap.setAttribute( 'id', id )
  Object.assign( wrap.style, {
    position: 'absolute',
    top: '0px',
    right: '0px',
    zIndex: '1000',
    width: '128px',
    height: '64px'
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
    this.dom = createElements()
    this.meter = new Meter({
      every: 10,
      decay: .5
    })

    this.meter.on( 'data', this.update.bind( this ) )

    this.ctx = this.dom.canvas.getContext( '2d' )
    this.history = []

    for ( var i = 0; i < 64; i++ ) {
      this.history.push( 0 )
    }

    this.history.push( 1 )
  }

  update( fps ) {
    this.current = fps
    this.render()
  }

  tick() {
    this.meter.tick()
  }

  render() {
    this.dom.title.innerHTML = this.current.toFixed( 1 )

  }
}
