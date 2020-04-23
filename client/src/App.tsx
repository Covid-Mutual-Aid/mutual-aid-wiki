import { Switch, Route } from 'react-router-dom'
import React from 'react'

import Groups from './pages/Groups'
import About from './pages/About'

import CreateGroup from './pages/CreateGroup'
import EditGroup from './pages/EditGroup'
import EmailAuth from './pages/EmailAuth'
import Report from './pages/Report'
import PolygonMap from './components/Maps/PolygonMap'

function App() {
  return (
    <Switch>
      <Route path="/about" component={About} />
      <Route path="/add-group" component={CreateGroup} />
      <Route path="/polygon" component={PolygonMap} />
      <Route path="/edit/:id/:token" component={EditGroup} />
      <Route path="/edit/:id" component={EmailAuth} />
      <Route path="/report/:id" component={Report} />
      <Route path="/" component={Groups} />
    </Switch>
  )
}

export default App
