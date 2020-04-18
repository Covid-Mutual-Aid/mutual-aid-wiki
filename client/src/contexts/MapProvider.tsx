import React, { createContext, useRef, useContext, useState, useMemo, useEffect } from 'react'
import { Coord, Group } from '../utils/types'
import { animate } from '../utils/animate'
import { usePlaceState } from './StateContext'
import { useData } from './DataProvider'

export type MapState = {
  center: Coord
  zoom: number
  group?: Omit<Group, 'id'>
}

const MapContext = createContext<{
  map: React.RefObject<google.maps.Map>
  setMapState: React.Dispatch<React.SetStateAction<MapState>>
}>({ map: { current: null }, setMapState: () => null })

export const defaultState: MapState = { center: { lat: 55.3781, lng: -3.436 }, zoom: 5 }
const MapStateContext = createContext<[MapState, MapState]>([defaultState, defaultState])

const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const [mapState, setMapState] = useState<MapState>(defaultState)
  const map = useRef<google.maps.Map>(null)
  return (
    <MapContext.Provider value={useMemo(() => ({ map, setMapState }), [map, setMapState])}>
      <MapStateContext.Provider value={[mapState, defaultState]}>
        <MapControls />
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
    if (!map.current || !window.google) return
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

const useControlMap = () => {
  const { map } = useContext(MapContext)
  const { panTo, zoomTo } = useMapControls()
  const { groups } = useData()
  const {
    search: { place },
    selected,
  } = usePlaceState()

  useEffect(() => {
    if (selected) {
      const group = groups.find((x) => x.id === selected)
      if (!group) return
      panTo(group.location_coord)
      if (map.current && map.current.getZoom() < 15) zoomTo(15)
    } else if (place) {
      panTo(place.coords)
      zoomTo(15)
    } else {
      panTo(defaultState.center)
      zoomTo(defaultState.zoom)
    }
  }, [place, panTo, groups, map, selected, zoomTo])
}
const MapControls = () => {
  useControlMap()
  return null
}
