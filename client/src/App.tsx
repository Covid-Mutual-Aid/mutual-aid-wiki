import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import GroupsMapPage from './pages/GroupsMapPage'
import CreateGroupPage from './pages/CreateGroupPage'

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/create-group">
            <CreateGroupPage />
          </Route>
          <Route path="/">
            <GroupsMapPage />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
