import React from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { Spring } from 'react-spring/renderprops'

import { useMapState, useMap } from '../contexts/MapProvider'
import { Group } from '../utils/types'

const GroupMap = ({ groups }: { groups: Group[] }) => {
  const [{ zoom, center }, inital] = useMapState()
  const { setMapState } = useMap()

  var shape = {
    coords: [1, 1, 1, 20, 18, 20, 18, 1],
    type: 'poly',
  }

  return (
    <div className="group-map">
      <LoadScript id="script-loader" googleMapsApiKey="AIzaSyDD8gtVtIrx6A0FpaTb7WXy0r1tZR8iECg">
        <Spring from={{ z: inital.zoom, ...inital.center }} to={{ z: zoom, ...center }}>
          {({ z, lat, lng }) => (
            <GoogleMap
              id="circle-example"
              mapContainerStyle={{
                height: '100%',
                width: 'auto',
              }}
              zoom={z}
              center={{ lat, lng }}
            >
              {groups.map(group => (
                <Marker
                  opacity={
                    group.location_coord.lat === lat && group.location_coord.lng === lng ? 1 : 0.2
                  }
                  position={group.location_coord}
                  key={group.id}
                  onClick={() => setMapState({ center: group.location_coord, group, zoom: 11 })}
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
