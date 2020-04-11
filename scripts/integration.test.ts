import axios from 'axios'

const endpoint = require('../stack.json').ServiceEndpoint

const endpoints = {
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
