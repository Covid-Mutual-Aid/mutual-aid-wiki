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

function GroupsMapPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [postcode, setPostcode] = useState('')
  const [postcodeError, setPostcodeError] = useState('')
  const [postcodeOverlay, setPostcodeOverlay] = useState(false)

  // const [mapConfig, error] = useMapConfig(useDebouncedValue(200, postcode))

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

  const verifyPostcode = () => {
    fetch('https://api.postcodes.io/postcodes/' + postcode)
      .then(response => {
        return response.json()
      })
      .then(data => {
        if (!data.result) {
          setPostcodeError('Invalid postcode, please try again')
          return
        }
        console.log(data)
        setPostcode(data.result.postcode)

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

        setGroups(sortedByDistance)
      })
  }

  const handlePostcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostcode(e.target.value)
  }

  const resetHandler = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    setPostcodeOverlay(false)
    setMapConfig(ukMapConfig)
  }

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    verifyPostcode()
  }

  return (
    <div>
      <div className="postcode-form">
        {!postcodeOverlay ? (
          <Form onSubmit={submitHandler}>
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
            <a className="blue" onClick={resetHandler}>
              Use a different postcode
            </a>
          </div>
        )}
      </div>

      <br />
      <GroupMap groups={sortedByDistance} center={mapConfig.center} zoom={mapConfig.zoom} />
      <GroupsTable groups={sortedByDistance} />
    </div>
  )
}

export default GroupsMapPage
