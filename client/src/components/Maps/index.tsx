import React, { useMemo, useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { selectGroup, useSelectedGroup } from '../../state/reducers/groups'
import useEditLocationMap from './hooks/useEditLocationMap'
import { useGroupClusters } from './hooks/useGroupClusters'
import withMap, { MapContext } from './withMap'
import InfoBox from '../InfoBox'

const useClusterMap = (disable: boolean) => {
  const [, map, setZoom] = useContext(MapContext)
  const selected = useSelectedGroup()
  const dispatch = useDispatch()

  const selectMarker = useGroupClusters(
    map,
    useMemo(() => ({ disable, onSelect: (grp) => dispatch(selectGroup(grp)) }), [dispatch, disable])
  )

  useEffect(() => {
    if (!map.current || !selected) return
    selectMarker(selected?.id || '')
    if (selected && map.current.getZoom() < 11) setZoom(12)
    map.current.panTo(selected.location_coord)
  }, [selected, setZoom, map, selectMarker])
}

const Map = () => {
  const [ref] = useContext(MapContext)
  const { pathname } = useLocation()

  useClusterMap(pathname !== '/')
  const controls = useEditLocationMap(!/\/add-group|\/edit\/.*?\/.*?$/.test(pathname))

  return (
    <MapStyles>
      {pathname === '/' && <InfoBox />}
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
