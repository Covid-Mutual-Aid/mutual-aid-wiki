// google sheet 1J7bjI-2bD4zpvpQM3v1QB9dlbbUgPErnn-JjBq4NrNs

import { getSheetData, groupConstructor } from '../adapters'
import { createSource } from '../helpers'
import { ExternalGroup } from '../../_utility_/types'
import { omit } from '../../_utility_/utils'

const getGroups = async () => {
  const groupData: any = await getSheetData('1J7bjI-2bD4zpvpQM3v1QB9dlbbUgPErnn-JjBq4NrNs', 'ALL')

  // console.log(groupData)
  const titleRow = [
    'country',
    'listingState',
    'Regions covered',
    'postcode',
    'Initiative type',
    'Target group',
    'Initiative name',
    'Contact details',
    'message',
    'LatitudeLongitude',
  ]
  const rows = groupData.values
  const createGroup = groupConstructor(titleRow, {
    'Regions covered': 'location_name',
    'Initiative name': 'name',
    'Contact details': 'links',
  })

  const groups = rows
    .map((r: any) => createGroup(r))
    .filter((x: any) => x.location_name && x.name && x.links.length > 0) as ExternalGroup[]

  return groups
}

const testCases = [
  {
    links: [{ url: 'https://www.facebook.com/groups/2467532753498978/?hc_location=ufi' }],
    location_name: 'Melbourne - all Northside',
    name: 'NorthSide Melbourne CoronaVirus Outreach',
  },
  {
    links: [{ url: 'https://www.facebook.com/groups/EastsideMelbCoronavirusOutreach/' }],
    location_name: 'Melbourne - all Eastside',
    name: 'Eastside Melbourne Coronavirus Outreach',
  },
  {
    links: [{ url: 'https://www.facebook.com/groups/486869402197064/' }],
    location_name: 'Melbourne - all Southside',
    name: 'Southside Melbourne Coronavirus Outreach',
  },
  {
    links: [{ url: 'https://www.facebook.com/groups/614273975816743/' }],
    location_name: 'Melbourne - all Westside',
    name: 'Westside Melbourne Coronavirus Outreach',
  },
  {
    links: [{ url: 'https://www.facebook.com/groups/162278224778441/' }],
    location_name: 'Melbourne - unspecified',
    name: 'COVID-19 Queer Aid Naarm / Melbourne',
  },
  {
    links: [{ url: 'https://www.facebook.com/groups/lynmelbourne/?hc_location=ufi' }],
    location_name: 'Melbourne - unspecified',
    name: 'Love your neighbour Melbourne: COVID-19 inspired local connections',
  },
  {
    links: [{ url: 'https://www.facebook.com/groups/248032376213090/?hc_location=ufi' }],
    location_name: 'Victoria - unspecified',
    name: 'Project share - open pantry grocery swap',
  },
  {
    links: [{ url: 'https://www.facebook.com/groups/679965322543965/?hc_location=ufi' }],
    location_name: 'Victoria - unspecified',
    name: 'Blackfullas COVID-19 Support and Assistance Victoria',
  },
  {
    links: [{ url: 'Call or text one of these two numbers: 0423 359 279 or 0401 509 236' }],
    location_name:
      'Victoria - Cranbourne, Frankston, Tooradin, Hampton Park, Lyndhurst, Lynbrook, Junction Village, Devon Meadows, Narre Warren, Berwick',
    name: 'Sikh Volunteers Australia',
  },
  {
    links: [{ url: 'https://www.facebook.com/groups/queercommunitymutualaidcollective/' }],
    location_name: 'Victoria - all',
    name: 'Queer Community Mutual Aid Network Vic',
  },
]

export const austrailiaInformalMutualAid = createSource({
  displayName: 'Australia COVID-19 Informal Mutual Aid Database',
  external_id: 'austrailia-informal-mutual-aid',
  external_link:
    'https://docs.google.com/spreadsheets/d/18P898HWbdR5ouW61sAxW_iBl3yiZlgJu0nSmepn6NwM/edit#gid=1451634215',
  getGroups,
  testCases,
})
