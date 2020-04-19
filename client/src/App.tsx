import { Switch, Route } from 'react-router-dom'
import React from 'react'

import Groups from './pages/Groups'
import About from './pages/About'

import EditGroup from './pages/EditGroup'
import AddGroup from './pages/AddGroup'
import EmailAuth from './pages/EmailAuth'
import Report from './pages/Report'

function App() {
  return (
    <Switch>
      <Route path="/about" component={About} />
      <Route path="/add-group" component={AddGroup} />
      <Route path="/edit/:id/:token" component={EditGroup} />
      <Route path="/edit/:id" component={EmailAuth} />
      <Route path="/report/:id" component={Report} />
      <Route path="/" component={Groups} />
    </Switch>
  )
}

export default App
