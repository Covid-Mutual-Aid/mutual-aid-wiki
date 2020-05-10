import { getSheetData, groupConstructor } from '../adapters'
import { createSource } from '../helpers'
import { ExternalGroup } from '../../_utility_/types'

const getGroups = async () => {
  const groupData: any = await getSheetData(
    '18P898HWbdR5ouW61sAxW_iBl3yiZlgJu0nSmepn6NwM',
    'Form responses 1'
  )

  const [_, titleRow, ...rows] = groupData.values
  const createGroup = groupConstructor(titleRow, {
    location_name: 'Location',
    name: 'Group name',
    link_facebook: 'Facebook group/website (Link/URL) Please only provide one link',
  })

  const groups = rows
    .map((r: any) => createGroup(r))
    .filter((x: any) => x.location_name && x.name && x.link_facebook) as ExternalGroup[]

  return groups
}

const testCases = [
  {
    link_facebook: 'https://www.facebook.com/groups/4483812821632630/',
    location_name: '151-179a Frome Road (odd numbers only), Trowbridge ',
    name: 'Frome Road layby COVID-19 Community Support (Trowbridge)',
  },
  {
    link_facebook: 'https://www.facebook.com/CoronavirusCommunityHelp',
    location_name: '25 locations',
    name: 'I have 25 groups',
  },
  {
    link_facebook: 'https://bit.ly/2J3pZDQ',
    location_name: '31 old road',
    name: 'Isolation help Bexley',
  },
  {
    link_facebook: 'http://bartonroadcentre.co.uk/',
    location_name: '40 Barton Rd, Lancaster LA1 4ER',
    name: 'Barton Road Community Centre',
  },
]

export const covid19MutualAidGroupsUk = createSource({
  displayName: 'Covid19 Mutual Aid Groups UK',
  external_id: 'covid19-mutual-aid-groups-uk',
  external_link:
    'https://docs.google.com/spreadsheets/d/18P898HWbdR5ouW61sAxW_iBl3yiZlgJu0nSmepn6NwM/edit#gid=1451634215',
  getGroups,
  testCases,
})
