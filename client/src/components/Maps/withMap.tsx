import React, { createContext } from 'react'

import { useLoadScript } from './hooks/useLoadScripts'
import useMap from './hooks/useMap'

export const MapContext = createContext<ReturnType<typeof useMap>>([
  { current: null },
  { current: undefined },
  () => null,
])

const MapProvider: React.FC = ({ children }) => (
  <MapContext.Provider value={useMap()}>{children}</MapContext.Provider>
)

const withMap = <P extends any>(Component: React.FC<P>): React.FC<P> => (props) => {
  const loaded = useLoadScript()
  if (!loaded) return null
  return (
    <MapProvider>
      <Component {...props} />
    </MapProvider>
  )
}

export default withMap
