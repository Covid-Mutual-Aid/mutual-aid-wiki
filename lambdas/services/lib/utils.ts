import { Group } from './types'
import { parse } from 'url'

const env = require('../../env.json')
export const GOOGLE_API_KEY = env.GOOGLE_API_KEY
export const SPREADSHEET_ID = env.SPREADSHEET_ID
export const SHEET_ID = env.SHEET_ID
export const GOOGLE_PRIVATE_KEY = env.GOOGLE_PRIVATE_KEY
export const GOOGLE_CLIENT_EMAIL = env.GOOGLE_CLIENT_EMAIL

export const isOffline = () => !!process.env.OFFLINE || !!process.env.IS_LOCAL

const norm = (x: string) => x.toLowerCase().trim()
const normLink = (x: string) => parse(x).pathname?.replace(/\/$/, '')

export const isSameGroup = <T extends Pick<Group, 'link_facebook' | 'name' | 'location_name'>>(
  a: T,
  b: T
) =>
  normLink(norm(a.link_facebook)) === normLink(norm(b.link_facebook)) ||
  (norm(a.name) === norm(b.name) && norm(a.location_name) === norm(b.location_name))

export const missingIn = <T extends any>(fn: (a: T, b: T) => boolean) => (a: T[], b: T[]) =>
  b.filter(x => !a.some(y => fn(x, y)))

export const uniqueBy = <T>(fn: (a: T, b: T) => boolean) => (arr: T[]) =>
  arr.reduce((a, b) => (a.some(x => fn(b, x)) ? a : [...a, b]), [] as T[])

export const allSeq = <T>(x: (() => Promise<T>)[]) =>
  x.reduce((a, b) => a.then(all => b().then(n => [...all, n])), Promise.resolve([] as T[]))
