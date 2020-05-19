import { Group } from '../_utility_/types'
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
export type FieldMap = { [k: string]: keyof Group }

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
    groupRow[labelRow.findIndex((v) => (v || '').trim() === label)]?.toString()

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
    [{ links: [] }, {}] as (Group | Record<any, any>)[]
  )

  return {
    ...group,
    external_data,
  } as Group & { external_data: Record<any, any> }
}

/**
 * Remaps fields of external group JSON into the format this database expects
 * @param map Object that maps fields in external groups to groups used here
 * @returns Function that accepts an external group object and returns one with the map
 */
export const groupConstructorObj = <T extends FieldMap>(map: T) => (
  externalGroup: Record<any, any>
) => {
  const [formattedGroup, external_data] = Object.keys(
    externalGroup as [keyof typeof externalGroup]
  ).reduce(
    ([group, external_data], externalLabel, index) => {
      const groupLabel = map[externalLabel || '']
      if (typeof groupLabel === 'undefined')
        return [
          group,
          {
            ...external_data,
            [externalLabel || '']: isObject(externalGroup[externalLabel])
              ? flattenObj(externalGroup[externalLabel])
              : externalGroup[externalLabel],
          },
        ]

      if (groupLabel === 'links') {
        return [
          {
            ...group,
            links: [
              ...group.links,
              {
                url: externalGroup[externalLabel],
              },
            ],
          },
          external_data,
        ]
      }

      return [
        {
          ...group,
          [groupLabel]: externalGroup[externalLabel].toString(),
        },
        external_data,
      ]
    },
    [{ links: [] }, {}] as (Group | Record<any, any>)[]
  )
  return {
    ...formattedGroup,
    external_data,
  } as Group & { external_data: Record<any, any> }
}

export const getGroupsFromSheet = async (
  id: string,
  sheetIdentifier: string,
  map: Record<any, keyof Group>
) => {
  const groupData: any = await getSheetData(id, sheetIdentifier)

  const [titleRow, ...rows] = groupData.values
  const createGroup = groupConstructor(titleRow, map)

  const groups = rows.map((r: any) => createGroup(r))

  console.log(groups, 'groups')
  return groups
}

const isObject = (v: any) => ({}.constructor === v.constructor)
export const flattenObj = (obj: Record<any, any>, prefix?: string): any =>
  Object.keys(obj).reduce(
    (flat, key) =>
      isObject(obj[key])
        ? { ...flat, ...flattenObj(obj[key], key) }
        : { ...flat, [prefix ? prefix + '.' + key : key]: obj[key] },
    {} as { [k: string]: any }
  )
