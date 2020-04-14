import { switchMap, mergeMap } from 'rxjs/operators'
import P from 'ts-prove'

import lrx, { response$, body$, params$ } from '../lib/lrx'
import { authorise$ } from '../lib/authenticate'
import { proofs, prove$ } from '../lib/proofs'
import { isOffline } from '../lib/environment'
import { addSheetRow } from '../google/sheets'
import { isSameGroup } from '../lib/utils'
import { Group } from '../lib/types'
import db from '../lib/database'
import { zip, of, throwError } from 'rxjs'

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

export const getGroups = lrx((req$) =>
  req$.pipe(
    params$,
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
export const updateGroup = lrx((req$) =>
  req$.pipe(
    mergeMap((input) =>
      zip(of(input).pipe(body$, prove$(P.shape({ id: P.string }))), of(input).pipe(authorise$))
    ),
    mergeMap(([grp, auth]) =>
      auth && (auth as any).id === grp.id ? of(grp) : throwError('Group id does not match token id')
    ),
    switchMap((grp) => db.groups.update(grp)),
    response$
  )
)

// /group/create
export const createGroup = lrx((req$) =>
  req$.pipe(
    body$,
    prove$(proofs.groupCreation),
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
export const associateEmail = lrx((req$) =>
  req$.pipe(
    mergeMap((input) =>
      zip(
        of(input).pipe(params$, prove$(P.shape({ email: P.string, id: P.string }))),
        of(input).pipe(authorise$)
      )
    ),
    switchMap(([data]) =>
      db.groups
        .getById(data.id, ['emails'])
        .then((res) =>
          db.groups.update({ id: data.id, emails: [...((res && res.emails) || []), data.email] })
        )
    ),
    response$
  )
)
