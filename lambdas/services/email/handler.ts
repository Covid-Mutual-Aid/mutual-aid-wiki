import P from 'ts-prove'

import lambda, { useBody } from '../lib/lambdaUtils'
import { signForGroups } from '../lib/jwt'
import airtable from '../lib/airtable'
import sendEmail from '../lib/sendgrid'
import ENV from '../lib/environment'
import db from '../lib/database'

export const emailEditGroupLink = lambda(
  useBody(P.shape({ email: P.string }))(async function (body) {
    return db.groups
      .get(['emails', 'id'])
      .then((grps) => grps.filter((x) => x.emails?.includes(body.email)))
      .then((grps) => (grps.length === 0 ? Promise.reject('No group with email exists') : grps))
      .then((grps) => signForGroups(grps.map((x) => x.id) as string[]))
      .then((token) =>
        sendEmail.editGroup(
          body.email,
          (this.event.headers.origin || '{NO ORIGIN}') + `/group/edit?token=${token}`
        )
      )
  })
)

export const attachEmailToGroup = lambda(
  useBody(P.shape({ email: P.string, id: P.string }))(function (body) {
    return db.groups
      .getById(body.id, ['name', 'link_facebook', 'location_name', 'emails', 'id'])
      .then((group) =>
        db.authkeys
          .create({ access_type: 'TABLE_ITEM', association: group.id as string })
          .then((auth) => ({ group, auth }))
      )
      .then(({ group, auth }) =>
        airtable.attachEmailRequest({
          confirmLink: `${this.event.headers.Host}/${ENV.STAGE}/group/addemail?id=${group.id}&email=${body.email}&token=${auth.id}`,
          email: body.email,
          group,
        })
      )
  })
)
