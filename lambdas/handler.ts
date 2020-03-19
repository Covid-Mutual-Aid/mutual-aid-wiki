import 'source-map-support/register'
import axios from 'axios'

import {
  getGroups,
  removeGroup,
  getGroup as _getGroup,
  createGroup as _createGroup,
} from './src/database'
import { lambda, lambdaPost } from './src/utils'

// Database
export const groups = lambda(getGroups)
export const getGroup = lambdaPost(_getGroup, { id: 'string' })
export const createGroup = lambdaPost(_createGroup, {
  name: 'string',
  link_facebook: 'string',
  location_name: 'string',
})
export const deleteGroup = lambdaPost(removeGroup, { id: 'string' })

// fdsa
export const googlePlaceSuggest = lambda(
  event =>
    axios
      .get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${
          (event.queryStringParameters as any).place
        }&types=geocode&key=${process.env.GOOGLE_PLACES_API_KEY}`
      )
      .then(x => x.data.predictions),
  {
    params: { place: 'string' },
  }
)

export const googlePlaceDetails = lambda(
  event =>
    axios
      .get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${
          (event.queryStringParameters as any).place_id
        }&key=${process.env.GOOGLE_PLACES_API_KEY}`
      )
      .then(x => x.data.result),
  {
    params: { place_id: 'string' },
  }
)
