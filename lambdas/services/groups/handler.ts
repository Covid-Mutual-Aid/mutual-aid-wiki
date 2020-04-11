import { APIGatewayProxyEvent } from 'aws-lambda'
import P from 'ts-prove'

import lambda, { useParams, useBody } from '../lib/lambdaUtils'
import { isSameGroup, isOffline } from '../lib/utils'
import { Group } from '../lib/types'

import { addSheetRow } from '../google/sheets'
import { groupCreated } from '../lib/slack'

import db from '../lib/database'

// Helper
const createNoDuplicates = (
  group: Omit<Group, 'id' | 'pub_id'> & { id?: string; pub_id?: string }
) =>
  db.groups
    .get(['name', 'link_facebook', 'location_coord', 'location_name'])
    .then((groups) =>
      groups.some((g) => isSameGroup(g as any, group))
        ? Promise.resolve('Exists')
        : (db.groups.create(group) as any)
    )

export const getGroups = lambda(
  useParams()((x) =>
    db.groups.get(['id', 'name', 'link_facebook', 'location_name', 'location_coord'])
  )
)

export const updateGroup = lambda(
  useBody(P.shape({ id: P.string }))((group) => db.groups.update(group))
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
  return db.groups
    .createBatch(groups)
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

export const deleteAll = lambda(() =>
  db.groups.get(['id']).then((x) => db.groups.deleteBatch(x.map((y) => y.id)))
)
