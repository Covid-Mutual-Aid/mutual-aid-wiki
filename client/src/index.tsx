import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'
import { BrowserRouter as Router } from 'react-router-dom'

import 'promise-polyfill/src/polyfill'
import 'whatwg-fetch'

import './styles/index.css'

import * as serviceWorker from './utils/serviceWorker'
import RequestProvider from './contexts/RequestProvider'

import App from './App'
import MapProvider from './contexts/MapProvider'
import DataProvider from './contexts/DataProvider'
import StateProvider from './contexts/StateContext'

Sentry.init({ dsn: 'https://54b6389bc04849729985b907d7dfcffe@sentry.io/5169267' })

const request = <T extends any>(input: RequestInfo, init?: RequestInit, accum = 0): Promise<T> =>
  fetch('/api/' + input, init).then((x) => x.json())

fetch('/api/group/get')
  .then((res) => res.json())
  .then((g) =>
    console.log(g.length > 0 ? 'Netlify redirect working: ' : 'Netlify redirect NOT working: ', g)
  )

const Render = () => (
  <Router>
    <RequestProvider request={request}>
      <DataProvider>
        <StateProvider>
          <MapProvider>
            <App />
          </MapProvider>
        </StateProvider>
      </DataProvider>
    </RequestProvider>
  </Router>
)

ReactDOM.render(<Render />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
