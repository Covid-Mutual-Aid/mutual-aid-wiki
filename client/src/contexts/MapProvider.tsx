import React, { createContext, useRef, useContext, useState, useMemo } from 'react';
import { GoogleMap } from '@react-google-maps/api';

import { Coord, Group } from '../utils/types';

export type MapState = {
    center: Coord,
    zoom: number,
    group?: Group
}

const MapContext = createContext<{
    map: React.RefObject<GoogleMap>;
    setMapState: React.Dispatch<React.SetStateAction<MapState>>;
}>({ map: { current: null }, setMapState: () => null })


const defaultState: MapState = { center: { lat: 55.3781, lng: -3.436 }, zoom: 5 }
const MapStateContext = createContext<[MapState, MapState]>([defaultState, defaultState]);

const MapProvider = ({ children }: { children: React.ReactNode }) => {
    const [mapState, setMapState] = useState<MapState>(defaultState)
    const map = useRef<GoogleMap>(null);

    return (
        <MapContext.Provider value={useMemo(() => ({ map, setMapState }), [map, setMapState])}>
            <MapStateContext.Provider value={[mapState, defaultState]}>
                {children}
            </MapStateContext.Provider>
        </MapContext.Provider>
    )
}

export default MapProvider;

export const useMap = () => useContext(MapContext)
export const useMapState = () => useContext(MapStateContext)