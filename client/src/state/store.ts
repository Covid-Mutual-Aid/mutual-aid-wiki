import { configureStore } from '@reduxjs/toolkit'

import reducer from './reducer'

const store = configureStore({
  reducer: reducer,
})

if (process.env.NODE_ENV === 'development' && (module as any).hot) {
  ;(module as any).hot.accept('./reducer', () => {
    const newRootReducer = require('./reducer').default
    store.replaceReducer(newRootReducer)
  })
}

export type AppDispatch = typeof store.dispatch

export default store
