import { flattenObj } from '../adapters'
import { createSource } from '../helpers'
import axios from 'axios'
import getUrls from 'get-urls'
import { omit } from '../../_utility_/utils'

const getGroups = async () => {
  const groups = await axios
    .get(`https://api.reach4help.org/edge/map/data`)
    .then((d) => d.data.data)
    .then((gs) =>
      gs.filter(
        ({ license, contact, type, general, web }: any) =>
          license === 'reach4help' && contact && type.type === 'mutual-aid-group'
      )
    )
    .then((gs) =>
      gs.map((g: any) => ({
        // Inconsistent formatting so just extracting all links from object
        links: Array.from(getUrls(JSON.stringify(g))).map((link) => ({ url: link })),
        location_name: g.loc.description,
        name: g.contentTitle,
        external_data: {
          ...flattenObj(omit(['contentTitle'], g)),
        },
      }))
    )

  return groups
}

const testCases = [
  {
    links: [
      { url: 'https://gofundme.com/f/blmcovid' },
      {
        url:
          'https://gofundme.com/f/blmcovid%22,%22Instagram%22:%22https://www.instagram.com/blacklivesmatterdc/%22,%22Twitter%22:%22https://twitter.com/DMVBlackLives%22%7D,%22email%22:[%22info@dcblm.org',
      },
      { url: 'https://facebook.com/BLMDC' },
    ],
    location_name: 'District of Columbia / Washington',
    name: 'DC Mutual Aid Network East of the River',
  },
  {
    links: [
      {
        url:
          'https://docs.google.com/spreadsheets/d/1UqvDWmL4Wt_fOphAL_EZddI2WWZPeBNt3yt9RKosBJI/edit#gid=634347005',
      },
    ],
    location_name: 'Orange County, California',
    name: 'Orange County COVID-19 Mutual Aid',
  },
  {
    links: [],
    location_name: 'Suttons Bay Township, MI, USA',
    name: 'GRAND TRAVERSE BAND OF OTTAWA AND CHIPPEWA INDIANS MUTUAL AID',
  },
  {
    links: [
      { url: 'https://gofundme.com/f/covid19-mutual-aid-network' },
      { url: 'http://groundgamela.org' },
      { url: 'http://facebook.com/mutualaidLA' },
    ],
    location_name: 'Los Angeles, California',
    name: 'COVID-19 Mutual Aid - LA - Ground Game',
  },
  {
    links: [
      {
        url:
          'https://google.com/url?q=https%3A%2F%2Ftinyurl.com%2Fquarantine-support&sa=D&usg=AFQjCNFNkqG1gNvFyiXTldi7_aLmPR6vBA&ust=1584994208551000',
      },
      {
        url:
          'https://google.com/url?q=https%3A%2F%2Ftinyurl.com%2Fquarantine-volunteer&sa=D&usg=AFQjCNFM70k4iQP3BkPRDGTsm9d0Fg80YA&ust=1584994208551000',
      },
      {
        url:
          'https://docs.google.com/forms/d/e/1FAIpQLScnpw-ScLBjjNCaPq2T0-E6GTBj3hrYJ_UVJS6_ZfH8T3WOJQ/viewform?fbclid=IwAR2ZXHalBZ6iynibcL7OrEfCivuSKH0RL30UcoR5vCn9wOQ8i4LVwBdcBGw',
      },
    ],
    location_name: 'Dane County, Wisconsin',
    name:
      'Wisconsin / Madison: Volunteer or Donate for Coronavirus Quarantine Support with the Madison General Defense Committee',
  },
]

export const reach4help = createSource({
  displayName: 'Reach4Help',
  external_id: 'reach4help',
  external_link: 'https://reach4help.org/',
  getGroups,
  testCases,
})
