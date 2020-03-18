import React, { useState, useEffect } from 'react'
import haversine from 'haversine-distance'
import { Form, Button } from 'react-bootstrap'

import { useRequest } from './contexts/RequestProvider'
import GroupsTable from './components/GroupsTable'
import { Group, Coord } from './utils/types'
import GroupMap from './components/GroupMap'

function App() {
  const [groups, setGroups] = useState<Group[]>([])
  const [postcode, setPostcode] = useState<String>('')
  const request = useRequest()

  useEffect(() => {
    request('/dev/groups').then(setGroups)
  }, [])

  const verifyPostcode = () => {
    fetch('https://api.postcodes.io/postcodes/' + postcode)
      .then(response => {
        return response.json()
      })
      .then(data => {
        const user = { lat: data.result.latitude, lng: data.result.longitude }
        const withDistance = groups
          .map(g => ({
            ...g,
            distance: haversine(user, g.location_coord),
          }))
          .sort((a, b) => (a.distance > b.distance ? 1 : -1))
          .map(g => ({
            name: g.name,
            link_facebook: g.link_facebook,
            location_name: g.location_name,
            location_coord: g.location_coord,
          }))

        setGroups(withDistance)
      })
  }

  const handlePostcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostcode(e.target.value)
  }

  return (
    <div className="App">
      <header className="App-header">
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Postcode</Form.Label>
            <Form.Control
              onChange={handlePostcodeChange}
              type="email"
              placeholder="Enter postcode..."
            />
          </Form.Group>
          <Button onClick={verifyPostcode} variant="primary">
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
