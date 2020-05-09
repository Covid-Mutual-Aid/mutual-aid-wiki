import { ExternalGroup, Group, LatLng } from '../_utility_/types'
import db from '../_utility_/database'
import { isExactSameGroup, matchAgainst, missingIn } from '../_utility_/utils'
import { googleGeoLocate } from '../google/handler'
import ENV from '../_utility_/environment'

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

const test = <T>(allGroups: T[], testCases: T[]) => {
  const failingTests = missingIn(isExactSameGroup)(allGroups, testCases)
  const testStatus = (testCases.length - failingTests.length) / testCases.length
  return { failingTests, testStatus }
}

type Source = {
  identifier: string
  displayName: string
  origin: string
}

export const createSource = (getGroups: (...args: any) => Promise<ExternalGroup[]>) => ({
  identifier,
  displayName,
  origin,
}: Source) => (testCases: ExternalGroup[]) => async () => {
  const externalGroups = await getGroups()

  const { failingTests, testStatus } = test(externalGroups, testCases)

  const internalGroups = await db.groups.getByKeyEqualTo('origin', origin)
  const matchPairs = matchAgainst<ExternalGroup, Group>(isExactSameGroup)(
    externalGroups,
    internalGroups
  )

  const existingGroups = matchPairs
    .filter(({ matches }) => matches.length > 0)
    .reduce((groups, { matches }) => groups.concat(matches), [] as Group[])

  // Groups in the db that do not match external groups
  const outdatedGroups = missingIn<Group>((i, g) => i.id === g.id)(existingGroups, internalGroups)
  db.groups.deleteBatch(outdatedGroups.map((g) => g.id))

  // Groups not yet in the db
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

  return {
    identifier, //test-sheet
    displayName, //Test Sheet
    origin, //https://google.com...
    triggerUrl: `http://www.google.com/${identifier}`, // ENV.domain + identifier
    testStatus, //ratio of passing/failing
    failingTests,
    groupsAdded: newGroups.length,
    groupsRemoved: outdatedGroups.length,
  }
}
