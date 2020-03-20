import React from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { Spring } from 'react-spring/renderprops'

import { useMapState, useMap } from '../contexts/MapProvider'
import { Group } from '../utils/types'

const GroupMap = ({ groups }: { groups: Group[] }) => {
  const [{ zoom, center }, inital] = useMapState();
  const { setMapState } = useMap();

  return (
    <div className="group-map">
      <LoadScript id="script-loader" googleMapsApiKey="AIzaSyDD8gtVtIrx6A0FpaTb7WXy0r1tZR8iECg">
        <Spring from={{ z: inital.zoom, ...inital.center }} to={{ z: zoom, ...center }}>{({ z, lat, lng }) =>
          (<GoogleMap
            id="circle-example"
            mapContainerStyle={{
              height: '600px',
              width: 'auto',
            }}
            zoom={z}
            center={{ lat, lng }}
          >
            {groups.map(group => <Marker position={group.location_coord} key={group.id} onClick={() => setMapState({ center: group.location_coord, name: group.name, zoom: 11 })} />)}
          </GoogleMap>)}
        </Spring>
      </LoadScript>
    </div>
  )
}

export default GroupMap
