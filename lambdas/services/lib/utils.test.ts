import { isSameGroup, missingIn, uniqueBy } from './utils'

const group1 = { link_facebook: 'foo', name: 'foo', location_name: 'foo' }
const group2 = { link_facebook: 'bar', name: 'bar', location_name: 'bar' }

describe('isSamegroup', () => {
  test('same facebook link', () => {
    expect(isSameGroup(group1, group2)).toBe(false)
    expect(isSameGroup({ ...group1, link_facebook: 'bar' }, group2)).toBe(true)
  })
  test('Should trim string values', () => {
    expect(isSameGroup({ ...group1, link_facebook: ' bar ' }, group2)).toBe(true)
  })
  test('Should trim string values', () => {
    expect(isSameGroup({ ...group1, name: 'bar' }, group2)).toBe(false)
    expect(isSameGroup({ ...group1, name: 'bar', location_name: 'bar' }, group2)).toBe(true)
  })
})

describe('missingGroups', () => {
  test('Should return list of groups not in a list of groups', () => {
    expect(missingIn(isSameGroup)([group1], [group1, group2])).toEqual([group2])
  })
})

describe('uniqueBy', () => {
  expect(uniqueBy(isSameGroup)([group1, group2, group1, group2, group1, group2])).toEqual([
    group1,
    group2,
  ])
})
