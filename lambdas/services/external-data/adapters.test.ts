import { groupConstructor, getKeyByValue } from './adapters'

const labels = ['linkylink', 'namelike', 'shouldGoIntoExternalData']
const exampleRows = [
  ['a.com', 'a', 'foo bar'],
  ['b.com', 'b', 'broo far'],
]

describe('groupConstructor', () => {
  const createGroup = groupConstructor(labels, { name: 'namelike', link: 'linkylink' })
  test('Correctly construct group', () => {
    expect(createGroup(exampleRows[0])).toEqual({
      name: 'a',
      link: 'a.com',
      external_data: {
        shouldGoIntoExternalData: 'foo bar',
      },
    })
  })
})

describe('getKeyByValue', () => {
  test('Return name of key when given value', () => {
    expect(getKeyByValue({ field: 'value' }, 'value')).toEqual('field')
  })
})
