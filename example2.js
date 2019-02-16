
import React, { Component } from 'react'
import { render } from 'react-dom'
import { resize } from 'raid-streams/screen'
import tick from 'raid-streams/tick'
import styled from 'styled-components'
import { random } from 'lodash'
import FPS from './src/react'

const el = document.createElement('div')
document.body.appendChild(el)

const VEL = 3

const Fit = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`

const Panel = styled('div')`
  position: absolute;
  top: 3px;
  left: 3px;
  border-radius: 3px;
  padding: 3px 6px;
  background: rgba(0, 0, 0 , 0.1);
  color: rgb(44, 44, 44);
  font-family: 'monospace';
  font-size: 11px;
  line-height: 15px;
`

const Ball = styled('div').attrs(({ x, y, color, size }) => ({
  style: {
    transform: `translate3d(${x}px, ${y}px, 0px)`,
    width: `${size}px`,
    height: `${size}px`,
    background: `${color}`
  }
}))`
  position: absolute;
  border-radius: 200px;
`

const generateDir = () => {
  const raw = random(0.1, 1) * VEL
  return random() > 0.5 ? raw : 0 - raw
}

class Viewport extends Component {
  state = {
    w: window.innerWidth,
    h: window.innerHeight,
    list: [],
    pointerDown: false
  }

  componentWillMount () {
    this.resize = resize().observe(this.onResize)
    this.tick = tick().observe(this.onTick)
    // document.addEventListener('click', this.onClick)
    document.addEventListener('pointerdown', this.onPointerDown)
    document.addEventListener('pointerup', this.onPointerUp)
  }

  componentWillUnmount () {
    this.resize.dispose()
    this.tick.dispose()
    // document.removeEventListener('click', this.onClick)
  }

  onResize = ({ payload: { width, height } }) => {
    this.setState(state => Object.assign(state, {
      w: width,
      h: height
    }))
  }

  onPointerDown = ({ x, y }) => {
    this.setState(s => ({
      ...s,
      pointerDown: { x, y }
    }))
  }

  onPointerUp = () => {
    this.setState(s => ({
      ...s,
      pointerDown: null
    }))
  }

  onClick = ({ x, y }) => {
    this.setState(state => {
      const size = random(20, 40)
      const color = [random(0, 255), random(0, 255), random(0, 255)]
      return Object.assign(state, {
        list: state.list.concat({
          x: x - size / 2,
          y: y - size / 2,
          color: `rgb(${color.join(',')})`,
          size,
          dir: [generateDir(), generateDir()]
        })
      })
    })
  }

  createNewEntity = ({ x, y }) => {
    const size = random(20, 40)
    const color = [random(0, 255), random(0, 255), random(0, 255)]
    return {
      x: x - size / 2,
      y: y - size / 2,
      color: `rgb(${color.join(',')})`,
      size,
      dir: [generateDir(), generateDir()]
    }
  }

  onTick = ({ payload: { dt } }) => {
    let newList = this.state.list
      .map(e => {
        return {
          ...e,
          x: e.x + e.dir[0],
          y: e.y + e.dir[1]
        }
      })
      .filter(this.inBounds)

    if (this.state.pointerDown) {
      newList = newList.concat(this.createNewEntity(this.state.pointerDown))
    }

    this.setState(state => ({
      ...state,
      list: newList
    }))
  }

  clamp = (x, y, size) => {
    return {
      x: x < 0 ? 0 : x > this.state.w ? this.state.w : x,
      y: y < 0 ? 0 : y > this.state.h ? this.state.h : y
    }
  }

  inBounds = ({ x, y, size }) => {
    const { w, h } = this.state
    return x > 0 && y > 0 && x < w - size && y < h - size
  }

  render () {
    return (
      <Fit>
        <Panel>{`Balls: ${this.state.list.length}`}</Panel>
        {
          this.state.list.map((entity, index) => <Ball key={index} {...entity} />)
        }
      </Fit>
    )
  }
}

render(
  <div>
    <FPS />
    <Viewport />
  </div>,
  el
)
