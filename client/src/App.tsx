import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import GroupsMapPage from './pages/GroupsMapPage'
import CreateGroupPage from './pages/CreateGroupPage'

import EditGroup from './pages/EditPage'
import Layout from './components/Layout'

function inIframe() {
  try {
    return window.self !== window.top
  } catch (e) {
    return true
  }
}

function App() {
  return (
    <div
      style={{ width: '100%', height: '100%' }}
      className={inIframe() ? 'App' : 'App-Standalone'}
    >
      <Router>
        <Layout>
          <Switch>
            <Route path="/create-group" component={CreateGroupPage} />
            <Route path="/group/:id" component={EditGroup} />
            <Route path="/" component={GroupsMapPage} />
          </Switch>
        </Layout>
      </Router>
    </div>
  )
}

export default App
