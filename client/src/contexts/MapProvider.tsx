import React, { createContext, useRef, useContext } from 'react';
import { GoogleMap } from '@react-google-maps/api';

const MapContext = createContext<React.RefObject<GoogleMap>>({ current: null })

const MapProvider = ({ children }: { children: React.ReactNode }) => {
    const map = useRef<GoogleMap>(null);
    return <MapContext.Provider value={map}>{children}</MapContext.Provider>
}

export default MapProvider;

export const useMap = () => useContext(MapContext)