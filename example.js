
var FPS = require( './' )

var fps = new FPS()

setInterval( () => {
  fps.tick()
}, 1000 / 60 )
