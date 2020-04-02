import React, { createContext, useState, useEffect, useContext } from 'react'
import { Group } from '../utils/types'
import { useRequest } from './RequestProvider'

const GroupsContext = createContext<Group[]>([])

const GroupsProvider = ({ children }: { children: React.ReactNode }) => {
  const [groups, setGroups] = useState<Group[]>([])
  const request = useRequest()

  useEffect(() => {
    request('/group/get').then(setGroups)
  }, [request])

  return <GroupsContext.Provider value={groups}>{children}</GroupsContext.Provider>
}

export const useGroups = () => useContext(GroupsContext)

export default GroupsProvider
