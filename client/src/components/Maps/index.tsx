import React, { useRef, useMemo, useEffect } from 'react'
import styled from 'styled-components'

import { useGroupClusters } from './useGroupClusters'
import withGoogleScript from './withGoogleScript'
import { useMap } from './hooks'
import InfoBox from '../InfoBox'
import { useSelectedGroup } from '../../state/selectors'
import { useDispatch } from 'react-redux'
import { selectGroup } from '../../state/reducers/groups'

const Map = () => {
  const dispatch = useDispatch()
  const selected = useSelectedGroup()
  const elem = useRef<HTMLDivElement>(null)
  const [map, setZoom] = useMap(elem)

  const selectMarker = useGroupClusters(
    map,
    useMemo(() => ({ disable: false, onSelect: (grp) => dispatch(selectGroup(grp)) }), [dispatch])
  )

  useEffect(() => {
    if (!map.current || !selected) return
    selectMarker(selected?.id || '')
    if (selected && map.current.getZoom() < 11) setZoom(12)
    map.current.panTo(selected.location_coord)
  }, [selected, setZoom, map, selectMarker])

  return (
    <MapStyles>
      <InfoBox />
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
