import 'source-map-support/register'
import P from 'ts-prove'
import lambda, { body, responseJson$ } from '../_utility_/lib/lambdaRx'

const proveLocationSearch = P.shape({
  query: P.string,
  place_id: P.string,
  address: P.string,
  coords: P.shape({ lat: P.number, lng: P.number }),
})

import db from '../_utility_/database'
import { switchMap } from 'rxjs/operators'

export const getLocationSearches = lambda((req$) =>
  req$.pipe(
    switchMap(() => db.search.get(['id', 'address', 'coords', 'place_id', 'query'])),
    responseJson$
  )
)

export const addLocationSearch = lambda((req$) =>
  req$.pipe(body(proveLocationSearch), switchMap(db.search.create), responseJson$)
)
