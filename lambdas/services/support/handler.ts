import 'source-map-support/register'
import { switchMap } from 'rxjs/operators'
import { v4 } from 'uuid'
import P from 'ts-prove'

import lambda, { body, responseJson$ } from '../_utility_/lib/lambdaRx'
import { createRow, transferToDone } from '../_utility_/dep/airtable'
import { switchMergeKey, authorise } from '../_utility_/observables'
import { Group } from '../_utility_/types'
import ENV from '../_utility_/environment'
import tokens from '../_utility_/tokens'
import db from '../_utility_/database'
import {
  sendNoneAssosiated,
  sendEditLink,
  sendNotAssosiated,
  sendSubmitedRequest,
  sendSuccessfulVerification,
  sendFailedVerification,
} from './templates'

// request/groupedit
export const requestGroupEdit = lambda((req$) =>
  req$.pipe(
    body(P.shape({ email: P.string, id: P.string })),
    switchMergeKey('group', (x) => db.groups.getById(x.id, ['emails', 'id']).catch(() => null)),
    switchMap(({ email, group }) => {
      console.log({ email, group })
      if (!group) return Promise.reject("Group doesn't exist")
      // Send email with link to submit support request
      if (!group.emails || group.emails.length === 0) return sendNoneAssosiated(email, group.id)
      // Send Email with link to edit group
      if (group.emails.includes(email)) return sendEditLink(email, group.id)
      // Send email explaining that the email is not assosiated to the group
      return sendNotAssosiated(email)
    }),
    responseJson$
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
    responseJson$
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
    responseJson$
  )
)

// request/reject
export const rejectSupportRequest = lambda((req$) =>
  req$.pipe(
    authorise('reject'),
    switchMap((x) => sendFailedVerification(x.email).then(() => transferToDone(x.key, 'rejected'))),
    responseJson$
  )
)

// request/report
export const reportGroup = lambda((req$) =>
  req$.pipe(
    body(P.shape({ id: P.string, message: P.string })),
    switchMap((x) =>
      db.groups.getById(x.id, ['link_facebook', 'name', 'id']).then((grp) =>
        createRow('Reports', {
          message: x.message,
          url: grp.link_facebook,
          name: grp.name,
          id: grp.id,
        })
      )
    ),
    responseJson$
  )
)

export const addSupportRequestToTable = async (
  email: string,
  key: string,
  group: Pick<Group, 'id' | 'name' | 'link_facebook'>
) => {
  const confirm = await tokens.confirm.sign({ id: group.id, email, key })
  const reject = await tokens.reject.sign({ id: group.id, email, key })

  return createRow('Waiting', {
    name: group.name,
    url: group.link_facebook,
    email: email,
    key,
    confirm: `${ENV.API_ENDPOINT}/request/confirm?token=${confirm}`,
    reject: `${ENV.API_ENDPOINT}/request/reject?token=${reject}`,
  })
}
