import React from 'react'
const p = React.PropTypes

import classes from '../randomText.scss'

export default class Letter extends React.Component {

  static propTypes = {
    x: p.number.isRequired,
    y: p.number.isRequired,
    i: p.number.isRequired,
    textLen: p.number.isRequired,
    char: p.string.isRequired,
    fontHeight: p.number.isRequired,
    numKeyframes: p.number.isRequired,
    animate: p.oneOf(['in', 'out']),
    animationSpeed: p.number.isRequired,
    animationRandomness: p.number.isRequired,
    animationStart: p.number.isRequired
  }

  constructor () {
    super()
    this.state = {
      show: false,
      animate: true
    }
    this.timeouts = []
  }

  componentDidMount () {
    if (this.props.animate === 'in') {
      this._fadeIn()
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.animate !== this.props.animate) {
      if (nextProps.animate === 'in') {
        this._fadeIn()
      } else {
        this._fadeOut()
      }
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      nextState.fade !== this.state.fade ||
      nextState.show !== this.state.show ||
      nextProps.x !== this.props.x ||
      nextProps.y !== this.props.y ||
      nextProps.fontHeight !== this.props.fontHeight
    )
  }

  componentWillUnmount () {
    this.timeouts.forEach(timeout => clearTimeout(timeout))
  }

  // render component and animate in
  _fadeIn () {
    this.timeouts.push(setTimeout(() => {
      this.timeouts.push(this.setState({
        fade: 'in',
        show: true
      }))
      // Disable animation after fade in
      this.timeouts.push(setTimeout(() => this.setState({animate: false}), this.animationSpeed))
    }, this.props.animationStart + Math.random() * this.props.animationSpeed * this.props.animationRandomness))
  }

  // animate out then stop rendering
  _fadeOut () {
    this.timeouts.push(setTimeout(() => {
      this.setState({fade: 'out', animate: true})
      this.timeouts.push(setTimeout(() => {
        this.setState({ show: false })
      }, this.props.animationSpeed))
    }, this.props.animationStart + Math.random() * this.props.animationSpeed * this.props.animationRandomness))
  }

  render () {
    if (!this.state.show) {
      return null
    }
    const keyframe = Math.floor(Math.random() * this.props.numKeyframes + 1)
    const easingFunction = 'cubic-bezier(.85,0,.54,1)'
    // const easingFunction = `cubic-bezier(${Math.random()*.8 + +.1},0,${Math.random()*.5 + .25},1)`
    const proportionalPosition = this.props.i / this.props.textLen
    const transitionDelay = proportionalPosition / 2 +
                            Math.random() * proportionalPosition
    return (
      <div
        className={classes.letter}
        style={{
          fontSize: this.props.fontHeight,
          height: this.props.fontHeight,
          width: this.props.fontHeight / 2,
          left: this.props.x,
          top: this.props.y,
          transition: `
            top 1s ${easingFunction} ${transitionDelay}s,
            left 1s ${easingFunction} ${transitionDelay}s,
            font-size 1s ${easingFunction} ${transitionDelay}s
          `,
          animation: this.state.animate
            ? `
              ${classes['fade-' + this.state.fade + '-' + keyframe]}
              ${easingFunction}
              ${this.props.animationSpeed}ms forwards
            `
            : null
        }}
        >{this.props.char}</div>
    )
  }
}
