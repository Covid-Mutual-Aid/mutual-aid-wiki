import { GoogleMap, Marker, MarkerClusterer } from '@react-google-maps/api'
import styled from 'styled-components'
import React, { useEffect } from 'react'

import InfoBox from '../InfoBox'

import { defaultState, useMap } from '../../contexts/MapProvider'
import { usePlaceMethod } from '../../contexts/StateContext'
import { useData } from '../../contexts/DataProvider'
import { gtag } from '../../utils/gtag'
import withGoogleScript from './withGoogleScript'

const gaTags = {
  mapMoved: () =>
    gtag('event', 'Map was dragged', {
      event_category: 'Map',
      event_label: 'Drag map',
    }),
  groupClicked: () =>
    gtag('event', 'Marker was clicked', {
      event_category: 'Map',
      event_label: 'Click marker',
    }),
}

const GroupMap = () => {
  const { map } = useMap()
  const { groups } = useData()
  const { onSelect } = usePlaceMethod()

  const clustererOptions = {
    minimumClusterSize: 6,
    clusterClass: 'map-cluster-icon',
    imagePath: process.env.PUBLIC_URL + '/cluster_marker_',
  }

  const clustererStyles = [
    {
      anchorText: [-5, 0],
      textColor: 'black',
      textSize: 13,
      url: process.env.PUBLIC_URL + '/cluster_marker_1.png',
      height: 60,
      width: 45,
    },
  ]

  useEffect(() => () => void ((map as any).current = null), [map])

  return (
    <MapStyles>
      <InfoBox />
      <GoogleMap
        onLoad={(x) => void ((map as any).current = x)}
        options={{ streetViewControl: false }}
        mapContainerStyle={{ height: '100%', width: 'auto' }}
        zoom={defaultState.zoom}
        center={defaultState.center}
        onDragEnd={gaTags.mapMoved}
      >
        <MarkerClusterer options={clustererOptions} styles={clustererStyles}>
          {(clusterer) =>
            groups.map((group) => (
              <Marker
                opacity={0.7}
                position={group.location_coord}
                clusterer={clusterer}
                key={group.id}
                icon={process.env.PUBLIC_URL + '/marker.png'}
                onClick={() => {
                  onSelect(group)
                  gaTags.groupClicked()
                }}
              />
            ))
          }
        </MarkerClusterer>
      </GoogleMap>
    </MapStyles>
  )
}

const MapStyles = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

export default React.memo(withGoogleScript(GroupMap))
