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

import { Group } from './types'

export const getGroups = () =>
  dynamoClient
    .scan({ TableName: process.env.DYNAMODB_TABLE as string })
    .promise()
    .then(x => x.Items)

export const addGroup = (group: Omit<Group, 'id'>) =>
  dynamoClient
    .put({
      TableName: process.env.DYNAMODB_TABLE as string,
      Item: { ...group, id: uuid() },
    })
    .promise()
