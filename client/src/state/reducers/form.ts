import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Group } from '../../utils/types'

type Form = Partial<Group>

let initialState: Form = {}
const formSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    resetForm: () => ({}),
    updateForm: (state, action: PayloadAction<Form>) => ({ ...state, ...action.payload }),
  },
})

export const { resetForm, updateForm } = formSlice.actions

export default formSlice.reducer
