import {
  isSameGroup,
  missingIn,
  uniqueBy,
  isDateTimeString,
  isCorrectlyNamed,
  normLink,
  matchAgainst,
  filterAgainst,
  isExactSameGroup,
} from './utils'
import { Group } from './types'
import { groupCreated } from './logging'

const group1 = { links: [{ url: 'foo' }], name: 'foo', location_name: 'foo' }
const group2 = { links: [{ url: 'bar' }], name: 'bar', location_name: 'bar' }

const testA = {
  id: 'a',
  location_name: 'Hove, UK',
  name: 'test',
  links: [{ url: 'http://asjdkad.com' }],
  link_facebook: 'http://asjdkad.com',
  location_coord: { lng: -0.168749, lat: 50.8279319 },
}

const testB = {
  id: 'b',
  name: 'Here is a test here is antoher test ',
  location_name: 'Hove, UK',
  links: [{ url: 'http://testinginginginging.com' }],
  link_facebook: 'http://testinginginginging.com',
  location_coord: { lat: 50.8279319, lng: -0.168749 },
}

describe('normLink', () => {
  test('Removes host for facebook URLs', () => {
    expect(normLink('http://facebook.com/groups/123456789') === '/groups/123456789').toBe(true)
  })
  test('Returns string for non facebook urls', () => {
    expect(
      normLink('http://test.com/groups/123456789') === 'http://test.com/groups/123456789'
    ).toBe(true)
  })
})

describe('isSamegroup', () => {
  test('same facebook link', () => {
    expect(isSameGroup(group1, group2)).toBe(false)
    expect(isSameGroup({ ...group1, links: [{ url: 'bar' }] }, group2)).toBe(true)
  })
  test('Should trim string values', () => {
    expect(isSameGroup({ ...group1, links: [{ url: 'bar' }] }, group2)).toBe(true)
  })
  test('Should trim string values', () => {
    expect(isSameGroup({ ...group1, name: 'bar' }, group2)).toBe(false)
    expect(isSameGroup({ ...group1, name: 'bar', location_name: 'bar' }, group2)).toBe(true)
  })
  test('Should be the same value', () => {
    expect(isSameGroup(testA, testB)).toBe(false)
  })
})

describe('isExactSameGroup', () => {
  test('Correctly identifies exact same group', () => {
    const exd = { ...groupCreated, external_data: { ex: 'd' } }

    expect(isExactSameGroup(testA, testA)).toBe(true)
    expect(isExactSameGroup(testA, testB)).toBe(false)
    expect(isExactSameGroup(exd, exd)).toBe(true)
    expect(isExactSameGroup({ ...exd, updated_at: '1' }, { ...exd, updated_at: '2' })).toBe(true)
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

describe('isDateTimeString', () => {
  test('Correctly identifies date time strings', () => {
    expect(isDateTimeString('11/22/3333 44:55:66')).toBe(true)
    expect(isDateTimeString('1/22/3333 44:55:66')).toBe(true)
    expect(isDateTimeString('11/2/3333 44:55:66')).toBe(true)
    expect(isDateTimeString('11/22/3333 4:55:66')).toBe(true)
  })
  test('Correctly identifies non date time strings', () => {
    expect(isDateTimeString('19/03/202A 14:15:12 ')).toBe(false)
  })
})

describe('Test matchAgainst', () => {
  test('Works as expected with empty arrays', () => {
    expect(matchAgainst<Group, Group>(isExactSameGroup)([], [])).toEqual([])
  })
  test('Matches two single element arrays correctly', () => {
    expect(matchAgainst<Group, Group>(isExactSameGroup)([testA], [testA])).toEqual([
      { obj: testA, matches: [testA] },
    ])
  })
  test('Does not match two single non matching element arrays', () => {
    expect(matchAgainst<Group, Group>(isExactSameGroup)([testA], [testB])).toEqual([
      { obj: testA, matches: [] },
    ])
  })
})

describe('Test isExactSameGroup', () => {
  test('Matches identical group', () => {
    expect(isExactSameGroup(testA, testA)).toBe(true)
  })
  test('Ignores updated_at and created_at', () => {
    expect(
      isExactSameGroup(
        { ...testA, updated_at: 'a', created_at: 'b' },
        { ...testA, updated_at: 'X', created_at: 'Y' }
      )
    ).toBe(true)
  })
})
