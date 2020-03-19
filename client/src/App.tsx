import React, { useState, useEffect } from 'react'
import haversine from 'haversine-distance'
import { Form, Button, Container, Fade } from 'react-bootstrap'

import { useRequest } from './contexts/RequestProvider'
import GroupsTable from './components/GroupsTable'
import { Group, Coord } from './utils/types'
import GroupMap from './components/GroupMap'
import CreateGroup from './components/CreateGroup'

type MapConfig = {
  center: Coord
  zoom: number
}

function App() {
  const [groups, setGroups] = useState<Group[]>([])
  const [postcode, setPostcode] = useState('')
  const [postcodeOverlay, setPostcodeOverlay] = useState(false)
  const [mapConfig, setMapConfig] = useState<MapConfig>({
    center: {
      lat: 55.3781,
      lng: -3.436,
    },
    zoom: 5,
  })

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
        setMapConfig({
          center: user,
          zoom: 11,
        })
        setPostcodeOverlay(true)
        const sortedByDistance = groups
          .map(g => ({
            ...g,
            distance: haversine(user, g.location_coord),
          }))
          .sort((a, b) => (a.distance > b.distance ? 1 : -1))
        // .map(g => ({
        //   name: g.name,
        //   link_facebook: g.link_facebook,
        //   location_name: g.location_name,
        //   location_coord: g.location_coord,
        // }))

        setGroups(sortedByDistance)
      })
  }

  const handlePostcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostcode(e.target.value)
  }

  return (
    <div className="App">
      <header className="App-header">
        <Container className="postcode-form">
          {!postcodeOverlay ? (
            <Form>
              <Form.Group>
                <Form.Control
                  onChange={handlePostcodeChange}
                  type="text"
                  placeholder="Enter postcode..."
                />
              </Form.Group>
              <Button onClick={verifyPostcode} variant="primary">
                Submit
              </Button>
            </Form>
          ) : (
            <div>
              <h4>Showing groups nearest to {postcode}</h4>
              <a onClick={() => setPostcodeOverlay(false)}>Use a different postcode</a>
            </div>
          )}
        </Container>

        <br />
        <GroupMap groups={groups} center={mapConfig.center} zoom={mapConfig.zoom} />
        <GroupsTable groups={groups} />
      </header>
    </div>
  )
}

export default App
