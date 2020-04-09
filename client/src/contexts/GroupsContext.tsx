import React, { createContext, useState, useEffect, useContext, useMemo } from 'react'
import { Group } from '../utils/types'
import { useRequest } from './RequestProvider'

const GroupsContext = createContext<{
  groups: Group[]
  selected: string | null
  setSelected: React.Dispatch<React.SetStateAction<string | null>>
}>({
  groups: [],
  selected: null,
  setSelected: (x) => null,
})

const GroupsProvider = ({ children }: { children: React.ReactNode }) => {
  const [groups, setGroups] = useState<Group[]>([])
  const [selected, setSelected] = useState<string | null>(null)

  const request = useRequest()

  useEffect(() => {
    request('/group/get').then(setGroups)
  }, [request])

  return (
    <GroupsContext.Provider
      value={useMemo(() => ({ groups, selected, setSelected }), [groups, selected, setSelected])}
    >
      {children}
    </GroupsContext.Provider>
  )
}

export const useGroups = () => useContext(GroupsContext)

export default GroupsProvider
