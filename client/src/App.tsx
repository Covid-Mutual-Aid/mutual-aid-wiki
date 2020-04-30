import React from 'react'

import Information from './components/Information'
import EmailAuth from './containers/Authenticate'
import ModalRoute from './components/ModalRoute'
import MapLayout from './containers/Landing'
import Report from './containers/Report'

const App = () => (
  <>
    <Information />
    <MapLayout />
    <ModalRoute path="/map/edit/:id" exact component={EmailAuth} />
    <ModalRoute path="/map/report/:id" exact component={Report} />
  </>
)

export default App
