import { ExternalGroup } from '../_utility_/types'
import axios from 'axios'
import ENV from '../_utility_/environment'

export const getSheetData = (id: string, sheetIdentifier: string) =>
  axios
    .get(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURI(id)}/values/${encodeURI(
        sheetIdentifier
      )}/?key=${ENV.GOOGLE_API_KEY}`
    )
    .then((d) => d.data)

type Cell = string | undefined | null

export const getKeyByValue = <T extends Record<any, any>>(object: T, value: string) => {
  return (Object.keys(object) as [keyof T]).find((key) => object[key] === value)
}

export const groupConstructor = <T extends Record<any, any>>(labels: Cell[], map: T) => (
  groupArray: Cell[]
) => {
  const [group, external_data] = labels.reduce(
    ([group, external_data], l, index) => {
      const label = getKeyByValue(map, l || '')
      return typeof label !== 'undefined'
        ? [
            {
              ...group,
              [label]: groupArray[labels.findIndex((v) => (v || '').trim() === map[label])],
            },
            external_data,
          ]
        : [group, { ...external_data, [l || '']: groupArray[index] }]
    },
    [{}, {}] as (ExternalGroup | Record<any, any>)[]
  )

  return {
    ...group,
    external_data,
  } as ExternalGroup & { external_data: Record<any, any> }
}

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
