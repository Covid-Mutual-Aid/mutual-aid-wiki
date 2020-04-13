import sgMail from '@sendgrid/mail'
import env from '../environment'

sgMail.setApiKey(env.SEND_GRID_API_KEY)

const sendEmail = {
  editGroup: (email: string, link: string) => ({
    to: email,
    from: 'no-reply@covidmutualaid.cc',
    subject: 'Covid mutualaid',
    html: `<p>Here is your edit link <a href="${link}">link</a></p>`,
  }),
}

export default sendEmail
