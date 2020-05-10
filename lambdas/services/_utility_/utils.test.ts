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

const group1 = { link_facebook: 'foo', name: 'foo', location_name: 'foo' }
const group2 = { link_facebook: 'bar', name: 'bar', location_name: 'bar' }

type TestGroup = {
  link_facebook: string
  name: string
  location_name: string
  external_data?: Record<any, any>
  updated_at?: string
}

const corrGroup = {
  link_facebook: 'http://facebook.com',
  name: 'Test Name',
  location_name: 'Test Location Name',
}
const inCorrGroup1 = {
  link_facebook: '19/03/2020 14:15:12',
  name: '19/03/2020 14:15:12',
  location_name: '19/03/2020 14:15:12',
}
const inCorrGroup2 = {
  ...corrGroup,
  location_name: '19/03/2020 14:15:12',
}
const inCorrGroup3 = {
  ...corrGroup,
  name: '19/03/2020 14:15:12',
}
const inCorrGroup4 = {
  ...corrGroup,
  name: 'http://facebook.com',
}

const testA = {
  location_name: 'Hove, UK',
  name: 'test',
  link_facebook: 'http://asjdkad.com',
  location_coord: { lng: -0.168749, lat: 50.8279319 },
}

const testB = {
  name: 'Here is a test here is antoher test ',
  location_name: 'Hove, UK',
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
    expect(isSameGroup({ ...group1, link_facebook: 'bar' }, group2)).toBe(true)
  })
  test('Should trim string values', () => {
    expect(isSameGroup({ ...group1, link_facebook: ' bar ' }, group2)).toBe(true)
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

describe('isCorrectlyNamed', () => {
  test('True for correctly named groups', () => {
    expect(isCorrectlyNamed(corrGroup)).toBe(true)
  })

  test('False for group with invalid URL in facebook_link', () => {
    expect(isCorrectlyNamed(inCorrGroup1)).toBe(false)
  })

  test('False for group with datetime string as name', () => {
    expect(isCorrectlyNamed(inCorrGroup3)).toBe(false)
  })

  test('False for group with datetime string as location_name', () => {
    expect(isCorrectlyNamed(inCorrGroup2)).toBe(false)
  })

  test('False for group with url as name', () => {
    expect(isCorrectlyNamed(inCorrGroup4)).toBe(false)
  })

  test('False for group with url as location_name', () => {
    expect(isCorrectlyNamed(inCorrGroup4)).toBe(false)
  })
})

describe('purgeIncorrectlyNamedFields', () => {
  const arr = [corrGroup, inCorrGroup1, inCorrGroup2, inCorrGroup3, inCorrGroup4].map((g, i) => ({
    ...g,
    id: '' + i,
    location_coord: { lat: 0, lng: 0 },
  }))

  test('Removes correctly named groups from array', () => {
    const correctlyNamedGroups = arr.filter(isCorrectlyNamed)
    expect(
      correctlyNamedGroups.length === 1 &&
        JSON.stringify(correctlyNamedGroups[0]) === JSON.stringify(arr[0])
    ).toBe(true)
  })

  test('Removes incorrectly named groups from array', () => {
    const correctlyNamedGroups = arr.filter(isCorrectlyNamed)
    expect(
      correctlyNamedGroups.length === 1 &&
        JSON.stringify(correctlyNamedGroups[0]) === JSON.stringify(arr[0])
    ).toBe(true)
  })
})

describe('Test matchAgainst', () => {
  test('Works as expected with empty arrays', () => {
    expect(matchAgainst<Group, Group>(isExactSameGroup)([], [])).toEqual([])
  })
  test('Matches two single element arrays correctly', () => {
    expect(matchAgainst<TestGroup, TestGroup>(isExactSameGroup)([testA], [testA])).toEqual([
      { obj: testA, matches: [testA] },
    ])
  })
  test('Does not match two single non matching element arrays', () => {
    expect(matchAgainst<TestGroup, TestGroup>(isExactSameGroup)([testA], [testB])).toEqual([
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
