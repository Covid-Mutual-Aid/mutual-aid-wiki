import { Form, Button, Col, Container } from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import haversine from 'haversine-distance'
import { Link, useLocation } from 'react-router-dom'

import { useRequest } from '../contexts/RequestProvider'
import GroupsTable from '../components/GroupsTable'
import GroupMap from '../components/GroupMap'

import { useMapState } from '../contexts/MapProvider'
import useLocationSearch from '../utils/useLocationSearch'
import { Group } from '../utils/types'
import { gtag } from '../utils/gtag'
import { useGroups } from '../contexts/GroupsContext'
import GroupsList from '../components/GroupsList'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

function GroupsMapPage() {
  const query = useQuery()
  const { groups } = useGroups()
  const [place, setPlace] = useState('')
  const [placeOverlay, setPlaceOverlay] = useState(false)
  const { locate, error, name } = useLocationSearch()
  const [{ center, group }] = useMapState()

  const sortedByDistance = groups
    .map((g) => ({
      ...g,
      distance: haversine(center, g.location_coord),
    }))
    .sort((a, b) => (a.distance > b.distance ? 1 : -1))

  const request = useRequest()
  const searchTerm = query.get('place')

  useEffect(() => {
    if (searchTerm && searchTerm.length > 0) locate(searchTerm)
  }, [searchTerm])

  return (
    <>
      <div className="place-form">
        {!placeOverlay ? (
          <Container className="search-padding">
            <Form
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault()
                gtag('event', 'Searched for a location', {
                  event_category: 'Map',
                  event_label: 'Clicked search button',
                })
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
                    onClick={() =>
                      gtag('event', 'Navigate to add group', {
                        event_category: 'Group',
                        event_label: 'Click add group button',
                      })
                    }
                    target="_blank"
                    href="https://docs.google.com/forms/d/e/1FAIpQLSdJrgqHazomhDsJDG3Nnye30Ys7sZEl-APCrQh80D1g-iQrgQ/viewform"
                  > */}
                  {/* <Button
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
        {/* <GroupsTable groups={sortedByDistance} shouldDisplayDistance={!!(group || name)} /> */}
        <GroupsList />
      </div>
    </>
  )
}

export default GroupsMapPage
