import React, { useState, useEffect } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { Group } from '../utils/types'

type Props = {
  groups: Group[]
}

const GroupMap = ({ groups }: Props) => {
  const center = {
    lat: 55.3781,
    lng: -3.436,
  }

  const markers = groups.map(group => {
    const position = {
      lat: 37.772,
      lng: -122.214,
    }

    const onLoad = (marker: any) => {
      console.log('marker: ', marker)
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
          zoom={5}
          center={center}
        >
          {markers}
        </GoogleMap>
      </LoadScript>
    </div>
  )
}

export default GroupMap
