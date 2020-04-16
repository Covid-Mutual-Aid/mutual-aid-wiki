import sendGrid from '@sendgrid/mail'
import { Group } from '../lib/types'
import ENV from '../lib/environment'
import { sign } from 'jsonwebtoken'
import airtable from '../lib/external/airtable'

sendGrid.setApiKey(ENV.SEND_GRID_API_KEY)
const sendMail = sendGrid.send

export const sendEditLink = (email: string, id: string) => {
  const link = `${ENV.CLIENT_ENDPOINT}/edit/${id}/${sign({ id, email }, ENV.JWT_SECRET, {
    expiresIn: '1d',
  })}`

  return sendGrid
    .send({
      to: email,
      from: 'no-reply@covidmutualaid.cc',
      subject: 'Covid mutualaid',
      html: `<p>Here is your edit link <a href="${link}">link</a></p>`,
    })
    .then((x) => 'Sent emails')
    .catch((x) => Promise.reject(x.message))
}

export const sendNotAssosiated = (email: string) =>
  sendMail({
    to: email,
    from: 'no-reply@covidmutualaid.cc',
    subject: 'Covid mutualaid',
    html: `<p>Email not assosiated with this group</p>`,
  })

export const sendNoneAssosiated = (email: string, id: string) => {
  const link = `${ENV.API_ENDPOINT}/request/support?token=${sign({ id, email }, ENV.JWT_SECRET, {
    expiresIn: '3d',
  })}`

  return sendMail({
    to: email,
    from: 'no-reply@covidmutualaid.cc',
    subject: 'Covid mutualaid',
    html: `<p>Email is not current linked click the  <a href="${link}">link</a> to submit a support request to get it added</p>`,
  })
}

export const sendSubmitedRequest = (email: string, key: string) =>
  sendMail({
    to: email,
    from: 'no-reply@covidmutualaid.cc',
    subject: 'Covid mutualaid',
    html: `<p>Your request was submited please type this somewhere in your group ${key}</p>`,
  })

export const addSupportRequestToTable = (
  email: string,
  key: string,
  group: Pick<Group, 'id' | 'name' | 'link_facebook'>
) => {
  const accept = `${ENV.API_ENDPOINT}/request/accept?token=${sign(
    { email: email, id: group.id },
    ENV.JWT_SECRET
  )}`
  const decline = `${ENV.API_ENDPOINT}/request/decline?token=${sign(
    { email: email, id: group.id },
    ENV.JWT_SECRET
  )}`

  return airtable.attachEmailBase.create([
    {
      fields: {
        name: group.name,
        url: group.link_facebook,
        email: email,
        key,
        accept,
        decline,
      },
    },
  ])
}
