import AWS from 'aws-sdk'
import { isOffline } from './utils'

const offlineOptions = {
  region: 'localhost',
  endpoint: 'http://localhost:8000',
}

const client = isOffline()
  ? new AWS.DynamoDB.DocumentClient(offlineOptions)
  : new AWS.DynamoDB.DocumentClient()

export default client
