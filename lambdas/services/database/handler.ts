import uuid from 'uuid/v4'
import AWS from 'aws-sdk'

import { isOffline, lambdaQuery, lambdaBody } from '../lib/utils'
import { Group } from '../lib/types'

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

// Helpers
export const putGroup = (group: Omit<Group, 'id'> & { id?: 'id' }) => {
  const Item = { ...group, id: group.id || uuid() }
  return dynamoClient
    .put({ TableName, Item })
    .promise()
    .then(() => Item)
}

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
  x && x.id
    ? dynamoClient
        .get({ TableName, Key: { id: x.id } })
        .promise()
        .then(x => x.Item)
    : scanGroups()
)

export const create = lambdaBody((group: Group) => putGroup(group), {
  name: 'string',
  link_facebook: 'string',
  location_name: 'string',
})

export const remove = lambdaBody(removeGroup, { id: 'string' })
