import { join } from 'path'
import { v4 as uuid } from 'uuid'
import { sign } from 'jsonwebtoken'

import axios from 'axios'
import { readFileSync } from 'fs'
import { Group } from '../services/_utility_/types'

const JWT_SECRET = process.env.JWT_SECRET as string
const endpoint = process.env.CI
  ? JSON.parse(readFileSync(join(__dirname, '../../stack.json'), 'utf8')).ServiceEndpoint
  : 'http://localhost:4000/local'

const routes = {
  getGroup: '/group/get',
  updateGroup: '/group/update',
  createGroup: '/group/create',
  deleteGroup: '/group/delete',
}

const createTestGroup = () => {
  const id = uuid()
  return {
    name: 'test group ' + id,
    link_facebook: 'Link-' + id,
    links: [{ url: 'Link-' + id }],
    location_name: 'Forest row',
    location_country: 'XX',
    emails: [`${id}@test.com`],
    location_coord: { lng: -5.8101207, lat: 54.7261871 },
  }
}

jest.setTimeout(1000 * 60 * 5)
describe('Groups API', () => {
  if (process.env.STAGE !== 'test' && endpoint !== 'http://localhost:4000/local') return

  let created: Group
  it('should create a group and return the group with id', async () => {
    const create = createTestGroup()
    const { data: returned } = await axios.post<Group>(
      endpoint + routes.createGroup,
      JSON.stringify(create)
    )
    created = returned
    expect(returned.id.length).toBeGreaterThan(0)
    expect(create.name).toEqual(returned.name)
    expect(create.link_facebook).toEqual(returned.link_facebook)
    expect(create.location_coord).toEqual(returned.location_coord)
  })

  it('should fail to create if group with same URL exists', async () => {
    const { data } = await axios
      .post<Group>(endpoint + routes.createGroup, JSON.stringify(created))
      .catch((x) => x)
    expect(data).toBe('Exists')
  })

  it('return single group without email when given group id as param', async () => {
    const { data: group } = await axios.get<Group>(endpoint + routes.getGroup + `?id=${created.id}`)
    expect(group.emails).toBe(undefined)
  })

  it('return single group with email when given group id and auth token', async () => {
    const editToken = (props: any = {}) => sign({ ...props, type: 'EDIT_GROUP' }, JWT_SECRET)
    const { data } = await axios.get<Group>(
      endpoint + routes.getGroup + `?id=${created.id}&token=${editToken()}`
    )
    expect(data.emails).toEqual(created.emails)
  })

  it('should fail to update group if no token is provided', async () => {
    const { data } = await axios
      .post<Group>(endpoint + routes.updateGroup, {
        id: created.id,
        location_poly: [{ lat: 1, lng: 1 }],
      })
      .catch((e) => ({ data: 'FAIL' }))
    expect(data).toEqual('FAIL')
  })

  it('should fail to update group id is not equal to token id', async () => {
    const editToken = (props: any = {}) => sign({ ...props, type: 'EDIT_GROUP' }, JWT_SECRET)
    const { data } = await axios
      .post<Group>(endpoint + routes.updateGroup + `?token=${editToken({ id: 'fsda' })}`, {
        id: created.id,
        location_poly: [{ lat: 1, lng: 1 }],
      })
      .catch((e) => ({ data: 'FAIL' }))
    expect(data).toEqual('FAIL')
  })

  //
  it('should update group', async () => {
    const editToken = sign({ id: created.id, type: 'EDIT_GROUP' }, JWT_SECRET)
    const { data } = await axios
      .post<Group>(endpoint + routes.updateGroup + `?token=${editToken}`, {
        id: created.id,
        location_poly: [{ lat: 1, lng: 1 }],
      })
      .catch((x) => {
        console.log(x)
        return {} as any
      })
    expect(data.location_poly).toEqual([{ lat: 1, lng: 1 }])
  })

  it('should fail to delete group if not authorised', async () => {
    const editToken = sign({ id: created.id, type: 'EDIT_GROUP' }, JWT_SECRET)
    const { data } = await axios
      .get(endpoint + routes.deleteGroup + `?token=${editToken}`)
      .catch((x) => ({ data: 'FAIL' }))
    expect(data).toEqual('FAIL')
  })

  it('should delete group', async () => {
    const editToken = sign({ id: created.id, type: 'DELETE_GROUP' }, JWT_SECRET)
    const { data } = await axios.get(endpoint + routes.deleteGroup + `?token=${editToken}`)
    expect(data).toEqual({})
  })
})
