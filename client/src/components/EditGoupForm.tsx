import { Link } from 'react-router-dom'
import styled from 'styled-components'
import React from 'react'

import Form, { Control, useControl } from './FormControl'
import { InputGroup } from '../styles/styles'
import { Group } from '../utils/types'
import Location from './Location'

const EditGroupForm = ({
  group,
  setGroup,
}: {
  group: Partial<Omit<Group, 'id'>>
  setGroup: (x: Partial<Omit<Group, 'id'>>) => void
}) => {
  return (
    <Form
      onSubmit={(values) =>
        setGroup({
          name: values.name,
          link_facebook: values.link_facebook,
          ...values.location,
        })
      }
      initialValues={
        {
          ...group,
          location: { location_name: group?.location_name, location_coord: group.location_coord },
        } || {}
      }
    >
      {group.name && <Input name="name" init="" valid={(x) => x.length > 0 || ' '} />}
      {group.link_facebook && <Input name="link_facebook" init="" valid={validURL} />}
      {group.location_name && (
        <Control name="location" init={{ location_name: '' }}>
          {({ props: { value, onChange } }) => (
            <div style={{ marginTop: '2rem' }}>
              <Location
                onChange={(x) =>
                  onChange({ location_name: x.name, location_coord: { lat: x.lat, lng: x.lng } })
                }
                placeholder={value.location_name || 'e.g "SE14 4NW"'}
              />
            </div>
          )}
        </Control>
      )}
      <FormButtons>
        <Link to="/">
          <button className="btn-secondary" type="button">
            cancel
          </button>
        </Link>
        <button type="submit">submit</button>
      </FormButtons>
    </Form>
  )
}

export default EditGroupForm

const Input = <T extends any>({
  name,
  init,
  valid,
  ...inputProps
}: { name: string; init: T; valid?: (x: T) => string | true } & React.InputHTMLAttributes<
  HTMLInputElement
>) => {
  const { error, props } = useControl(name, init, valid)
  return (
    <div style={{ margin: '1rem 0' }}>
      <span style={{ width: '100%', paddingLeft: '.5rem', height: '.5rem' }}>{error}</span>
      <InputGroup>
        <input
          style={{
            backgroundColor: error ? 'rgba(255, 0, 0, 0.1)' : 'inherit',
          }}
          {...inputProps}
          {...props}
        />
      </InputGroup>
    </div>
  )
}

const FormButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem 0;

  button {
    margin: 0 0.4rem;
  }
`

export function validURL(str: string) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ) // fragment locator

  return !!pattern.test(str) || 'Invalid URL'
}
