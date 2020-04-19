import React, { createContext, useState, useEffect, useContext, useMemo } from 'react'
import { Group } from '../utils/types'
import { useRequest } from './RequestProvider'
import { useLocation } from 'react-router-dom'

const DataContext = createContext<{
  groups: Group[]
  location?: { lat: number; lng: number }
}>({
  groups: [],
})

const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useUserLocation()
  const groups = useGroups()

  return (
    <DataContext.Provider value={useMemo(() => ({ groups, location }), [groups, location])}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)

export default DataProvider

const useUserLocation = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number }>()
  const request = useRequest()

  useEffect(() => {
    request('/info/locate').then(setLocation)
  }, [request])

  return location
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
