import { Form, Button, Col, Container } from 'react-bootstrap'
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
  const { locate, error, name } = useLocationSearch()
  const [{ center, group }] = useMapState()

  const sortedByDistance = groups
    .map(g => ({
      ...g,
      distance: haversine(center, g.location_coord),
    }))
    .sort((a, b) => (a.distance > b.distance ? 1 : -1))

  const request = useRequest()

  useEffect(() => {
    request('/group/get')
      .then(setGroups)
      .catch(console.log)
  }, [request])

  return (
    <>
      <div className="place-form">
        {!placeOverlay ? (
          <Container className="search-padding">
            <Form
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault()
                locate(place)
              }}
            >
              <Form.Row>
                <Col>
                  <Form.Text className="text-muted">{error}</Form.Text>
                </Col>
              </Form.Row>
              <Form.Row>
                <Col xs={12} md={8} className="input-height">
                  <Form.Group className="place-input">
                    <Form.Control
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPlace(e.target.value)
                      }
                      type="text"
                      placeholder="Enter place..."
                    />
                  </Form.Group>
                </Col>
                <Col xs={7} md={2} className="input-height">
                  <Button
                    className="full-width"
                    onClick={() => locate(place)}
                    variant="primary"
                    // size="sm"
                  >
                    Search
                  </Button>
                </Col>
                <Col xs={5} md={2} className="input-height">
                  <Link to="/create-group">
                    <Button className="full-width" variant="secondary">
                      Add Group
                    </Button>
                  </Link>
                  {/* Maintain Google Doc as primary source of info */}
                  {/* <a
                    target="_blank"
                    href="https://docs.google.com/forms/d/e/1FAIpQLSdJrgqHazomhDsJDG3Nnye30Ys7sZEl-APCrQh80D1g-iQrgQ/viewform"
                  >
                    <Button
                      style={{ whiteSpace: 'nowrap' }}
                      className="full-width"
                      variant="secondary"
                    >
                      Add Group
                    </Button>
                  </a> */}
                </Col>
              </Form.Row>
            </Form>
          </Container>
        ) : (
          <div>
            <h4>Showing groups nearest to {place}</h4>
            <button type="button" className="blue" onClick={() => setPlaceOverlay(false)}>
              Use a different place
            </button>
          </div>
        )}
      </div>

      <GroupMap groups={groups} />
      <div className="table-wrapper">
        <GroupsTable groups={sortedByDistance} shouldDisplayDistance={!!(group || name)} />
      </div>
    </>
  )
}

export default GroupsMapPage
