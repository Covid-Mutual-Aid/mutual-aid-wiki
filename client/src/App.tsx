import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'

import { useRequest } from './contexts/RequestProvider'
import GroupsTable from './components/GroupsTable'
import { Group } from './utils/types'
import GroupMap from './components/GroupMap'

function App() {
  const [groups, setGroups] = useState<Group[]>([])
  const request = useRequest()

  useEffect(() => {
    request('/dev/groups').then(setGroups)
  }, [])

  const verifyPostcode = (postcode: string) => {
    fetch('api.postcodes.io/postcodes/' + postcode).then(data => {
      console.log(data)
    })
  }

  return (
    <div className="App">
      <header className="App-header">
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Postcode</Form.Label>
            <Form.Control type="email" placeholder="Enter postcode..." />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>

        <br />
        <GroupMap groups={groups} />
        <GroupsTable groups={groups} />
      </header>
    </div>
  )
}

export default App
