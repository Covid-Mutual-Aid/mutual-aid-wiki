import React, { useEffect } from 'react'
import styled from 'styled-components'
import { GoogleMap, LoadScript, Marker, MarkerClusterer } from '@react-google-maps/api'

import { defaultState, useMap, useMapControls } from '../../contexts/MapProvider'
import { usePlaceState, usePlaceMethod } from '../../contexts/StateContext'
import { useData } from '../../contexts/DataProvider'
import { gtag } from '../../utils/gtag'

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

  const options = {
    minimumClusterSize: 6,
    clusterClass: 'map-cluster-icon',
    imagePath:
      'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
  }

  return (
    <MapStyles>
      <LoadScript id="script-loader" googleMapsApiKey="AIzaSyDD8gtVtIrx6A0FpaTb7WXy0r1tZR8iECg">
        <GoogleMap
          onLoad={(x) => void ((map as any).current = x)}
          options={{ streetViewControl: false }}
          mapContainerStyle={{ height: '100%', width: 'auto' }}
          zoom={defaultState.zoom}
          center={defaultState.center}
          onDragEnd={gaTags.mapMoved}
        >
          <MarkerClusterer options={options}>
            {(clusterer) =>
              groups.map((group) => (
                <Marker
                  opacity={0.7}
                  position={group.location_coord}
                  clusterer={clusterer}
                  key={group.id}
                  onClick={() => {
                    onSelect(group.id)
                    gaTags.groupClicked()
                  }}
                />
              ))
            }
          </MarkerClusterer>
        </GoogleMap>
      </LoadScript>
    </MapStyles>
  )
}

const MapStyles = styled.div`
  width: 100%;
  height: 100%;
`

export default React.memo(GroupMap)
