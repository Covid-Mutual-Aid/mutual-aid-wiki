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

const compare = (a: Object, b: Object): boolean => JSON.stringify(a) === JSON.stringify(b)

const API_KEY = 'AIzaSyDD8gtVtIrx6A0FpaTb7WXy0r1tZR8iECg'
const ukMapConfig = {
  center: {
    lat: 55.3781,
    lng: -3.436,
  },
  zoom: 5,
}

function GroupsMapPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [place, setPlace] = useState('')
  const [placeError, setPlaceError] = useState('')
  const [placeOverlay, setPlaceOverlay] = useState(false)
  const [mapConfig, setMapConfig] = useState<MapConfig>(ukMapConfig)
  // const [mapConfig, error] = useMapConfig(useDebouncedValue(200, place))

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
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${place}&region=uk&key=${API_KEY}`
    )
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data.results.length === 0) {
          setPlaceError('Invalid location, please try again')
          return
        }

        const { formatted_address, geometry } = data.results[0]

        setPlaceOverlay(true)
        setPlace(formatted_address)
        setMapConfig({
          center: geometry.location,
          zoom: 11,
        })
      })
  }
  return (
    <div>
      <div className="place-form">
        {!placeOverlay ? (
          <Form
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault()
              verifyplace()
            }}
          >
            <Form.Row>
              <Col xs={8} md={8}>
                <Form.Group className="place-input">
                  <Form.Control
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setPlace(e.target.value)
                    }}
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
            <a
              className="blue"
              onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                setPlaceOverlay(false)
                setMapConfig(ukMapConfig)
              }}
            >
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
