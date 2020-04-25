import { combineReducers } from '@reduxjs/toolkit'
import groups from './groups'
import location from './location'

const rootReducer = combineReducers({ groups, location })

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
