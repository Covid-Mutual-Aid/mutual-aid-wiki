import { APIGatewayProxyEvent } from 'aws-lambda'
import P from 'ts-prove'

import { isSameGroup, isOffline, omit } from '../lib/utils'
import lambda, { useParams, useBody } from '../lib/lambdaUtils'
import { Group } from '../lib/types'

import { addSheetRow } from '../google/sheets'
import { groupCreated } from '../lib/slack'

import { groupsdb } from '../lib/database'
const { create, scan, batchCreate, batchDelete } = groupsdb

// Helper
export const createNoDuplicates = (
  group: Omit<Group, 'id' | 'pub_id'> & { id?: string; pub_id?: string }
) =>
  scan().then((groups) =>
    groups.some((g) => isSameGroup(g, group))
      ? 'Exists'
      : create({ ...group, created_at: Date.now() }).then(() => 'Added')
  )

// Lambdas
const sanitize = (x: Group & { pub_id: string }): Omit<Group, 'pub_id'> => ({
  id: x.pub_id,
  name: x.name,
  link_facebook: x.link_facebook,
  location_name: x.location_name,
  location_coord: x.location_coord,
})

export const getGroup = lambda(
  useParams(P.shape({ id: P.optional(P.string) }))((x) =>
    scan().then((groups) => groups.map(sanitize))
  )
)

export const updateGroup = lambda(
  useBody()((group) =>
    scan().then((groups) => {
      const grp = groups.find((x) => x.id === group.id)
      if (!grp) return Promise.reject('No group with id')
      return create({ updated_at: Date.now(), ...grp, ...omit('id')(group) })
    })
  )
)

export const createGroup = lambda(
  useBody(
    P.shape({
      name: P.string,
      emails: P.array(P.string),
      link_facebook: P.string,
      location_name: P.string,
      location_coord: P.shape({
        lat: P.number,
        lng: P.number,
      }),
    })
  )((group) =>
    Promise.resolve()
      .then(() =>
        isOffline()
          ? (createNoDuplicates(group) as any)
          : (Promise.all([
              createNoDuplicates(group),
              addSheetRow(group).catch((err) => console.log('ERROR adding group to sheet')),
            ]) as any)
      )
      .then(() => groupCreated(group).then(() => group))
  )
)

export const createGroupsBatch = (event: APIGatewayProxyEvent) => {
  const groups = JSON.parse(event.body || '{}')
  return batchCreate(groups)
    .then((x) => ({
      statusCode: 200,
      body: 'DONE',
      headers: { 'Access-Control-Allow-Origin': '*' },
    }))
    .catch((err) => ({
      statusCode: 200,
      body: err.message || err,
      headers: { 'Access-Control-Allow-Origin': '*' },
    }))
}
export const deleteAll = lambda(() => scan().then(batchDelete))
