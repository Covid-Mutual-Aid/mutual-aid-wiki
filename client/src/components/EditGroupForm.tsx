import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import Form, { Control, useControl } from './FormControl'
import ValuesListener from './FormControl/ValuesListener'
import { InputGroup } from '../styles/styles'
import { isTruthy, head } from '../utils/fp'
import EmailsInput from './EmailsInput'
import { Group } from '../utils/types'
import Location from './Location'

const EditGroupForm = ({
  group,
  onSave,
  isLoading = false,
  children,
}: {
  group: Partial<Omit<Group, 'id'>>
  onSave: (x: Partial<Omit<Group, 'id'>>) => void
  isLoading?: boolean
  children?: React.ReactNode
}) => {
  const [error, setError] = useState<string>()
  const [initialValues, setInitialValues] = useState({
    ...group,
    location: { location_name: group?.location_name, location_coord: group.location_coord },
  })

  const clearError = useCallback(() => setError(undefined), [])
  return (
    <Form
      style={{ width: '100%' }}
      onSubmit={(values, errors) => {
        if (errors && errors.length > 0) {
          setError(head(errors)[1])
          setInitialValues(values)
        }
        return (
          !isLoading &&
          onSave({
            name: values.name,
            link_facebook: values.link_facebook,
            ...values.location,
          })
        )
      }}
      initialValues={initialValues || {}}
    >
      <ValuesListener onChange={(x) => (error ? clearError() : null)} />
      {isTruthy(group.name) && (
        <Input
          disabled={isLoading}
          name="name"
          init=""
          valid={(x) => x.length > 0 || 'Must provide a group name'}
          placeholder="Group name"
        />
      )}

      {isTruthy(group.link_facebook) && (
        <Input
          disabled={isLoading}
          name="link_facebook"
          init=""
          valid={(x) => validURL(x) || 'Must provide valid Group URL'}
          placeholder="https://www.f..."
        />
      )}

      {isTruthy(group.emails) && (
        <Control
          name="emails"
          init={[] as string[]}
          valid={(x) => (x.length > 0 ? true : 'Must provide at least one email')}
        >
          {({ props, error }) => (
            <div>
              <Description>
                Enter any emails for people you want to give access to edit this group{' '}
                <small style={{ color: 'grey' }}>(These will not be public)</small>
              </Description>
              <EmailsInput emails={props.value} onChange={props.onChange} />
            </div>
          )}
        </Control>
      )}

      {isTruthy(group.location_name) && (
        <Control name="location" init={{ location_name: '' }}>
          {({ props: { value, onChange } }) => (
            <div style={{ marginTop: '2rem', opacity: isLoading ? '.8' : 1 }}>
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
          <button className="btn-secondary" type="button" disabled={isLoading}>
            cancel
          </button>
        </Link>
        <button type="submit" disabled={isLoading}>
          submit
        </button>
      </FormButtons>
      {error && <Error>{error}</Error>}
      {children}
    </Form>
  )
}

export default EditGroupForm

const Input = <T extends any>({
  name,
  init,
  valid,
  description,
  ...inputProps
}: {
  name: string
  init: T
  description?: string
  valid?: (x: T) => string | true
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  const { error, props } = useControl(name, init, valid)
  return (
    <div style={{ margin: '1rem 0' }}>
      {description && <Description>{description}</Description>}
      {/* <Error>{error}</Error> */}
      <InputGroup>
        <input
          style={{
            backgroundColor: error ? 'inherit' : 'rgba(0, 255, 0, 0.05)',
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

const Description = styled.p`
  padding: 0 1rem;
  margin: 0.5rem 0rem 0.5rem 0rem;
`

const Error = styled(Description)`
  color: gray;
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

  return !!pattern.test(str)
}