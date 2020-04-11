import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda'
import { Proof, isProved, ProofType } from 'ts-prove'

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
  lambda((event) => {
    console.log('post body', JSON.parse(event.body || '{}'))
    return new Promise((resolve, reject) => {
      const body = JSON.parse(event.body || '{}') as Record<string, any>
      if (!proof) return resolve(body)
      const result = proof(body)
      if (isProved(result)) return resolve(body)
      return reject(result[0])
    })
  })

lambda.queryParams = <T extends Proof<any>>(proof?: T) => (
  callback: (x: ProofType<T>) => Promise<any>
) =>
  lambda((event) =>
    Promise.resolve(
      !proof
        ? event.queryStringParameters || ({} as any)
        : promiseProof(proof)(event.queryStringParameters || {})
    ).then(callback)
  )

export default lambda
