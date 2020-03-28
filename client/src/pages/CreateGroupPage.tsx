import { Link, useHistory } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import React, { useState } from 'react'

import { useRequest } from '../contexts/RequestProvider'
import { gtag } from '../utils/gtag'
import EditGroup, { Validation } from '../components/EditGroup'
import { Group, GroupWithEmails } from '../utils/types'

const CreateGroup = () => {
  const request = useRequest()
  const history = useHistory()
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

  const [validation, setValidation] = useState<Array<keyof Validation>>([])

  const [isReady, setIsReady] = useState(false)
  const [triedToSubmit, setTriedToSubmit] = useState(false)

  const [requestError, setRequestError] = useState<[string, GroupWithEmails]>(['', group])
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
            setTriedToSubmit(true)
            if (!isReady) return

            gtag('event', 'Added Group', {
              event_category: 'Group',
              event_label: 'Clicked add group button',
            })

            request(`/group/create`, {
              method: 'POST',
              body: JSON.stringify(group),
            })
              .then(res => {
                console.log(res)
                if (res === 'Exists') {
                  setRequestError(['This group already exists.', group])
                  return
                }
                setSuccessModal(true)
                setTimeout(() => history.push('/'), 3000)
              })
              .catch(err => {
                setRequestError([
                  'There was an error processing your request, please try again.',
                  group,
                ])
              })
          }}
        >
          <EditGroup
            initGroup={group}
            onChange={(g, v) => {
              console.log(g)
              setGroup(g)
              setValidation(v)
            }}
            onComplete={() => setIsReady(true)}
          />

          {requestError[0].length > 0 &&
            JSON.stringify(group) === JSON.stringify(requestError[1]) && (
              <Form.Text className="text-danger">{requestError[0]}</Form.Text>
            )}
          {validation.length > 0 && triedToSubmit && requestError[0].length === 0 && (
            <Form.Text className="text-danger">
              Still need: {validation.map(v => `"` + v + `"` + ` `)}
            </Form.Text>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Link to="/" style={{ marginRight: '1rem' }}>
              <Button variant="light">Cancel</Button>
            </Link>
            <Button variant={isReady ? 'primary' : 'secondary'} type="submit">
              Add Group
            </Button>
          </div>
        </Form>
      )}
    </div>
  )
}

export default CreateGroup
