import React, { useEffect, useRef, useState } from 'react'
import withGoogleScript from './withGoogleScript'
import { useControl } from '../FormControl'
import useMap from './hooks/useMap'
import { useMarker } from './hooks/useMarker'
import usePolygon from './hooks/usePolygon'
import { createSquare } from './hooks/utils'

const PolygonMap = () => {
  const [type, setType] = useState<'point' | 'shape'>('point')
  const {
    props: { value: coord, onChange: onDrag },
  } = useControl('location_coord', undefined as { lat: number; lng: number } | undefined)
  const {
    props: { value: path, onChange },
  } = useControl('location_poly', undefined as { lat: number; lng: number }[] | undefined)
  const mapRef = useRef<HTMLDivElement>(null)
  const [map] = useMap(mapRef)

  useMarker(map, { disable: type === 'shape', coord, onDrag })
  usePolygon(map, { disable: type === 'point', path, onChange })

  useEffect(() => {
    if (!coord || !map.current) return
    if (map.current.getZoom() < 5) map.current.setZoom(10)
    map.current.panTo(coord)
  }, [coord, map])

  useEffect(() => {
    if (!path && coord) onChange(createSquare(coord, 1000))
  }, [path, coord, onChange])

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexFlow: 'column' }}>
      <div>
        <button
          type="button"
          style={{ background: type === 'point' ? 'green' : 'white' }}
          onClick={() => setType('point')}
        >
          point
        </button>
        <button
          type="button"
          style={{ background: type === 'shape' ? 'green' : 'white' }}
          onClick={() => setType('shape')}
        >
          shape
        </button>
      </div>
      <div id="map" ref={mapRef} style={{ width: '100%', flex: '1 1 100%' }} />
    </div>
  )
}
export default withGoogleScript(PolygonMap)
