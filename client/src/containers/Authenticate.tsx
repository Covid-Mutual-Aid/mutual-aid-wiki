import { useParams, useHistory } from 'react-router-dom'
import React, { useState } from 'react'
import styled from 'styled-components'

import { useRequest } from '../contexts/RequestProvider'
import { useI18n } from '../contexts/I18nProvider'

import InputGroup from '../components/Form/InputGroup'
import { Card, FormButtons } from '../styles/styles'

const EmailAuth = () => {
  const { id } = useParams()
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sucessModal, setSucessModal] = useState(false)
  const request = useRequest()
  const t = useI18n((locale) => locale.translation.pages.email_auth)

  return (
    <Wrapper>
      <Card>
        {sucessModal ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#28a745' }}>
            <h3>{t.after_submit_message}</h3>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              request('/request/groupedit', {
                method: 'POST',
                body: JSON.stringify({ email, id }),
              })
                .then((x) => {
                  if (x.error) {
                    setError(x.error)
                    return
                  }
                  setSucessModal(true)
                  return new Promise((res) => setTimeout(res, 6000))
                })
                .then(() => history.replace('/'))
            }}
          >
            <h1>{t.title}</h1>
            <p>{t.enter_email_prompt}</p>
            <InputGroup>
              <input value={email} onChange={(e) => setEmail(e.target.value)} />
            </InputGroup>
            <p style={{ color: 'red' }}>{error}</p>
            <FormButtons>
              <button className="btn-secondary" onClick={() => history.replace('/map')}>
                {t.cancel_button}
              </button>
              <button type="submit">{t.submit_button}</button>
            </FormButtons>
          </form>
        )}
      </Card>
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
  padding: 1rem;

  form {
    max-width: 30rem;
  }

  h4 {
    margin: 1.4rem 0 0.4rem 0.6rem;
    font-size: 1.2rem;
    color: rgba(0, 0, 0, 0.54);
  }

  .cancel {
    display: flex;
    justify-items: flex-end;
    padding-top: 1rem;
    justify-content: end;
  }
`
