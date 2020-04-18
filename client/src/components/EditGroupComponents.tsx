import React, { useState, useEffect } from 'react'
import { ReactMultiEmail, isEmail } from 'react-multi-email'
import 'react-multi-email/style.css'

import { GroupWithEmails } from '../utils/types'

import Location from './Location'
import EditEmails from './EditEmails'
import { InputGroup } from '../styles/styles'
import styled from 'styled-components'
import { Input, validURL, validEmail } from './NewLayout/FormElements'

type Props = {
  group: GroupWithEmails
  omitKeys?: (keyof GroupWithEmails)[]
  onChange: (group: GroupWithEmails, validation: (keyof Validation)[]) => void
  onReady?: (group: GroupWithEmails) => void
}

export type Validation = {
  name: boolean
  emails: boolean
  link_facebook: boolean
  location_name: boolean
}

const EditGroupComponents = ({ group, omitKeys = [], onChange, onReady }: Props) => {
  const [validation, setValidation] = useState<Validation>({
    name: false,
    emails: false,
    link_facebook: false,
    location_name: false,
  })

  const groupValidated = (val: Validation) =>
    (Object.keys(val) as (keyof Validation)[])
      .filter((k) => !val[k])
      .filter((k) => !omitKeys.includes(k))

  useEffect(() => {
    console.log(validation, groupValidated(validation))
    if (onReady && groupValidated(validation).length === 0) {
      onReady(group)
    }
  }, [group])

  return (
    <Wrapper>
      {!omitKeys.includes('name') ? (
        <>
          <h4>Name</h4>
          <InputGroup>
            <Input
              placeholder="Group name"
              value={group.name}
              onChange={({ value, validated }) => {
                const v = { ...validation, name: validated }
                onChange({ ...group, name: value }, groupValidated(v))
                setValidation(v)
              }}
              validator={(s) => s.length > 0}
            />
          </InputGroup>
        </>
      ) : null}

      {!omitKeys.includes('emails') ? (
        <>
          <h4>Emails</h4>
          <ReactMultiEmail
            placeholder="yourname@mail.com..."
            emails={group.emails}
            onChange={(_emails: string[]) => {
              const v = { ...validation, emails: _emails.length > 0 }
              onChange({ ...group, emails: _emails }, groupValidated(v))
              setValidation(v)
            }}
            validateEmail={isEmail}
            getLabel={(email: string, index: number, removeEmail: (index: number) => void) => (
              <div data-tag key={index}>
                {email}
                <span data-tag-handle onClick={() => removeEmail(index)}>
                  ×
                </span>
              </div>
            )}
          />
        </>
      ) : null}

      {!omitKeys.includes('link_facebook') ? (
        <>
          <h4>Link</h4>
          <InputGroup>
            <Input
              placeholder="http://www..."
              value={group.link_facebook}
              onChange={({ value, validated }) => {
                const v = { ...validation, link_facebook: validated }
                onChange({ ...group, link_facebook: value }, groupValidated(v))
                setValidation(v)
              }}
              validator={validURL}
            />
          </InputGroup>
        </>
      ) : null}

      {!omitKeys.includes('location_name') ? (
        <>
          <h4>Location</h4>
          <Location
            onChange={({ name, lat, lng }) => {
              const v = { ...validation, location_name: name.length > 0 }
              onChange(
                { ...group, location_name: name, location_coord: { lat, lng } },
                groupValidated(v)
              )
              setValidation(v)
            }}
            placeholder={group.location_name.length > 0 ? group.location_name : 'e.g "SE14 4NW"'}
          />
        </>
      ) : null}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  min-width: 22rem;

  h4 {
    margin: 1.4rem 0 0.4rem 0.6rem;
    font-size: 1.2rem;
    color: rgba(0, 0, 0, 0.54);
  }
`

export default EditGroupComponents
