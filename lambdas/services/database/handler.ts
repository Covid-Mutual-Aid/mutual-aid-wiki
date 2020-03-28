import { lambdaQuery, lambdaBody } from '../lib/lambdaUtils'
import { Group } from '../lib/types'
import { isSameGroup, isOffline, omit } from '../lib/utils'
import { addSheetRow } from '../google/sheets'
import createDynamoApi from '../lib/dynamodb'

const TableName = process.env.DYNAMODB_TABLE as string
const { create, remove, read, readAll } = createDynamoApi<Group>(TableName)

// Helper
export const createNoDuplicates = (
  group: Omit<Group, 'id' | 'pub_id'> & { id?: string; pub_id?: string }
) =>
  readAll().then(groups =>
    groups.some(x => isSameGroup(x, group)) ? 'Exists' : create(group).then(() => 'Added')
  )

// Lambdas
export const getGroup = lambdaQuery((x?: { pub_id?: string }) =>
  x && x.pub_id
    ? read(x as { pub_id: string }).then(omit('id'))
    : readAll().then(x => x.map(omit('id')))
)

export const createGroup = lambdaBody(
  (group: Omit<Group, 'id' | 'pub_id'>) =>
    isOffline()
      ? (createNoDuplicates(group) as any)
      : (Promise.all([createNoDuplicates(group), addSheetRow(group)]) as any),
  {
    name: 'string',
    link_facebook: 'string',
    location_name: 'string',
    location_coord: {
      lat: 'number',
      lng: 'number',
    },
  }
)

export const removeGroup = lambdaBody(remove, { id: 'string' })
