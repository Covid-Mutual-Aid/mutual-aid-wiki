import { Switch, Route } from 'react-router-dom'
import React from 'react'


import LocaleSwitcher from './components/LocaleSwitcher'

import Groups from './pages/Groups'
import About from './pages/About'

import CreateGroup from './pages/CreateGroup'
import EditGroup from './pages/EditGroup'
import EmailAuth from './pages/EmailAuth'
import Report from './pages/Report'

function App() {
  return (
    <div>
      <LocaleSwitcher />
      <Switch>
        <Route path="/about" component={About} />
        <Route path="/add-group" component={CreateGroup} />
        <Route path="/edit/:id/:token" component={EditGroup} />
        <Route path="/edit/:id" component={EmailAuth} />
        <Route path="/report/:id" component={Report} />
        <Route path="/" component={Groups} />
      </Switch>
    </div>
  )
}

export default App
