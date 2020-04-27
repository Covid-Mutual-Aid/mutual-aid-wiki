import { ExternalGroup, Group } from '../_utility_/types'
import db from '../_utility_/database'
import { isSameGroup } from '../_utility_/utils'
import { googleGeoLocate } from '../google/handler'

export const batchDedupe = (newGroups: ExternalGroup[]) =>
  db.groups
    .get(['id', 'name', 'link_facebook', 'location_name', 'location_coord', 'updated_at'])
    .then((groups: Group[]) =>
      newGroups.reduce(
        (uniqs, group) => (groups.find((ng) => isSameGroup(group, ng)) ? uniqs : [...uniqs, group]),
        [] as ExternalGroup[]
      )
    )

export const geolocateGroups = (groups: ExternalGroup[]) =>
  Promise.all(
    groups.map(
      (g) =>
        new Promise<Omit<Group, 'id'>>((resolve) => {
          googleGeoLocate(g.location_name).then(([place]) => {
            console.log(place, g)
            resolve({
              ...g,
              location_coord: place.geometry.location,
            })
          })
        })
    )
  )
