import { combineReducers } from '@reduxjs/toolkit'

import location from './location'
import groups from './groups'
import layout from './layout'
import form from './form'

const reducer = combineReducers({ groups, location, form, layout })

export type RootState = ReturnType<typeof reducer>

export default reducer
