import { getGroupsFromSheet } from '../adapters'
import { createSource } from '../helpers'

const getGroups = () =>
  getGroupsFromSheet('1rOnO6iAkSAc90-Zzd4a09L7DouoO3wo9eL_Ia2_CSLg', 'Sheet1', {
    'Location Name': 'location_name',
    Name: 'name',
    Link: 'links',
  })

const testCases = [
  {
    name: 'Piglet',
    location_name: 'london',
    link_facebook: 'https://pigs.com',
    links: [{ url: 'https://pigs.com' }],
  },
  {
    name: 'Foo edit',
    location_name: 'london',
    links: [{ url: 'https://baz.com' }],
  },
  {
    name: 'Failing test',
    location_name: 'london',
    links: [{ url: 'https://pigstyle.com' }],
  },
]

export const testSource = createSource({
  displayName: 'Test Source',
  external_id: 'test-source',
  external_link:
    'https://docs.google.com/spreadsheets/d/1rOnO6iAkSAc90-Zzd4a09L7DouoO3wo9eL_Ia2_CSLg/edit#gid=0',
  getGroups,
  testCases,
})
