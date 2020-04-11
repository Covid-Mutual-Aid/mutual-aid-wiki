import { DocumentClient, GetItemInput, WriteRequest } from 'aws-sdk/clients/dynamodb'
import { isOffline } from './utils'
import { v4 as uuid } from 'uuid'

const offlineOptions = {
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'DEFAULT_ACCESS_KEY',
  secretAccessKey: 'DEFAULT_SECRET',
}

export const dynamoClient = isOffline() ? new DocumentClient(offlineOptions) : new DocumentClient()

// Helper
export default function createDynamoApi<T extends Record<string, any> & { id: string }>(
  TableName: string
) {
  return {
    create: <G extends Omit<T, 'id' | 'pub_id'>>(x: G) => {
      const Item = { ...x, id: (x.id || uuid()) as string, pub_id: (x.pub_id || uuid()) as string }
      return dynamoClient
        .put({ TableName, Item })
        .promise()
        .then(() => Item)
    },
    read: <K extends GetItemInput['Key']>(key: K) =>
      dynamoClient
        .get({ TableName, Key: key })
        .promise()
        .then((x) => x.Item as T),
    readAll: () =>
      dynamoClient
        .scan({ TableName })
        .promise()
        .then((x) => x.Items as T[]),
    remove: <K extends Partial<T>>(key: K) =>
      dynamoClient.delete({ TableName, Key: key }).promise(),
    batchCreate: (items: T[]) =>
      batchRequest(
        TableName,
        items.map((x) => ({ ...x, id: uuid(), pub_id: uuid() })).map(putRequest)
      ),
    batchDelete: (items: T[]) => batchRequest(TableName, items.map(deleteRequest)),
  }
}

const putRequest = <T extends { id: string }>(item: T): WriteRequest => ({
  PutRequest: { Item: item as any },
})
const deleteRequest = <T extends { id: string }>({ id }: T): WriteRequest => ({
  DeleteRequest: { Key: { id: id as any } },
})

const batchRequest = (tableName: string, items: WriteRequest[]): Promise<void> => {
  if (items.length < 1) return Promise.resolve()
  const [current, rest] = [items.slice(0, 25), items.slice(25)]
  return dynamoClient
    .batchWrite({ RequestItems: { [tableName]: current } })
    .promise()
    .then(() => batchRequest(tableName, rest))
}
