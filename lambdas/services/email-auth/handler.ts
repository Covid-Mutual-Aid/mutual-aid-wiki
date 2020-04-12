import jwt from 'jsonwebtoken'
import P from 'ts-prove'

import lambda, { useBoth, useBody, useParams } from '../lib/lambdaUtils'
import db from '../lib/database'

export const emailAuthLink = lambda(
  useBody(P.shape({ email: P.string }))(async (body) => {
    return db.groups
      .get(['emails', 'id'])
      .then((grps) => grps.filter((x) => x.emails?.includes(body.email)))
      .then((grps) => (grps.length === 0 ? Promise.reject('No group with email exists') : grps))
      .then((grps) => jwt.sign({ ids: grps.map((x) => x.id) }, 'SECRET', { expiresIn: '1h' }))
  })
)

export const verify = lambda(
  useParams(P.shape({ token: P.string }))(async (x) =>
    Promise.resolve(jwt.verify(x.token, 'SECRET')).then((r) =>
      (r as any).error ? Promise.reject((r as any).error) : r
    )
  )
)
