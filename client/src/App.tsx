import React, { useState, useEffect } from 'react'
import { useRequest } from './contexts/RequestProvider'
import GroupsTable from './components/GroupsTable'
import { Group } from './utils/types'

function App() {
  const [groups, setGroups] = useState<Group[]>([])
  const request = useRequest()

  useEffect(() => {
    request('/dev/groups').then(setGroups)
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <GroupsTable groups={groups} />
      </header>
    </div>
  )
}

export default App
