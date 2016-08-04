import React from 'react'
import { Link } from 'react-router'
import ImageLoader from 'react-imageloader'

import View from '../../../../components/ViewWrapper'
import RandomText from '../../../../components/RandomText'

import Projects from '../Projects'
import classes from './List.scss'

export default class ProjectsList extends React.Component {

  constructor () {
    super()
    this.state = {
      showProject: Projects.map(() => false)
    }
    this.timeouts = []
  }

  componentDidMount () {
    Projects.forEach((p, ind) => {
      this.timeouts.push(setTimeout(() => {
        const showProject = this.state.showProject
        showProject[ind] = true
        this.setState({showProject})
      }, ind * 800))
    })
  }

  componentWillUnmount () {
    this.timeouts.forEach(timeoutId => clearTimeout(timeoutId))
  }

  render () {
    return (
      <View className={classes.container}>
        {Projects.map((project, ind) => {
          // image loader refs
          const placeholder = require('../Projects/' + project.dirname + '/assets/1-placeholder.png')
          const img = require('../Projects/' + project.dirname + '/assets/1-list-version.png')
          const preloader = () => <img src={placeholder} />

          // title text sizing
          const randomTextFontHeight = 25
          const randomTextWidth = randomTextFontHeight / 2 * project.title.length

          return (
            <Link
              to={'/projects/' + project.path}
              key={ind}
              className={classes.projectContainer + (this.state.showProject[ind] ? ' ' + classes.active : '')} >
              <ImageLoader
                className={classes.projectImage}
                src={img}
                preloader={preloader}>Image load failed!</ImageLoader>
              <RandomText
                text={project.title}
                className={classes.title}
                width={randomTextWidth}
                fontHeight={randomTextFontHeight}
                animationSpeed={600}
                animationDuration={1500}
                animate={(this.state.showProject[ind] ? 'in' : 'out')} />
              <hr style={{
                width: randomTextWidth,
                transform: `translateY(${randomTextFontHeight / 2}px)`
              }} />
              <p className={classes.description}>{project.description}</p>
            </Link>
          )
        })}
      </View>
    )
  }

}
