// curl https://sheets.googleapis.com/v4/spreadsheets/1HEdNpLB5p-sieHVK-CtS8_N7SIUhlMpY6q1e8Je0ToY/values/Local%20Mutual%20Aid\?key=AIzaSyDD8gtVtIrx6A0FpaTb7WXy0r1tZR8iECg

import { google, sheets_v4 } from 'googleapis'
import ENV from '../../_utility_/environment'
import { ExternalGroup, Group } from '../../_utility_/types'
import { getGroupsFromSheet } from '../../google/sheets'
import db from '../../_utility_/database'
import { isSameGroup } from '../../_utility_/utils'
import { googleGeoLocate } from '../../google/handler'

type Cell = string | undefined | null

const batchDedupe = (newGroups: ExternalGroup[]) =>
  db.groups
    .get(['id', 'name', 'link_facebook', 'location_name', 'location_coord', 'updated_at'])
    .then(
      (groups: Group[]) =>
        newGroups.reduce(
          ([uniqs, dups], group) =>
            groups.find((ng) => isSameGroup(group, ng))
              ? [uniqs, [...dups, group]]
              : [[...uniqs, group], dups],
          [[], []] as ExternalGroup[][]
        )[0]
    )

const batchGeolocate = (groups: ExternalGroup[]) =>
  Promise.all(groups.map((g) => googleGeoLocate(g.location_name)))

export const getData = () =>
  getGroupsFromSheet('1HEdNpLB5p-sieHVK-CtS8_N7SIUhlMpY6q1e8Je0ToY', 1455689482, {
    location_name: 'State',
    name: 'Title of Document',
    link_facebook: 'Link',
  })
    .then((g) => g.slice(0, 20))
    .then((g) => {
      console.log(g, 'sheet')
      return g
    })
    .then(batchDedupe)
    .then((g) => {
      console.log(g, 'deduped')
      return g
    })
    .then(batchGeolocate)
    .then((g) => {
      console.log(g, 'geolocated')
      return g
    })
    .then(db.groups.createBatch)

// Dedupe groups
// Geolocate new groups
// groupsdb.createBatch(groups)
