import React from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

import { useMapState } from '../contexts/MapProvider'
import { Group } from '../utils/types'

const GroupMap = ({ groups }: { groups: Group[] }) => {
  const { zoom, center } = useMapState();

  return (
    <div className="group-map">
      <LoadScript id="script-loader" googleMapsApiKey="AIzaSyDD8gtVtIrx6A0FpaTb7WXy0r1tZR8iECg">
        <GoogleMap
          id="circle-example"
          mapContainerStyle={{
            height: '600px',
            width: 'auto',
          }}
          zoom={zoom}
          center={center}
        >
          {groups.map(group => <Marker position={group.location_coord} key={group.id} />)}
        </GoogleMap>
      </LoadScript>
    </div>
  )
}

export default GroupMap
