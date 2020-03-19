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

export const get = lambdaQuery((x?: { id?: string }) =>
  x && x.id
    ? dynamoClient
        .get({ TableName, Key: { id: x.id } })
        .promise()
        .then(x => x.Item)
    : dynamoClient
        .scan({ TableName })
        .promise()
        .then(x => x.Items)
)

export const create = lambdaBody(
  (group: Group) =>
    dynamoClient.put({ TableName, Item: { ...group, id: group.id || uuid() } }).promise(),
  {
    name: 'string',
    link_facebook: 'string',
    location_name: 'string',
  }
)

export const remove = lambdaBody(
  ({ id }: { id: string }) => dynamoClient.delete({ TableName, Key: { id } }).promise(),
  { id: 'string' }
)
