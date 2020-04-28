import { useEffect, useRef } from 'react'

export type Coord = { lat: number; lng: number }
export type MapRef = React.MutableRefObject<google.maps.Map | undefined>

type PolyOptions = { path?: Coord[]; onChange?: (x: Coord[]) => void; disable?: boolean }
const usePolygon = (map: MapRef, { path, onChange, disable }: PolyOptions) => {
  const poly = useRef<google.maps.Polygon>()

  useEffect(() => {
    if (!map.current || disable) return
    poly.current = new google.maps.Polygon({
      paths: path ? [path] : [],
      map: map.current,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
      editable: true,
    })

    const getCoords = () =>
      poly.current
        ? poly.current
            .getPath()
            .getArray()
            .map((x) => ({ lat: x.lat(), lng: x.lng() }))
        : []

    const polypath = poly.current.getPath()
    const unsubs = [
      poly.current.addListener('dblclick', (e) => {
        const coords = getCoords()
        if (e.vertex && onChange && coords.length > 3)
          return onChange(getCoords().filter((x, i) => i !== e.vertex))
      }),
      polypath &&
        polypath.addListener('set_at', () => {
          onChange &&
            poly.current &&
            onChange(
              poly.current
                ?.getPath()
                .getArray()
                .map((x) => ({ lat: x.lat(), lng: x.lng() }))
            )
        }),
    ]

    return () => {
      unsubs.forEach((x) => x && x.remove())
      poly.current?.setMap(null)
    }
  }, [map, onChange, path, disable])

  return poly
}

export default usePolygon
