// curl https://sheets.googleapis.com/v4/spreadsheets/1HEdNpLB5p-sieHVK-CtS8_N7SIUhlMpY6q1e8Je0ToY/values/Local%20Mutual%20Aid\?key=AIzaSyDD8gtVtIrx6A0FpaTb7WXy0r1tZR8iECg

import { google, sheets_v4 } from 'googleapis'
import ENV from '../../_utility_/environment'
import { ExternalGroup } from '../../_utility_/types'
import { create } from 'domain'

const sheets = google.sheets('v4')
const spreadsheetId = '1HEdNpLB5p-sieHVK-CtS8_N7SIUhlMpY6q1e8Je0ToY'

type Cell = string | undefined | null

const groupConstructor = (titleRow: Cell[], map: ExternalGroup) => (row: Cell[]) =>
  (Object.keys(map) as [keyof ExternalGroup]).reduce((group, key) => {
    return { ...group, [key]: row[titleRow.findIndex((v) => (v || '').trim() === map[key])] }
  }, {} as ExternalGroup)

export const getData = () =>
  sheets.spreadsheets
    .get({ spreadsheetId, auth: ENV.GOOGLE_API_KEY, includeGridData: true })
    .then((spreadsheet) =>
      (spreadsheet.data.sheets || []).find((x) => x.properties?.sheetId === 1455689482)
    )
    .then((x) => {
      const rowData = x && x.data && x.data[0] && x.data[0].rowData
      if (!rowData) return Promise.reject('No row data')

      const rows = rowData.map((cell) =>
        (cell.values || []).map(
          (cell) => cell.userEnteredValue && cell.userEnteredValue.stringValue
        )
      )

      const map = {
        location_name: 'State',
        name: 'Title of Document',
        link_facebook: 'Link',
      }

      const createGroup = groupConstructor(rows[0], map)

      return rows
        .map((r) => createGroup(r))
        .filter((x) => x.location_name && x.name && x.link_facebook)
    })
