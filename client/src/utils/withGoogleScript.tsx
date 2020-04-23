import { useMap } from '../contexts/MapProvider'
import React from 'react'

const withGoogleScript = <P extends any>(Component: React.FC<P>): React.FC<P> => (props) => {
  const { loaded } = useMap()
  if (!loaded) return null
  return <Component {...props} />
}

export default withGoogleScript
