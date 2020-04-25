import { useRef, useEffect } from 'react'
import { getCoord, Coord, MapRef } from './utils'

type MarkerProps = {
  onDrag?: (x: Coord) => void
  coord?: Coord
  disable?: boolean
}

export const useMarker = (map: MapRef, { disable, coord, onDrag }: MarkerProps) => {
  const marker = useRef<google.maps.Marker>()

  useEffect(() => {
    if (!map.current) return
    marker.current = new google.maps.Marker({
      map: map.current,
      animation: google.maps.Animation.DROP,
      draggable: true,
    })
    let listeners: google.maps.MapsEventListener[] = []
    if (onDrag) {
      listeners = [
        ...listeners,
        marker.current.addListener('dragend', (x) => onDrag(getCoord(x.latLng))),
      ]
    }
    return () => {
      marker.current?.setMap(null)
      listeners.forEach((x) => x.remove())
    }
  }, [onDrag, map])

  useEffect(() => {
    if (!coord || !marker.current) return
    marker.current.setVisible(!disable)
    marker.current?.setPosition(coord)
  }, [coord, disable])

  return marker
}
