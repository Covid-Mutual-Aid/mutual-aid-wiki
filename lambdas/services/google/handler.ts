import axios from 'axios'
import P from 'ts-prove'

import lambda, { useParams } from '../lib/lambdaUtils'
import { GOOGLE_API_KEY } from '../lib/utils'

const geocodeEndpoint = `https://maps.googleapis.com/maps/api/geocode`
const googlePlaceEnpoint = 'https://maps.googleapis.com/maps/api/place'

// Helpers
export const googlePlaceSuggest = (place: string) =>
  axios.get(
    `${googlePlaceEnpoint}/autocomplete/json?input=${place}&types=geocode&key=${GOOGLE_API_KEY}`
  )

export const googlePlaceDetails = (place_id: string) =>
  axios.get(`${googlePlaceEnpoint}/details/json?place_id=${place_id}&key=${GOOGLE_API_KEY}`)

export const googleGeoLocate = (location: string) =>
  axios
    .get(`${geocodeEndpoint}/json?address=${location}&region=uk&key=${GOOGLE_API_KEY}`)
    .then((x) =>
      x.data.error_message ? Promise.reject(new Error(x.data.error_message)) : x.data.results
    )

// Lambdas
export const placeSuggest = lambda(
  useParams(P.shape({ place: P.string }))((params) =>
    googlePlaceSuggest(params.place).then((x) => x.data.predictions)
  )
)

export const placeDetails = lambda(
  useParams(P.shape({ place_id: P.string }))((params) =>
    googlePlaceDetails(params.place_id).then((x) => x.data.result)
  )
)

export const geolocate = lambda(
  useParams(P.shape({ name: P.string }))((params) => googleGeoLocate(params.name))
)
