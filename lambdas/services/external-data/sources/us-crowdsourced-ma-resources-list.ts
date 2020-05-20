import { getSheetData, groupConstructor } from '../adapters'
import { createSource } from '../helpers'
import { ExternalGroup } from '../../_utility_/types'

const getGroups = async () => {
  const groupData: any = await getSheetData(
    '1M9Y46lhZSVIRyE1Qh74Tj5uu91VKs5nhFCUudnFOqOg',
    'Form responses 1'
  )

  const [_1, _2, _3, _4, _5, titleRow, ...rows] = groupData.values
  const createGroup = groupConstructor(titleRow, {
    "Location: Community, City, or Region - or \"online\" for distributed efforts": 'location_name',
    'Name of initiative': 'name',
    'Primary link': 'links',
  })

  const groups = rows
    .map((r: any) => createGroup(r))
    .filter((x: any) => x.location_name && x.name && x.links) as ExternalGroup[]

  return groups
}

const testCases = [
  {
    links: [{ url: 'https://www.facebook.com/groups/1005041203222884/' }],
    location_name: 'Montreal, Quebec Canada',
    name: 'MTL COVID-19 Mutual Aid Mobilisation d\'entraide',
  },
  {
    links: [{ url: 'https://docs.google.com/spreadsheets/d/1iRTr4P5fJsGlJ5ogNqogZMOFtuOsdMSiDylkjZo-AKE/edit?usp=sharing' }],
    location_name: 'Sacramento',
    name: 'Sacramento COVID-19 Mutual Aid 2020',
  },
  {
    links: [{ url: 'https://docs.google.com/document/d/1XMVbEVqFLuhjuzE8H7lQ8o03Bz38DYBRWJjdP3mMqj4/edit?usp=sharing' }],
    location_name: 'Louisville, KY',
    name: 'Louisville Mutual Aid- Coronavirus Specific',
  },
]

export const usCrowdsourcedMAResources = createSource({
  displayName: 'Listings of #covid19mutualaid initiatives (crowd-sourced)',
  external_id: 'us-crowdsourced-ma-resources-list',
  external_link:
  'https://docs.google.com/spreadsheets/d/1M9Y46lhZSVIRyE1Qh74Tj5uu91VKs5nhFCUudnFOqOg/edit#gid=776187552',
  getGroups,
  testCases,
})
