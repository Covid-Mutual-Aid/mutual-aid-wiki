import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda'
import { Proof, ProofType, isProved } from 'ts-prove'

import { of, Observable, throwError, OperatorFunction, ObservableInput, forkJoin } from 'rxjs'
import { map, mergeMap, switchMap } from 'rxjs/operators'

import { requestFailed } from '../logging'

export type LambdaInput = {
  _event: APIGatewayProxyEvent
  _context: Context
}
type OpR<O> = O extends OperatorFunction<any, infer D> ? D : never

const lambdaRx = (
  req$: (payload: Observable<LambdaInput>) => Observable<APIGatewayProxyResult>
) => (_event: APIGatewayProxyEvent, _context: Context) =>
  req$(
    of({ _event, _context }).pipe(
      switchMap((input) => {
        if (/localhost|mutualaid\.wiki/.test(input._event.headers['x-forwarded-host']))
          return of(input)
        return Promise.reject('Invalid origin')
      })
    )
  )
    .toPromise()
    .catch((err) => {
      console.log(err)
      const error = err.message || err
      return requestFailed(JSON.stringify({ message: error }), _event).then(() => ({
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': 'mutualaid.wiki' },
        body: JSON.stringify({ message: error }),
      }))
    })

// Selectors
export const body = <P extends Proof<any>>(proof?: P) =>
  mergeMap((input: LambdaInput) => {
    const body = JSON.parse(input._event.body || '{}') as ProofType<P>
    if (proof) return prove(proof)(body)
    return of(body)
  })

export const params = <P extends Proof<any>>(proof?: P) =>
  mergeMap((input: LambdaInput) => {
    const params = input._event.queryStringParameters as ProofType<P>
    if (proof) return prove(proof)(params)
    return of(params)
  })

// Helpers
export const select = <T extends { [key: string]: OperatorFunction<any, any> }>(selects: T) =>
  mergeMap((input: LambdaInput) => {
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

export const responseJson$ = map((res) => ({
  statusCode: 200,
  headers: { 'Access-Control-Allow-Origin': '*' },
  body: JSON.stringify(res),
}))

const lambda = lambdaRx
export default lambda
