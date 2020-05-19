import { switchMap, mergeMap } from 'rxjs/operators'
import { of, throwError } from 'rxjs'
import P from 'ts-prove'

import lambda, { params, body, select, responseJson$ } from '../_utility_/lib/lambdaRx'
import { authorise } from '../_utility_/observables'
import { isSameGroup } from '../_utility_/utils'
import { proofs } from '../_utility_/proofs'
import { Group } from '../_utility_/types'
import db from '../_utility_/database'

// Make sure this group hasn't been added
const createNoDuplicates = (
  group: Omit<Group, 'id' | 'pub_id'> & { id?: string; pub_id?: string }
) =>
  db.groups
    .get(['name', 'links', 'location_coord', 'location_name'])
    .then((groups) =>
      groups.some((g) => isSameGroup(g as any, group))
        ? Promise.resolve('Exists')
        : (db.groups.create({ ...group, external: false, source: 'mutualaidwiki' }) as any)
    )

export const getGroups = lambda((req$) =>
  req$.pipe(
    select({
      params: params(),
      auth: authorise('edit', true),
    }),
    switchMap(({ params, auth }) => {
      const base: (keyof Group)[] = [
        'id',
        'name',
        'link_facebook',
        'links',
        'location_name',
        'location_coord',
        'location_poly',
        'source',
        'contact',
        'description',
        'location_country',
        'updated_at',
      ]

      const attributes: (keyof Group)[] = auth ? [...base, 'emails'] : base

      if (params && params.id) return db.groups.getById(params.id, attributes)
      return db.groups
        .get(attributes)
        .then((grps) =>
          grps.sort(
            (a, b) =>
              new Date(b.updated_at || '01 Jan 2020').valueOf() -
              new Date(a.updated_at || '01 Jan 2020').valueOf()
          )
        )
    }),
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
    switchMap((grp) => db.groups.update({ ...grp, external: false, source: 'mutualaidwiki' })),
    responseJson$
  )
)

// /group/create
export const createGroup = lambda((req$) =>
  req$.pipe(body(proofs.groupCreation), switchMap(createNoDuplicates), responseJson$)
)

// /group/delete
export const deleteGroup = lambda((req$) =>
  req$.pipe(
    authorise('delete'),
    switchMap((val) => (val ? db.groups.delete(val.id) : throwError('No id provided'))),
    responseJson$
  )
)
