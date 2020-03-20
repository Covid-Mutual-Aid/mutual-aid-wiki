import axios from 'axios'
import { lambda } from '../lib/lambdaUtils'

const apiKey = process.env.GOOGLE_API_KEY
const geocodeEndpoint = `https://maps.googleapis.com/maps/api/geocode`
const googlePlaceEnpoint = 'https://maps.googleapis.com/maps/api/place'

// Helpers
export const googlePlaceSuggest = (place: string) =>
  axios.get(`${googlePlaceEnpoint}/autocomplete/json?input=${place}&types=geocode&key=${apiKey}`)

export const googlePlaceDetails = (place_id: string) =>
  axios.get(`${googlePlaceEnpoint}/details/json?place_id=${place_id}&key=${apiKey}`)

export const googleGeoLocate = (location: string) =>
  axios
    .get(`${geocodeEndpoint}/json?address=${location}&region=uk&key=${apiKey}`)
    .then(x => (x.data.error_message ? Promise.reject(new Error(x.data.error_message)) : x.data))

// Lambdas
export const placeSuggest = lambda(
  event =>
    googlePlaceSuggest((event.queryStringParameters as any).place).then(x => x.data.predictions),
  { params: { place: 'string' } }
)

export const placeDetails = lambda(
  event =>
    googlePlaceDetails((event.queryStringParameters as any).place_id).then(x => x.data.result),
  { params: { place_id: 'string' } }
)
