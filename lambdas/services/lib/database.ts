import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { Group, Search } from '../lib/types'
import { isOffline } from '../lib/utils'
import createTableAPI from './createTableAPI'

const offlineOptions = {
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'DEFAULT_ACCESS_KEY',
  secretAccessKey: 'DEFAULT_SECRET',
}

export const dynamoClient = isOffline() ? new DocumentClient(offlineOptions) : new DocumentClient()

export const groupsdb = createTableAPI<Group>({
  table: process.env.GROUPS_TABLE as string,
  client: dynamoClient,
})

export const searchesdb = createTableAPI<Search>({
  table: process.env.LOCATION_SEARCHES_TABLE as string,
  client: dynamoClient,
})

export default {
  search: searchesdb,
  groups: groupsdb,
}
