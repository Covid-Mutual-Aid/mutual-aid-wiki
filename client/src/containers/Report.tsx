import { useParams, useHistory } from 'react-router-dom'
import React, { useState } from 'react'

import { useRequest } from '../contexts/RequestProvider'
import { useI18n } from '../contexts/I18nProvider'

import { CenterAlign, FormButtons, Card } from '../styles/styles'
import { useModalClose } from '../components/withModal'
import InputGroup from '../components/Form/InputGroup'

const Report = () => {
  const [successModal, setSuccessModal] = useState(false)
  const [message, setMessage] = useState('')
  const [validated, setValidated] = useState(false)
  const closeModal = useModalClose()

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
                body: JSON.stringify({ id, message }),
              })
                .then((x) => {
                  setSuccessModal(true)
                  return new Promise((res) => setTimeout(res, 6000))
                })
                .then(() => history.replace('/'))
            }}
          >
            <h1>{t.report_group_title}</h1>
            <p>{t.report_reason_prompt}</p>
            <InputGroup>
              <input
                placeholder={t.report_reason_placeholder}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value)
                  setValidated(validMessage(e.target.value))
                }}
              />
            </InputGroup>
            <FormButtons>
              <button
                className="btn-secondary"
                type="button"
                onClick={() => closeModal(() => history.replace('/map'))}
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
