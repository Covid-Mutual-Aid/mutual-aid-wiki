import Airtable from 'airtable'
import env from '../environment'
import { omit } from '../utils'

export const airtable = new Airtable({ apiKey: env.AIRTABLE_ATTACH_EMAIL_KEY }).base(
  env.AIRTABLE_ATTACH_EMAIL_BASE
)

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

export type Tables = { Waiting: WaitingTable; Done: DoneTable }

const getAll = <T extends keyof Tables>(table: T) =>
  airtable(table).select().all() as Promise<Airtable.Records<Tables[T]>>

export const removeRowByField = <T extends keyof Tables, K extends keyof Tables[T]>(
  table: T,
  field: K,
  value: Tables[T][K]
) =>
  (airtable(table).select().all() as Promise<Airtable.Records<WaitingTable>>)
    .then((x) => x.filter((y) => (y.fields as any)[field] === value))
    .then((rows) => Promise.all(rows.map((x) => airtable('Waiting').destroy(x.id))))

export const createRow = <T extends keyof Tables>(table: T, fields: Tables[T]) =>
  airtable(table).create([{ fields }])

export const transferToDone = (key: string, status: DoneTable['status']) =>
  getAll('Waiting')
    .then((rows) => rows.filter((y) => y.fields.key === key))
    .then((rows) =>
      Promise.all(
        rows.map((row) =>
          createRow('Done', {
            status,
            ...omit(['confirm', 'reject', 'date'], row.fields),
          }).then(() => removeRowByField('Waiting', 'key', key))
        )
      )
    )
