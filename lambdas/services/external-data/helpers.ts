import { ExternalGroup, Group, Coord, Source, Snapshot } from '../_utility_/types'
import db from '../_utility_/database'
import { isExactSameGroup, matchAgainst, missingIn, includedIn } from '../_utility_/utils'
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
  const failing = missingIn(isExactSameGroup)(allGroups, testCases)
  const passing = includedIn(isExactSameGroup)(allGroups, testCases) //testCases.length - failing.length
  return { failing, passing }
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

  const deduped = await batchDedupe(newGroups)
  const geolocated = await geolocateGroups(deduped)
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
    testsPassing,
    failingTests,
    groupsAdded,
    groupsRemoved,
  } = source
  const { getAll, createRow, updateRow } = airtableAPI('AIRTABLE_EXTERNAL_DATA_BASE')
  const ATSourceId = await getAll('Sources').then(async (records) => {
    let source = records.find((r) => r.fields.id === external_id)
    if (typeof source !== 'undefined') {
      updateRow('Sources', source.id, {
        id: external_id,
        Name: displayName,
        'Origin URL': external_link,
        Trigger: triggerUrl,
        'Tests Passing': testsPassing,
      })
      return source.id
    }

    let { id } = await createRow('Sources', {
      id: external_id,
      Name: displayName,
      'Origin URL': external_link,
      Trigger: triggerUrl,
      'Tests Passing': testsPassing,
    })

    return id
  })

  createRow('Snapshots', {
    Timestamp: new Date().toISOString(),
    'Groups Added': groupsAdded,
    'Groups Removed': groupsRemoved,
    'Tests Passing': testsPassing,
    'Failing Tests': failingTests,
    Source: [ATSourceId],
  })

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

    const { failing, passing } = test(externalGroups, testCases)
    if (passing.length === 0) return Promise.reject('All tests failed')

    const { groupsAdded, groupsRemoved } = await syncExternalData(
      externalGroups,
      external_id,
      external_link
    )

    return updateAirtable({
      displayName,
      external_id,
      external_link,
      triggerUrl: `${ENV.API_ENDPOINT}/external_data/trigger/${external_id}`,
      testsPassing: `${passing.length} out of ${testCases.length} `,
      failingTests: failing.map(({ name }) => name).join(''),
      groupsAdded,
      groupsRemoved,
    })
  },
})
