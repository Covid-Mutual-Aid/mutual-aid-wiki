import Airtable from 'airtable'
import env from '../environment'

export const airtable = new Airtable({ apiKey: env.AIRTABLE_ATTACH_EMAIL_KEY }).base(
  env.AIRTABLE_ATTACH_EMAIL_BASE
)

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

export type DoneTable = Omit<WaitingTable, 'reject' | 'confirm'> & {
  status: 'confirmed' | 'rejected'
}

export type Tables = {
  Waiting: WaitingTable
  Done: DoneTable
  Reports: ReportsTable
}

export const getAll = <T extends keyof Tables>(table: T) =>
  airtable(table).select().all() as Promise<Airtable.Records<Tables[T]>>

export const createRow = <T extends keyof Tables>(table: T, fields: Tables[T]) =>
  airtable(table).create([{ fields }])

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
          createRow(table2, transformer(row.fields)).then(() => airtable(table1).destroy(row.id))
        )
      )
    )
