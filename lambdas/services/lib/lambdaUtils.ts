import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda'
import { Proof, isProved, ProofType } from 'ts-prove'
import { isOffline } from './utils'

const promiseProof = <T extends any>(proof: Proof<T>) => (arg: any) => {
  const result = proof(arg)
  if (Array.isArray(result) && isProved(result)) return Promise.resolve(result[1])
  return Promise.reject((result as any)[0])
}

const lambda = (callback: (event: APIGatewayProxyEvent, context: Context) => any) => (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> =>
  Promise.resolve(callback(event, context))
    .then((res) => ({
      statusCode: 200,
      body: JSON.stringify(res),
      headers: { 'Access-Control-Allow-Origin': '*' },
    }))
    .catch((err) => ({
      statusCode: 500,
      body: err.message || err,
    }))

lambda.body = <T extends Proof<any>>(proof?: T) => (callback: (x: ProofType<T>) => Promise<any>) =>
  lambda((event) =>
    new Promise<ProofType<T>>((resolve, reject) => {
      const data = JSON.parse(event.body || '{}') as ProofType<T>
      if (!proof || !isOffline) return resolve(data)
      return promiseProof(proof)(data)
    }).then(callback)
  )

lambda.queryParams = <T extends Proof<any>>(proof?: T) => (
  callback: (x: ProofType<T>) => Promise<any>
) =>
  lambda((event) =>
    new Promise<ProofType<T>>((resolve, reject) => {
      const data = event.queryStringParameters as ProofType<T>
      if (!proof || !isOffline) return resolve(data)
      return promiseProof(proof)(data)
    }).then(callback)
  )

export default lambda
