import React, { useState } from 'react'
import { InputGroup } from '../styles/styles'
import { useRequest } from '../contexts/RequestProvider'
import styled from 'styled-components'

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
        <InputGroup>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="submit">submit</button>
        </InputGroup>
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
`
