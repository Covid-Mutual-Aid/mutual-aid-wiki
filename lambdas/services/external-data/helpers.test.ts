import { diff } from './helpers'
import { ExternalGroup, Group } from '../_utility_/types'

const exGrp = (name: string): ExternalGroup => ({
  name,
  location_name: 'New Cross',
  link_facebook: 'https://fb.com',
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
  it('shouldnt update if external groups exactly match internal groups', async () => {
    const { add, remove } = diff([exGrp('a')], [inGrp('a')])
    expect(add.length + remove.length).toEqual(0)
  })
  it('should identify if external groups dont match internal groups', async () => {
    const { add, remove } = diff([exGrp('a')], [inGrp('b')])
    expect(add.length).toEqual(1)
    expect(remove.length).toEqual(1)
  })
  it('should update if there is a new external group', async () => {
    const { add, remove } = diff([exGrp('a')], [])
    expect(add.length).toEqual(1)
    expect(remove.length).toEqual(0)
  })
  it('should update if there are two new external groups', async () => {
    const { add, remove } = diff([exGrp('a'), exGrp('b'), exGrp('c')], [inGrp('c')])
    expect(add.length).toEqual(2)
    expect(remove.length).toEqual(0)
  })
})
