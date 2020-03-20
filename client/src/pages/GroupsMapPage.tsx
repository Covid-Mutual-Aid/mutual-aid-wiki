import React, { useState, useEffect } from 'react'
import haversine from 'haversine-distance'
import { Form, Button, Container, Col, Row } from 'react-bootstrap'

import { useRequest } from '../contexts/RequestProvider'
import GroupsTable from '../components/GroupsTable'
import { Group, Coord } from '../utils/types'
import GroupMap from '../components/GroupMap'
import { Link } from 'react-router-dom'
import useMapConfig, { MapConfig } from '../utils/useMapConfig'
import useDebouncedValue from '../utils/useDebounceValue'

const API_KEY = 'AIzaSyDD8gtVtIrx6A0FpaTb7WXy0r1tZR8iECg'

function GroupsMapPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [place, setPlace] = useState('')
  const [placeError, setPlaceError] = useState('')
  const [placeOverlay, setPlaceOverlay] = useState(false)

  // const [mapConfig, error] = useMapConfig(useDebouncedValue(200, place))

  const ukMapConfig = {
    center: {
      lat: 55.3781,
      lng: -3.436,
    },
    zoom: 5,
  }

  const [mapConfig, setMapConfig] = useState<MapConfig>(ukMapConfig)

  const request = useRequest()

  useEffect(() => {
    request('/dev/group/get').then(setGroups)
  }, [])

  const sortedByDistance = groups
    .map(g => ({
      ...g,
      distance: haversine(mapConfig.center, g.location_coord),
    }))
    .sort((a, b) => (a.distance > b.distance ? 1 : -1))

  const verifyplace = () => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=${API_KEY}`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data.results.length === 0) {
          setPlaceError('Invalid location, please try again')
          return
        }

        const place = data.results[0]

        setPlace(place.formatted_address)

        const user = place.geometry.location
        setMapConfig({
          center: user,
          zoom: 11,
        })
        setPlaceOverlay(true)
        const sortedByDistance = groups
          .map(g => ({
            ...g,
            distance: haversine(user, g.location_coord),
          }))
          .sort((a, b) => (a.distance > b.distance ? 1 : -1))

        setGroups(sortedByDistance)
      })
  }

  const handleplaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlace(e.target.value)
  }

  const resetHandler = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    setPlaceOverlay(false)
    setMapConfig(ukMapConfig)
  }

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    verifyplace()
  }

  const compare = (a: Object, b: Object): boolean => JSON.stringify(a) === JSON.stringify(b)

  return (
    <div>
      <div className="place-form">
        {!placeOverlay ? (
          <Form onSubmit={submitHandler}>
            <Form.Row>
              <Col xs={8} md={8}>
                <Form.Group className="place-input">
                  <Form.Control
                    onChange={handleplaceChange}
                    type="text"
                    placeholder="Enter place..."
                  />
                </Form.Group>
                <Form.Text className="text-muted">{placeError}</Form.Text>
              </Col>
              <Col xs={4} md={2}>
                <Button className="button-search" onClick={verifyplace} variant="primary">
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
            <a className="blue" onClick={resetHandler}>
              Use a different place
            </a>
          </div>
        )}
      </div>

      <br />
      <GroupMap groups={sortedByDistance} center={mapConfig.center} zoom={mapConfig.zoom} />
      <GroupsTable
        groups={sortedByDistance}
        shouldDisplayDistance={!compare(ukMapConfig, mapConfig)}
      />
    </div>
  )
}

export default GroupsMapPage
