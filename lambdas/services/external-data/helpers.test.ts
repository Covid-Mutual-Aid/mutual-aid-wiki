import { diff, validLinks } from './helpers'
import { ExternalGroup, Group } from '../_utility_/types'
import { tokensdb } from '../_utility_/database'

const exGrp = (name: string): ExternalGroup => ({
  name,
  location_name: 'New Cross',
  link_facebook: 'https://fb.com',
  links: [{ url: 'https://fb.com' }],
})

const inGrp = (name: string): Group => ({
  ...exGrp(name),
  id: 'da',
  location_coord: { lat: 0, lng: 0 },
})

describe('diff()', () => {
  it('should work with empty groups', () => {
    const { add, remove } = diff([], [])
    expect(add.length).toEqual(0)
    expect(remove.length).toEqual(0)
  })
  it('shouldnt update if external groups exactly match internal groups', () => {
    const { add, remove } = diff([exGrp('a')], [inGrp('a')])
    expect(add.length + remove.length).toEqual(0)
  })
  it('should identify if external groups dont match internal groups', () => {
    const { add, remove } = diff([exGrp('a')], [inGrp('b')])
    expect(add.length).toEqual(1)
    expect(remove.length).toEqual(1)
  })
  it('should update if there is a new external group', () => {
    const { add, remove } = diff([exGrp('a')], [])
    expect(add.length).toEqual(1)
    expect(remove.length).toEqual(0)
  })
  it('should update if there are two new external groups', () => {
    const { add, remove } = diff([exGrp('a'), exGrp('b'), exGrp('c')], [inGrp('c')])
    expect(add.length).toEqual(2)
    expect(remove.length).toEqual(0)
  })
  it('Should remove groups with non matching urls', () => {
    const { add, remove } = diff([exGrp('c')], [{ ...inGrp('c'), links: [{ url: 'X' }] }])
    expect(add.length).toEqual(1)
    expect(remove.length).toEqual(1)
  })
})

describe('Tests if all links in groups.links are not falsy', () => {
  it('Should return true to valid values', () => {
    expect(validLinks([{ url: 'yes' }, { url: 'yes' }])).toBe(true)
  })
  it('Should return false if there is one invalid value', () => {
    expect(validLinks([{ url: 'yes' }, { url: null }])).toBe(false)
  })
})
