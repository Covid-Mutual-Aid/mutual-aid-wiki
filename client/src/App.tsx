import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import GroupsMapPage from './pages/GroupsMapPage'
import CreateGroupPage from './pages/CreateGroupPage'

function inIframe() {
  try {
    return window.self !== window.top
  } catch (e) {
    return true
  }
}

function App() {
  return (
    <>
      <div className={`App ${inIframe() ? '' : 'App-Standalone'}`}>
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
      <div className="footer">
        <a target="_blank" href="https://github.com/Covid-Mutual-Aid/search-by-postcode">
          open sourced on github
        </a>
      </div>
    </>
  )
}

export default App
