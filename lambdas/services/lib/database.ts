import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { v4 as uuid } from 'uuid'

import createDynamoTableApi from '../lib/createDynamoTableApi'
import { Group, Search, StoredGroup, StoredSearch } from '../lib/types'
import { isOffline } from '../lib/utils'

const offlineOptions = {
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'DEFAULT_ACCESS_KEY',
  secretAccessKey: 'DEFAULT_SECRET',
}

export const dynamoClient = isOffline() ? new DocumentClient(offlineOptions) : new DocumentClient()

export const groupsdb = createDynamoTableApi<Group, StoredGroup>(
  dynamoClient,
  process.env.GROUPS_TABLE as string,
  (x) => ({
    id: uuid(),
    pub_id: uuid(),
    created_at: Date.now(),
    updated_at: Date.now(),
    ...x,
  })
)

export const searchesdb = createDynamoTableApi<Search, StoredSearch>(
  dynamoClient,
  process.env.LOCATION_SEARCHES_TABLE as string,
  (x) => ({
    id: uuid(),
    created_at: Date.now(),
    updated_at: Date.now(),
    ...x,
  })
)
