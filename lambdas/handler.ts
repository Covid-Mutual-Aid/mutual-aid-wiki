import { APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'

import dynamoClient from './src/lib/dynamodb'

export const hello: APIGatewayProxyHandler = async (event, _context) => {
  const res = await dynamoClient.scan({ TableName: 'dev-groups' }).promise()
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Headers': '*',
      'access-control-allow-credentials': 'false',
    },
    body: JSON.stringify(
      {
        message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
        input: event,
        res,
      },
      null,
      2
    ),
  }
}
