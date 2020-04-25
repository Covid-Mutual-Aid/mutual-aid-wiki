import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Group } from '../../utils/types'

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
