import React, { useState } from 'react'
import { GoogleMap, LoadScript, Marker, MarkerClusterer } from '@react-google-maps/api'

import { useMapState, useMap } from '../contexts/MapProvider'
import { Group } from '../utils/types'
import { gtag } from '../utils/gtag'

type GoogleMapState = google.maps.Map | null

const GroupMap = ({ groups }: { groups: Group[] }) => {
  const [{ zoom, center, group }, inital] = useMapState()
  const { setMapState } = useMap()
  const [googleMapInstance, setGoogleMapInstance] = useState<GoogleMapState>(null)

  const onLoad = React.useCallback(mapInstance => {
    setGoogleMapInstance(mapInstance)
    // do something with map Instance
    console.log(mapInstance.getCenter())
  }, [])

  const clustererOptions = {
    minimumClusterSize: 6,
    clusterClass: 'map-cluster-icon',
    imagePath:
      process.env.PUBLIC_URL + '/cluster_marker_'
  }

  const clustererStyles = [{
    anchorText:[-5,0],
    textColor: "white",
    url: process.env.PUBLIC_URL + '/cluster_marker_1.png',
    height: 60,
    width: 45
  }]

  // onCenterChanged={(e: any) => console.log('called', e)}

  return (
    <div className="group-map">
      <LoadScript id="script-loader" googleMapsApiKey="AIzaSyDD8gtVtIrx6A0FpaTb7WXy0r1tZR8iECg">
        <GoogleMap
          onLoad={onLoad}
          mapContainerStyle={{
            height: '100%',
            width: 'auto',
          }}
          zoom={zoom}
          center={center}
          onDragEnd={() => {
            gtag('event', 'Map was dragged', {
              event_category: 'Map',
              event_label: 'Drag map',
            })
            if (googleMapInstance instanceof google.maps.Map) {
              const center = googleMapInstance.getCenter()
              //Uncommenting the line below animates the Map the wrong way on drag end, but
              //at least we have the coordinates from the drag event.
              //setMapState({ zoom, group, center: { lat: center.lat(), lng: center.lng() } })
            }
          }}
        >
          <MarkerClusterer options={clustererOptions} styles={clustererStyles}>
            {clusterer =>
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
                  icon={process.env.PUBLIC_URL + '/marker.png'}
                  onClick={() => {
                    gtag('event', 'Marker was clicked', {
                      event_category: 'Map',
                      event_label: 'Click marker',
                    })
                    setMapState({ center: group.location_coord, group, zoom: 11 })
                  }}
                />
              ))
            }
          </MarkerClusterer>
        </GoogleMap>
      </LoadScript>
    </div>
  )
}

export default GroupMap
