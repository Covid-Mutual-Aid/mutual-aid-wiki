import { APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'

import dynamoClient from './src/lib/dynamodb'

export const groups: APIGatewayProxyHandler = async (_event, _context) => {
  const groups = await dynamoClient
    .scan({ TableName: process.env.DYNAMODB_TABLE as string })
    .promise()
    .catch(err => err.message)
    .then(x => x.Items)

  return {
    statusCode: 200,
    body: JSON.stringify(groups),
  }
}
