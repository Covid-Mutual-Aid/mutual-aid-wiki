import { ExternalGroup, Group, LatLng } from '../_utility_/types'
import db from '../_utility_/database'
import { isExactSameGroup, matchAgainst, missingIn, includedIn } from '../_utility_/utils'
import { googleGeoLocate } from '../google/handler'
import ENV from '../_utility_/environment'

type Cell = string | undefined | null

export const batchDedupe = (newGroups: ExternalGroup[]) =>
  db.groups
    .get(['id', 'name', 'link_facebook', 'location_name', 'location_coord', 'updated_at'])
    .then((groups) =>
      newGroups.reduce(
        (uniqs, group) =>
          groups.find((ng) => isExactSameGroup(group, ng)) ? uniqs : [...uniqs, group],
        [] as ExternalGroup[]
      )
    )

export const groupConstructor = (titleRow: Cell[], map: ExternalGroup) => (row: Cell[]) =>
  // Add external_fields key for remaining cells
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

export const createSource = (getGroups: (...args: any) => Promise<ExternalGroup[]>) => ({
  identifier,
  displayName,
  origin,
}: {
  identifier: string
  displayName: string
  origin: string
}) => (testCases: ExternalGroup[]) => async () => {
  const externalGroups = await getGroups()

  const failingTests = missingIn(isExactSameGroup)(externalGroups, testCases)
  const testStatus = (testCases.length - failingTests.length) / testCases.length

  const internalGroups = await db.groups.getByKeyEqualTo('origin', origin)

  const matchPairs = matchAgainst<ExternalGroup, Group>(isExactSameGroup)(
    externalGroups || [],
    internalGroups || []
  )

  const existingGroups = matchPairs
    .filter(({ matches }) => matches.length > 0)
    .map(({ matches }) => matches)
    .reduce((groups, g) => groups.concat(g), [] as Group[])

  // Groups we remove
  const outdatedGroups = missingIn<Group>((i, g) => i.id === g.id)(existingGroups, internalGroups)
  db.groups.deleteBatch(outdatedGroups.map((g) => g.id))

  // New groups we add
  const newGroups = matchPairs
    .filter(({ matches }) => matches.length === 0)
    .map(({ obj }) => ({ ...obj, isExternalGroup: true, origin: identifier }))

  const geolocated = await geolocateGroups(newGroups)

  db.groups.createBatch(
    geolocated.map((g) => ({
      ...g,
      emails: [],
      created_at: Date.now() + '',
      isExternalGroup: true,
      origin: identifier,
    }))
  )

  // return {statusObj}
  return {
    identifier, //test-sheet
    displayName, //Test Sheet
    origin, //https://google.com...
    triggerUrl: `http://www.google.com`, // ENV.domain + identifier
    testStatus, //ratio of passing/failing
    failingTests,
    existingGroups: existingGroups.length,
    newGroups: newGroups.length,
    geolocated: geolocated.length,
  }
}
