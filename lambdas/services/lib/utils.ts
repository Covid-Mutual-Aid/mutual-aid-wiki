import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context } from 'aws-lambda'
import { ValidateStruct, ValidationTypes, validate } from './validate'

export const isOffline = () => !!process.env.OFFLINE || !!process.env.IS_LOCAL

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
    .then(() => console.log('BODY', { validation }, event.body && JSON.parse(event.body)))
    .then(() =>
      validation && (validation.body || validation.params) ? validateEvent(validation, event) : null
    )
    .then(() => console.log('Validated'))
    .then(() => callback(event, context))
    .then(res => ({
      statusCode: 200,
      body: JSON.stringify(res),
      headers: { 'Access-Control-Allow-Origin': '*' },
    }))
    .catch(err => ({
      statusCode: 500,
      body: err.message || err,
    }))

export const lambdaBody = (
  callback: (x: any) => Promise<any>,
  validation?: ValidateStruct
): APIGatewayProxyHandler =>
  lambda(event => callback(JSON.parse(event.body as any)), { body: validation })

export const lambdaQuery = (
  callback: (x: any) => Promise<any>,
  validation?: { [x: string]: ValidationTypes }
): APIGatewayProxyHandler =>
  lambda(event => callback(event.queryStringParameters), { params: validation })
