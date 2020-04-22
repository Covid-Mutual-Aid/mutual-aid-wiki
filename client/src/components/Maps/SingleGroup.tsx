import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { defaultState } from '../../contexts/MapProvider'
import { useControl } from '../FormControl'
import InfoBox from '../InfoBox'

const SingleMap = () => {
  const [center, setCenter] = useState(defaultState.center)
  const [zoom, setZoom] = useState(3)

  const {
    props: { value: coords, onChange: onCoords },
  } = useControl('location_coord', undefined as { lat: number; lng: number } | undefined)
  const {
    props: { value: locationName },
  } = useControl('location_name', '')
  const active = !!locationName && !!coords

  useEffect(() => {
    if (coords) setCenter(coords)
  }, [locationName]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!coords) return
    if (zoom === 3) setZoom(13)
    if (defaultState.center.lat === center.lat) setCenter(coords)
  }, [coords, zoom, center])

  return (
    <MapStyles active={active}>
      <InfoBox />
      <LoadScript id="script-loader" googleMapsApiKey="AIzaSyDD8gtVtIrx6A0FpaTb7WXy0r1tZR8iECg">
        <GoogleMap
          options={{ streetViewControl: false }}
          mapContainerStyle={{ height: '100%', width: 'auto' }}
          zoom={zoom}
          center={center}
          onClick={(x) => onCoords({ lat: x.latLng.lat(), lng: x.latLng.lng() })}
        >
          {coords && (
            <Marker opacity={0.7} position={coords} icon={process.env.PUBLIC_URL + '/marker.png'} />
          )}
        </GoogleMap>
      </LoadScript>
    </MapStyles>
  )
}

const MapStyles = styled.div<{ active: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  opacity: ${(p) => (p.active ? 1 : 0.7)};
  pointer-events: ${(p) => (p.active ? 'all' : 'none')};
`

export default SingleMap
