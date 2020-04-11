import AWS from 'aws-sdk'
import P from 'ts-prove'

import { isSameGroup, isOffline, omit } from '../lib/utils'
import lambda, { useParams, useBody } from '../lib/lambdaUtils'
import { Group, SanitizedGroup } from '../lib/types'

import { addSheetRow } from '../google/sheets'
import createDynamoApi from '../lib/dynamodb'
import { groupCreated } from '../lib/slack'

const TableName = process.env.GROUPS_TABLE as string
const BackupBucket = process.env.BACKUP_BUCKET as string

const { create, remove, readAll } = createDynamoApi<Group>(TableName)

// Helper
export const createNoDuplicates = (
  group: Omit<Group, 'id' | 'pub_id'> & { id?: string; pub_id?: string }
) =>
  readAll().then((groups) =>
    groups.some((g) => isSameGroup(g, group))
      ? 'Exists'
      : create({ ...group, created_at: Date.now() }).then(() => 'Added')
  )

// Lambdas
const sanitize = (x: Group): SanitizedGroup => ({
  id: x.pub_id,
  name: x.name,
  link_facebook: x.link_facebook,
  location_name: x.location_name,
  location_coord: x.location_coord,
})

export const getGroup = lambda(
  useParams(P.shape({ id: P.optional(P.string) }))((x) =>
    readAll().then((groups) => groups.map(sanitize))
  )
)

export const updateGroup = lambda(
  useBody()((group) =>
    readAll().then((groups) => {
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

export const createBackup = () => {
  const s3 = new AWS.S3()
  const date = new Date().toISOString()

  return readAll().then((groups) =>
    s3
      .putObject({
        Bucket: BackupBucket,
        Key: `backups/backup-${date}.json`,
        ContentType: 'application/json',
        ACL: 'public-read',
        Body: JSON.stringify({
          created_at: new Date().toISOString(),
          groups,
        }),
      })
      .promise()
      .then(() =>
        s3.putObject({
          Bucket: BackupBucket,
          Key: `groups.json`,
          ContentType: 'application/json',
          ACL: 'public-read',
          Body: JSON.stringify(groups),
        })
      )
  )
}
