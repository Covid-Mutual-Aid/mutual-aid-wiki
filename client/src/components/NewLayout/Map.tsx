import React, { useEffect } from 'react'
import styled from 'styled-components'
import { GoogleMap, LoadScript, Marker, MarkerClusterer } from '@react-google-maps/api'

import { defaultState, useMap, useMapControls } from '../../contexts/MapProvider'
import { useGroups } from '../../contexts/GroupsContext'
import { useSearch } from '../../contexts/SearchContext'
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
  const { panTo, zoomTo } = useMapControls()
  const { map } = useMap()
  const { groups, selected, setSelected } = useGroups()
  const { place } = useSearch()

  useEffect(() => {
    if (selected) {
      const group = groups.find((x) => x.id === selected)
      if (!group) return
      panTo(group.location_coord)
      zoomTo(11)
    } else if (place) {
      panTo(place.coords)
      zoomTo(11)
    } else {
      panTo(defaultState.center)
      zoomTo(defaultState.zoom)
    }
  }, [place, panTo])

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
                  opacity={selected === group.id ? 1 : 0.7}
                  position={group.location_coord}
                  clusterer={clusterer}
                  key={group.id}
                  onClick={() => {
                    setSelected(group.id)
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

export default GroupMap
