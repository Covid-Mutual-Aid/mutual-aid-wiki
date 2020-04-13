import React, { createContext, useState, useEffect, useContext, useMemo } from 'react'
import { Group } from '../utils/types'
import { useRequest } from './RequestProvider'

const DataContext = createContext<{
  groups: Group[]
}>({
  groups: [],
})

const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [groups, setGroups] = useState<Group[]>([])

  const request = useRequest()

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
  }, [request])

  return (
    <DataContext.Provider value={useMemo(() => ({ groups }), [groups])}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)

export default DataProvider
