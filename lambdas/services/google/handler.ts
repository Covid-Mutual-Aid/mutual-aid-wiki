import 'source-map-support/register'

import { switchMap } from 'rxjs/operators'
import axios from 'axios'
import P from 'ts-prove'

import lambda, { params, responseJson$ } from '../_utility_/lib/lambdaRx'
import ENV from '../_utility_/environment'

const geocodeEndpoint = `https://maps.googleapis.com/maps/api/geocode`
const googlePlaceEnpoint = 'https://maps.googleapis.com/maps/api/place'

// Helpers
export const googlePlaceSuggest = (place: string) =>
  axios.get(
    `${googlePlaceEnpoint}/autocomplete/json?input=${place}&types=geocode&key=${ENV.GOOGLE_API_KEY}`
  )

export const googlePlaceDetails = (place_id: string) =>
  axios.get(`${googlePlaceEnpoint}/details/json?place_id=${place_id}&key=${ENV.GOOGLE_API_KEY}`)

export const googleGeoLocate = async (location: string) => {
  const escapedLocation = encodeURI(location).replace(/\#/g, "%23")
  return axios
    .get(
      `${geocodeEndpoint}/json?address=${escapedLocation}&region=uk&key=${ENV.GOOGLE_API_KEY}`
    )
    .then((x) =>
      x.data.error_message ? Promise.reject(new Error(x.data.error_message)) : x.data.results
         )

}

// Lambdas
// google/placeSuggest
export const placeSuggest = lambda((req) =>
  req.pipe(
    params(P.shape({ place: P.string })),
    switchMap((x) => googlePlaceSuggest(x.place).then((x) => x.data.predictions)),
    responseJson$
  )
)

// google/placeDetails
export const placeDetails = lambda((req) =>
  req.pipe(
    params(P.shape({ place_id: P.string })),
    switchMap((x) => googlePlaceDetails(x.place_id).then((x) => x.data.result)),
    responseJson$
  )
)

// google/geolocate
export const geolocate = lambda((req) =>
  req.pipe(
    params(P.shape({ name: P.string })),
    switchMap((x) => googleGeoLocate(x.name)),
    responseJson$
  )
)
