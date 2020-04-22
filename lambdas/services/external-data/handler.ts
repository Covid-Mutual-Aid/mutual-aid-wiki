import 'source-map-support/register'
import { switchMap } from 'rxjs/operators'
import P from 'ts-prove'

import lambda, { body, responseJson$ } from '../_utility_/lib/lambdaRx'
import db from '../_utility_/database'
import { getData } from './templates/usa-localised-resources'

export const getLocationSearches = lambda((req$) =>
  req$.pipe(
    switchMap(() => db.search.get(['id', 'address', 'coords', 'place_id', 'query'])),
    responseJson$
  )
)

export const addLocationSearch = lambda((req$) =>
  req$.pipe(
    body(
      P.shape({
        query: P.string,
        place_id: P.string,
        address: P.string,
        coords: P.shape({ lat: P.number, lng: P.number }),
      })
    ),
    switchMap(db.search.create),
    responseJson$
  )
)

export const getExternalData = lambda((req$) => req$.pipe(switchMap(getData), responseJson$))
