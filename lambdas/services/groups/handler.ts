import { switchMap, mergeMap } from 'rxjs/operators'
import { of, throwError } from 'rxjs'
import P from 'ts-prove'

import lambda, { params, body, select, responseJson$ } from '../_utility_/lib/lambdaRx'
import { isOffline } from '../_utility_/environment'
import { addSheetRow } from '../google/sheets'
import { authorise } from '../_utility_/observables'
import { isSameGroup } from '../_utility_/utils'
import { proofs } from '../_utility_/proofs'
import { Group } from '../_utility_/types'
import db from '../_utility_/database'

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
        : db.groups
            .get(['id', 'name', 'link_facebook', 'location_name', 'location_coord', 'updated_at'])
            .then((grps) =>
              grps.sort(
                (a, b) =>
                  new Date(b.updated_at || '01 Jan 2020').valueOf() -
                  new Date(a.updated_at || '01 Jan 2020').valueOf()
              )
            )
    ),
    responseJson$
  )
)

// /group/update?token={ jwt }
export const updateGroup = lambda((req$) =>
  req$.pipe(
    select({
      group: body(P.shape({ id: P.string })),
      auth: authorise('edit'),
    }),
    mergeMap(({ group, auth }) =>
      auth && (auth as any).id === group.id
        ? of(group)
        : throwError('Group id does not match token id')
    ),
    switchMap((grp) => db.groups.update(grp)),
    responseJson$
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
    responseJson$
  )
)
