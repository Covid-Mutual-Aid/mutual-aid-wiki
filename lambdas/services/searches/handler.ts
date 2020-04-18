import 'source-map-support/register'
import P from 'ts-prove'
import lambda, { body, response$ } from '../lib/lambdaRx'

const proveLocationSearch = P.shape({
  query: P.string,
  place_id: P.string,
  address: P.string,
  coords: P.shape({ lat: P.number, lng: P.number }),
})

import db from '../lib/database'
import { switchMap } from 'rxjs/operators'

export const getLocationSearches = lambda((req$) =>
  req$.pipe(
    switchMap(() => db.search.get(['id', 'address', 'coords', 'place_id', 'query'])),
    response$
  )
)

export const addLocationSearch = lambda((req$) =>
  req$.pipe(body(proveLocationSearch), switchMap(db.search.create), response$)
)
