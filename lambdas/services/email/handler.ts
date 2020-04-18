import 'source-map-support/register'
import { switchMap } from 'rxjs/operators'
import { v4 } from 'uuid'
import P from 'ts-prove'

import { createRow, transferToDone } from '../lib/external/airtable'
import lambda, { body, response$ } from '../lib/lambdaRx'
import { switchMergeKey, authorise } from '../lib/observables'
import db from '../lib/database'
import {
  sendNoneAssosiated,
  sendEditLink,
  sendNotAssosiated,
  sendSubmitedRequest,
  sendSuccessfulVerification,
  sendFailedVerification,
} from './templates'
import tokens from '../lib/tokens'
import { Group } from '../lib/types'

// request/groupedit
export const requestGroupEdit = lambda((req$) =>
  req$.pipe(
    body(P.shape({ email: P.string, id: P.string })),
    switchMergeKey('group', (x) => db.groups.getById(x.id, ['emails', 'id']).catch(() => null)),
    switchMap(({ email, group }) => {
      console.log({ email, group })
      if (!group) return Promise.reject("Group doesn't exist")
      // Send email with link to submit support request
      if (!group.emails) return sendNoneAssosiated(email, group.id)
      // Send Email with link to edit group
      if (group.emails.includes(email)) return sendEditLink(email, group.id)
      // Send email explaining that the email is not assosiated to the group
      return sendNotAssosiated(email)
    }),
    response$
  )
)

// request/support?token={ email, id }
export const submitSupportRequest = lambda((req$) =>
  req$.pipe(
    authorise('support'),
    switchMergeKey('group', (x) =>
      db.groups
        .getById(x.id, ['name', 'link_facebook', 'location_name', 'emails', 'id'])
        .catch(() => null)
    ),
    switchMap((x) => {
      const key = v4()
      if (!x.group) return Promise.reject('No group')
      return addSupportRequestToTable(x.email, key, x.group)
        .then(() => sendSubmitedRequest(x.email, key))
        .then(() => 'Successfully submited you should recieve an email with further instructions')
    }),
    response$
  )
)

// request/confirm
export const confirmSupportRequest = lambda((req$) =>
  req$.pipe(
    authorise('confirm'),
    switchMap((x) =>
      db.groups
        .update({ id: x.id, emails: [x.email] })
        .then(() => sendSuccessfulVerification(x.email))
        .then(() => transferToDone(x.key, 'confirmed'))
    ),
    response$
  )
)

// request/reject
export const rejectSupportRequest = lambda((req$) =>
  req$.pipe(
    authorise('reject'),
    switchMap((x) => sendFailedVerification(x.email).then(() => transferToDone(x.key, 'rejected'))),
    response$
  )
)

export const addSupportRequestToTable = (
  email: string,
  key: string,
  group: Pick<Group, 'id' | 'name' | 'link_facebook'>
) => {
  const confirm = tokens.confirm.signUrl({ id: group.id, email, key })
  const reject = tokens.reject.signUrl({ id: group.id, email, key })
  return createRow('Waiting', {
    name: group.name,
    url: group.link_facebook,
    email: email,
    key,
    confirm,
    reject,
  })
}
