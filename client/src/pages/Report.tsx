import React, { useState } from 'react'
import { CenterAlign, FormButtons, InputGroup } from '../styles/styles'
import { Link, useParams, useHistory } from 'react-router-dom'

import { ValidatedInput } from '../components/ValidatedInput'
import { useRequest } from '../contexts/RequestProvider'

const Report = () => {
  const [successModal, setSuccessModal] = useState(false)
  const [message, setMessage] = useState('')
  const [validated, setValidated] = useState(false)

  const { id } = useParams<{ id: string }>()
  const history = useHistory()
  const request = useRequest()

  return (
    <CenterAlign>
      {successModal ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#28a745' }}>
          <h3>Thanks for your report</h3>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!validated) return
            request('/request/report', {
              method: 'POST',
              body: JSON.stringify({ id, message }),
            })
              .then((x) => {
                setSuccessModal(true)
                return new Promise((res) => setTimeout(res, 6000))
              })
              .then(() => history.replace('/'))
          }}
        >
          <p>Why are you reporting this group?</p>
          <InputGroup>
            <ValidatedInput
              placeholder="E.g, it no longer exists..."
              value={message}
              onChange={({ value, validated }) => {
                setMessage(value)
                setValidated(validated)
              }}
              validator={(s: string) => s.length > 0}
            />
          </InputGroup>
          <FormButtons>
            <Link to="/">
              <button className="btn-secondary" type="button">
                cancel
              </button>
            </Link>
            <button type="submit">submit</button>
          </FormButtons>
        </form>
      )}
    </CenterAlign>
  )
}

export default Report
