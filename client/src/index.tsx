import { BrowserRouter as Router } from 'react-router-dom'
import * as Sentry from '@sentry/browser'
import ReactDOM from 'react-dom'
import React from 'react'

import 'promise-polyfill/src/polyfill'
import 'whatwg-fetch'

import RequestProvider from './contexts/RequestProvider'
import SearchProvider from './contexts/SearchProvider'
import I18nProvider from './contexts/I18nProvider'
import StateProvider from './state/StateProvider'

import * as serviceWorker from './utils/serviceWorker'
import inIframe from './utils/inIframe'
import { gtag } from './utils/gtag'

import './styles/index.css'
import InitialRequests from './state/InitialRequests'

if (!inIframe()) {
  gtag('event', 'Viewed on covidmutualaid.cc', {
    event_category: 'Iframe',
    event_label: 'Viewed without iframe',
  })
}

let current = { endpoint: '/api' } as { endpoint: string | Promise<string> }
if ((window as any).location.host.includes('localhost')) {
  current.endpoint = fetch('http://localhost:4000/local/ping')
    .then((x) => (x.ok ? (current.endpoint = 'http://localhost:4000/local') : Promise.reject('')))
    .catch((err) => (current.endpoint = 'http://staging.mutualaid.wiki/api'))
} else {
  Sentry.init({ dsn: 'https://54b6389bc04849729985b907d7dfcffe@sentry.io/5169267' })
}

const request = <T extends any>(input: RequestInfo, init?: RequestInit, accum = 0): Promise<T> =>
  Promise.resolve(current.endpoint).then((endpoint) =>
    fetch(endpoint + input, init).then((x) => {
      if (!x.ok) return Promise.reject(x.statusText)
      return (x.json && x.json()) || x
    })
  )

;(window as any).Intercom('boot', {
  app_id: 'f1tn2aqi',
})

const render = () => {
  const App = require('./App').default
  ReactDOM.render(
    <Router>
      <RequestProvider request={request}>
        <StateProvider>
          <InitialRequests />
          <SearchProvider>
            <I18nProvider>
              <App />
            </I18nProvider>
          </SearchProvider>
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
