import Airtable from 'airtable'
import env from '../environment'

const attachEmailBase = new Airtable({ apiKey: env.AIRTABLE_ATTACH_EMAIL_KEY }).base(
  env.AIRTABLE_ATTACH_EMAIL_BASE
)('Table 1')

const airtable = { attachEmailBase }

export default airtable
