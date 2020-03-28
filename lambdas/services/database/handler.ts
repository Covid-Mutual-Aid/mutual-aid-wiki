import { lambdaQuery, lambdaBody } from '../lib/lambdaUtils'
import { Group } from '../lib/types'
import { isSameGroup, isOffline, omit, renameKey } from '../lib/utils'
import { addSheetRow } from '../google/sheets'
import createDynamoApi from '../lib/dynamodb'

const TableName = process.env.DYNAMODB_TABLE as string
const { create, remove, readAll } = createDynamoApi<Group>(TableName)

// Helper
export const createNoDuplicates = (
  group: Omit<Group, 'id' | 'pub_id'> & { id?: string; pub_id?: string }
) =>
  readAll().then(groups =>
    groups.some(g => isSameGroup(g, group))
      ? 'Exists'
      : create({ ...group, created_at: Date.now() }).then(() => 'Added')
  )

// Lambdas
const sanitize = (x?: Group) =>
  !x
    ? null
    : {
        name: x.name,
        link_facebook: x.link_facebook,
        location_name: x.location_name,
        location_coord: x.location_coord,
      }

export const getGroup = lambdaQuery((x?: { id?: string }) =>
  readAll().then(groups =>
    x && x.id
      ? sanitize(groups.find(y => y.id === x.id || y.pub_id === x.id))
      : groups.map(sanitize)
  )
)

export const updateGroup = lambdaBody(group =>
  readAll().then(groups => {
    const grp = groups.find(x => x.id === group.id)
    if (!grp) return Promise.reject('No group with id')
    return create({ updated_at: Date.now(), ...grp, ...omit('id')(group) })
  })
)

export const createGroup = lambdaBody(
  (group: Omit<Group, 'id' | 'pub_id'>) =>
    isOffline()
      ? (createNoDuplicates(group) as any)
      : (Promise.all([createNoDuplicates(group), addSheetRow(group)]) as any),
  {
    name: 'string',
    emails: ['string'],
    link_facebook: 'string',
    location_name: 'string',
    location_coord: {
      lat: 'number',
      lng: 'number',
    },
  }
)

export const removeGroup = lambdaBody(remove, { id: 'string' })
