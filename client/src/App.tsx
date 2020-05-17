import React, { useEffect } from 'react'

import Information from './components/Information'
import EmailAuth from './containers/Authenticate'
import MapLayout from './containers/Landing'
import Report from './containers/Report'
import { Route } from 'react-router-dom'
import withModal from './components/withModal'

declare global {
  interface Window { Intercom: any }
}

const App = () => {
  useEffect(() => {
    window.Intercom("boot", {
      app_id: "f1tn2aqi"
    })
  }, [])

  return (
    <>
      <Information />
      <MapLayout />
      <Route path="/map/edit/:id" exact component={withModal(EmailAuth)} />
      <Route path="/map/report/:id" exact component={withModal(Report)} />
    </>
  )
}

export default App
