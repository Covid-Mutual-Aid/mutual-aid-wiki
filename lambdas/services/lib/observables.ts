import { mergeMap, map } from 'rxjs/operators'
import { of, throwError, ObservableInput } from 'rxjs'
import { verify } from 'jsonwebtoken'
import { is } from 'ts-prove'

import { LRXReq, params$ } from './lrx'
import ENV from './environment'

export const jwt$ = mergeMap((token?: string) => {
  if (!token) return throwError(`Didn't receive authorisation token`)
  const result = verify(token, ENV.JWT_SECRET)
  if (is.string(result)) return throwError(result)
  if ((result as any).error) return throwError((result as any).error)
  return of(result)
})

export const authorise$ = mergeMap((input: LRXReq) =>
  of(input).pipe(
    params$,
    map((params) => params.token as string),
    jwt$
  )
)

export const authorise = <A extends object, B extends any>(fn: (token: A) => B) =>
  mergeMap((input: LRXReq) =>
    of(input).pipe(
      params$,
      map((params) => params.token as string),
      jwt$,
      map((x) => fn(x as any))
    )
  )

export const switchMergeKey = <A extends { [x: string]: any }, B extends any, K extends string>(
  key: K,
  cb: (x: A) => Promise<B>
) =>
  mergeMap<A, ObservableInput<A & { [Key in K]: B }>>((x) =>
    cb(x).then((y) => ({ ...x, [key]: y }))
  )
