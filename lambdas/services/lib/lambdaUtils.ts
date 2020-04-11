import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda'
import { Proof, isProved, ProofType } from 'ts-prove'
import { isOffline } from './utils'
import { failedRequest } from './slack'

const promiseProof = <T extends any>(proof: Proof<T>, arg: any): Promise<T> =>
  new Promise((res, rej) => {
    const result = proof(arg)
    if (Array.isArray(result) && isProved(result)) return res(result[1])
    return rej((result as any)[0])
  })

const lambda = (callback: (event: APIGatewayProxyEvent, context: Context) => any) => (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> =>
  new Promise((res) => res(callback(event, context)))
    .then((res) => ({
      statusCode: 200,
      body: JSON.stringify(res),
      headers: { 'Access-Control-Allow-Origin': '*' },
    }))
    .catch((err) =>
      Promise.resolve(
        isOffline() || process.env.TESTING
          ? err
          : failedRequest({
              method: event.httpMethod,
              path: event.path,
              params: event.queryStringParameters,
              body: event.body,
              resource: event.resource,
            }).then(() => err)
      ).then((err) => ({
        statusCode: 500,
        body: JSON.stringify({ error: err.message || err }),
      }))
    )

const prooveArgs = (selector: (event: APIGatewayProxyEvent) => any) => <T extends Proof<any>>(
  proof?: T
) => <R extends any = any>(callback: (arg: ProofType<T>) => Promise<R>) => (
  event: APIGatewayProxyEvent,
  _context: Context
) =>
  new Promise<ProofType<T>>((resolve, reject) => {
    const data = (selector(event) || {}) as ProofType<T>
    if (!proof || isOffline()) return resolve(data)
    return promiseProof(proof, data).then(resolve).catch(reject)
  }).then(callback)

export const useBody = prooveArgs((event) => JSON.parse(event.body || '{}'))
export const useParams = prooveArgs((event) => event.queryStringParameters)

type HTTPMethods = 'GET' | 'POST' | 'PUT' | 'DELETE'

export const useMethod = <
  T extends {
    [Key in HTTPMethods]?: (event: APIGatewayProxyEvent, context: Context) => Promise<any>
  }
>(
  methods: T
) => (event: APIGatewayProxyEvent, context: Context) => {
  if (!methods[event.httpMethod as HTTPMethods])
    return Promise.reject(`Unreconised http method ${event.httpMethod}`)
  return (methods[event.httpMethod as HTTPMethods] as any)(event, context)
}

export default lambda
