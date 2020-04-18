import { APIGatewayProxyEvent } from 'aws-lambda'
import { sendData } from './external/slack'
import { Group } from './types'

export const requestFailed = (message: string, event: APIGatewayProxyEvent) =>
  sendData('Failed request', {
    message,
    method: event.httpMethod,
    path: event.path,
    params: event.queryStringParameters,
    body: event.body,
    resource: event.resource,
  })

export const groupCreated = (group: Partial<Group>) => sendData('Group created', group)
