import { useHistory, useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'

import { useRequest } from '../contexts/RequestProvider'
import { Group, GroupWithEmails } from '../utils/types'
import { InputGroup } from '../styles/styles'
import styled from 'styled-components'
import Location from '../components/Location'

const CreateGroup = () => {
  const request = useRequest()
  const history = useHistory()
  const { id, token } = useParams<{ id: string; token: string }>()

  const [email, setEmail] = useState('')
  const [group, setGroup] = useState<GroupWithEmails>({
    name: '',
    emails: [],
    location_name: '',
    link_facebook: '',
    location_coord: {
      lat: 0,
      lng: 0,
    },
  })
  const [sucessModal, setSuccessModal] = useState(false)

  useEffect(() => {
    request(`/group/get?id=${id}`).then(setGroup)
  }, [id, request])
  console.log(group)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    request(`/group/update?token=${token}`, {
      method: 'POST',
      body: JSON.stringify(group),
    }).then((x) => {
      console.log(x)
      // setSuccessModal(true)
      // return new Promise((res) => setTimeout(res, 1000))
    })
    // .then(() => history.replace('/'))
  }

  return (
    <Wrapper>
      {sucessModal ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#28a745' }}>
          <h3>Thanks for submitting your group</h3>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
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
          <button type="submit">submit</button>
        </form>
      )}
    </Wrapper>
  )
}

export default CreateGroup

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  form {
    width: 100%;
    max-width: 30rem;
  }
  h4 {
    padding: 1.5rem 0rem 0.5rem 1rem;
    margin: 0;
  }
`
