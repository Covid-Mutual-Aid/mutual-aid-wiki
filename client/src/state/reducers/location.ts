import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { RootState } from '.'

type Languages = 'en'
export type Location = {
  coord?: { lat: number; lng: number }
  zoom?: number
  name?: string
}

type LocationState = {
  language: Languages
  user?: Location & { countryCode?: string }
  search?: Location
}

let initialState: LocationState = { language: 'en' }
const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<Languages>) {
      state.language = action.payload
    },
    setUserLocation(state, action: PayloadAction<Partial<LocationState['user']>>) {
      state.user = action.payload ? { ...state.user, ...(action.payload || {}) } : undefined
    },
    setSearchLocation(state, action: PayloadAction<LocationState['search']>) {
      state.search = action.payload
    },
  },
})

export const { setLanguage, setUserLocation, setSearchLocation } = groupsSlice.actions

export default groupsSlice.reducer

export const useLocationState = () =>
  useSelector<RootState, Pick<LocationState, 'search' | 'user'>>((x) => ({
    search: x.location.search,
    user: x.location.user,
  }))
