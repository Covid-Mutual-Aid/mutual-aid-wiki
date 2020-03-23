import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import GroupsMapPage from './pages/GroupsMapPage'
import CreateGroupPage from './pages/CreateGroupPage'
import { gtag } from './utils/gtag'

function inIframe() {
  try {
    return window.self !== window.top
  } catch (e) {
    return true
  }
}

function App() {
  useEffect(() => {
    if (!inIframe()) {
      gtag('event', 'Viewed on covidmutualaid.cc')
    }
  })

  return (
    <div className={inIframe() ? 'App' : 'App-Standalone'}>
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
      <div className="footer">
        <a target="_blank" href="https://github.com/Covid-Mutual-Aid/search-by-postcode">
          open sourced on github
        </a>
        <a href="mailto:covidmutualaid.cc@gmail.com">covidmutualaid.cc@gmail.com</a>
      </div>
    </div>
  )
}

export default App
