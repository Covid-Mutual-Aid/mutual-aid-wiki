import { combineReducers } from '@reduxjs/toolkit'

import location from './location'
import groups from './groups'

const reducer = combineReducers({ groups, location })

export type RootState = ReturnType<typeof reducer>

export default reducer
