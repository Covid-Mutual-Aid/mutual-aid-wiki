import React, { useState } from 'react'
import { InputGroup } from '../styles/styles'
import { useRequest } from '../contexts/RequestProvider'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const EmailAuth = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const request = useRequest()

  return (
    <Wrapper>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          request('/request/groupedit', {
            method: 'POST',
            body: JSON.stringify({ email }),
          }).then((x) => (x.error ? setError(x.error) : console.log(x)))
        }}
      >
        <h4>Please enter your email</h4>
        <InputGroup>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="submit">submit</button>
        </InputGroup>
        <div className="cancel">
          <Link to="/">
            <button>Cancel</button>
          </Link>
        </div>
        <p style={{ color: 'red' }}>{error}</p>
      </form>
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
    padding: 1rem;
    justify-content: end;
  }

  button {
    padding: 0.4rem;
  }
`
