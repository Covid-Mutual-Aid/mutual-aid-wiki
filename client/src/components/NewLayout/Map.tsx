import React, { useEffect } from 'react'
import styled from 'styled-components'
import { GoogleMap, LoadScript, Marker, MarkerClusterer } from '@react-google-maps/api'

import { useMapState, useMap, useMapControls } from '../../contexts/MapProvider'
import { useGroups } from '../../contexts/GroupsContext'
import { gtag } from '../../utils/gtag'
import { useSearch } from '../../contexts/SearchContext'

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
  const [{ zoom, center }] = useMapState()
  const { setMapState, map } = useMap()
  const { groups } = useGroups()
  const { place } = useSearch()

  useEffect(() => {
    if (place) {
      panTo(place.coords)
      zoomTo(11)
    } else {
      panTo(center)
      zoomTo(zoom)
    }
  }, [place, panTo, center])

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
          onLoad={(x) => {
            ;(map as any).current = x
          }}
          options={{ streetViewControl: false }}
          mapContainerStyle={{
            height: '100%',
            width: 'auto',
          }}
          zoom={zoom}
          center={center}
          onDragEnd={gaTags.mapMoved}
        >
          <MarkerClusterer options={options}>
            {(clusterer) =>
              groups.map((group, i) => (
                <Marker
                  opacity={
                    group.location_coord.lat === center.lat &&
                    group.location_coord.lng === center.lng
                      ? 1
                      : 0.8
                  }
                  position={group.location_coord}
                  clusterer={clusterer}
                  key={i}
                  onClick={() => {
                    setMapState({ center: group.location_coord, group, zoom: 11 })
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
