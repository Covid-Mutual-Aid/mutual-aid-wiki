import React, { useState } from 'react'
import { Spring } from 'react-spring/renderprops'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

import { useMapState, useMap } from '../contexts/MapProvider'
import { Group } from '../utils/types'
import { gtag } from '../utils/gtag'

type GoogleMapState = google.maps.Map | null

const GroupMap = ({ groups }: { groups: Group[] }) => {
  const [{ zoom, center }, inital] = useMapState()
  const { setMapState, map } = useMap()
  const [googleMapInstance, setGoogleMapInstance] = useState<GoogleMapState>(null)

  const onLoad = React.useCallback(mapInstance => {
    setGoogleMapInstance(mapInstance)
    // do something with map Instance
    console.log(mapInstance.getCenter())
  }, [])

  // onCenterChanged={(e: any) => console.log('called', e)}

  return (
    <div className="group-map">
      <LoadScript id="script-loader" googleMapsApiKey="AIzaSyDD8gtVtIrx6A0FpaTb7WXy0r1tZR8iECg">
        <Spring from={{ z: inital.zoom, ...inital.center }} to={{ z: zoom, ...center }}>
          {({ z, lat, lng }) => (
            <GoogleMap
              ref={map}
              onLoad={onLoad}
              mapContainerStyle={{
                height: '100%',
                width: 'auto',
              }}
              zoom={z}
              center={{ lat, lng }}
              onDragEnd={() => {
                gtag('event', 'Map was dragged', {
                  event_category: 'Map',
                  event_label: 'Drag map',
                })
              }}
            >
              {groups.map(group => (
                <Marker
                  opacity={
                    group.location_coord.lat === lat && group.location_coord.lng === lng ? 1 : 0.2
                  }
                  position={group.location_coord}
                  key={group.id}
                  onClick={() => {
                    gtag('event', 'Marker was clicked', {
                      event_category: 'Map',
                      event_label: 'Click marker',
                    })
                    setMapState({ center: group.location_coord, group, zoom: 11 })
                  }}
                />
              ))}
            </GoogleMap>
          )}
        </Spring>
      </LoadScript>
    </div>
  )
}

export default GroupMap
