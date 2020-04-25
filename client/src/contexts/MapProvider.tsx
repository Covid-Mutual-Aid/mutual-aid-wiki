import React, { createContext, useRef, useContext } from 'react'

import { useLoadScript } from '../components/Maps/hooks/useLoadScripts'
import { Coord, Group } from '../utils/types'

export type MapState = {
  center: Coord
  zoom: number
  group?: Omit<Group, 'id'>
}

const MapContext = createContext<[React.RefObject<google.maps.Map<Element>>, boolean]>([
  { current: null },
  false,
])

export const defaultState: MapState = { center: { lat: 55.3781, lng: -3.436 }, zoom: 3 }

const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const loaded = useLoadScript()
  const map = useRef<google.maps.Map>(null)
  return <MapContext.Provider value={[map, loaded]}>{children}</MapContext.Provider>
}

export default MapProvider

export const useMapContext = () => useContext(MapContext)
