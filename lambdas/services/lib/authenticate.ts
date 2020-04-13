import { mergeMap, map } from 'rxjs/operators'
import { of, throwError } from 'rxjs'
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
    jwt$,
    map(() => input)
  )
)
