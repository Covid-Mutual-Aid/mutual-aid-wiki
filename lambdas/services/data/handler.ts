import { scanGroups, putGroup, removeGroup } from '../database/handler'

import { Group } from '../lib/types'
import { lambda } from '../lib/lambdaUtils'
import { missingIn, allSeq, isSameGroup } from '../lib/utils'
import { scrapeSheet, geoLocateGroup } from './utils'
import Axios from 'axios'

// Lambdas
export const scrapeGroups = lambda(scrapeSheet)
export const updateGroups = lambda(() =>
  scrapeSheet()
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

export const purgeDuplicates = lambda(() =>
  scanGroups()
    .then(groups =>
      groups.reduce<[Group[], Group[]]>(
        ([uniqs, dups], g) =>
          uniqs.some(gc => isSameGroup(gc, g)) ? [uniqs, [...dups, g]] : [[...uniqs, g], dups],
        [[], []]
      )
    )
    .then(([_, dups]) => allSeq(dups.map(grp => () => removeGroup(grp))))
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
