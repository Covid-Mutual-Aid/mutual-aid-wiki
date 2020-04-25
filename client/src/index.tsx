import { BrowserRouter as Router } from 'react-router-dom'
import * as Sentry from '@sentry/browser'
import ReactDOM from 'react-dom'
import React from 'react'
import 'promise-polyfill/src/polyfill'
import 'whatwg-fetch'

import './styles/index.css'

import RequestProvider from './contexts/RequestProvider'
import * as serviceWorker from './utils/serviceWorker'

import StateProviderOld from './contexts/StateContext'
import StateProvider from './state/StateProvider'
import DataProvider from './contexts/DataProvider'
import MapProvider from './contexts/MapProvider'
import inIframe from './utils/inIframe'
import { gtag } from './utils/gtag'

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
  current.endpoint = 'http://staging.mutualaid.wiki/api'
}

const request = <T extends any>(input: RequestInfo, init?: RequestInit, accum = 0): Promise<T> =>
  fetch(current.endpoint + input, init).then((x) => {
    if (!x.ok) return Promise.reject(x.statusText)
    return (x.json && x.json()) || x
  })

const render = () => {
  const App = require('./App').default
  ReactDOM.render(
    <Router>
      <RequestProvider request={request}>
        <StateProvider>
          <DataProvider>
            <StateProviderOld>
              <I18nProvider>
                <MapProvider>
                  <App />
                </MapProvider>
              </I18nProvider>
            </StateProviderOld>
          </DataProvider>
        </StateProvider>
      </RequestProvider>
    </Router>,
    document.getElementById('root')
  )
}
render()

if (process.env.NODE_ENV === 'development' && (module as any).hot) {
  ;(module as any).hot.accept('./App', render)
}
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
