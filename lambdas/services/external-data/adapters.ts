import { ExternalGroup } from '../_utility_/types'
import axios from 'axios'
import ENV from '../_utility_/environment'
import { groupConstructor } from './helpers'

const getSheetData = (id: string, sheetIdentifier: string) =>
  axios
    .get(
      `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${sheetIdentifier}/?key=${ENV.GOOGLE_API_KEY}`
    )
    .then((d) => d.data)

export const getGroupsFromSheet = async (
  id: string,
  sheetIdentifier: string,
  map: ExternalGroup
) => {
  const groupData: any = await getSheetData(id, sheetIdentifier)

  const [titleRow, ...rows] = groupData.values

  const createGroup = groupConstructor(titleRow, map)

  return rows
    .map((r: any) => createGroup(r))
    .filter((x: any) => x.location_name && x.name && x.link_facebook) as ExternalGroup[]
}
