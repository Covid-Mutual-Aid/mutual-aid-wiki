import { useEffect, useState } from 'react'

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

const useZoom = (
  map: React.MutableRefObject<google.maps.Map<HTMLDivElement> | undefined>,
  initialZoom?: number
) => {
  const [zoom, setZoom] = useState(initialZoom || map.current?.getZoom() || 3)

  useEffect(() => {
    if (!map.current) return
    smoothZoom(map, zoom, map.current.getZoom())
  }, [zoom, map])

  return setZoom
}

export default useZoom
