import { ExternalGroup, Group, LatLng } from '../_utility_/types'
import db from '../_utility_/database'
import { isSameGroup } from '../_utility_/utils'
import { googleGeoLocate } from '../google/handler'

type Cell = string | undefined | null

export const batchDedupe = (newGroups: ExternalGroup[]) =>
  db.groups
    .get(['id', 'name', 'link_facebook', 'location_name', 'location_coord', 'updated_at'])
    .then((groups) =>
      newGroups.reduce(
        (uniqs, group) => (groups.find((ng) => isSameGroup(group, ng)) ? uniqs : [...uniqs, group]),
        [] as ExternalGroup[]
      )
    )

export const filterAgainst = <I, A>(filter: (i: I, a: A) => boolean) => (
  initial: I[],
  against: A[]
) =>
  initial.reduce(
    ([dups, uniqs], group) =>
      against.find((g) => filter(group, g)) ? [uniqs, [...dups, group]] : [[...uniqs, group], dups],
    [[], []] as (I | A)[][]
  )

export const matchAgainst = <O, E>(isMatch: (o: O, e: E) => boolean) => (
  initial: O[],
  exists: E[]
) =>
  initial.reduce((pairs, obj) => {
    const matches = exists.filter((g) => isMatch(obj, g))
    return matches.length > 0 ? [...pairs, { obj, matches }] : [...pairs, { obj, matches: [] }]
  }, [] as { obj: O; matches: E[] }[])

export const groupConstructor = (titleRow: Cell[], map: ExternalGroup) => (row: Cell[]) =>
  (Object.keys(map) as [keyof ExternalGroup]).reduce((group, key) => {
    return { ...group, [key]: row[titleRow.findIndex((v) => (v || '').trim() === map[key])] }
  }, {} as ExternalGroup)

/*
  TODO: 
  Right now this fails to geolocate large arrays of groups because the google API rate limits requests. 
  Would be great if we can recursively retry geolocations that have failed due to rate limiting (and not retry for failed geolocations)
*/
export const geolocateGroups = <T extends { location_name: string }>(groups: T[]) =>
  Promise.all(
    groups.map(
      (g) =>
        new Promise<T & { location_coord: LatLng }>((resolve) => {
          googleGeoLocate(g.location_name).then(([place]) => {
            resolve({
              ...g,
              location_coord: place.geometry.location,
            })
          })
        })
    )
  )

export const createSource = ({
  id,
  displayName,
  origin,
}: {
  id: string
  displayName: string
  origin: string
}) => (getGroups: (...args: any) => Promise<ExternalGroup[]>) => (
  testCases: Partial<Group>[]
) => async () => {
  const externalGroups = await getGroups()
  console.log(externalGroups, 'externalGroups')

  // const passing = filterAgainst(isSameGroup)(externalGroups, tests)
  // const passRatio = tests.length / passing.length
  // if(passRatio === 0) return {statusObj} // All tests are failing, bail out

  // type GroupI = Pick<Group, 'id' | 'name' | 'location_name' | 'link_facebook'>
  // type GroupE = Omit<GroupI, 'id'>

  const internalGroups = await db.groups.getByKeyEqualTo('origin', origin) //['id', 'name', 'location_name', 'link_facebook']

  console.log(internalGroups, 'getGroupsBysource')

  const matches = matchAgainst<ExternalGroup, Group>(isSameGroup)(
    externalGroups,
    internalGroups || []
  )

  // console.log(internalGroups, 'internalGroups')
  // console.log(matches, 'matches')

  const outdatedGroups = matches
    .filter(({ matches }) => matches.length > 0)
    .map(({ matches }) => matches.map(({ id }) => id))
    .reduce((ids, id) => ids.concat(id), [])

  const newGroups = matches
    .filter(({ matches }) => matches.length === 0)
    .map(({ obj }) => ({ ...obj, isExternalGroup: true, origin }))

  if (newGroups.length === 0) return { status: 'No new groups' }

  const geolocated = await geolocateGroups(newGroups)

  db.groups.createBatch(
    geolocated.map((g) => ({
      ...g,
      emails: [],
      created_at: Date.now() + '',
    }))
  )

  // return {statusObj}
  return {
    outdatedGroups,
    newGroups,
    geolocated,
  }
}
