
import fit from 'canvas-fit'
import { scale } from './constants'
import { tail, head, normalize } from './utils'

export function createElements (id = 'fps', shape) {
  var container = document.createElement('div')
  container.setAttribute('id', id)
  Object.assign(container.style, {
    position: 'absolute',
    top: '3px',
    right: '3px',
    zIndex: '1000',
    width: shape[ 0 ] + 'px',
    height: shape[ 1 ] + 'px',
    background: 'rgba(255, 255, 255, .95)',
    border: '3px solid rgba(255, 255, 255, 1)'
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
    fontFamily: 'monospace',
    textAlign: 'right',
    boxSizing: 'border-box'
  })

  var canvas = document.createElement('canvas')

  window.addEventListener('resize', fit(canvas, container, scale), false)

  container.appendChild(title)
  container.appendChild(canvas)
  document.body.appendChild(container)

  return { container, title, canvas }
}

export function renderGraph (ctx, shape, graph) {
  ctx.save()
  ctx.scale(scale, scale)

  ctx.clearRect(0, 0, ...shape)
  ctx.fillStyle = 'rgba(192, 192, 192, .95)'

  ctx.beginPath()
  ctx.moveTo(shape[0], normalize(shape[1], tail(graph)))
  ctx.lineTo(shape[0], shape[1])
  ctx.lineTo(0, shape[1])
  ctx.lineTo(0, normalize(shape[1], head(graph)))

  for (var i = 0; i < graph.length - 1; i++) {
    ctx.lineTo(i, normalize(shape[1], graph[i]))
  }

  ctx.fill()
  ctx.restore()
}
