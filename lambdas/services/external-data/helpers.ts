import { ExternalGroup, Group, Coord, Source, Snapshot } from '../_utility_/types'
import db from '../_utility_/database'
import {
  isExactSameGroup,
  matchAgainst,
  missingIn,
  includedIn,
  isSameGroup,
} from '../_utility_/utils'
import { googleGeoLocate } from '../google/handler'
import ENV from '../_utility_/environment'
import { airtableAPI, Base } from '../_utility_/dep/airtable'

export const batchDedupe = (newGroups: ExternalGroup[]) =>
  db.groups
    .get(['name', 'links', 'location_name'])
    .then((groups) =>
      newGroups.reduce(
        (uniqs, group) => (groups.find((ng) => isSameGroup(group, ng)) ? uniqs : [...uniqs, group]),
        [] as ExternalGroup[]
      )
    )

export const geolocateGroups = <T extends { location_name: string }>(groups: T[]) => {
  const [BATCH_SIZE, INTERVAL] = [50, 1000]
  const delay = <T extends any>(t: number) => (v: T) =>
    new Promise<T>((resolve) => setTimeout(() => resolve(v), t))

  const recurse = (
    groups: T[],
    geolocated: Promise<(T & { location_coord: Coord; location_country: string })[]>
  ): Promise<(T & { location_coord: Coord; location_country: string })[]> =>
    geolocated.then((gl) =>
      groups.length === 0
        ? Promise.resolve(gl.filter(({ location_coord }) => location_coord !== null))
        : Promise.all(
            groups.slice(0, BATCH_SIZE).map(
              (g) =>
                new Promise<T & { location_coord: Coord; location_country: string }>((resolve) => {
                  googleGeoLocate(g.location_name).then(([place]) => {
                    let country = null
                    if (place && place.address_components) {
                      const countryComponent = place.address_components.find((a: any) =>
                        a.types.includes('country')
                      )
                      country = countryComponent ? countryComponent.short_name : null
                    }

                    resolve({
                      ...g,
                      location_coord: place ? place.geometry.location : null,
                      location_country: country,
                    })
                  })
                })
            )
          )
            .then(delay(INTERVAL))
            .then((batch) => recurse(groups.slice(BATCH_SIZE), Promise.resolve(batch.concat(gl))))
    )

  return recurse(groups, Promise.resolve([]))
}

export const test = <T>(allGroups: T[], testCases: T[]) => {
  const failing = missingIn(isExactSameGroup)(allGroups, testCases)
  const passing = includedIn(isExactSameGroup)(allGroups, testCases) //testCases.length - failing.length
  return { failing, passing }
}

export const diff = (externalGroups: ExternalGroup[], internalGroups: Group[]) => {
  const matchPairs = matchAgainst<ExternalGroup, Group>(isExactSameGroup)(
    externalGroups,
    internalGroups
  )
  const matches = matchPairs
    .filter(({ matches }) => matches.length > 0)
    .reduce((groups, { matches }) => groups.concat(matches), [] as Group[])

  return {
    add: matchPairs.filter(({ matches }) => matches.length === 0).map(({ obj }) => obj),
    remove: missingIn<Group>((e, g) => e.id === g.id)(matches, internalGroups),
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
      await updateRow('Sources', source.id, {
        id: external_id,
        Name: displayName,
        'Origin URL': external_link,
        Trigger: triggerUrl,
        'Tests Passing': testsPassing,
      })
      return source.id
    }

    let [record] = await createRow('Sources', {
      id: external_id,
      Name: displayName,
      'Origin URL': external_link,
      Trigger: triggerUrl,
      'Tests Passing': testsPassing,
    })

    return record.id
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

export const validLinks = (links: { url: any }[]) =>
  links.reduce((valid: boolean, { url }) => valid && !!url, true)

export const createSource = ({
  displayName,
  external_id,
  external_link,
  getGroups,
  testCases,
}: Source) => ({
  external_id,
  handler: async () => {
    const externalGroups = await getGroups().then(
      (groups) =>
        groups.filter(
          (g: any) => g.location_name && g.name && g.links.length > 0 && validLinks(g.links)
        ) as Group[]
    )
    const dedupedExternalGroups = await batchDedupe(externalGroups)

    const { failing, passing } = test(externalGroups, testCases)
    if (passing.length === 0) return Promise.reject('All tests failed')

    const internalGroups = await db.groups.getByKeyEqualTo('external_id', external_id)
    const { add, remove } = diff(
      dedupedExternalGroups,
      internalGroups.filter((g) => g.external)
    )

    await geolocateGroups(add).then((gl) =>
      db.groups.createBatch(
        gl.map((g: any) => {
          delete g['external_data'][''] // stop blank columns in sheets choking dynamodb
          return {
            ...g,
            link_facebook: g.link_facebook || g.links[0].url, //Backwards compatibility
            emails: [],
            external: true,
            source: external_id, //Changed to mutualaidwiki when user edits
            external_id,
            external_link,
          }
        })
      )
    )

    await db.groups.deleteBatch(remove.map((g) => g.id))

    return updateAirtable({
      displayName,
      external_id,
      external_link,
      triggerUrl: `${ENV.API_ENDPOINT}/external_data/trigger/${external_id}`,
      testsPassing: `${passing.length} / ${testCases.length} `,
      failingTests: failing.map(({ name }) => name).join(' '),
      groupsAdded: add.length,
      groupsRemoved: remove.length,
    })
  },
})
