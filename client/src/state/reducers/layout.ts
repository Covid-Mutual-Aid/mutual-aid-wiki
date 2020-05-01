import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '.'
import { useCallback } from 'react'

type Layout = {
  sidebar_open: boolean
}

let initialState: Layout = { sidebar_open: true }
const layoutSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    toggleSideBar: (state, action: PayloadAction<boolean | undefined>) => ({
      ...state,
      sidebar_open: action.payload || !state.sidebar_open,
    }),
  },
})

export default layoutSlice.reducer

export const useSideBar = (): [boolean, (x?: boolean) => void] => {
  const dispatch = useDispatch()
  const open = useSelector<RootState, boolean>((x) => x.layout.sidebar_open)
  return [
    open,
    useCallback((x?: boolean) => dispatch(layoutSlice.actions.toggleSideBar(x)), [dispatch]),
  ]
}
