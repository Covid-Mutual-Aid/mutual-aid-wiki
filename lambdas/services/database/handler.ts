import P from 'ts-prove'

import { isSameGroup, isOffline, omit } from '../lib/utils'
import lambda from '../lib/lambdaUtils'
import { Group } from '../lib/types'

import { addSheetRow } from '../google/sheets'
import createDynamoApi from '../lib/dynamodb'

const TableName = process.env.GROUPS_TABLE as string
const { create, remove, readAll } = createDynamoApi<Group>(TableName)

// Helper
export const createNoDuplicates = (
  group: Omit<Group, 'id' | 'pub_id'> & { id?: string; pub_id?: string }
) =>
  readAll().then((groups) =>
    groups.some((g) => isSameGroup(g, group))
      ? 'Exists'
      : create({ ...group, created_at: Date.now() }).then(() => 'Added')
  )

// Lambdas
const sanitize = (x?: Group) =>
  !x
    ? null
    : {
        id: x.pub_id,
        name: x.name,
        link_facebook: x.link_facebook,
        location_name: x.location_name,
        location_coord: x.location_coord,
      }

export const getGroup = lambda.queryParams()((x) =>
  readAll().then((groups) =>
    x && x.id
      ? sanitize(groups.find((y) => y.id === x.id || y.pub_id === x.id))
      : groups.map(sanitize)
  )
)

export const updateGroup = lambda.body()((group) =>
  readAll().then((groups) => {
    const grp = groups.find((x) => x.id === group.id)
    if (!grp) return Promise.reject('No group with id')
    return create({ updated_at: Date.now(), ...grp, ...omit('id')(group) })
  })
)

export const createGroup = lambda.body(
  P.shape({
    name: P.string,
    emails: P.array(P.string),
    link_facebook: P.string,
    location_name: P.string,
    location_coord: P.shape({
      lat: P.number,
      lng: P.number,
    }),
  })
)((group) =>
  isOffline()
    ? (createNoDuplicates(group) as any)
    : (Promise.all([createNoDuplicates(group), addSheetRow(group)]) as any)
)

export const removeGroup = lambda.body(P.shape({ id: P.string }))(remove)
