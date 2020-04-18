import sendGrid from '@sendgrid/mail'
import { sign } from 'jsonwebtoken'

import airtable from '../lib/external/airtable'
import { Group } from '../lib/types'
import ENV from '../lib/environment'

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
      subject: 'Here is your edit link',
      html: `
        <p>Hi,</p>
        <p>Please follow this link to edit your site: <a href="${link}">${link}</a></p>
        <p>
          This link will expire in 1 day, so if you need to edit your group again afterwards,
          please request another one by clicking the edit button on the dropdown menu of your 
          group (as you may have just done).
        </p>
        <p>Very best wishes,</p>
        <p>The Mutual Aid Wiki team</p>
      `,
    })
    .then((x) => 'Sent emails')
    .catch((x) => Promise.reject(x.message))
}

export const sendNotAssosiated = (email: string) =>
  sendMail({
    to: email,
    from: 'no-reply@covidmutualaid.cc',
    subject: 'Email not linked with this group',
    html: `
      <p>Hi,</p>
      <p>
        This email address (${email}) is currently not one of the one(s) linked with this group. Please 
        speak with one of your co-organsiers who can request an edit link on your behalf.
      </p>
      <p>Many thanks,</p>
      <p>The Mutual Aid Wiki team</p>
    `,
  })

export const sendNoneAssosiated = (email: string, id: string) => {
  const link = `${ENV.API_ENDPOINT}/request/support?token=${sign({ id, email }, ENV.JWT_SECRET, {
    expiresIn: '3d',
  })}`

  return sendMail({
    to: email,
    from: 'no-reply@covidmutualaid.cc',
    subject: 'Email not linked with this group',
    html: `
      <p>Hi,</p>
      <p>
        The email address you provided (${email}) is currently not linked to this group. If you would like to edit this group from
        this email address, you will first need to complete a short verification process. The steps for this are as follows:
      </p>
      <p>
        - Click the link below to recieve an email with a unique code \n
        - Promptly paste this code into a publicly visible section of your group (further instructions in the email) \n
        - Wait a few days for one of our team to visit your group to check this code matches what we sent you \n
        - Delete this code from your group once you have recieved a confirmation email \n
      </p>
      
      <p>If you would like to proceed, please click this link: <a href="${link}">${link}</a></p>

      <p>Best wishes,</p>
      <p>The Mutual Aid Wiki team</p>
    `,
  })
}

export const sendSubmitedRequest = (email: string, key: string) =>
  sendMail({
    to: email,
    from: 'no-reply@covidmutualaid.cc',
    subject: 'Here is your verification code',
    html: `
      <p>Hi,</p>
      <p>
        Here is your verification code: ${key} \n
        Please paste this into a publicly visible section of your group. Examples include:
      </p>
      <p>
        Facebook: In the about section \n
        WhatsApp: In the group description section \n
        Website: Anywhere on your home page (maybe in the footer?) \n
      </p>
      <p>
        Sometime after tomorrow, a member of our team will visit your group to check for this code. If it matches 
        what we sent you, we will send you a confirmation email. You will then be able to edit your group from this email
        address.
      </p>
      <p>Best wishes,</p>
      <p>The Mutual Aid Wiki team</p>
    `,
  })

export const sendSuccessfulVerification = (email: string) =>
  sendMail({
    to: email,
    from: 'no-reply@covidmutualaid.cc',
    subject: 'You have sucessfuly verified!',
    html: `
      <p>Hi,</p>
      <p>
        You have sucessfully verified your group! This means you can select the edit option on your group in the dropdown menu 
         and use this email address (${email}) to recieve a link that will enable you to edit your group.
      </p>
      <p>Best wishes,</p>
      <p>The Mutual Aid Wiki team</p>
    `,
  })

export const sendFailedVerification = (email: string) =>
  sendMail({
    to: email,
    from: 'no-reply@covidmutualaid.cc',
    subject: 'Unsuccessful verification',
    html: `
      <p>Hi,</p>
      <p>
        Unfortunately the verification process did not succeeed. This is either because our team couldn't find the verification
        code on your group or the code didn't match. Sorry about this, you are welcome to try again if this was a mistake.
      </p>
      <p>Best wishes,</p>
      <p>The Mutual Aid Wiki team</p>
    `,
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
