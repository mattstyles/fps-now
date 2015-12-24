
const FPS = require( './src' )
const Context = require( '2d-context' )
const loop = require( 'canvas-loop' )
const easing = require( 'eases/quad-in-out' )
const lerp = require( 'lerp' )

const PI2 = Math.PI * 2

const ctx = Context()
const fps = new FPS()
document.body.appendChild( ctx.canvas )

const app = loop( ctx.canvas, {
  scale: window.devicePixelRatio
})

var time = 0

app.on( 'tick', dt => {
  fps.tick()
  time += dt / 1000

  const [ width, height ] = app.shape

  const gradient = ctx.createLinearGradient( 0, 0, width, height )
  gradient.addColorStop( 0, 'rgb( 63, 193, 97 )' )
  gradient.addColorStop( .5, 'rgb( 81, 211, 115 )' )
  gradient.addColorStop( 1, 'rgb( 88, 208, 150 )' )

  ctx.clearRect( 0, 0, width, height )
  ctx.fillStyle = gradient
  ctx.fillRect( 0, 0, width, height )

  const anim = easing( Math.sin( time ) * .5 + .5 )
  const rot = Math.sin( time )

  ctx.strokeStyle = 'rgba( 255, 255, 255, 1 )'
  ctx.beginPath()
  ctx.lineWidth = 12
  ctx.arc( width / 2, height / 2, 25, time, time + lerp( 0, PI2, anim ) )
  ctx.stroke()
})

app.start()
