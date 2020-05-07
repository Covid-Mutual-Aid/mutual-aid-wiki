import { useParams, useHistory } from 'react-router-dom'
import React, { useState } from 'react'

import { useRequest } from '../contexts/RequestProvider'
import { useI18n } from '../contexts/I18nProvider'

import { CenterAlign, FormButtons, Card } from '../styles/styles'
import InputGroup from '../components/Form/InputGroup'
import TextareaAutosize from 'react-textarea-autosize'

const Report = () => {
  const [successModal, setSuccessModal] = useState(false)
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [validated, setValidated] = useState(false)

  const { id } = useParams<{ id: string }>()
  const history = useHistory()
  const request = useRequest()
  const t = useI18n((locale) => locale.translation.pages.report)
  const validMessage = (s: string) => s.length > 0
  return (
    <CenterAlign>
      <Card>
        {successModal ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#28a745' }}>
            <h3>{t.after_submit_message}</h3>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!validated) return
              request('/request/report', {
                method: 'POST',
                body: JSON.stringify({ id, message, email }),
              })
                .then((x) => {
                  setSuccessModal(true)
                  return new Promise((res) => setTimeout(res, 6000))
                })
                .then(() => history.replace('/map'))
            }}
          >
            <h1>{t.report_group_title}</h1>
            <p>{t.report_reason_prompt}</p>
            <InputGroup>
              <TextareaAutosize
                placeholder={t.report_reason_placeholder}
                name="description"
                value={message}
                style={{ fontFamily: 'inherit', minHeight: '4rem' }}
                onChange={(e) => {
                  setMessage(e.target.value)
                  setValidated(validMessage(e.target.value))
                }}
              />
            </InputGroup>
            <InputGroup>
              <input
                placeholder={'Your email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
            <FormButtons>
              <button
                className="btn-secondary"
                type="button"
                onClick={() => history.replace('/map')}
              >
                {t.cancel_button}
              </button>
              <button type="submit">{t.submit_button}</button>
            </FormButtons>
          </form>
        )}
      </Card>
    </CenterAlign>
  )
}

export default Report
