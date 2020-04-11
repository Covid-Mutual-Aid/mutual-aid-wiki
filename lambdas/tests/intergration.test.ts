import { join } from 'path'
import { v4 as uuid } from 'uuid'

import axios from 'axios'
import { readFileSync } from 'fs'

const endpoint = JSON.parse(readFileSync(join(__dirname, '../../stack.json'), 'utf8'))
  .ServiceEndpoint

const routes = {
  getGroup: '/group/get',
  updateGroup: '/group/update',
  createGroup: '/group/create',
  deleteGroup: '/group/delete',
  createBatch: '/group/createbatch',

  googlePlaceSuggest: '/google/placeSuggest',
  googlePlaceDetails: '/google/placeDetails',
  googlePlaceQeolocate: '/google/geolocate',

  getLocationSearches: '/search/location/get',
  addLocationSearch: '/search/location/get',
}

jest.setTimeout(1000 * 60 * 5)
test('Adding groups', async () => {
  if (process.env.STAGE !== 'staging') return
  const mocGroup = createTestGroup()

  // Test adding a group
  const getEmpty = await axios.get(endpoint + routes.getGroup)
  expect(getEmpty.data.find((x: any) => x.name === mocGroup.name)).toBe(undefined)

  await axios.post(endpoint + routes.createGroup, mocGroup)
  const withGroup = await axios.get(endpoint + routes.getGroup)
  const found = withGroup.data.find((x: any) => x.name === mocGroup.name)
  expect(found.name).toEqual(mocGroup.name)
  expect(found.link_facebook).toEqual(mocGroup.link_facebook)
  expect(found.location_name).toEqual(mocGroup.location_name)
  expect(found.location_coord).toEqual(mocGroup.location_coord)
})

const createTestGroup = () => {
  const id = uuid()
  return {
    name: 'test group ' + id,
    link_facebook: 'Link-' + id,
    location_name: 'Forest row',
    emails: [`${id}@test.com`],
    location_coord: { lng: -5.8101207, lat: 54.7261871 },
  }
}

const groupBy = <T extends any>(n: number, items: T[], grouped = [] as T[][]): T[][] =>
  items.length < 1 ? grouped : groupBy(n, items.slice(n), [...grouped, items.slice(0, n)])
