import { BrowserRouter as Router } from 'react-router-dom'
import { render, fireEvent } from '@testing-library/react'
import React from 'react'

import RequestProvider from '../../contexts/RequestProvider'
import I18nProvider from '../../contexts/I18nProvider'
import StateProvider from '../../state/StateProvider'
import GroupForm from './index'

const Render = ({ onSave, req }: { onSave?: any; req?: any }) => (
  <Router>
    <RequestProvider request={req || (() => Promise.resolve())}>
      <StateProvider>
        <I18nProvider>
          <GroupForm onSave={onSave || (() => {})} />
        </I18nProvider>
      </StateProvider>
    </RequestProvider>
  </Router>
)

const getInputFields = (base: HTMLElement) => {
  const [name, link_facebook, emails, _, email, phone, location] = Array.from(
    base.querySelectorAll('input')
  )
  return { name, link_facebook, emails, email, phone, location }
}
it('should show validation error when submited without any input', async () => {
  const p = render(<Render />)
  expect(!!p.getByTestId('validation-error').textContent).toBe(false)
  fireEvent.click(p.baseElement.querySelector('[name=submit]') as HTMLButtonElement)
  expect(!!p.getByTestId('validation-error').textContent).toBe(true)
})

const mocGroup = {
  name: 'NAME',
  link_facebook: 'www.mock.com',
  emails: ['mock@mock.com'],
  location_name: 'LOCATION',
  location_coord: { lat: 1, lng: 1 },
  description: 'Some description',
  contact: { email: 'm@m.com', phone: '1111' },
}
it('should show validation error when submited without link, name or email', async () => {
  const onSave = jest.fn()
  const req = (input: string) => {
    if (/placeSuggest/.test(input))
      return Promise.resolve([{ place_id: 'ID', description: mocGroup.location_name }])
    if (/placeDetails/.test(input))
      return Promise.resolve({
        label: mocGroup.location_name,
        geometry: { location: mocGroup.location_coord },
      })
    return Promise.reject('Unknown rout')
  }
  const p = render(<Render onSave={onSave} req={req} />)
  const { name, link_facebook, emails, location, phone, email } = getInputFields(p.baseElement)
  const submit = p.baseElement.querySelector('[name=submit]') as HTMLButtonElement
  // Name
  fireEvent.change(name, { target: { value: mocGroup.name } })
  fireEvent.click(submit)
  expect(!!p.getByTestId('validation-error').textContent).toBe(true)
  expect(onSave.mock.calls).toEqual([])

  // Link
  fireEvent.change(link_facebook, { target: { value: mocGroup.link_facebook } })
  fireEvent.click(submit)
  expect(!!p.getByTestId('validation-error').textContent).toBe(true)
  expect(onSave.mock.calls).toEqual([])

  // Emails
  fireEvent.change(emails, { target: { value: mocGroup.emails[0] } })
  fireEvent.keyDown(emails, { key: 'Tab', code: 'Tab' })
  fireEvent.click(submit)
  expect(!!p.getByTestId('validation-error').textContent).toBe(true)
  expect(onSave.mock.calls).toEqual([])

  // Location
  fireEvent.change(location, { target: { value: 'fake' } })
  await new Promise((res) => setTimeout(res, 300))
  fireEvent.click(p.getByText(mocGroup.location_name))
  await new Promise((res) => setTimeout(res, 300))

  // Description
  fireEvent.change(p.baseElement.querySelector('[name=description]') as HTMLElement, {
    target: { value: mocGroup.description },
  })

  //Contact
  fireEvent.change(phone, { target: { value: mocGroup.contact.phone } })
  fireEvent.change(email, { target: { value: mocGroup.contact.email } })

  // Contact
  fireEvent.click(submit)
  expect(onSave.mock.calls[0]).toEqual([mocGroup])
})
