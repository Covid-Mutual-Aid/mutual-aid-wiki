import { useSelector } from 'react-redux'
import { RootState } from './reducers'
import { Group } from '../utils/types'

export const useUserLocation = () => useSelector<RootState>((x) => x.location.location)
export const useSelectedGroup = () =>
  useSelector<RootState, Group | undefined>(
    (x) => x.groups.selected,
    (a, b) => a === b && a?.id === b?.id
  )
export const useGroupsList = () => useSelector<RootState, Group[]>((x) => x.groups.all)
export const useGroup = (id: string) =>
  useSelector<RootState, Group | undefined>(
    (x) => x.groups.all.find((y) => y.id === id),
    (a, b) => !!(a && b) && a.id === b.id
  )
