import { mergeMap } from 'rxjs/operators'
import { ObservableInput, throwError } from 'rxjs'

import tokens, { Tokens } from './tokens'
import { LambdaInput } from './lib/lambdaRx'

export const authorise = <K extends keyof Tokens>(key: K) =>
  mergeMap((input: LambdaInput) => {
    const params = input._event.queryStringParameters
    if (!params || !params.token) return throwError('No auth token')
    return tokens[key].verify(params.token) as ReturnType<Tokens[K]['verify']>
  })

export const switchMergeKey = <A extends { [x: string]: any }, B extends any, K extends string>(
  key: K,
  cb: (x: A) => Promise<B>
) =>
  mergeMap<A, ObservableInput<A & { [Key in K]: B }>>((x) =>
    cb(x).then((y) => ({ ...x, [key]: y }))
  )
