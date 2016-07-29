import React from 'react'
import TransitionGroup from 'react-addons-css-transition-group'

import Menu from '../../../components/Menu'
import classes from '../CoreLayout.scss'
import '../../../styles/core.scss'

const p = React.PropTypes

export default class CoreLayout extends React.Component {

  static propTypes = {
    children: p.element.isRequired,
    breakpointRanges: p.array.isRequired,
    currentBreakpointInd: p.oneOfType([p.number, p.object]),
    updateBreakpoint: p.func.isRequired,
    router: p.object.isRequired
  }

  constructor () {
    super()
    this.eventListeners = []
  }

  componentWillMount () {
    this._handleResize()
    this._setupResizeListener()
  }

  componentWillUnmount () {
    this.eventListeners.forEach(eventListener => {
      window.removeEventListener(eventListener[0], eventListener[1])
    })
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.children !== this.props.children
  }

  render () {
    return (
      <div className={classes.background}>
        <Menu {...this.props} />
        <div className={classes.viewContainer || 'view-container'}>
          <TransitionGroup
            transitionName='example'
            transitionAppear
            transitionEnterTimeout={1500}
            transitionAppearTimeout={1500}
            transitionLeaveTimeout={1500}>
            {React.cloneElement(this.props.children,
              {key: this.props.router.locationBeforeTransitions.pathname}
            )}
          </TransitionGroup>
        </div>
      </div>
    )
  }

  _getWindowWidth () {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  }

  _setupResizeListener () {
    // Create "window.throttledResize" event that listens to resize and throttles it to fire once per frame at most
    // https://developer.mozilla.org/en-US/docs/Web/Events/resize#requestAnimationFrame_customEvent
    let running = false
    const throttleResize = () => {
      if (!running) {
        running = true
        requestAnimationFrame(() => {
          window.dispatchEvent(new CustomEvent('throttledResize'))
          running = false
        })
      }
    }
    window.addEventListener('resize', throttleResize)
    this.eventListeners.push(['resize', throttleResize])
    window.addEventListener('throttledResize', this._handleResize.bind(this))
    this.eventListeners.push(['throttledResize', this._handleResize.bind(this)])
  }

  _handleResize () {
    const curWidth = this._getWindowWidth()
    if (this.props.currentBreakpointInd === null) {
      this.props.updateBreakpoint(curWidth)
    } else {
      const curRange = this.props.breakpointRanges[this.props.currentBreakpointInd]
      if (curRange[0] > curWidth || curRange[1] < curWidth) {
        this.props.updateBreakpoint(curWidth)
      }
    }
  }

}
