import { groupConstructorObj } from '../adapters'
import { createSource } from '../helpers'
import { ExternalGroup } from '../../_utility_/types'
import axios from 'axios'

const baseUrl = "https://firestore.googleapis.com/v1/projects/townhallproject-86312/databases/(default)/documents/mutual_aid_networks"

// This is needed as the optional arg to getAllGroups changes the
// type signature!

const getGroups = async(pageToken? : String, groups : ExternalGroup[]=[]) : Promise<ExternalGroup[]> => {
  const data = await getGroupsPage(pageToken)
  const pageGroups = await createGroups(data.documents)
  const allGroups = groups.concat(pageGroups)
  if(data.nextPageToken) {
    return await getGroups(data.nextPageToken, allGroups)
  } else {
    return allGroups
  }
}

const createGroup = groupConstructorObj({
  'title' : "name",
  'address': 'location_name',
  'facebookPage': 'links',
  'generalForm': 'links',
  'supportRequestForm': 'links',
  'supportOfferForm': 'links'
})

const normaliseFirebaseFormat = (data : any) => {
  const topLevelKeys= Object.keys(data as [keyof typeof data])
  let group : Record<any, any> = {}
  if(topLevelKeys.includes('fields')) {
    for(const key in data.fields) {
      const valueObj = data.fields[key]
      if("stringValue" in valueObj) {
        if(valueObj.stringValue != "") {
          group[key] = valueObj.stringValue
        }
      }
      if("doubleValue" in valueObj) {
        group[key] = valueObj.doubleValue
      }
      if("arrayValue" in valueObj) {
        if("values" in valueObj.arrayValue) {
          group[key] = valueObj.arrayValue.values
        }
      }
    }
  }
  for(const key of topLevelKeys) {
    if(key != 'fields') {
      group[key] = data[key]
    }
  }
  return group
}

const createGroups = async(data : any[]) => {
  return data
    .map((datum : any) => createGroup(normaliseFirebaseFormat(datum)))
    .filter((g : any) => g.location_name && g.name && g.links.length > 0) as ExternalGroup[]
}

const getGroupsPage = async (pageToken? : String) => {
  const response = await axios.get(baseUrl, {
    params: {
      pageToken: pageToken
    }
  })
  return response.data
}

const testCases = [
  {
    name: "Aid Network Denton",
    location_name: "Denton, Texas, USA",
    links: [
      { url: "https://docs.google.com/document/d/1mNdlT_Yl9uhwDGuBxyYYfqXzdiM6R3BcSsBUbbRqzN4/edit?fbclid=IwAR3km02Ec2dU-Cz4SaxbpZFIHrggtqdqYO0zhIU7H_JG0ACmslnxk7r3MzA#"},
      { url: "https://docs.google.com/forms/d/180eQT1XLxjkZMgJl54bL9Asv0JCH10T-_Cg07rZ5Lhc/viewform?edit_requested=true"},
      { url: "https://docs.google.com/forms/d/1YTjMuCCquDnawbjAeDJSubQXuJkL8-1K22Z2rOPP9vM/viewform?edit_requested=true"}
    ]
  },
  {
    name: "Boston Queers for Mutual Aid",
    location_name: "Boston, Massachusetts, USA",
    links: [{ url: "https://www.facebook.com/groups/1910113582610797/?ref=br_rs"}]
  },
  {
    name: "COVID-19 Emergency Food Distribution (LA)",
    location_name: "Los Angeles, California, USA",
    links: [
      { url: "https://urbanpartnersla.org/"},
      { url: "https://www.facebook.com/UrbanPartnersLA/" }
    ]
  }
]

export const mutualaidhub = createSource({
  displayName: "Mutual Aid Hub",
  external_id: "mutual-aid-hub",
  external_link: "https://www.mutualaidhub.org/",
  getGroups, testCases
})
