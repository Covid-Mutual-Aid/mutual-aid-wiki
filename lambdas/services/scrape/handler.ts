import Xray from 'x-ray'

import { googleGeoLocate } from '../google/handler'
import { scanGroups, putGroup, removeGroup } from '../database/handler'

import { Group } from '../lib/types'
import { lambda } from '../lib/lambdaUtils'
import { uniqueBy, missingIn, allSeq, isSameGroup } from '../lib/utils'

let x = Xray()
const documentEnpoint =
  'https://docs.google.com/spreadsheets/u/0/d/e/2PACX-1vTvSFFG0ByJlzWLBVZ_-sYdhGLvMCCrbb_Fe9sA9LZ_Y_BFoq1BVEFGLf4t--pJ8gg73o0ULvqYlqdk/pubhtml/sheet?headers=false&gid=1451634215'

type Scraped = Omit<Group, 'location_coord' | 'id'>

// Helpers
const scrape = (): Promise<Scraped[]> =>
  x(documentEnpoint, 'tr', [['td']])
    .then(
      res =>
        res
          .filter((x: any) => x.join('').length > 0)
          .map((x: string[]) => ({
            name: x[1].trim(),
            link_facebook: x[2].trim(),
            location_name: x[0].trim(),
          })) as Scraped[]
    )
    .then(uniqueBy(isSameGroup))

const geoLocateGroup = (group: Scraped): Promise<Omit<Group, 'id'>> =>
  googleGeoLocate(encodeURIComponent(group.location_name))
    .then(results => ({
      ...group,
      location_coord: {
        lat: results[0].geometry.location.lat,
        lng: results[0].geometry.location.lng,
      },
    }))
    .catch(err => Promise.reject(new Error(`Geolocation faile ${err.message}`)))

// Lambdas
export const scrapeGroups = lambda(scrape)
export const updateGroups = lambda(() =>
  scrape()
    .then(scraped => scanGroups().then(existing => missingIn(isSameGroup)(existing, scraped)))
    .then(groups =>
      allSeq(
        groups.map(group => () =>
          geoLocateGroup(group)
            .then(putGroup)
            .catch(err => err.message)
        )
      )
    )
)

export const removeAllGroups = lambda(() =>
  scanGroups().then(groups =>
    allSeq(
      groups.map(group => () =>
        removeGroup(group)
          .then(() => console.log(`deleted ${group.name}`))
          .catch(err => err.message)
      )
    )
  )
)
