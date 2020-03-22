import { Link, useHistory } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import React, { useState } from 'react'

import { useRequest } from '../contexts/RequestProvider'
import Location from '../components/Location'

// https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
function validURL(str: string) {
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

const CreateGroup = () => {
  const request = useRequest()
  const history = useHistory()
  const [valid, setValid] = useState(true)
  const [name, setName] = useState('')
  const [link, setLink] = useState('')
  const [location, setLocation] = useState<{ lat: string; lng: string; name: string } | null>(null)
  const [linkValidationError, setLinkValidationError] = useState('')
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
            if (!validURL(link)) {
              setLinkValidationError('Please enter a valid URL')
              return
            }
            if (!location || !link || !name) return setValid(false)
            request(`/group/create`, {
              method: 'POST',
              body: JSON.stringify({
                name,
                link_facebook: link,
                location_name: location?.name,
                location_coord: { lng: location.lng, lat: location.lat },
              }),
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
          <Form.Group controlId="formBasicEmail">
            <Form.Control placeholder="Group name" onChange={(e: any) => setName(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Text className="text-muted">{linkValidationError}</Form.Text>
            <Form.Control
              placeholder="Facebook link"
              onChange={(e: any) => setLink(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Location onChange={setLocation} placeholder={'Group location'} />
          </Form.Group>
          {!valid && <Form.Text className="text-muted">You must fill every field</Form.Text>}
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
