import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'

import 'promise-polyfill/src/polyfill'
import 'whatwg-fetch'

import './styles/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import * as serviceWorker from './utils/serviceWorker'
import RequestProvider from './contexts/RequestProvider'

import App from './App'
import MapProvider from './contexts/MapProvider'

Sentry.init({ dsn: 'https://54b6389bc04849729985b907d7dfcffe@sentry.io/5169267' })

const baseUrl = 'https://sn29v7uuxi.execute-api.eu-west-2.amazonaws.com/dev'

const request = <T extends any>(input: RequestInfo, init?: RequestInit, accum = 0): Promise<T> =>
  fetch(baseUrl + input, init)
    .then(x => x.json())
    .catch(err => {
      if (accum > 2) return Promise.reject(err)
      return new Promise(res => setTimeout(res, 500 * accum * accum)).then(() =>
        request(input, init, accum + 1)
      )
    })

const Render = () => (
  <RequestProvider request={request}>
    <MapProvider>
      <App />
    </MapProvider>
  </RequestProvider>
)

ReactDOM.render(<Render />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
