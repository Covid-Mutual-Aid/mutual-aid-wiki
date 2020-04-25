import { useSelector } from 'react-redux'
import { RootState } from './reducer'

export const useUserLocation = () => useSelector<RootState>((x) => x.location.location)
export const useSelected = () => useSelector<RootState>((x) => x.groups.selected)
export const useGroups = () => useSelector<RootState>((x) => x.groups.all)
