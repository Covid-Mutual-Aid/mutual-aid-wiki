import P from 'ts-prove'

import lambda, { useBody } from '../lib/lambdaUtils'
import { signForGroups } from '../lib/jwt'
import db from '../lib/database'

export const emailAuthLink = lambda(
  useBody(P.shape({ email: P.string }))(async function (body) {
    return db.groups
      .get(['emails', 'id'])
      .then((grps) => grps.filter((x) => x.emails?.includes(body.email)))
      .then((grps) => (grps.length === 0 ? Promise.reject('No group with email exists') : grps))
      .then((grps) => signForGroups(grps.map((x) => x.id) as string[]))
      .then((token) => ({
        ...this.event,
        edit_url: (this.event.headers.Origin || '{NO ORIGIN}') + `/group/edit?token=${token}`,
      }))
  })
)
