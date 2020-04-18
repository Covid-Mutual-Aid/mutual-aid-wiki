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
  validation: (keyof Validation)[]
  omitKeys?: (keyof GroupWithEmails)[]
  onChange: (group: GroupWithEmails, validation: (keyof Validation)[]) => void
}

export type Validation = {
  name: boolean
  emails: boolean
  link_facebook: boolean
  location_name: boolean
}

const EditGroupComponents = ({ group, validation, omitKeys = [], onChange }: Props) => {
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
                onChange(
                  { ...group, name: value },
                  validated ? validation.filter((k) => k !== 'name') : [...validation, 'name']
                )
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
              onChange(
                { ...group, emails: _emails },
                _emails.length > 0
                  ? validation.filter((k) => k !== 'emails')
                  : [...validation, 'emails']
              )
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
              placeholder={group.location_name.length > 0 ? group.location_name : 'http://www...'}
              value={group.link_facebook}
              onChange={({ value, validated }) => {
                onChange(
                  { ...group, link_facebook: value },
                  validated
                    ? validation.filter((k) => k !== 'link_facebook')
                    : [...validation, 'link_facebook']
                )
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
              onChange(
                { ...group, location_name: name, location_coord: { lat, lng } },
                name.length > 0
                  ? validation.filter((k) => k !== 'location_name')
                  : [...validation, 'location_name']
              )
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
