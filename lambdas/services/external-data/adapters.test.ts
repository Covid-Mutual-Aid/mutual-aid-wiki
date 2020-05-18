import { groupConstructor, groupConstructorObj } from './adapters'

const labels = ['examplelink', 'examplelink2', 'examplename', 'shouldGoIntoExternalData']
const exampleRows = [
  ['a.com', 'a.com2', 'a', 'foo bar'],
  ['b.com', 'b.com2', 'b', 'broo far'],
]

describe('groupConstructor', () => {
  const createGroup = groupConstructor(labels, {
    examplename: 'name',
    examplelink: 'links',
    examplelink2: 'links',
  })
  test('Correctly construct group', () => {
    expect(createGroup(exampleRows[0])).toEqual({
      name: 'a',
      links: [{ url: 'a.com' }, { url: 'a.com2' }],
      external_data: {
        shouldGoIntoExternalData: 'foo bar',
      },
    })
  })
})

describe('groupConstructorObj', () => {
  const exampleGroup = {
    nameField: 'example mutual aid',
    linkFieldA: 'https://linkfielda.com',
    linkFieldB: 'https://linkfieldb.com',
    locationField: 'Example Location Somewhere',
    shouldGoIntoExternalData: 'foo bar',
  }

  const createGroup = groupConstructorObj({
    nameField: 'name',
    linkFieldA: 'links',
    linkFieldB: 'links',
    locationField: 'location_name',
  })

  test('Correctly construct group', () => {
    expect(createGroup(exampleGroup)).toEqual({
      name: 'example mutual aid',
      links: [{ url: 'https://linkfielda.com' }, { url: 'https://linkfieldb.com' }],
      location_name: 'Example Location Somewhere',
      external_data: {
        shouldGoIntoExternalData: 'foo bar',
      },
    })
  })
})
