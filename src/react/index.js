
import React, { Component } from 'react'
import vanillaFPS from '../'

const styles = {
  text: {
    fontSize: '11px',
    lineHeight: '15px',
    color: 'rgb(40, 40, 40)',
    fontFamily: 'monospace'
  },
  wrapper: {
    position: 'absolute',
    top: 3,
    right: 3,
    zIndex: 10000,
    borderRadius: 3,
    background: 'rgba(0, 0, 0, 0.1)',
    padding: '8px 16px',
    minWidth: 30,
    textAlign: 'center'
  }
}

const Wrapper = ({ children }) => (
  <div style={styles.wrapper}>
    {children}
  </div>
)

const Text = ({ children }) => (
  <span style={styles.text}>
    {children}
  </span>
)

export default class FPS extends Component {
  state = {
    fps: 0
  }

  componentWillMount () {
    this.fps = vanillaFPS.of({
      visual: false,
      averageFPS: true,
      x: 10
    })
    this.fps.on('tick', this.onTick)
  }

  componentDidMount () {
    this.fps.start()
  }

  componentWillUnmount () {
    delete this.fps
  }

  onTick = graph => {
    this.setState(s => ({
      fps: graph.toFixed(2)
    }))
  }

  render () {
    return (
      <Wrapper>
        <Text>{this.state.fps}</Text>
      </Wrapper>
    )
  }
}
