import { isSameGroup, missingIn, uniqueBy, isDateTimeString, isCorrectlyNamed } from './utils'

const group1 = { link_facebook: 'foo', name: 'foo', location_name: 'foo' }
const group2 = { link_facebook: 'bar', name: 'bar', location_name: 'bar' }

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
    console.log(correctlyNamedGroups)
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
