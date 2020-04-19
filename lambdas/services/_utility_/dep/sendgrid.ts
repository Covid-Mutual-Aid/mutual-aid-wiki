import sendGrid from '@sendgrid/mail'
import env from '../environment'

sendGrid.setApiKey(env.SEND_GRID_API_KEY)
const sendMail = sendGrid.send

export default sendMail
