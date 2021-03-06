import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { Group, Search, Token } from './types'
import createTableAPI from './lib/createTableAPI'
import ENV, { isOffline } from './environment'

const offlineOptions = {
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'DEFAULT_ACCESS_KEY',
  secretAccessKey: 'DEFAULT_SECRET',
  convertEmptyValues: true,
}

export const dynamoClient = isOffline()
  ? new DocumentClient(offlineOptions)
  : new DocumentClient({ convertEmptyValues: true })

export const groupsdb = createTableAPI<Group>({
  table: ENV.GROUPS_TABLE as string,
  client: dynamoClient,
})

export const searchesdb = createTableAPI<Search>({
  table: ENV.LOCATION_SEARCHES_TABLE as string,
  client: dynamoClient,
})

export const tokensdb = createTableAPI<Token>({
  table: ENV.ACTIVE_TOKENS as string,
  client: dynamoClient,
})

const db = {
  search: searchesdb,
  groups: groupsdb,
  tokens: tokensdb,
}

export default db
