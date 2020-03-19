import { validate } from './validate'

describe('validate', () => {
  test('Should accept primative values', () => {
    expect(validate('number', 1)).toBe(true)
    expect(validate('number', 'w')).toBe(false)

    expect(validate('string', 'foo')).toBe(true)
  })
  test('Should accept array of primatives', () => {
    expect(validate(['number'], [1, 2, 3])).toBe(true)
    expect(validate(['number'], [1, '2', 3])).toBe(false)
  })
  test('Should accept object of primatives', () => {
    expect(validate({ one: 'number', two: 'string' }, { one: 1, two: 'two' })).toBe(true)
    expect(validate({ one: 'number', two: 'string' }, { one: 1, two: 2 })).toBe(false)
  })
  test('Should handle null and undefined values', () => {
    expect(validate({ one: 'number', two: 'string' }, null)).toBe(false)
    expect(validate({ one: 'number', two: 'string' }, { one: 1 })).toBe(false)
  })
})
