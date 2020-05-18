import { DocumentClient, WriteRequest } from 'aws-sdk/clients/dynamodb'
import { v4 as uuid } from 'uuid'
import { is } from 'ts-prove'

const toExp = (x: any): any => {
  if (is.string(x)) return { S: x }
  if (is.number(x)) return { N: x }
  if (Array.isArray(x)) return { L: x.map(toExp) }
  if (x && typeof x === 'object')
    return { M: Object.keys(x).reduce((all, key) => ({ ...all, [key]: toExp(x[key]) }), {}) }
}

export default function createTableAPI<
  T extends { id: string; created_at?: string; updated_at?: string }
>({ table, client }: { table: string; client: DocumentClient }) {
  const TableName = table
  const create = (x: Omit<T, 'id'>) => ({
    ...x,
    id: uuid(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  const update = (item: Partial<T> & { id: string; updated_at?: string }) => {
    const modifiedKeys = Object.keys(item).filter(
      (x) => !['updated_at', 'created_at', 'id'].includes(x)
    )

    return {
      ...item,
      TableName,
      Key: { id: item.id },
      ExpressionAttributeValues: modifiedKeys.reduce(
        (a, b) => ({ ...a, [`:${b}`]: (item as any)[b] }),
        { [':updated_at']: Date.now() }
      ),
      ExpressionAttributeNames: modifiedKeys.reduce((all, key) => ({ ...all, [`#${key}`]: key }), {
        ['#updated_at']: 'updated_at',
      }),
      UpdateExpression: `SET ${modifiedKeys.reduce(
        (a, b) => a + `, #${b} = :${b}`,
        '#updated_at = :updated_at'
      )}`,
      ReturnValues: 'ALL_NEW',
    }
  }

  return {
    TableName,
    client,
    get: <A extends (keyof T)[]>(attributes: A) => {
      const getAll = (
        items: Pick<T, A[number]>[],
        ExclusiveStartKey?: Record<string, string>
      ): Promise<Pick<T, A[number]>[]> =>
        client
          .scan({
            TableName,
            ExclusiveStartKey,
            ...(ExclusiveStartKey ? { ExclusiveStartKey } : {}),
            ...(attributes ? { AttributesToGet: attributes as string[] } : {}),
          })
          .promise()
          .then((x) =>
            x.LastEvaluatedKey
              ? getAll([...items, ...(x.Items as any)], x.LastEvaluatedKey)
              : [...items, ...(x.Items as any)]
          )

      return getAll([])
    },
    getById: <A extends (keyof T)[]>(id: string, attributes: A) =>
      client
        .get({
          TableName,
          Key: { id },
          AttributesToGet: attributes as string[],
        })
        .promise()
        .then((x) => x.Item as Pick<T, A[number]>),

    getByKeyEqualTo: <Key extends keyof T>(key: Key, value: T[Key]) => {
      const params = {
        TableName,
        ScanIndexForward: true,
        FilterExpression: `#${key} = :${key}`,
        ExpressionAttributeNames: { [`#${key}`]: key as string },
        ExpressionAttributeValues: { [`:${key}`]: value },
      }
      return client
        .scan(params)
        .promise()
        .then((x) => x.Items as T[])
    },

    create: (item: Omit<T, 'id'>) => {
      const Item = create(item)
      return client
        .put({ TableName, Item })
        .promise()
        .then(() => Item)
    },
    createBatch: (items: Omit<T, 'id'>[]) =>
      batchRequest(client, TableName, items.map(create).map(putRequest)),

    update: (item: Partial<T> & { id: string; updated_at?: string }) => {
      const UpdateItemInput = update(item)
      return client
        .update(UpdateItemInput)
        .promise()
        .then((x) => (x.$response.data as any).Attributes)
    },
    // Untested
    updateBatch: (items: (Partial<T> & { id: string; updated_at?: string })[]) =>
      batchRequest(client, TableName, items.map(update).map(putRequest)),

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
