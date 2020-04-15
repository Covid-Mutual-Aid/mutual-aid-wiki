import { useParams, Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react'

import { useRequest } from '../contexts/RequestProvider'
import { GroupWithEmails } from '../utils/types'
import { InputGroup, EditPage, CenterAlign } from '../styles/styles'
import styled from 'styled-components'
import Location from '../components/Location'
import EditGroupForm from '../components/EditGroupForm'
import GroupItem from '../components/NewLayout/GroupItem'
import { spawn } from 'child_process'

const CreateGroup = () => {
  const request = useRequest()
  const { id, token } = useParams<{ id: string; token: string }>()

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

  const [sucessModal] = useState(false)
  const [ready, setReady] = useState(false)
  const [validation, setValidation] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    request(`/group/get?id=${id}`).then(setGroup)
  }, [id, request])
  console.log(group)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
    if (!ready) {
      alert('Please complete the form')
      return
    }
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
    <EditPage>
      <div className="main">
        <CenterAlign>
          {sucessModal ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#28a745' }}>
              <h3>Thanks for submitting your group</h3>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <EditGroupForm
                onChange={(group, validation) => {
                  setValidation(validation)
                  setGroup(group)
                }}
                onComplete={() => setReady(true)}
                initGroup={group}
              />

              <div style={{ display: submitted ? 'block' : 'none' }} className="validation">
                <label style={{ display: 'block', margin: '1.2rem 0 0.4rem 0' }}>
                  Please complete
                </label>
                {submitted &&
                  validation.map((key) => (
                    <span style={{ color: 'rgba(255, 0, 0, 0.6)', margin: '0 0.2rem' }}>
                      {key === 'link_facebook'
                        ? 'link'
                        : key === 'location_name'
                        ? 'location'
                        : key}
                    </span>
                  ))}
              </div>

              <Link to="/">
                <button type="button">cancel</button>
              </Link>
              <button type="submit">submit</button>
            </form>
          )}
        </CenterAlign>
      </div>
      <div className="preview">
        <CenterAlign>
          <div className="item">
            <GroupItem
              onSelect={() => null}
              selected={false}
              group={{ ...group, id: '1234567890' }}
            />
          </div>
        </CenterAlign>
      </div>
    </EditPage>
  )
}

export default CreateGroup
