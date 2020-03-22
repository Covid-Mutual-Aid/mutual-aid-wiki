import Xray from 'x-ray'

import { googleGeoLocate } from '../google/handler'

import { Group } from '../lib/types'
import { uniqueBy, isSameGroup } from '../lib/utils'

let x = Xray()
const documentEnpoint =
  'https://docs.google.com/spreadsheets/u/0/d/e/2PACX-1vTvSFFG0ByJlzWLBVZ_-sYdhGLvMCCrbb_Fe9sA9LZ_Y_BFoq1BVEFGLf4t--pJ8gg73o0ULvqYlqdk/pubhtml/sheet?headers=false&gid=1451634215'

type Scraped = Omit<Group, 'location_coord' | 'id'>

// Helpers
export const scrapeSheet = (): Promise<Scraped[]> =>
  x(documentEnpoint, 'tr', [['td']])
    .then(
      res =>
        res
          .filter((x: any) => x.join('').length > 0)
          .map((x: string[]) => ({
            name: x[2].trim(),
            link_facebook: x[3].trim(),
            location_name: x[0].trim(),
          })) as Scraped[]
    )
    .then(uniqueBy(isSameGroup))

export const geoLocateGroup = (group: Scraped): Promise<Omit<Group, 'id'>> =>
  googleGeoLocate(encodeURIComponent(group.location_name))
    .then(results => ({
      ...group,
      location_coord: {
        lat: results[0].geometry.location.lat,
        lng: results[0].geometry.location.lng,
      },
    }))
    .catch(err => Promise.reject(new Error(`Geolocation failed ${err.message}`)))
