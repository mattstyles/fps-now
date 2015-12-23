
var FPS = require( './' )
var loop = require( 'raf-loop' )

var fps = new FPS()

loop( fps.tick.bind( fps ) ).start()
