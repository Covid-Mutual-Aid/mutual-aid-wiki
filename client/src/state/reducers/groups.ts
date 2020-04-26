import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Group } from '../../utils/types'
import { useSelector } from 'react-redux'
import { RootState } from '.'

type GroupsState = {
  all: Group[]
  selected?: Group
  visible: string[]
}

let initialState: GroupsState = { all: [], visible: [] }
const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    addGroups(state, action: PayloadAction<Group[]>) {
      state.all = action.payload
    },
    selectGroup(state, action: PayloadAction<Group | undefined>) {
      state.selected = action.payload
    },
    setVisible(state, action: PayloadAction<string[]>) {
      state.visible = action.payload
    },
  },
})

export const { addGroups, selectGroup, setVisible } = groupsSlice.actions

export default groupsSlice.reducer

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
