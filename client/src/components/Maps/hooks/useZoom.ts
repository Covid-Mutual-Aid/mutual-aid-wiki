import { useEffect, useState, useCallback } from 'react'

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

const useZoom = (map: React.MutableRefObject<google.maps.Map<HTMLDivElement> | undefined>) =>
  useCallback((zoom) => {
    if (!map.current) return
    smoothZoom(map, zoom, map.current.getZoom())
  }, [])

export default useZoom
