import { Link, useHistory } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import React, { useState } from 'react'

import { useRequest } from '../contexts/RequestProvider'
import Location from '../components/Location'

const CreateGroup = () => {
  const request = useRequest()
  const history = useHistory();
  const [valid, setValid] = useState(true)
  const [name, setName] = useState('')
  const [link, setLink] = useState('')
  const [location, setLocation] = useState<{ lat: string; lng: string; name: string } | null>(null)

  return (
    <div style={{ width: '100%', padding: '1.5rem' }}>
      <Form
        style={{ maxWidth: '50rem', margin: '0 auto' }}
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          if (!location || !link || !name) return setValid(false)
          request(`/group/create`, {
            method: 'POST',
            body: JSON.stringify({
              name,
              link_facebook: link,
              location_name: location?.name,
              location_coord: { lng: location.lng, lat: location.lat },
            }),
          }).then(() => history.push('/'))
        }}
      >
        <Form.Group controlId="formBasicEmail">
          <Form.Control placeholder="Group name" onChange={(e: any) => setName(e.target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Control placeholder="Facebook link" onChange={(e: any) => setLink(e.target.value)} />
        </Form.Group>
        <Form.Group>
          <Location onChange={setLocation} placeholder={'Group location'} />
        </Form.Group>
        {!valid && <Form.Text className="text-muted">You must fill every field</Form.Text>}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Link to="/" style={{ marginRight: '1rem' }}>
            <Button variant="light">Cancel</Button>
          </Link>
          <Button variant="primary" type="submit" >
            Add Group
          </Button>

        </div>
      </Form>
    </div>
  )
}

export default CreateGroup
