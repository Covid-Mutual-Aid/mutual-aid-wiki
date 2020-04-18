import { switchMap, mergeMap } from 'rxjs/operators'
import { of, throwError } from 'rxjs'
import P from 'ts-prove'

import lambda, { params, body, select, authorise, response$ } from '../lib/lambdaRx'
import { isOffline } from '../lib/environment'
import { addSheetRow } from '../google/sheets'
import { isSameGroup } from '../lib/utils'
import { proofs } from '../lib/proofs'
import { Group } from '../lib/types'
import db from '../lib/database'

// Helper
const createNoDuplicates = (
  group: Omit<Group, 'id' | 'pub_id'> & { id?: string; pub_id?: string }
) =>
  db.groups
    .get(['name', 'link_facebook', 'location_coord', 'location_name'])
    .then((groups) =>
      groups.some((g) => isSameGroup(g as any, group))
        ? Promise.resolve('Exists')
        : (db.groups.create(group) as any)
    )

export const getGroups = lambda((req$) =>
  req$.pipe(
    params(),
    switchMap((params) =>
      params && params.id
        ? db.groups.getById(params.id as string, [
            'id',
            'name',
            'link_facebook',
            'location_name',
            'location_coord',
          ])
        : db.groups.get(['id', 'name', 'link_facebook', 'location_name', 'location_coord'])
    ),
    response$
  )
)

// /group/update?token={ jwt }
export const updateGroup = lambda((req$) =>
  req$.pipe(
    select({
      group: body(P.shape({ id: P.string })),
      auth: authorise(),
    }),
    mergeMap(({ group, auth }) =>
      auth && (auth as any).id === group.id
        ? of(group)
        : throwError('Group id does not match token id')
    ),
    switchMap((grp) => db.groups.update(grp)),
    response$
  )
)

// /group/create
export const createGroup = lambda((req$) =>
  req$.pipe(
    body(proofs.groupCreation),
    switchMap((group) =>
      createNoDuplicates(group).then((res) =>
        isOffline()
          ? res
          : addSheetRow(group)
              .catch((err) => console.log('ERROR adding group to sheet'))
              .then(() => res)
      )
    ),
    response$
  )
)

// /group/associate?token={ jwt }&email=""&id=""
export const addEmailToGroup = lambda((req$) =>
  req$.pipe(
    select({
      data: params(P.shape({ email: P.string, id: P.string })),
      auth: authorise(),
    }),
    switchMap(({ data, auth }) =>
      db.groups
        .getById(data.id, ['emails'])
        .then((res) =>
          db.groups.update({ id: data.id, emails: [...((res && res.emails) || []), data.email] })
        )
    ),
    response$
  )
)
