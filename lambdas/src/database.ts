import uuid from 'uuid/v4'
import AWS from 'aws-sdk'

import { isOffline } from './utils'

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
import { Group } from './types'

export const getGroups = () =>
  dynamoClient
    .scan({ TableName })
    .promise()
    .then(x => x.Items)

export const getGroup = ({ id }: { id: string }) =>
  dynamoClient
    .get({ TableName, Key: { id } })
    .promise()
    .then(x => x.Item)

export const createGroup = (group: Group) =>
  dynamoClient.put({ TableName, Item: { ...group, id: group.id || uuid() } }).promise()

export const removeGroup = ({ id }: { id: string }) =>
  dynamoClient.delete({ TableName, Key: { id } }).promise()
