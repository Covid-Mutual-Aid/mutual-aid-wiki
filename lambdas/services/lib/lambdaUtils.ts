import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context } from 'aws-lambda'
import { ValidateStruct, ValidationTypes, validate, Validated, ValidationObj } from './validate'

export const isOffline = () => !!process.env.OFFLINE || !!process.env.IS_LOCAL

type ValidateEvent<T extends ValidateStruct> = {
  body?: T
  queryStringParameters?: { [x: string]: T }
}

const validateEvent = (validation: ValidateEvent, event: APIGatewayProxyEvent) =>
  new Promise((resolve, reject) => {
    const args = {
      ...(validation.body && event.body ? { body: JSON.parse(event.body) } : {}),
      ...(validation?.queryStringParameters && event.queryStringParameters
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

export const lambda = <T extends ValidateStruct>(
  callback: (event: APIGatewayProxyEvent & Validated<T>, context: Context) => Promise<any>,
  validation?: ValidateEvent<T>
): APIGatewayProxyHandler => (event, context) =>
  Promise.resolve()
    .then(() => console.log('BODY', { validation }, event.body && JSON.parse(event.body)))
    .then(() =>
      validation && (validation.body || validation.queryStringParameters)
        ? validateEvent(validation, event)
        : null
    )
    .then(() => console.log('Validated'))
    .then(() => callback(event as any, context))
    .then(res => ({
      statusCode: 200,
      body: JSON.stringify(res),
      headers: { 'Access-Control-Allow-Origin': '*' },
    }))
    .catch(err => ({
      statusCode: 500,
      body: err.message || err,
    }))

export const lambdaBody = <T extends ValidationObj>(
  callback: (x: Validated<T>) => Promise<any>,
  validation?: T
): APIGatewayProxyHandler =>
  lambda(event => callback(JSON.parse(event.body as any)), { body: validation })

export const lambdaQuery = <T extends ValidationObj>(
  callback: (x: Validated<T>) => Promise<any>,
  validation?: { [x: string]: ValidationTypes }
): APIGatewayProxyHandler =>
  lambda(event => callback(event.queryStringParameters as any), {
    queryStringParameters: validation,
  })
