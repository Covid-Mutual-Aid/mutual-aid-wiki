import { useRef, useCallback, useLayoutEffect } from 'react'

const smoothZoom = (
  map: React.MutableRefObject<google.maps.Map | undefined>,
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

const useMap = (): [
  React.RefObject<HTMLDivElement>,
  React.MutableRefObject<google.maps.Map | undefined>,
  (zoom: number) => void
] => {
  const ref = useRef<HTMLDivElement>(null)
  const map = useRef<google.maps.Map>()

  useLayoutEffect(() => {
    if (!ref.current) return
    map.current = new google.maps.Map(ref.current, {
      center: { lat: 55.3781, lng: -3.436 },
      zoom: 3,
    })
    return map.current.unbindAll
  }, [])

  const setZoom = useCallback((zoom: number) => {
    if (!map.current) return
    smoothZoom(map, zoom, map.current.getZoom())
  }, [])

  return [ref, map, setZoom]
}

export default useMap
