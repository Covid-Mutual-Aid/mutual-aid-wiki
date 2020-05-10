import { getGroupsFromSheet } from '../../google/sheets'
import { batchDedupe, geolocateGroups } from '../helpers'
import { uniqueBy, isSameGroup } from '../../_utility_/utils'

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
