import { ExternalGroup, Group, LatLng, Source } from '../_utility_/types'
import db from '../_utility_/database'
import { isExactSameGroup, matchAgainst, missingIn } from '../_utility_/utils'
import { googleGeoLocate } from '../google/handler'
import ENV from '../_utility_/environment'
import { getAllEntries } from '../_utility_/dep/airtable'

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
  const testRatio = (testCases.length - failingTests.length) / testCases.length
  return { failingTests, testRatio }
}

const syncExternalData = async (
  externalGroups: ExternalGroup[],
  external_id: string,
  external_link: string
) => {
  const storedGroups = await db.groups.getByKeyEqualTo('external_id', external_id)
  const matchPairs = matchAgainst<ExternalGroup, Group>(isExactSameGroup)(
    externalGroups,
    storedGroups
  )

  const matches = matchPairs
    .filter(({ matches }) => matches.length > 0)
    .reduce((groups, { matches }) => groups.concat(matches), [] as Group[])

  const outdatedGroups = missingIn<Group>((e, g) => e.id === g.id)(matches, storedGroups)
  db.groups.deleteBatch(outdatedGroups.map((g) => g.id))

  const newGroups = matchPairs
    .filter(({ matches }) => matches.length === 0)
    .map(({ obj }) => ({ ...obj, external: true, external_id, external_link }))

  const geolocated = await geolocateGroups(newGroups)
  db.groups.createBatch(
    geolocated.map((g) => ({
      ...g,
      emails: [],
      created_at: Date.now() + '',
    }))
  )

  return {
    groupsAdded: newGroups.length,
    groupsRemoved: outdatedGroups.length,
  }
}

const updateAirtable = async (source: {
  displayName: string
  external_id: string
  external_link: string
  triggerUrl: string
  testRatio: number
  failingTests: string
  groupsAdded: number
  groupsRemoved: number
}) => {
  const sources = await getAllEntries('Sources')
  console.log(sources)
  // If external_id is not in sources, create a new one with the params
  // Now create a new snapshot!

  return source
}

export const createSource = ({
  displayName,
  external_id,
  external_link,
  getGroups,
  testCases,
}: Source) => ({
  external_id,
  handler: async () => {
    const externalGroups = await getGroups()

    const { failingTests, testRatio } = test(externalGroups, testCases)

    const { groupsAdded, groupsRemoved } = await syncExternalData(
      externalGroups,
      external_id,
      external_link
    )

    return updateAirtable({
      displayName, //Test Sheet
      external_id, //test-sheet
      external_link, //https://google.com...
      triggerUrl: `${ENV.API_ENDPOINT}/external_data/trigger/${external_id}`, // ENV.domain + identifier
      testRatio, //ratio of passing/failing
      failingTests: failingTests.map(({ name }) => name).join(''),
      groupsAdded,
      groupsRemoved,
    })
  },
})
