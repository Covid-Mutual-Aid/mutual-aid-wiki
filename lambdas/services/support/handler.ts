import 'source-map-support/register'
import { switchMap } from 'rxjs/operators'
import shortid from 'shortid'
import P from 'ts-prove'

import lambda, { body, responseJson$ } from '../_utility_/lib/lambdaRx'
import { createRow, transferRow } from '../_utility_/dep/airtable'
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
import { omit } from '../_utility_/utils'
import { throwError } from 'rxjs'

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

      // Their email is not linked to the group, send email with link to submit support request
      return sendNoneAssosiated(email, group.id)
      // Send email explaining that the email is not assosiated to the group
      // return sendNotAssosiated(email)
    }),
    responseJson$
  )
)

// request/support?token={ email, id }
export const submitSupportRequest = lambda((req$) =>
  req$.pipe(
    authorise('support'),
    switchMap((x) => {
      if (!x) return throwError('Unauthorised')
      return db.groups
        .getById(x.id, ['name', 'links', 'location_name', 'emails', 'id'])
        .then((group) => {
          const key = shortid.generate()
          return addSupportRequestToTable(x.email, key, group)
            .then(() => sendSubmitedRequest(x.email, key))
            .then(
              () => 'Successfully submited you should recieve an email with further instructions'
            )
        })
        .catch(() => Promise.reject(`Missing group ${x.id}`))
    }),
    responseJson$
  )
)

// request/confirm
export const confirmSupportRequest = lambda((req$) =>
  req$.pipe(
    authorise('confirm'),
    switchMap((x) => {
      if (!x) return throwError('Unauthorised')
      return db.groups
        .update({ id: x.id, emails: [x.email] })
        .then(() => sendSuccessfulVerification(x.email, x.id))
        .then(() =>
          transferRow('Waiting', 'Done', (y) => ({
            status: 'confirmed',
            ...omit(['confirm', 'reject', 'date'], y),
          }))((y) => y.key === x.key)
        )
    }),
    responseJson$
  )
)

// request/reject
export const rejectSupportRequest = lambda((req$) =>
  req$.pipe(
    authorise('reject'),
    switchMap((x) => {
      if (!x) return throwError('Unauthorised')
      return sendFailedVerification(x.email).then(() =>
        transferRow('Waiting', 'Done', (y) => ({
          status: 'rejected',
          ...omit(['confirm', 'reject', 'date'], y),
        }))((y) => y.key === x.key)
      )
    }),
    responseJson$
  )
)

// request/report
export const reportGroup = lambda((req$) =>
  req$.pipe(
    body(P.shape({ id: P.string, message: P.string, email: P.optional(P.string) })),
    switchMap((x) =>
      Promise.all([
        tokens.edit.sign({ id: x.id, email: 'NONE' }),
        tokens.delete.sign({ id: x.id }),
      ]).then(([editToken, deleteToken]) => ({ ...x, editToken, deleteToken }))
    ),
    switchMap((x) =>
      db.groups.getById(x.id, ['links', 'name', 'id']).then((grp) =>
        createRow('Reports', {
          action: 'waiting',
          message: x.message,
          email: x.email,
          url: grp.links[0].url,
          name: grp.name,
          id: grp.id,
          edit: `${ENV.CLIENT_ENDPOINT}/map/edit/${x.id}/${x.editToken}`,
          delete: `${ENV.API_ENDPOINT}/group/delete?token=${x.deleteToken}`,
        })
      )
    ),
    responseJson$
  )
)

export const addSupportRequestToTable = async (
  email: string,
  key: string,
  group: Pick<Group, 'id' | 'name' | 'links'>
) => {
  const confirm = await tokens.confirm.sign({ id: group.id, email, key })
  const reject = await tokens.reject.sign({ id: group.id, email, key })

  return createRow('Waiting', {
    name: group.name,
    url: group.links[0].url,
    email: email,
    key,
    confirm: `${ENV.API_ENDPOINT}/request/confirm?token=${confirm}`,
    reject: `${ENV.API_ENDPOINT}/request/reject?token=${reject}`,
  })
}
