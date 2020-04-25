import React from 'react'
import { useMapContext } from '../../contexts/MapProvider'

const withGoogleScript = <P extends any>(Component: React.FC<P>): React.FC<P> => (props) => {
  const [, loaded] = useMapContext()
  if (!loaded) return null
  return <Component {...props} />
}

export default withGoogleScript
