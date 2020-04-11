import { DocumentClient, WriteRequest } from 'aws-sdk/clients/dynamodb'
import { v4 as uuid } from 'uuid'

type GetReturn<T extends { [x: string]: any }, A extends (keyof T)[]> = {
  [Key in A[number]]: T[A[number]]
}

export default function createTableAPI<T extends { [x: string]: any } & { id: string }>({
  table,
  client,
}: {
  table: string
  client: DocumentClient
}) {
  const TableName = table
  const create = (x: Omit<T, 'id'>) => ({
    ...x,
    id: uuid(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })
  return {
    get: <A extends (keyof T)[]>(attributes: A) =>
      client
        .scan({
          TableName,
          ...(attributes ? { AttributesToGet: attributes as string[] } : {}),
        })
        .promise()
        .then((x) => x.Items as GetReturn<T, A>[]),

    getById: <A extends (keyof T)[]>(id: string, attributes: A) =>
      client
        .get({
          TableName,
          Key: { id },
          AttributesToGet: attributes as string[],
        })
        .promise()
        .then((x) => x.Item as GetReturn<T, A>),

    create: (item: Omit<T, 'id'>) => {
      const Item = create(item)
      return client
        .put({ TableName, Item })
        .promise()
        .then(() => Item)
    },
    createBatch: (items: Omit<T, 'id'>[]) =>
      batchRequest(client, TableName, items.map(create).map(putRequest)),

    update: (item: Partial<T> & { id: string }) => {
      const modifiedKeys = Object.keys(item).filter((x) => x !== 'id')
      return client
        .update({
          TableName,
          Key: { id: item.id },
          ExpressionAttributeValues: modifiedKeys.reduce(
            (a, b) => ({ ...a, [`:${b}`]: item[b] }),
            {}
          ),
          UpdateExpression: `SET ${modifiedKeys.reduce((a, b) => a + `, ${b} = :${b}`).slice(1)}`,
          ReturnValues: 'ALL_NEW',
        })
        .promise()
        .then((x) => x.$response.data)
    },

    delete: (id: string) => client.delete({ TableName, Key: { id } }).promise(),
    deleteBatch: (ids: string[]) => batchRequest(client, TableName, ids.map(deleteRequest)),
  }
}

const putRequest = <T extends { id: string }>(item: T): WriteRequest => ({
  PutRequest: { Item: item as any },
})
const deleteRequest = (id: string): WriteRequest => ({
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
