import { Form, Button, Col } from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import haversine from 'haversine-distance'
import { Link } from 'react-router-dom'

import { useRequest } from '../contexts/RequestProvider'
import GroupsTable from '../components/GroupsTable'
import GroupMap from '../components/GroupMap'

import { useMapState } from '../contexts/MapProvider'
import useLocationSearch from '../utils/useLocationSearch'
import { Group } from '../utils/types'


function GroupsMapPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [place, setPlace] = useState('')
  const [placeOverlay, setPlaceOverlay] = useState(false)
  const { locate, error } = useLocationSearch();
  const { center, name } = useMapState();

  const sortedByDistance = groups
    .map(g => ({
      ...g,
      distance: haversine(center, g.location_coord),
    }))
    .sort((a, b) => (a.distance > b.distance ? 1 : -1))

  const request = useRequest()

  useEffect(() => {
    request('/group/get').then(setGroups).catch(console.log)
  }, [])

  return (
    <div>
      <div className="place-form">
        {!placeOverlay ? (
          <Form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            locate(place)
          }}>
            <Form.Row>
              <Col xs={8} md={8}>
                <Form.Group className="place-input">
                  <Form.Control
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlace(e.target.value)}
                    type="text"
                    placeholder="Enter place..."
                  />
                </Form.Group>
                <Form.Text className="text-muted">{error}</Form.Text>
              </Col>
              <Col xs={4} md={2}>
                <Button className="button-search" onClick={() => locate(place)} variant="primary">
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
              <h4>Showing groups nearest to {place}</h4>
              <a className="blue" onClick={() => setPlaceOverlay(false)}>
                Use a different place
            </a>
            </div>
          )}
      </div>

      <br />
      <GroupMap groups={groups} />
      <GroupsTable
        groups={sortedByDistance}
        shouldDisplayDistance={!!name}
      />
    </div>
  )
}

export default GroupsMapPage
