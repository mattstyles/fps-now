
import { scale } from './constants'
import fit from 'canvas-fit'

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

  window.addEventListener('resize', fit(canvas, container, scale), false)

  container.appendChild(title)
  container.appendChild(canvas)
  document.body.appendChild(container)

  return { container, title, canvas }
}
