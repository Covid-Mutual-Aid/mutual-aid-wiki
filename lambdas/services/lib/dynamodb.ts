import AWS from 'aws-sdk'
import { isOffline } from './utils'
import uuid from 'uuid/v4'

const offlineOptions = {
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'DEFAULT_ACCESS_KEY', // needed if you don't have aws credentials at all in env
  secretAccessKey: 'DEFAULT_SECRET', // needed if you don't have aws credentials at all in env
}

export const dynamoClient = isOffline()
  ? new AWS.DynamoDB.DocumentClient(offlineOptions)
  : new AWS.DynamoDB.DocumentClient()

// Helper
export default function createDynamoApi<T extends Record<string, any> & { id: string }>(
  TableName: string
) {
  return {
    create: <G extends Omit<T, 'id' | 'pub_id'>>(x: G) =>
      dynamoClient
        .put({
          TableName,
          Item: { ...x, id: x.id || uuid(), pub_id: x.pub_id || uuid() },
        })
        .promise(),
    read: <K extends Partial<T>>(key: K) =>
      dynamoClient
        .get({ TableName, Key: key })
        .promise()
        .then(x => x.Item as T),
    readAll: () =>
      dynamoClient
        .scan({ TableName })
        .promise()
        .then(x => x.Items as T[]),
    remove: <K extends Partial<T>>(key: K) =>
      dynamoClient.delete({ TableName, Key: key }).promise(),
  }
}

// export const batchRemove = (groups: Group[]) =>
//   dynamoClient
//     .batchWrite({
//       RequestItems: {
//         [TableName]: [
//           groups
//             .filter(x => x.id && typeof x.id === 'string')
//             .map(x => ({ DeleteRequest: { Key: { id: x.id } } })) as any,
//         ],
//       },
//     })
//     .promise()
