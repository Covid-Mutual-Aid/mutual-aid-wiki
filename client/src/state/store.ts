import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import reducer from './reducers'

const store = configureStore({
  reducer,
  middleware: [
    ...getDefaultMiddleware({
      thunk: false,
      immutableCheck: false,
      serializableCheck: false,
    }),
  ],
})

if (process.env.NODE_ENV === 'development' && (module as any).hot) {
  ;(module as any).hot.accept('./reducers', () => {
    const newRootReducer = require('./reducers').default
    store.replaceReducer(newRootReducer)
  })
}

export type AppDispatch = typeof store.dispatch

export default store
