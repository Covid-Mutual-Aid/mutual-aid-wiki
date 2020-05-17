import { ExternalGroup, Group } from '../_utility_/types'
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
export type FieldMap = { [k: string]: keyof ExternalGroup }

/**
 * Constructs group objects from an array of group arrays. Useful for creating groups from sources like google sheets
 * @param labelRow Array of labels that match the order of values in the array group
 * @param map Object that maps the labels in labelsRow to labels defined in type ExternalGroup
 * @returns Function that accepts an array of fields and returns a group
 */
export const groupConstructor = <T extends FieldMap>(labelRow: string[], map: T) => (
  groupRow: Cell[]
) => {
  const value = (groupRow: Cell[], label: string) =>
    groupRow[labelRow.findIndex((v) => (v || '').trim() === label)]

  const [group, external_data] = labelRow.reduce(
    ([group, external_data], externalLabel, index) => {
      const groupLabel = map[externalLabel || '']
      if (typeof groupLabel === 'undefined')
        return [group, { ...external_data, [externalLabel || '']: groupRow[index] }]

      if (groupLabel === 'links') {
        return [
          {
            ...group,
            links: [
              ...group.links,
              {
                url: value(groupRow, externalLabel),
              },
            ],
          },
          external_data,
        ]
      }

      return [
        {
          ...group,
          [groupLabel]: value(groupRow, externalLabel),
        },
        external_data,
      ]
    },
    [{ links: [] }, {}] as (ExternalGroup | Record<any, any>)[]
  )

  return {
    ...group,
    external_data,
  } as ExternalGroup & { external_data: Record<any, any> }
}

export const getGroupsFromSheet = async (
  id: string,
  sheetIdentifier: string,
  map: Record<any, keyof ExternalGroup>
) => {
  const groupData: any = await getSheetData(id, sheetIdentifier)

  const [titleRow, ...rows] = groupData.values
  const createGroup = groupConstructor(titleRow, map)

  return rows
    .map((r: any) => createGroup(r))
    .filter((x: any) => x.location_name && x.name && x.link_facebook) as ExternalGroup[]
}
