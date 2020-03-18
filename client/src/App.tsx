import React, { useState, useEffect } from 'react'
import { useRequest } from './contexts/RequestProvider'

function App() {
  const [groups, setGroups] = useState<any[]>([])
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
        {groups.map((group, i) => (
          <div key={i}>
            <p>{group.name}</p>
            <a href={group.link}>{group.link}</a>
          </div>
        ))}
      </header>
    </div>
  )
}

export default App
