import { Switch, Route } from 'react-router-dom'
import React from 'react'

import MapLayout from './pages/MapLayout'
import EmailAuth from './pages/EmailAuth'
import Report from './pages/Report'
import About from './pages/About'

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
