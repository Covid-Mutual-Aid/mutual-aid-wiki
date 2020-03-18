import { APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'

import { getGroups } from './src/data'

export const groups: APIGatewayProxyHandler = async (_event, _context) =>
  getGroups().then(groups => ({
    statusCode: 200,
    body: JSON.stringify(groups),
  }))

export const group: APIGatewayProxyHandler = async (_event, _context) => {
  return {
    statusCode: 200,
    body: JSON.stringify(_event),
  }
}
