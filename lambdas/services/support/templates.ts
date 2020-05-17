import sendGrid from '@sendgrid/mail'

import ENV from '../_utility_/environment'
import tokens from '../_utility_/tokens'
import fs from 'fs'

sendGrid.setApiKey(ENV.SEND_GRID_API_KEY)
const from = 'no-reply@mutualaid.wiki'

export const sendEditLink = async (email: string, id: string, locale='EN') => {
  const token = await tokens.edit.sign({ id, email })
  const link = `${ENV.CLIENT_ENDPOINT}/edit/${id}/${token}`

  return sendGrid
    .send({
      to: email,
      from,
      subject: 'Here is your edit link',
      substitutionWrappers: ['{{', '}}'],
      html: fs.readFileSync(`templates${locale}/sendEditLink.html`),
    })
    .then((x) => 'Sent emails')
    .catch((x) => Promise.reject(x.message))
}

export const sendNotAssosiated = (email: string, locale='EN') =>
  sendGrid.send({
    to: email,
    from,
    subject: 'Email not linked with this group',
    substitutionWrappers: ['{{', '}}'],
    html: fs.readFileSync(`./templates${locale}/sendNotAssociated.html`),
  })

export const sendNoneAssosiated = async (email: string, id: string, locale = 'EN') => {
  const token = await tokens.support.sign({ email, id }, true)
  const link = `${ENV.API_ENDPOINT}/request/support?token=${token}`

  return sendGrid.send({
    to: email,
    from,
    subject: 'Email not linked with this group',
    substitutionWrappers: ['{{', '}}'],
    html: fs.readFileSync(`templates${locale}/sendNoneAssociated.html`),
  })
}

export const sendSubmitedRequest = (email: string, key: string, locale='EN') => {
  return sendGrid.send({
    to: email,
    from,
    subject: 'Here is your verification code',
    substitutionWrappers: ['{{', '}}'],
    html: fs.readFileSync(`templates${locale}/sendSubmittedRequest.html`),
  })
}

export const sendSuccessfulVerification = async (email: string, id: string, locale='EN') => {
  const token = await tokens.edit.sign({ id, email })
  const link = `${ENV.CLIENT_ENDPOINT}/edit/${id}/${token}`

  return sendGrid.send({
    to: email,
    from,
    subject: 'You have sucessfuly verified!',
    substitutionWrappers: ['{{', '}}'],
    html: fs.readFileSync(`templates${locale}/sendSuccessfulVerification.html`),
  })
}

export const sendFailedVerification = (email: string, locale='EN') =>
  sendGrid.send({
    to: email,
    from,
    subject: 'Unsuccessful verification',
    substitutionWrappers: ['{{', '}}'],
    html: fs.readFileSync(`templates${locale}/sendFailedVerification.html`),
  })
