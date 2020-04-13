import Airtable from 'airtable'

import env from '../environment'
import { Group } from '../types'

const attachEmailBase = new Airtable({ apiKey: env.AIRTABLE_ATTACH_EMAIL_KEY }).base(
  env.AIRTABLE_ATTACH_EMAIL_BASE
)

export default {
  attachEmailRequest: ({
    confirmLink,
    email,
    group,
  }: {
    confirmLink: string
    email: string
    group: Pick<Group, 'name' | 'link_facebook'>
  }) =>
    attachEmailBase('Table 1').create([
      {
        fields: {
          name: group.name,
          url: group.link_facebook,
          email: email,
          confirm: confirmLink,
        },
      },
    ]),
}
