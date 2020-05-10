import Airtable from 'airtable'
import env from '../environment'

export type Base = 'AIRTABLE_ATTACH_EMAIL_BASE' | 'AIRTABLE_EXTERNAL_DATA_BASE'
export const _airtable = (base: Base) =>
  env[base] !== undefined
    ? new Airtable({ apiKey: env.AIRTABLE_KEY }).base(env[base])
    : (): any => _airtable

export const airtableAttachEmail = _airtable('AIRTABLE_ATTACH_EMAIL_BASE')
export const airtableExternalData = _airtable('AIRTABLE_EXTERNAL_DATA_BASE')

export type ReportsTable = {
  name: string
  message: string
  url: string
  id: string
  edit: string
  delete: string
  action: 'waiting'
}

export type WaitingTable = {
  confirm: string
  date?: string
  email: string
  key: string
  name: string
  reject: string
  url: string
}

export type SourcesTable = {
  id: string
  Name: string
  'Origin URL': string
  Trigger: string
  'Tests Passing': string
}

export type SnapshotsTable = {
  Timestamp: string
  'Groups Added': number
  'Groups Removed': number
  'Tests Passing': string
  'Failing Tests': string
  Source: string[]
}

export type DoneTable = Omit<WaitingTable, 'reject' | 'confirm'> & {
  status: 'confirmed' | 'rejected'
}

export type Tables = {
  Waiting: WaitingTable
  Done: DoneTable
  Reports: ReportsTable
  Sources: SourcesTable
  Snapshots: SnapshotsTable
}

export const airtableAPI = (base: Base) => ({
  getAll: <T extends keyof Tables>(table: T) =>
    _airtable(base)(table).select().all() as Promise<Airtable.Records<Tables[T]>>,

  createRow: <T extends keyof Tables>(table: T, fields: Tables[T]) =>
    _airtable(base)(table).create([{ fields }]),

  updateRow: <T extends keyof Tables>(table: T, id: string, fields: Tables[T]) =>
    _airtable(base)(table).update([{ id, fields }]),

  transferRow: <T1 extends keyof Tables, T2 extends keyof Tables>(
    table1: T1,
    table2: T2,
    transformer: (table1: Tables[T1]) => Tables[T2]
  ) => (selector: (row: Tables[T1]) => boolean) =>
    getAll(table1)
      .then((rows) => rows.filter((row) => selector(row.fields)))
      .then((rows) =>
        Promise.all(
          rows.map((row) =>
            createRow(table2, transformer(row.fields)).then(() =>
              _airtable(base)(table1).destroy(row.id)
            )
          )
        )
      ),
})

export const getAll = <T extends keyof Tables>(table: T) =>
  airtableAttachEmail(table).select().all() as Promise<Airtable.Records<Tables[T]>>

export const createRow = <T extends keyof Tables>(table: T, fields: Tables[T]) =>
  airtableAttachEmail(table).create([{ fields }])

export const transferRow = <T1 extends keyof Tables, T2 extends keyof Tables>(
  table1: T1,
  table2: T2,
  transformer: (table1: Tables[T1]) => Tables[T2]
) => (selector: (row: Tables[T1]) => boolean) =>
  getAll(table1)
    .then((rows) => rows.filter((row) => selector(row.fields)))
    .then((rows) =>
      Promise.all(
        rows.map((row) =>
          createRow(table2, transformer(row.fields)).then(() =>
            airtableAttachEmail(table1).destroy(row.id)
          )
        )
      )
    )
