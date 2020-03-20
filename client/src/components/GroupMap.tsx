import React from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { Group, Coord } from '../utils/types'

type Props = {
  groups: Group[]
  center: Coord
  zoom: number
}

const GroupMap = ({ groups, center, zoom }: Props) => {
  const markers = groups.map(group => {
    const onLoad = (marker: any) => {
      // console.log('marker: ', marker)
    }

    return <Marker onLoad={onLoad} position={group.location_coord} key={group.id} />
  })

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
          {markers}
        </GoogleMap>
      </LoadScript>
    </div>
  )
}

export default GroupMap
