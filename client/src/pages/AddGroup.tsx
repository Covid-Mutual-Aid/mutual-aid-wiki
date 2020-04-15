import { useHistory } from 'react-router-dom'
import React, { useState } from 'react'
import styled from 'styled-components'

import { useRequest } from '../contexts/RequestProvider'
import { GroupWithEmails } from '../utils/types'
import EditGroupForm from '../components/EditGroup'
import GroupItem from '../components/NewLayout/GroupItem'

const CreateGroup = () => {
  const request = useRequest()
  const history = useHistory()
  const [ready, setReady] = useState(false)
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!ready) {
      alert('Please complete the form')
      return
    }
    request('/group/create', { method: 'POST', body: JSON.stringify(group) })
      .then((x) => {
        setSuccessModal(true)
        return new Promise((res) => setTimeout(res, 1000))
      })
      .then(() => history.replace('/'))
  }

  return (
    <Page>
      <div className="main">
        <CenterAlign>
          {sucessModal ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#28a745' }}>
              <h3>Thanks for submitting your group</h3>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <EditGroupForm
                onChange={setGroup}
                onComplete={() => setReady(true)}
                initGroup={group}
              />
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
    </Page>
  )
}

export default CreateGroup

const Page = styled.div`
  display: grid;
  grid: 1fr / 4fr 3fr;

  .main {
    border-right: 1px solid rgba(0, 0, 0, 0.1);
  }

  .item {
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0px 0px 22px -9px #959595;
    padding: 1rem;
    border-radius: 8px;
    width: 100%;
    min-width: 12rem;
    max-width: 22rem;
    margin: 2rem;
  }
`

const CenterAlign = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`
