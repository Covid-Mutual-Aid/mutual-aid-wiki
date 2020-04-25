import { useRef, useEffect, useState, useCallback } from 'react'
import { tuple } from '../../utils/fp'

export type Coord = { lat: number; lng: number }
export type MapRef = React.MutableRefObject<google.maps.Map<HTMLDivElement> | undefined>
export const getCoord = (x: google.maps.LatLng) => ({ lat: x.lat(), lng: x.lng() })
export const createSquare = (coord: Coord, radius: number) => {
  const center = new google.maps.Circle({ center: coord, radius }).getBounds()
  const ne = getCoord(center.getNorthEast())
  const sw = getCoord(center.getSouthWest())
  return [ne, { lat: ne.lat, lng: sw.lng }, sw, { lat: sw.lat, lng: ne.lng }]
}

const smoothZoom = (
  map: React.MutableRefObject<google.maps.Map<HTMLDivElement> | undefined>,
  max: number,
  cnt: number
) => {
  if (cnt >= max || !map.current) return
  let z = map.current.addListener('zoom_changed', () => {
    z.remove()
    smoothZoom(map, max, cnt + 1)
  })
  setTimeout(function () {
    map.current?.setZoom(cnt)
  }, 80)
}

export const useLoadScript = () => {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    let acc = 0
    const onLoad = () => {
      if (acc === 0) return void (acc = 1)
      return setLoaded(true)
    }
    if (!window.google) {
      const script = document.createElement(`script`)
      const clusterScript = document.createElement(`script`)
      clusterScript.src = `https://unpkg.com/@google/markerclustererplus@4.0.1/dist/markerclustererplus.min.js`
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDD8gtVtIrx6A0FpaTb7WXy0r1tZR8iECg`

      document.head.append(script)
      document.head.append(clusterScript)
      script.addEventListener(`load`, onLoad)
      clusterScript.addEventListener(`load`, onLoad)
      return () => {
        script.removeEventListener(`load`, onLoad)
        clusterScript.removeEventListener(`load`, onLoad)
      }
    }
    return onLoad()
  }, [])
  return loaded
}

export const useMap = (ref: React.RefObject<HTMLDivElement>) => {
  const map = useRef<google.maps.Map<HTMLDivElement>>()

  useEffect(() => {
    if (!ref.current) return
    map.current = new google.maps.Map(ref.current, {
      center: { lat: 55.3781, lng: -3.436 },
      zoom: 3,
    })
  }, [ref])

  const setZoom = useCallback((zoom) => {
    if (!map.current) return
    smoothZoom(map, zoom, map.current.getZoom())
  }, [])

  return tuple(map, setZoom)
}

type PolyOptions = { path?: Coord[]; onChange?: (x: Coord[]) => void; disable?: boolean }
export const usePoly = (map: MapRef, { path, onChange, disable }: PolyOptions) => {
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
