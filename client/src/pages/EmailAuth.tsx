import React, { useState } from 'react'
import { InputGroup, Button } from '../styles/styles'
import { useRequest } from '../contexts/RequestProvider'
import styled from 'styled-components'
import { Link, useParams } from 'react-router-dom'

const EmailAuth = () => {
  const { id } = useParams()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sucessModal, setSucessModal] = useState(false)
  const request = useRequest()

  return (
    <Wrapper>
      {sucessModal ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#28a745' }}>
          <h3>Please check you email for further instructions :-)</h3>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            request('/request/groupedit', {
              method: 'POST',
              body: JSON.stringify({ email, id }),
            }).then((x) => {
              if (x.error) {
                setError(x.error)
                console.log(x)
                return
              }
              setSucessModal(true)
            })
          }}
        >
          <h4>Please enter your email</h4>
          <InputGroup>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit">submit</button>
          </InputGroup>
          <div className="cancel">
            <Button>
              <Link to="/">Cancel </Link>
            </Button>
          </div>
          <p style={{ color: 'red' }}>{error}</p>
        </form>
      )}
    </Wrapper>
  )
}

export default EmailAuth

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  form {
    width: 30rem;
  }

  h4 {
    margin: 1.4rem 0 0.4rem 0.6rem;
    font-size: 1.2rem;
    color: rgba(0, 0, 0, 0.54);
  }

  .cancel {
    display: flex;
    justify-items: flex-end;
    padding: 1rem 0;
    justify-content: end;
  }
`
