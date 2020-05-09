import { getGroupsFromSheet } from '../adapters'
import { createSource } from '../helpers'
import ENV from '../../_utility_/environment'
import axios from 'axios'

// const externalGroups = await getGroupsFromSheet(
//   '1rOnO6iAkSAc90-Zzd4a09L7DouoO3wo9eL_Ia2_CSLg',
//   1455689482,
//   {
//     location_name: 'Location Name',
//     name: 'Name',
//     link_facebook: 'Link',
//   }
// )

export const testSource = createSource(() =>
  getGroupsFromSheet('1rOnO6iAkSAc90-Zzd4a09L7DouoO3wo9eL_Ia2_CSLg', 'Sheet1', {
    location_name: 'Location Name',
    name: 'Name',
    link_facebook: 'Link',
  })
)({
  identifier: 'test-source',
  displayName: 'Test Source',
  origin:
    'https://docs.google.com/spreadsheets/d/1rOnO6iAkSAc90-Zzd4a09L7DouoO3wo9eL_Ia2_CSLg/edit#gid=0',
})([
  { name: 'Piglet', location_name: 'bn35de', link_facebook: 'https://pigstyle.com' },
  { name: 'Piglet FAILS', location_name: 'bn35de', link_facebook: 'https://pigstyle.com' },
])
