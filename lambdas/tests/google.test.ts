import { readFileSync } from 'fs'
import { join } from 'path'
import axios from 'axios'

const endpoint = process.env.CI
  ? JSON.parse(readFileSync(join(__dirname, '../../stack.json'), 'utf8')).ServiceEndpoint
  : 'http://localhost:4000/local'

const routes = {
  googlePlaceSuggest: '/google/placeSuggest',
  googlePlaceDetails: '/google/placeDetails',
  googlePlaceQeolocate: '/google/geolocate',

  getLocationSearches: '/search/location/get',
  addLocationSearch: '/search/location/get',
}

jest.setTimeout(1000 * 60 * 5)
describe('Google api', () => {
  it('should return a list of place suggestions', async () => {
    const { data } = await axios.get(endpoint + routes.googlePlaceSuggest + '?place="Forest"')
    expect(data.length > 0).toBe(true)
  })
})
