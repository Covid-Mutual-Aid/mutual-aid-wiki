import AWS from 'aws-sdk'
import { isOffline } from './utils'

const offlineOptions = {
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'DEFAULT_ACCESS_KEY', // needed if you don't have aws credentials at all in env
  secretAccessKey: 'DEFAULT_SECRET', // needed if you don't have aws credentials at all in env
}

const client = isOffline()
  ? new AWS.DynamoDB.DocumentClient(offlineOptions)
  : new AWS.DynamoDB.DocumentClient()

export default client
