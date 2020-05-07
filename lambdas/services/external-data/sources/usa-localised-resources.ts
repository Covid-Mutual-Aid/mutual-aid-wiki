// curl https://sheets.googleapis.com/v4/spreadsheets/1HEdNpLB5p-sieHVK-CtS8_N7SIUhlMpY6q1e8Je0ToY/values/Local%20Mutual%20Aid\?key=AIzaSyDD8gtVtIrx6A0FpaTb7WXy0r1tZR8iECg

import { getGroupsFromSheet } from '../../google/sheets'
import db from '../../_utility_/database'
import { batchDedupe, geolocateGroups, matchAgainst } from '../helpers'
import { uniqueBy, isSameGroup } from '../../_utility_/utils'
import { Group } from '../../_utility_/types'

type Cell = string | undefined | null

export const getData = () =>
  getGroupsFromSheet('1HEdNpLB5p-sieHVK-CtS8_N7SIUhlMpY6q1e8Je0ToY', 1455689482, {
    location_name: 'State',
    name: 'Title of Document',
    link_facebook: 'Link',
  })
    .then((g) => g.slice(0, 20))
    .then(uniqueBy(isSameGroup))
    .then(batchDedupe)
    .then(geolocateGroups)
    .then((g) => {
      console.log(g, 'geolocated')
      return g.map((g) => ({
        ...g,
        source: {
          name: 'usa-localised-resources',
          external: true,
          origin:
            'https://docs.google.com/spreadsheets/d/1HEdNpLB5p-sieHVK-CtS8_N7SIUhlMpY6q1e8Je0ToY/edit#gid=1455689482',
        },
      }))
    })
// .then(db.groups.createBatch)
