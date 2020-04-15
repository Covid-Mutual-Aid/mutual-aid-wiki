import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'

import { useRequest } from '../contexts/RequestProvider'
import { GroupWithEmails } from '../utils/types'
import { InputGroup } from '../styles/styles'
import styled from 'styled-components'
import Location from '../components/Location'
import EditGroupForm from '../components/EditGroup'

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

  const [ready, setReady] = useState(false)
  const [sucessModal] = useState(false)

  useEffect(() => {
    request(`/group/get?id=${id}`).then(setGroup)
  }, [id, request])
  console.log(group)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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
    <Wrapper>
      {sucessModal ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#28a745' }}>
          <h3>Thanks for submitting your group</h3>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <EditGroupForm
            onChange={() => setGroup}
            onComplete={() => setReady(true)}
            initGroup={group}
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
