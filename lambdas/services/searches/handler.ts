import P, { ProofType } from 'ts-prove'

import { triggorLocationSearch } from '../lib/pusher'
import createDynamoApi from '../lib/dynamodb'
import lambda from '../lib/lambdaUtils'
import { v4 as uuid } from 'uuid'

const proveLocationSearch = P.shape({
  query: P.string,
  place_id: P.string,
  address: P.string,
  coords: P.shape({ lat: P.number, lng: P.number }),
})

const TableName = process.env.LOCATION_SEARCHES_TABLE as string
const { create, readAll } = createDynamoApi<ProofType<typeof proveLocationSearch> & { id: string }>(
  TableName
)

export const getLocationSearches = lambda(readAll)
export const addLocationSearch = lambda.body(proveLocationSearch)(data =>
  create({ ...data, id: uuid(), createdAt: Date.now() }).then(() =>
    triggorLocationSearch(data.coords)
  )
)
