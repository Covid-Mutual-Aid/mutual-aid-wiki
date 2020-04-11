import P from 'ts-prove'
import lambda, { useBody } from '../lib/lambdaUtils'

const proveLocationSearch = P.shape({
  query: P.string,
  place_id: P.string,
  address: P.string,
  coords: P.shape({ lat: P.number, lng: P.number }),
})

import { searchesdb } from '../lib/database'
const { create, scan } = searchesdb

export const getLocationSearches = lambda(scan)
export const addLocationSearch = lambda(useBody(proveLocationSearch)(create))
