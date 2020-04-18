import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda'
import { is, Proof, ProofType, isProved } from 'ts-prove'
import { verify } from 'jsonwebtoken'

import { of, Observable, throwError, OperatorFunction, ObservableInput, forkJoin } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'

import { requestFailed } from './logging'
import ENV from './environment'

export type Input = {
  _event: APIGatewayProxyEvent
  _context: Context
}
type OpR<O> = O extends OperatorFunction<any, infer D> ? D : never

const lambdaRx = (req$: (payload: Observable<Input>) => Observable<APIGatewayProxyResult>) => (
  _event: APIGatewayProxyEvent,
  _context: Context
) =>
  req$(of({ _event, _context }))
    .toPromise()
    .catch((err) =>
      requestFailed(JSON.stringify(err), _event).then(() => ({
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(err),
      }))
    )

// Selectors
export const body = <P extends Proof<any>>(proof?: P) =>
  mergeMap((input: Input) => {
    const body = JSON.parse(input._event.body || '{}') as ProofType<P>
    if (proof) return prove(proof)(body)
    return of(body)
  })

export const params = <P extends Proof<any>>(proof?: P) =>
  mergeMap((input: Input) => {
    const params = input._event.queryStringParameters as ProofType<P>
    if (proof) return prove(proof)(params)
    return of(params)
  })

export const authorise = <P extends Proof<any>>(proof?: P) =>
  mergeMap((input: Input) => {
    const params = input._event.queryStringParameters
    if (!params || !params.token) return throwError('No auth token')
    const result = verify(params.token, ENV.JWT_SECRET) as ProofType<P>
    if (is.string(result)) return throwError(result)
    if ((result as any).error) return throwError((result as any).error)
    if (proof) return prove(proof)(result)
    return of(result)
  })

// Helpers
export const select = <T extends { [key: string]: OperatorFunction<any, any> }>(selects: T) =>
  mergeMap((input: Input) => {
    return forkJoin<{ [Key in keyof T]: ObservableInput<OpR<T[Key]>> }, keyof T>(
      Object.keys(selects).reduce(
        (all, key) => ({ ...all, [key]: of(input).pipe(selects[key] as any) }),
        {}
      ) as { [Key in keyof T]: any }
    )
  })

export const prove = <P extends Proof<any>>(proof: P) => <T extends Record<string, any>>(
  input: T
) => {
  const proven = proof(input)
  if (isProved(proven)) return of(proven[1] as ProofType<P>)
  return throwError(proven[0])
}

export const response$ = map((res) => ({
  statusCode: 200,
  headers: { 'Access-Control-Allow-Origin': '*' },
  body: JSON.stringify(res),
}))

const lambda = lambdaRx
export default lambda
