import { Switch, Route } from 'react-router-dom'
import React from 'react'

import Groups from './pages/Groups'
import About from './pages/About'
import Help from './pages/Help'

import EditGroup from './pages/EditGroup'
import AddGroup from './pages/AddGroup'
import EmailAuth from './pages/EmailAuth'

function App() {
  return (
    <Switch>
      <Route path="/help" component={Help} />
      <Route path="/about" component={About} />
      <Route path="/add-group" component={AddGroup} />
      <Route path="/edit/:id/:token" component={EditGroup} />
      <Route path="/edit" component={EmailAuth} />
      <Route path="/" component={Groups} />
    </Switch>
  )
}

export default App
