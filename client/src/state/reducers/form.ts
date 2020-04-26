import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Group } from '../../utils/types'

type Form = {
  values: Partial<Group>
  errors: Partial<{ [Key in keyof Group]: string | true }>
}

let initialState: Form = { values: {}, errors: {} }
const formSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    reset(state) {
      state.values = {}
      state.errors = {}
    },
    updateForm(state, action: PayloadAction<Form>) {
      state.values = { ...state.values, ...action.payload.values }
      state.errors = { ...state.errors, ...action.payload.errors }
    },
    updateValues(state, action: PayloadAction<Form['values']>) {
      state.values = { ...state.values, ...action.payload }
    },
    updateErrors(state, action: PayloadAction<Form['errors']>) {
      state.errors = { ...state.errors }
    },
  },
})

export const { reset, updateValues, updateErrors, updateForm } = formSlice.actions

export default formSlice.reducer
