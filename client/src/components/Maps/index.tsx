import React, { useRef, useMemo, useEffect } from 'react'
import styled from 'styled-components'

import { usePlaceState, usePlaceMethod } from '../../contexts/StateContext'
import { useGroupClusters } from './useGroupClusters'
import withGoogleScript from './withGoogleScript'
import useZoom from './hooks/useZoom'
import { useMap } from './hooks'

const Map = () => {
  const { selected } = usePlaceState()
  const { onSelect } = usePlaceMethod()
  const elem = useRef<HTMLDivElement>(null)
  const map = useMap(elem)
  useGroupClusters(
    map,
    useMemo(() => ({ selected, disable: false, onSelect }), [selected, onSelect])
  )
  const setZoom = useZoom(map)

  useEffect(() => {
    if (!map.current || !selected) return
    if (selected && map.current.getZoom() < 10) setZoom(10)
    map.current.panTo(selected.location_coord)
  }, [selected, setZoom, map])

  return (
    <MapStyles>
      <div id="map" ref={elem} style={{ width: '100%', flex: '1 1 100%' }} />
    </MapStyles>
  )
}

export default withGoogleScript(Map)

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
