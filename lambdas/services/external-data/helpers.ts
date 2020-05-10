import { ExternalGroup, Group, Coord, Source, Snapshot } from '../_utility_/types'
import db from '../_utility_/database'
import { isExactSameGroup, matchAgainst, missingIn } from '../_utility_/utils'
import { googleGeoLocate } from '../google/handler'
import ENV from '../_utility_/environment'
import { airtableAPI, airtableExternalData } from '../_utility_/dep/airtable'
import Airtable from 'airtable'
import { groupCreated } from '../_utility_/logging'

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
        new Promise<T & { location_coord: Coord }>((resolve) => {
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

const updateAirtable = async (source: Snapshot) => {
  const {
    displayName,
    external_id,
    external_link,
    triggerUrl,
    testRatio,
    failingTests,
    groupsAdded,
    groupsRemoved,
  } = source
  const { getAll, createRow } = airtableAPI('AIRTABLE_EXTERNAL_DATA_BASE')
  const ATSourceId = await getAll('Sources').then(async (records) => {
    let source = records.find((r) => r.fields.id === external_id)
    if (typeof source !== 'undefined') return source.id
    let { id } = await createRow('Sources', {
      id: external_id,
      Name: displayName,
      'Origin URL': external_link,
      Trigger: triggerUrl,
      'Test Ratio': testRatio,
      Snapshots: [],
    })

    return id
  })

  const snapshotRes = await createRow('Snapshots', {
    Timestamp: new Date().toISOString(),
    'Groups Added': groupsAdded,
    'Groups Removed': groupsRemoved,
    'Test Ratio': testRatio,
    'Failing Tests': failingTests,
    Source: [ATSourceId],
  })

  console.log(snapshotRes, 'snapshotRes')

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
