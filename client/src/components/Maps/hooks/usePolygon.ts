import { useEffect, useRef } from 'react'

export type Coord = { lat: number; lng: number }
export type MapRef = React.MutableRefObject<google.maps.Map<HTMLDivElement> | undefined>

type PolyOptions = { path?: Coord[]; onChange?: (x: Coord[]) => void; disable?: boolean }
const usePolygon = (map: MapRef, { path, onChange, disable }: PolyOptions) => {
  const poly = useRef<google.maps.Polygon>()
  useEffect(() => {
    if (!map.current) return
    poly.current = new google.maps.Polygon({
      paths: path ? [path] : [],
      map: map.current,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
      editable: true,
    })
    let listeners: google.maps.MapsEventListener[] = []

    if (onChange) {
      listeners = [
        ...listeners,
        poly.current.addListener('mouseup', (event) => {
          let pths = [] as Coord[][]
          poly.current?.getPaths().forEach((x) => {
            let pth = [] as Coord[]
            // console.log(x.forEach((y) => void (pth = [...pth, getCoord(y)])))
            pths = [...pths, pth]
          })
          onChange(pths[0])
        }),
      ]
    }

    return () => {
      listeners.forEach((x) => x.remove())
      poly.current?.setMap(null)
    }
  }, [map, onChange, path])

  useEffect(() => {
    if (!poly.current) return
    if (path) poly.current.setPaths([path])
    poly.current.setVisible(!disable)
  }, [path, disable])

  return poly
}

export default usePolygon
