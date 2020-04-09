import React, { createContext, useRef, useContext, useState, useMemo, useEffect } from 'react'
import { Coord, Group } from '../utils/types'
import { animate, animateMulti } from '../utils/animate'

export type MapState = {
  center: Coord
  zoom: number
  group?: Group
}

const MapContext = createContext<{
  map: React.RefObject<google.maps.Map>
  setMapState: React.Dispatch<React.SetStateAction<MapState>>
}>({ map: { current: null }, setMapState: () => null })

const defaultState: MapState = { center: { lat: 55.3781, lng: -3.436 }, zoom: 5 }
const MapStateContext = createContext<[MapState, MapState]>([defaultState, defaultState])

const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const [mapState, setMapState] = useState<MapState>(defaultState)
  const map = useRef<google.maps.Map>(null)

  return (
    <MapContext.Provider value={useMemo(() => ({ map, setMapState }), [map, setMapState])}>
      <MapStateContext.Provider value={[mapState, defaultState]}>
        {children}
      </MapStateContext.Provider>
    </MapContext.Provider>
  )
}

export default MapProvider

export const useMap = () => useContext(MapContext)
export const useMapState = () => useContext(MapStateContext)

export const useMapControls = () => {
  const { map } = useContext(MapContext)

  const panTo = (coord: { lat: number; lng: number }) => {
    if (!map.current) return
    map.current.panTo(new window.google.maps.LatLng(coord))
  }

  let unsub = () => void null
  const zoomTo = (n: number) => {
    if (!map.current || n === map.current.getZoom()) return
    unsub = animate(map.current.getZoom(), n, 300)((n) => map.current && map.current.setZoom(n))
  }

  useEffect(() => unsub)

  return { panTo, zoomTo }
}
