import P from 'ts-prove'
import lambda, { useBody } from '../lib/lambdaUtils'

const proveLocationSearch = P.shape({
  query: P.string,
  place_id: P.string,
  address: P.string,
  coords: P.shape({ lat: P.number, lng: P.number }),
})

import db from '../lib/database'

export const getLocationSearches = lambda(() =>
  db.search.get(['id', 'address', 'coords', 'place_id', 'query'])
)

export const addLocationSearch = lambda(useBody(proveLocationSearch)(db.search.create))
