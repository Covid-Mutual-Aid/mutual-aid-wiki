import uuid from 'uuid/v4'
import AWS from 'aws-sdk'

import { lambdaQuery, lambdaBody } from '../lib/lambdaUtils'
import { Group } from '../lib/types'
import { isSameGroup, isOffline } from '../lib/utils'
import { addSheetRow } from '../google/sheets'

const offlineOptions = {
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'DEFAULT_ACCESS_KEY', // needed if you don't have aws credentials at all in env
  secretAccessKey: 'DEFAULT_SECRET', // needed if you don't have aws credentials at all in env
}

const dynamoClient = isOffline()
  ? new AWS.DynamoDB.DocumentClient(offlineOptions)
  : new AWS.DynamoDB.DocumentClient()

const TableName = process.env.DYNAMODB_TABLE as string

// Helper
export const putGroup = (group: Omit<Group, 'id'> & { id?: string }) => {
  const Item = { ...group, id: group.id || uuid() }
  return scanGroups().then(groups =>
    groups.some(x => isSameGroup(x, group))
      ? 'Exists'
      : dynamoClient
          .put({ TableName, Item })
          .promise()
          .then(() => 'Done')
  )
}

export const getGroup = ({ id }: { id: string }) =>
  dynamoClient
    .get({ TableName, Key: { id } })
    .promise()
    .then(x => x.Item)

export const scanGroups = () =>
  dynamoClient
    .scan({ TableName })
    .promise()
    .then(x => x.Items as Group[])

export const removeGroup = ({ id }: { id: string }) =>
  dynamoClient.delete({ TableName, Key: { id } }).promise()

export const batchRemove = (groups: Group[]) =>
  dynamoClient
    .batchWrite({
      RequestItems: {
        [TableName]: [
          groups
            .filter(x => x.id && typeof x.id === 'string')
            .map(x => ({ DeleteRequest: { Key: { id: x.id } } })) as any,
        ],
      },
    })
    .promise()

// Lambdas
export const get = lambdaQuery((x?: { id?: string }) =>
  x && x.id ? getGroup(x as { id: string }) : scanGroups()
)

export const create = lambdaBody(
  (group: Omit<Group, 'id'>) => Promise.all([putGroup(group), addSheetRow(group)]),
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

export const remove = lambdaBody(removeGroup, { id: 'string' })
