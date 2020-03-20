import { Group } from './types'

const env = require('../../env.json')
export const GOOGLE_API_KEY = env.GOOGLE_API_KEY

export const isSameGroup = <T extends Pick<Group, 'link_facebook' | 'name' | 'location_name'>>(
  a: T,
  b: T
) =>
  a.link_facebook.trim() === b.link_facebook.trim() ||
  (a.name.trim() === b.name.trim() && a.location_name.trim() === b.location_name.trim())

export const missingIn = <T extends any>(fn: (a: T, b: T) => boolean) => (a: T[], b: T[]) =>
  b.filter(x => !a.some(y => fn(x, y)))

export const uniqueBy = <T>(fn: (a: T, b: T) => boolean) => (arr: T[]) =>
  arr.reduce((a, b) => (a.some(x => fn(b, x)) ? a : [...a, b]), [] as T[])

export const allSeq = <T>(x: (() => Promise<T>)[]) =>
  x.reduce((a, b) => a.then(all => b().then(n => [...all, n])), Promise.resolve([] as T[]))
