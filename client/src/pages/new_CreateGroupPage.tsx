import { Link, useHistory } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import React, { useState } from 'react'

import { useRequest } from '../contexts/RequestProvider'
import { gtag } from '../utils/gtag'
import EditGroup from '../components/EditGroup'
import { Group } from '../utils/types'

const CreateGroup = () => {
  const request = useRequest()
  const history = useHistory()
  const [group, setGroup] = useState<Group>({
    name: '',
    location_name: '',
    link_facebook: '',
    location_coord: {
      lat: 0,
      lng: 0,
    },
  })

  const [requestError, setRequestError] = useState('')
  const [sucessModal, setSuccessModal] = useState(false)

  return (
    <div style={{ width: '100%', padding: '1.5rem' }}>
      {sucessModal ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#28a745' }}>
          <h3>Thanks for submitting your group</h3>
        </div>
      ) : (
        <Form
          style={{ maxWidth: '50rem', margin: '0 auto' }}
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            gtag('event', 'Added Group', {
              event_category: 'Group',
              event_label: 'Clicked add group button',
            })

            request(`/group/create`, {
              method: 'POST',
              body: JSON.stringify(group),
            })
              .then(() => {
                setSuccessModal(true)
                setTimeout(() => history.push('/'), 3000)
              })
              .catch(err => {
                setRequestError('There was an error processing your request, please try again.')
              })
          }}
        >
          <EditGroup initGroup={group} onChange={setGroup} />
          {requestError.length > 0 && <Form.Text className="text-danger">{requestError}</Form.Text>}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Link to="/" style={{ marginRight: '1rem' }}>
              <Button variant="light">Cancel</Button>
            </Link>
            <Button variant="primary" type="submit">
              Add Group
            </Button>
          </div>
        </Form>
      )}
    </div>
  )
}

export default CreateGroup
