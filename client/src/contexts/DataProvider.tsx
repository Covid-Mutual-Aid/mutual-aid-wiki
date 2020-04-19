import React, { createContext, useState, useEffect, useContext, useMemo } from 'react'
import { Group } from '../utils/types'
import { useRequest } from './RequestProvider'
import { useLocation } from 'react-router-dom'

const DataContext = createContext<{
  groups: Group[]
}>({
  groups: [],
})

const useUserLocation = () => {
  const [location, setLocation] = useState()

  useEffect(() => {
    fetch(`http://ip-api.com/json`)
      .then((x) => x.json())
      .then(console.log)
  }, [])
  return location
}

const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [groups, setGroups] = useState<Group[]>([])
  const { pathname } = useLocation()
  const request = useRequest()
  const isHome = pathname === '/'
  const userLocation = useUserLocation()
  console.log(userLocation)

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

  return (
    <DataContext.Provider value={useMemo(() => ({ groups }), [groups])}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)

export default DataProvider
