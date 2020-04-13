import { switchMap } from 'rxjs/operators'
import P from 'ts-prove'

import lrx, { response$, body$, params$ } from '../lib/lrx'
import { authorise$ } from '../lib/authenticate'
import { proofs, prove$ } from '../lib/proofs'
import { isOffline } from '../lib/environment'
import { addSheetRow } from '../google/sheets'
import { isSameGroup } from '../lib/utils'
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

export const getGroups = lrx((req$) =>
  req$.pipe(
    switchMap(() =>
      db.groups.get(['id', 'name', 'link_facebook', 'location_name', 'location_coord', 'emails'])
    ),
    response$
  )
)

export const updateGroup = lrx((req$) =>
  req$.pipe(
    authorise$,
    body$,
    prove$(P.shape({ id: P.string })),
    switchMap((grp) => db.groups.update(grp)),
    response$
  )
)

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

export const associateEmail = lrx((req$) =>
  req$.pipe(
    authorise$,
    params$,
    prove$(P.shape({ email: P.string, id: P.string })),
    switchMap((data) =>
      db.groups
        .getById(data.id, ['emails'])
        .then((res) =>
          db.groups.update({ id: data.id, emails: [...((res && res.emails) || []), data.email] })
        )
    ),
    response$
  )
)
