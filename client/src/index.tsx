import { BrowserRouter as Router } from 'react-router-dom'
import * as Sentry from '@sentry/browser'
import ReactDOM from 'react-dom'
import React from 'react'

import 'promise-polyfill/src/polyfill'
import 'whatwg-fetch'

import './styles/index.css'

import RequestProvider from './contexts/RequestProvider'
import * as serviceWorker from './utils/serviceWorker'

import StateProvider from './contexts/StateContext'
import DataProvider from './contexts/DataProvider'
import MapProvider from './contexts/MapProvider'
import inIframe from './utils/inIframe'
import { gtag } from './utils/gtag'
import App from './App'

import I18nProvider from './contexts/I18nProvider'

Sentry.init({ dsn: 'https://54b6389bc04849729985b907d7dfcffe@sentry.io/5169267' })

if (!inIframe()) {
  gtag('event', 'Viewed on covidmutualaid.cc', {
    event_category: 'Iframe',
    event_label: 'Viewed without iframe',
  })
}

let current = { endpoint: '/api' }
if ((window as any).location.host.includes('localhost')) {
  current.endpoint = '/dev'
}

const request = <T extends any>(input: RequestInfo, init?: RequestInit, accum = 0): Promise<T> =>
  fetch(current.endpoint + input, init).then((x) => {
    if (!x.ok) return Promise.reject(x.statusText)
    return (x.json && x.json()) || x
  })

const Render = () => (
  <Router>
    <RequestProvider request={request}>
      <DataProvider>
        <StateProvider>
          <I18nProvider>
            <MapProvider>
              <App />
            </MapProvider>
          </I18nProvider>
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
