import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { Group, Search, AuthKey } from '../lib/types'
import createTableAPI from './createTableAPI'
import { isOffline, tables } from './environment'

const offlineOptions = {
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'DEFAULT_ACCESS_KEY',
  secretAccessKey: 'DEFAULT_SECRET',
}

export const dynamoClient = isOffline() ? new DocumentClient(offlineOptions) : new DocumentClient()

export const groupsdb = createTableAPI<Group>({
  table: tables.GROUPS_TABLE as string,
  client: dynamoClient,
})

export const searchesdb = createTableAPI<Search>({
  table: tables.LOCATION_SEARCHES_TABLE as string,
  client: dynamoClient,
})

export const authkeysdb = createTableAPI<AuthKey>({
  table: tables.AUTHENTICATED_KEYS_TABLE as string,
  client: dynamoClient,
})

const db = {
  search: searchesdb,
  groups: groupsdb,
  authkeys: authkeysdb,
}

export default db
