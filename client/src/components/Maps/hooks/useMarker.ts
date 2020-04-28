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
    const listener = marker.current.addListener(
      'dragend',
      (x) => onDrag && onDrag(getCoord(x.latLng))
    )
    return () => {
      marker.current?.setMap(null)
      listener.remove()
    }
  }, [onDrag, map])

  useEffect(() => {
    if (!coord || !marker.current) return
    marker.current.setVisible(!disable)
    marker.current?.setPosition(coord)
  }, [coord, disable])

  return marker
}
