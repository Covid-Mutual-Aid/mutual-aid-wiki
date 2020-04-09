import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import React from 'react'

import Layout from './pages/Layout'
import CreateGroupPage from './pages/CreateGroupPage'
import GroupsMapPage from './pages/GroupsMapPage'
import EditGroupPage from './pages/EditGroupPage'
import SearchesPage from './pages/SearchesPage'

import HeatMap from './components/HeatMap'

import NewLayout from './pages/NewLayout'
import SearchProvider from './contexts/SearchContext'

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/newlayout">
          <SearchProvider>
            <NewLayout />
          </SearchProvider>
        </Route>
        <Route path="/heatmap">
          <Layout>
            <HeatMap />
          </Layout>
        </Route>
        <Route path="/create-group">
          <Layout>
            <CreateGroupPage />
          </Layout>
        </Route>
        <Route path="/edit-group/:id">
          <Layout>
            <EditGroupPage />
          </Layout>
        </Route>
        <Route path="/searches">
          <Layout>
            <SearchesPage />
          </Layout>
        </Route>
        <Route path="/">
          <Layout>
            <GroupsMapPage />
          </Layout>
        </Route>
      </Switch>
    </Router>
  )
}

export default App
