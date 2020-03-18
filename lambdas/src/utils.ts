import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context } from 'aws-lambda'
import { ValidateStruct, ValidationTypes, validate } from './validate'

export const isOffline = () => !!process.env.OFFLINE

type ValidateEvent = {
  body?: ValidateStruct
  params?: { [x: string]: ValidationTypes }
}

const validateEvent = (validation: ValidateEvent, event: APIGatewayProxyEvent) =>
  new Promise((resolve, reject) => {
    const args = {
      ...(validation.body && event.body ? { body: JSON.parse(event.body) } : {}),
      ...(validation?.params && event.queryStringParameters
        ? { params: event.queryStringParameters }
        : {}),
    }
    const valid = validate(validation as any, args)
    return valid
      ? resolve()
      : reject(
          new Error(
            `Invalid parameters: \n\n ${JSON.stringify(validation, null, 2)} \n\n  ${JSON.stringify(
              args,
              null,
              2
            )}`
          )
        )
  })

export const lambda = (
  callback: (event: APIGatewayProxyEvent, context: Context) => Promise<any>,
  validation?: ValidateEvent
): APIGatewayProxyHandler => (event, context) =>
  Promise.resolve()
    .then(() => (validation ? validateEvent(validation, event) : null))
    .then(() => callback(event, context))
    .then(res => ({
      statusCode: 200,
      body: JSON.stringify(res),
    }))
    .catch(err => ({
      statusCode: 500,
      body: err.message,
    }))
