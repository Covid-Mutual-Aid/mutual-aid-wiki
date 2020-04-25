import { useRef, useEffect, useCallback } from 'react'
import { tuple } from '../../../utils/fp'

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

const useMap = (ref: React.RefObject<HTMLDivElement>) => {
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

export default useMap
