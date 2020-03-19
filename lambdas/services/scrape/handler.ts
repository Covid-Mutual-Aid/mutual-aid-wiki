import Xray from 'x-ray'

import { googleGeoLocate } from '../google/handler'
import { scanGroups, putGroup } from '../database/handler'

import { lambda } from '../lib/utils'
import { Group } from '../lib/types'

let x = Xray()
const documentEnpoint =
  'https://docs.google.com/spreadsheets/u/0/d/e/2PACX-1vTvSFFG0ByJlzWLBVZ_-sYdhGLvMCCrbb_Fe9sA9LZ_Y_BFoq1BVEFGLf4t--pJ8gg73o0ULvqYlqdk/pubhtml/sheet?headers=false&gid=1451634215'

// Helpers
const scrape = (): Promise<Omit<Group, 'location_coord' | 'id'>[]> =>
  x(documentEnpoint, 'tr', [['td']]).then(res =>
    res
      .filter(x => x.join('').length > 0)
      .map((x: string[]) => ({
        name: x[1],
        link_facebook: x[2],
        location_name: x[0],
      }))
  )

const geoLocateGroup = (group: Omit<Group, 'location_coord' | 'id'>): Promise<Omit<Group, 'id'>> =>
  googleGeoLocate(encodeURIComponent(group.location_name)).then(response => ({
    ...group,
    location_coord: {
      lat: response.results[0].geometry.location.lat,
      lng: response.results[0].geometry.location.lng,
    },
  }))

// Lambdas
export const scrapeGroups = lambda(scrape)
export const updateGroups = lambda(() =>
  scrape()
    .then(scraped =>
      scanGroups().then(existing =>
        scraped.filter(x => !existing.some(y => y.link_facebook === x.link_facebook))
      )
    )
    .then(groups =>
      allSeq(
        groups.map(group => () =>
          geoLocateGroup(group)
            .then(putGroup)
            .catch(() => group)
        )
      )
    )
)

// Utility
const allSeq = <T>(x: (() => Promise<T>)[]) =>
  x.reduce((a, b) => a.then(all => b().then(n => [...all, n])), Promise.resolve([] as T[]))
