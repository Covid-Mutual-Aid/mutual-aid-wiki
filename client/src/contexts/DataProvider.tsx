import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react'
import { Group } from '../utils/types'
import { useRequest } from './RequestProvider'
import { useLocation } from 'react-router-dom'

const DataContext = createContext<{
  groups: Group[]
  location?: { lat: number; lng: number; zoom: number }
  geolocateUser: () => void
}>({
  groups: [],
  geolocateUser: () => null,
})

const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { location, geolocateUser } = useUserLocation()
  const groups = useGroups()

  return (
    <DataContext.Provider
      value={useMemo(() => ({ groups, location, geolocateUser }), [
        groups,
        location,
        geolocateUser,
      ])}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)

export default DataProvider

const useUserLocation = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number; zoom: number }>()
  const request = useRequest()

  useEffect(() => {
    request('/info/locate').then((x) => {
      if (x.message) return console.error(x.message)
      return setLocation({ lat: x.lat, lng: x.lon, zoom: 4 })
    })
  }, [request])

  const geolocateUser = useCallback(() => {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            zoom: position.coords.altitudeAccuracy || 7,
          }),
        console.error
      )
    } else {
      alert("Your browser doesn't support this feature")
    }
  }, [])

  return useMemo(() => ({ location, geolocateUser }), [location, geolocateUser])
}

const useGroups = () => {
  const request = useRequest()
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const [groups, setGroups] = useState<Group[]>([])

  useEffect(() => {
    request('/group/get').then((grps: Group[]) =>
      setGroups(
        grps.map((grp) =>
          typeof grp.location_coord.lat === 'string'
            ? {
                ...grp,
                location_coord: {
                  lat: parseFloat(grp.location_coord.lat),
                  lng: parseFloat(grp.location_coord.lng as any),
                },
              }
            : grp
        )
      )
    )
  }, [request, isHome])

  return groups
}
