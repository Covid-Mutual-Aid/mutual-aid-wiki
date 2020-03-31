import { Group } from '../lib/types'
import lambda from '../lib/lambdaUtils'
import { missingIn, allSeq, isSameGroup, isCorrectlyNamed } from '../lib/utils'
import { scrapeSheet, geoLocateGroup } from './utils'
import createDynamoApi from '../lib/dynamodb'

const TableName = process.env.GROUPS_TABLE as string
const { create, remove, readAll } = createDynamoApi<Group>(TableName)

// Lambdas
export const scrapeGroups = lambda(scrapeSheet)
export const updateGroups = lambda(() =>
  scrapeSheet()
    .then(scraped => readAll().then(existing => missingIn(isSameGroup)(existing, scraped)))
    .then(groups =>
      allSeq(
        groups.map(group => () =>
          geoLocateGroup(group)
            .then(grp => create(grp))
            .catch(err => err.message)
        )
      )
    )
)

export const purgeDuplicates = lambda(() =>
  readAll()
    .then(groups =>
      groups.reduce<[Group[], Group[]]>(
        ([uniqs, dups], g) =>
          uniqs.some(gc => isSameGroup(gc, g)) ? [uniqs, [...dups, g]] : [[...uniqs, g], dups],
        [[], []]
      )
    )
    .then(([_, dups]) => allSeq(dups.map(grp => () => remove(grp))))
)

export const purgeIncorrectlyLabeledGroups = lambda(() =>
  readAll()
    .then(groups => groups.filter(g => !isCorrectlyNamed(g)))
    .then(rejects => allSeq(rejects.map(reject => () => remove(reject))))
)

export const removeAllGroups = lambda(() =>
  readAll().then(groups =>
    allSeq(
      groups.map(group => () =>
        remove(group)
          .then(() => console.log(`deleted ${group.name}`))
          .catch(err => err.message)
      )
    )
  )
)
