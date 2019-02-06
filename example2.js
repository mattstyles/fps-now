
import React from 'react'
import {render} from 'react-dom'
import FPS from './src/react'

const el = document.createElement('div')
document.body.appendChild(el)

render(
  <div>
    <FPS />
  </div>,
  el
)
