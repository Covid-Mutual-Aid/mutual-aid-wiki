import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Languages = 'en'
type GroupsState = {
  language: Languages
  location: {
    coord?: { lat: number; lng: number }
  }
}

let initialState: GroupsState = { language: 'en', location: {} }
const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<Languages>) {
      state.language = action.payload
    },
    setLocation(state, action: PayloadAction<Partial<GroupsState['location']>>) {
      state.location = action.payload
    },
  },
})

export const { setLanguage, setLocation } = groupsSlice.actions

export default groupsSlice.reducer
