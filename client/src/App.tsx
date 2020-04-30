import { Route } from 'react-router-dom'
import React from 'react'

import Information from './components/Information'
import EmailAuth from './containers/Authenticate'
import withModal from './components/withModal'
import MapLayout from './containers/Landing'
import Report from './containers/Report'

const App = () => (
  <>
    <Information />
    <MapLayout />
    <Route path="/map/edit/:id" exact component={withModal(EmailAuth)} />
    <Route path="/map/report/:id" exact component={withModal(Report)} />
  </>
)

export default App
