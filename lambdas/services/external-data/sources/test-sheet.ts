import { getGroupsFromSheet } from '../adapters'
import { createSource } from '../helpers'

const getGroups = () =>
  getGroupsFromSheet('1rOnO6iAkSAc90-Zzd4a09L7DouoO3wo9eL_Ia2_CSLg', 'Sheet1', {
    location_name: 'Location Name',
    name: 'Name',
    link_facebook: 'Link',
  })

const testCases = [
  { name: 'Piglet', location_name: 'bn35de', link_facebook: 'https://pigstyle.com' },
  { name: 'Piglet FAILS', location_name: 'bn35de', link_facebook: 'https://pigstyle.com' },
  { name: 'Another FAILS', location_name: 'bn35de', link_facebook: 'https://pigstyle.com' },
]

export const testSource = createSource({
  displayName: 'Test Source',
  external_id: 'test-source',
  external_link:
    'https://docs.google.com/spreadsheets/d/1rOnO6iAkSAc90-Zzd4a09L7DouoO3wo9eL_Ia2_CSLg/edit#gid=0',
  getGroups,
  testCases,
})
