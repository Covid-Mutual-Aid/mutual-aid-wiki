import { matchPath, RouteProps, useLocation, useHistory } from 'react-router-dom'
import { useSpring, animated } from 'react-spring'
import React from 'react'

const ModalRoute = (props: RouteProps) => {
  const history = useHistory()
  const location = useLocation()

  const match = matchPath(location.pathname, props)

  const styles = useSpring({
    to: {
      display: !match ? 'none' : 'block',
      paddingTop: !!match ? '0rem' : '5rem',
      backgroundColor: `rgba(255,255,255,${!!match ? '.8' : '0'})`,
      position: 'fixed',
      height: '100vh',
      width: '100vw',
      zIndex: 4,
      top: '0px',
    },
  })

  return (
    <animated.div style={styles}>
      {match && props.component && <props.component {...{ history, location, match: match }} />}
    </animated.div>
  )
}

export default ModalRoute
