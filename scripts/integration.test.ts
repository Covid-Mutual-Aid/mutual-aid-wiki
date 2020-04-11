import axios from 'axios'

const endpoint = require('../stack.json').ServiceEndpoint

const routes = {
  getGroup: '/group/get',
  updateGroup: '/group/update',
  createGroup: '/group/create',
  deleteGroup: '/group/delete',

  googlePlaceSuggest: '/google/placeSuggest',
  googlePlaceDetails: '/google/placeDetails',
  googlePlaceQeolocate: '/google/geolocate',

  getLocationSearches: '/search/location/get',
  addLocationSearch: '/search/location/get',
}

test('Getting groups', async () => {
  const groups = await axios.get(endpoint + routes.getGroup)
})
