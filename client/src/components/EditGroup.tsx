import React, { useState, useEffect, useRef, useMemo } from 'react'
import { ReactMultiEmail, isEmail } from 'react-multi-email'
import 'react-multi-email/style.css'

import { GroupWithEmails } from '../utils/types'

import Location from './Location'
import EditEmails from './EditEmails'
import { InputGroup } from '../styles/styles'

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

const EditGroupForm = ({ initGroup, onChange, onComplete }: Props) => {
  const [email, setEmail] = useState('')
  const [group, setGroup] = useState<GroupWithEmails>(initGroup)

  const [validation, setValidation] = useState<Validation>({
    name: false,
    emails: false,
    link_facebook: false,
    location_name: false,
  })

  useEffect(() => {
    onChange(
      group,
      (Object.keys(validation) as Array<keyof Validation>).filter((k) => !validation[k])
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
      <h4>Enter group information</h4>
      <InputGroup>
        <input
          placeholder="Group name"
          value={group.name}
          onChange={(e) => setGroup({ ...group, name: e.target.value })}
        />
      </InputGroup>
      <h4>Enter any emails you want to associate with this group</h4>
      <InputGroup>
        <input
          placeholder="Enter an email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            setGroup((x) => ({ ...group, emails: [...x.emails, email] }))
            setEmail('')
          }}
        >
          add
        </button>
      </InputGroup>
      {group.emails.map((email, i) => (
        <InputGroup style={{ margin: '1rem 0' }} key={email + i}>
          <p style={{ padding: '0 .3rem', width: '100%' }}>{email}</p>
          <button
            type="button"
            onClick={() =>
              setGroup((x) => ({ ...group, emails: x.emails.filter((y) => y !== email) }))
            }
          >
            remove
          </button>
        </InputGroup>
      ))}

      <h4>Enter link to the group</h4>
      <InputGroup>
        <input
          placeholder="http..."
          value={group.link_facebook}
          onChange={(e) => setGroup({ ...group, link_facebook: e.target.value })}
        />
      </InputGroup>
      <h4>Enter location for the group</h4>

      <Location
        onChange={({ name, lat, lng }) => {
          setGroup((x) => ({ ...group, location_name: name, location_coord: { lat, lng } }))
        }}
        placeholder={'e.g "SE14 4NW"'}
      />
    </div>
  )
}

export default EditGroupForm
