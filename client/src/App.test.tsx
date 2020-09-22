import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import RequestProvider from './contexts/RequestProvider'
import InitialRequests from './state/InitialRequests'
import SearchProvider from './contexts/SearchProvider'
import I18nProvider from './contexts/I18nProvider'
import StateProvider from './state/StateProvider'

import App from './App'
import { render, fireEvent } from '@testing-library/react'
import { Group } from './utils/types'

const Render = ({ request }: { request: any }) => (
  <Router>
    <RequestProvider request={request}>
      <StateProvider>
        <SearchProvider>
          <InitialRequests />
          <I18nProvider>
            <App />
          </I18nProvider>
        </SearchProvider>
      </StateProvider>
    </RequestProvider>
  </Router>
)

const mocGroup: Group = {
  id: 'one',
  name: 'some name',
  location_name: 'some location',
  link_facebook: 'www.link.com',
  links: [{ url: 'www.link.com' }],
  location_coord: { lat: 0, lng: 0 },
  location_country: 'UK',
}

test('Info box appears when group is selected', async () => {
  const request = (input: string, opt?: any) => {
    if (input === '/group/get') return Promise.resolve([mocGroup])
    console.log({ input, opt })
  }
  const p = render(<Render request={request} />)
  await new Promise((res) => setTimeout(res, 0))
  fireEvent.click(p.getAllByText('Find a group')[0])
  await new Promise((res) => setTimeout(res, 100))
})
