import { Switch, Route, Redirect } from 'react-router-dom'
import React from 'react'

import EmailAuth from './containers/Authenticate'
import MapLayout from './containers/Landing'
import Report from './containers/Report'
import About from './containers/About'

function App() {
  return (
    <Switch>
      <Route path="/about" exact component={About} />
      <Route path="/report/:id" exact component={Report} />
      <Route path="/edit/:id" exact component={EmailAuth} />
      <Route path="/" component={MapLayout} />
    </Switch>
  )
}

export default App
