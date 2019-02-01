
# fps-now

> FPS meter for evergreen browsers

[![npm version](https://badge.fury.io/js/fps-now.svg)](https://badge.fury.io/js/fps-now)
[![Dependency Status](https://david-dm.org/mattstyles/fps-now.svg)](https://david-dm.org/mattstyles/fps-now)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

## Install

Install with [npm](https://npmjs.com)

```sh
$ npm i -S fps-now
```

## Example

```js
const FPS = require('fps-now')

var fps = FPS.of()
fps.start()
```

See [example.js](./example.js).

## Usage

The FPS object is a convenient component for displaying the current fps of the browser it is running in. As it is tied specifically to the frame rate there is no option to manually control the tick, instead, the consumer calls `fps.start()` and forgets all about it.

Usage is kept deliberately as minimal as possible, to use you must create an instance of the FPS meter and then call start on it when you’re ready to start recording.

```js
var fps = FPS.of()
fps.start()
```

There are a few options that can be passed to control the meter, again, the options are kept deliberately minimal.

```js
const defaultOptions = {
  x: 64,
  y: 32,
  shape: [64, 32],
  visual: true,
  averageFPS: false
}
```

### Sample size (`shape`)

`x` and `y` convert into `[x, y]`, and are identical to `shape`, if `shape` is supplied as an option it will take precedence.

`shape` controls the sample size (`x`) and the height of the graph (`y`). As the FPS meter is decoupled from the render the `y` is largely irrelevant, although it is useful if you use the default rendering method.

The meter calculates the fps for each tick (based on the duration of the tick, with a little bit of estimation, full credit for the algorithm used goes to [hughsk](https://github.com/hughsk/fps)). This fps is stored in an array whose length is the sample size, the sample is a window on to the latest `x` frame rate readings.

A larger sample size will mean more accurate results, but also less performant. Generally speaking only a small sample size is required.

### Rendering

`fps-now` comes bundles with a super-basic renderer, creating your own is fairly straight forward though. To turn off default rendering set `{visual: false}` when instantiating the meter.

The `FPS` object is an event emitter and will emit the current fps samples, allowing you to create your own renderer on top.

For example, if you just wanted to display last tick frame rate something like the following would work:

```js
var el = document.createElement('div')
document.body.appendChild(el)

var fps = FPS.of({
  visual: false
})
fps.on('tick', function onTick (graph) {
  el.innerHTML = graph[graph.length - 1].toFixed(1)
})

fps.start()
```

There is another use-case for setting `visual: false` which is if you just want to measure FPS and maybe make decisions in your application based on that. Visualisation is unnecessary for this. You can use the emitted `tick` event to access the frame rate history and do whatever you need with that record of history.

### Averaging

By default only the last ticks frame rate is rendered, set `{averageFPS: true}` if you want an average of the samples.

This is slightly heavier performance-wise but smoothes out fluctuations in frame rate.

Generally speaking, usually the last tick frame rate is sufficient for monitoring fluctuations in the frame rate.

## Running tests

```sh
$ npm install
$ npm test
```

## Contributing

Pull requests are always welcome, the project uses the [standard](http://standardjs.com) code style. Please run `npm test` to ensure all tests are passing and add tests for any new features or updates.

For bugs and feature requests, [please create an issue](https://github.com/mattstyles/fps-now/issues).

## License

MIT
