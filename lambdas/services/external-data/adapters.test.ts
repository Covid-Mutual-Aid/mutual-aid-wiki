import { groupConstructor } from './adapters'

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
    console.log(createGroup(exampleRows[0]), 'example')
    expect(createGroup(exampleRows[0])).toEqual({
      name: 'a',
      links: [{ url: 'a.com' }, { url: 'a.com2' }],
      external_data: {
        shouldGoIntoExternalData: 'foo bar',
      },
    })
  })
})
