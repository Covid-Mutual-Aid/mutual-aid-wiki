import { BrowserRouter as Router } from 'react-router-dom'
import { render, fireEvent } from '@testing-library/react'
import React from 'react'

import GroupForm from './index'
import StateProvider from '../../state/StateProvider'
import I18nProvider from '../../contexts/I18nProvider'

const Render = ({ onSave }: { onSave: any }) => (
  <Router>
    <StateProvider>
      <I18nProvider>
        <GroupForm onSave={onSave} />
      </I18nProvider>
    </StateProvider>
  </Router>
)

it('should show validation error when submited without data input', async () => {
  const onSave = jest.fn()
  const p = render(<Render onSave={onSave} />)
  expect(!!p.getByTestId('validation-error').textContent).toBe(false)
  fireEvent.click(p.getByRole('submit'))
  expect(!!p.getByTestId('validation-error').textContent).toBe(true)
})
