import { Switch, Route, Redirect } from 'react-router-dom'
import React from 'react'

import EmailAuth from './containers/Authenticate'
import MapLayout from './containers/Landing'
import Report from './containers/Report'
import About from './containers/About'
import LandingModal from './components/Information'
// import useLocalyStoredState from './utils/useLocallyStoredState'

function App() {
  // const [firstVisit, setFirstVisit] = useLocalyStoredState('firstVisit')
  // console.log(firstVisit)
  return (
    <Switch>
      <Route path="/landing" component={LandingModal} />
      <Route path="/about" exact component={About} />
      <Route path="/report/:id" exact component={Report} />
      <Route path="/edit/:id" exact component={EmailAuth} />
      <Route path="/information">
        <MapLayout showModal={true} />
      </Route>
      <Route
        path="/"
        render={() => {
          if (typeof true === 'undefined') {
            // setFirstVisit(false)
            return <Redirect to="/information" />
          }
          return <MapLayout showModal={false} />
        }}
      ></Route>
    </Switch>
  )
}

export default App
