import React, { useState, useEffect, useRef } from 'react'

import { Group } from '../utils/types'
import { Form } from 'react-bootstrap'

import Location from '../components/Location'

// https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
function validURL(str: string) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ) // fragment locator
  return !!pattern.test(str)
}

type Props = {
  initGroup: Group
  onChange: (group: Group) => void
}

const EditGroup = ({ initGroup, onChange }: Props) => {
  const [group, setGroup] = useState(initGroup)
  const [linkValidationError, setLinkValidationError] = useState('')

  useEffect(() => {
    console.log(group)
    onChange(group)
  })

  return (
    <div>
      <Form.Group controlId="formBasicEmail">
        <Form.Text className="text-muted">
          {group.name.length === 0 ? `You'll need a name...` : ``}
        </Form.Text>
        <Form.Control
          value={group.name}
          placeholder="Group name"
          onChange={(e: any) => {
            setGroup({ ...group, name: e.target.value })
          }}
        />
      </Form.Group>
      <Form.Group>
        <Form.Text className="text-muted">{linkValidationError}</Form.Text>
        <Form.Control
          value={group.link_facebook}
          placeholder="Facebook link"
          onChange={(e: any) => {
            if (!validURL(e.target.value)) {
              setLinkValidationError(
                'Please enter a valid URL (the http bit is important), e.g https://www.facebook.com/groups/123456789'
              )
            } else {
              setLinkValidationError('')
            }
            setGroup({ ...group, link_facebook: e.target.value })
          }}
        />
      </Form.Group>
      <Form.Group>
        <Location
          onChange={({ name, lat, lng }) => {
            setGroup({ ...group, location_name: name, location_coord: { lat, lng } })
          }}
          placeholder={group.location_name}
        />
      </Form.Group>
    </div>
  )
}

export default EditGroup
