import React, { useState, useEffect } from 'react'
import haversine from 'haversine-distance'
import { Form, Button, Container, Col, Row } from 'react-bootstrap'

import { useRequest } from '../contexts/RequestProvider'
import GroupsTable from '../components/GroupsTable'
import { Group, Coord } from '../utils/types'
import GroupMap from '../components/GroupMap'
<<<<<<< HEAD
import CreateGroup from './CreateGroupPage'
=======
>>>>>>> b8447f190d27a139588dc9d3acb71c3f2345cc37
import { Link } from 'react-router-dom'
import useMapConfig from '../utils/useMapConfig'
import useDebouncedValue from '../utils/useDebounceValue'

function GroupsMapPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [postcode, setPostcode] = useState('')
  const [mapConfig, error] = useMapConfig(useDebouncedValue(200, postcode))
  const request = useRequest()

  useEffect(() => {
    request('/dev/groups').then(setGroups)
  }, [])

  const sortedByDistance = groups
    .map(g => ({
      ...g,
      distance: haversine(mapConfig.center, g.location_coord),
    }))
    .sort((a, b) => (a.distance > b.distance ? 1 : -1))

  return (
    <div>
      <div className="postcode-form">
<<<<<<< HEAD
        {!postcodeOverlay ? (
          <Form>
            <Form.Row>
              <Col xs={8} md={8}>
                <Form.Group className="postcode-input">
                  <Form.Control
                    onChange={handlePostcodeChange}
                    type="text"
                    placeholder="Enter postcode..."
                  />
                </Form.Group>
                <Form.Text className="text-muted">{postcodeError}</Form.Text>
              </Col>
              <Col xs={4} md={2}>
                <Button className="button-search" onClick={verifyPostcode} variant="primary">
                  Search
                </Button>
              </Col>
              <Col className="d-flex flex-row-reverse" xs={12} md={2}>
                <Link to="/create-group">
                  <Button variant="secondary">Add group</Button>
                </Link>
              </Col>
            </Form.Row>
          </Form>
        ) : (
          <div>
            <h4>Showing groups nearest to {postcode}</h4>
            <a onClick={() => setPostcodeOverlay(false)}>Use a different postcode</a>
          </div>
        )}
=======
        <div>
          <h4>Showing groups nearest to {postcode}</h4>
          {/* <a onClick={() => setPostcodeOverlay(false)}>Use a different postcode</a> */}
        </div>
        <Form>
          <Form.Row>
            <Col xs={8} md={5} mb={3}>
              <Form.Group className="postcode-input">
                <Form.Control
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPostcode(e.target.value)}
                  type="text"
                  placeholder="Enter postcode..."
                />
              </Form.Group>
              <Form.Text className="text-muted">{error ? 'Invalid postcode' : ''}</Form.Text>
            </Col>
            <Col className="d-flex flex-row-reverse" xs={12} md={4}>
              <Link to="/create-group">
                <Button variant="light">Add group</Button>
              </Link>
            </Col>
          </Form.Row>
        </Form>
>>>>>>> b8447f190d27a139588dc9d3acb71c3f2345cc37
      </div>

      <br />
      <GroupMap groups={sortedByDistance} center={mapConfig.center} zoom={mapConfig.zoom} />
      <GroupsTable groups={sortedByDistance} />
    </div>
  )
}

export default GroupsMapPage
