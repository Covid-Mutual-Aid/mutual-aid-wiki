import { Switch, Route } from 'react-router-dom'
import React from 'react'

import Groups from './pages/Groups'
import About from './pages/About'
import Help from './pages/Help'

import EditGroup from './pages/EditGroup'
import AddGroup from './pages/AddGroup'
import Layout from './pages/Layout'

const withLayout = (Comp: React.FC) => <T extends any>(props: T) => (
  <Layout>
    <Comp {...props} />
  </Layout>
)

function App() {
  return (
    <Switch>
      <Route path="/help" component={Help} />
      <Route path="/about" component={About} />
      <Route path="/add-group" component={withLayout(AddGroup)} />
      <Route path="/group/:groupId/edit" component={withLayout(EditGroup)} />
      <Route path="/" component={Groups} />
    </Switch>
  )
}

export default App
