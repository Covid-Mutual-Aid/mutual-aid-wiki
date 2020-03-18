import React, { useState, useEffect } from 'react'
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

    return <Marker onLoad={onLoad} position={group.location_coord} />
  })

  return (
    <div className="group-map">
      <LoadScript id="script-loader" googleMapsApiKey="AIzaSyCKQeMu8vMl25We8EHBAmLJ7FxIqpjC-9Q">
        <GoogleMap
          id="circle-example"
          mapContainerStyle={{
            height: '400px',
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
