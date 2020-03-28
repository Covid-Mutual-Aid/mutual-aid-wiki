import React, { useState, useEffect, useRef, useMemo } from 'react'

import { GroupWithEmails } from '../utils/types'
import { Form, Badge } from 'react-bootstrap'

import Location from '../components/Location'
import EditEmails from './EditEmails'

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
  initGroup: GroupWithEmails
  onChange: (group: GroupWithEmails, validation: Array<keyof Validation>) => void
  onComplete?: (group: GroupWithEmails) => void
}

export type Validation = {
  name: boolean
  emails: boolean
  link_facebook: boolean
  location_name: boolean
}

const linkErrorMsg = 'A valid URL (the http bit is important)...'

const EditGroup = ({ initGroup, onChange, onComplete }: Props) => {
  const [group, setGroup] = useState(initGroup)
  const [validation, setValidation] = useState<Validation>({
    name: false,
    emails: false,
    link_facebook: false,
    location_name: false,
  })

  useEffect(() => {
    onChange(
      group,
      (Object.keys(validation) as Array<keyof Validation>).filter(k => !validation[k])
    )
    if (
      onComplete &&
      validation.name &&
      validation.emails &&
      validation.link_facebook &&
      validation.location_name
    ) {
      onComplete(group)
    }
  }, [group])

  useMemo(
    () =>
      setValidation({
        name: group.name.length !== 0,
        emails: group.emails.length !== 0,
        link_facebook: validURL(group.link_facebook),
        location_name: group.location_name.length !== 0,
      }),
    [group]
  )

  return (
    <div>
      <Form.Group>
        <Form.Text className="text-muted">
          {validation.name ? `` : `You'll need a name...`}
        </Form.Text>
        <Form.Control
          value={group.name}
          placeholder={`e.g "Mutual Aid Isolation Support Glasgow"`}
          onChange={(e: any) => {
            setGroup({ ...group, name: e.target.value })
          }}
        />
      </Form.Group>
      <EditEmails
        initEmails={group.emails}
        onChange={emails => setGroup((g: GroupWithEmails) => ({ ...group, emails }))}
      />
      <Form.Group>
        <Form.Text className="text-muted">{validation.link_facebook ? '' : linkErrorMsg}</Form.Text>
        <Form.Control
          value={group.link_facebook}
          placeholder={`e.g "https://www.facebook.com/groups/123456789"`}
          onChange={(e: any) => {
            setGroup({ ...group, link_facebook: e.target.value })
          }}
        />
      </Form.Group>
      <Form.Text className="text-muted">
        {validation.location_name ? '' : 'And a location.'}
      </Form.Text>
      <Form.Group>
        <Location
          onChange={({ name, lat, lng }) => {
            setGroup({ ...group, location_name: name, location_coord: { lat, lng } })
          }}
          placeholder={validation.location_name ? group.location_name : 'e.g "SE14 4NW"'}
        />
      </Form.Group>
    </div>
  )
}

export default EditGroup
