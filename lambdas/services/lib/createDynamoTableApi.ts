import { DocumentClient, GetItemInput, WriteRequest } from 'aws-sdk/clients/dynamodb'

type Rebuild<T extends Record<any, any>> = { [K in keyof T]: T[K] }
type PartialP<T extends Record<any, any>, K extends keyof T> = Rebuild<
  Omit<T, K> & { [Key in K]?: T[K] }
>

export default function createDynamoTableApi<
  T extends Record<string, any>,
  R extends T & { id: string }
>(client: DocumentClient, TableName: string, transform: (x: PartialP<T, 'id'>) => R) {
  const trans = (x: PartialP<T, 'id'>) => (x.id ? x : transform(x)) as R
  return {
    create: <G extends PartialP<T, 'id'>>(x: G) =>
      client
        .put({ TableName, Item: trans(x) })
        .promise()
        .then(() => trans(x)),
    update: <G extends Partial<T> & { id: string }>(x: G) =>
      client
        .put({ TableName, Item: { ...x, updated_at: Date.now() } })
        .promise()
        .then(() => x),
    get: <K extends GetItemInput['Key']>(key: K) =>
      client
        .get({ TableName, Key: key })
        .promise()
        .then((x) => x.Item as R),
    scan: () =>
      client
        .scan({ TableName })
        .promise()
        .then((x) => x.Items as R[]),
    remove: <K extends Partial<T>>(key: K) => client.delete({ TableName, Key: key }).promise(),
    batchCreate: <G extends PartialP<T, 'id'>>(items: G[]) =>
      batchRequest(client, TableName, items.map(trans).map(putRequest)),
    batchDelete: (items: R[]) => batchRequest(client, TableName, items.map(deleteRequest)),
  }
}

const putRequest = <T extends { id: string }>(item: T): WriteRequest => ({
  PutRequest: { Item: item as any },
})
const deleteRequest = <T extends { id: string }>({ id }: T): WriteRequest => ({
  DeleteRequest: { Key: { id: id as any } },
})

const batchRequest = (
  client: DocumentClient,
  tableName: string,
  items: WriteRequest[]
): Promise<void> => {
  if (items.length < 1) return Promise.resolve()
  const [current, rest] = [items.slice(0, 25), items.slice(25)]
  return client
    .batchWrite({ RequestItems: { [tableName]: current } })
    .promise()
    .then(() => batchRequest(client, tableName, rest))
}
