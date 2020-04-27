// curl https://sheets.googleapis.com/v4/spreadsheets/1HEdNpLB5p-sieHVK-CtS8_N7SIUhlMpY6q1e8Je0ToY/values/Local%20Mutual%20Aid\?key=AIzaSyDD8gtVtIrx6A0FpaTb7WXy0r1tZR8iECg

import { getGroupsFromSheet } from '../../google/sheets'
import db from '../../_utility_/database'
import { batchDedupe, geolocateGroups } from '../helpers'
import { uniqueBy, isSameGroup } from '../../_utility_/utils'

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
    .then(db.groups.createBatch)
/*
    - Scrape groups from sheet & dedupe
    - Get groups from our db from this sheet
    - For all scraped groups where location_name matches a group we already have, copy location_coords to the new group
    - Geolocate remaining groups that dont have location_coords
    - Delete all our entries from this sheet
    - Replace with geolocated entries

    Cases:
    - Group is deleted
    - Group is added 
    - Group info is edited
*/
