import React, { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

import useEditLocationMap from './hooks/useEditLocationMap'
import useGroupsMap from './hooks/useGroupsMap'
import withMap, { MapContext } from './withMap'
import InfoBox from '../InfoBox'

const Map = () => {
  const [ref] = useContext(MapContext)
  const { pathname } = useLocation()

  useGroupsMap(/(add-group)|(edit\/.*?\/.{1,}?$)/.test(pathname))
  const controls = useEditLocationMap(!/\/add-group|\/edit\/.*?\/.*?$/.test(pathname))

  return (
    <MapStyles>
      {pathname === '/map' && <InfoBox />}
      {controls}
      <div id="map" ref={ref} style={{ width: '100%', flex: '1 1 100%' }} />
    </MapStyles>
  )
}

export default withMap(Map)

const MapStyles = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  #map {
    width: 100%;
    height: 100%;
  }
  .map-cluster-icon {
    img {
      width: 100%;
    }
  }
`
