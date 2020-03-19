import axios from 'axios'
import { lambda } from '../lib/utils'

const googlePlaceEnpoint = 'https://maps.googleapis.com/maps/api/place'

export const placeSuggest = lambda(
  event =>
    axios
      .get(
        `${googlePlaceEnpoint}/autocomplete/json?input=${
          (event.queryStringParameters as any).place
        }&types=geocode&key=${process.env.GOOGLE_PLACES_API_KEY}`
      )
      .then(x => x.data.predictions),
  {
    params: { place: 'string' },
  }
)

export const placeDetails = lambda(
  event =>
    axios
      .get(
        `${googlePlaceEnpoint}/details/json?place_id=${
          (event.queryStringParameters as any).place_id
        }&key=${process.env.GOOGLE_PLACES_API_KEY}`
      )
      .then(x => x.data.result),
  {
    params: { place_id: 'string' },
  }
)
