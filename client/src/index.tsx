import React, { useCallback } from 'react'
import ReactDOM from 'react-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/index.css'
import * as serviceWorker from './utils/serviceWorker'
import RequestProvider from './contexts/RequestProvider'

import App from './App'

const Render = () => (
  <RequestProvider
    request={useCallback(
      (input: RequestInfo, init?: RequestInit) =>
        fetch('https://sn29v7uuxi.execute-api.eu-west-2.amazonaws.com' + input, init).then(x =>
          x.json()
        ),
      []
    )}
  >
    <App />
  </RequestProvider>
)

ReactDOM.render(<Render />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
