import { Provider } from 'react-redux'
import React from 'react'

import InitialRequests from './InitialRequests'
import store from './store'

const StateProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <InitialRequests />
      {children}
    </Provider>
  )
}

export default StateProvider
