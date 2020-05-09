import { google, sheets_v4 } from 'googleapis'
import { Group, ExternalGroup } from '../_utility_/types'
import ENV from '../_utility_/environment'
import { groupConstructor } from '../external-data/adapters'

export const sheets = google.sheets('v4')

const spreadsheetId = ENV.SPREADSHEET_ID

export const authorise = () =>
  Promise.resolve().then(() =>
    google.auth.getClient({
      credentials: {
        private_key: ENV.GOOGLE_PRIVATE_KEY,
        client_email: ENV.GOOGLE_CLIENT_EMAIL,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })
  )

export const addSheet = (title: string): sheets_v4.Schema$Request => ({
  addSheet: { properties: { title } },
})

export const updateSheet = (auth: any) => (...args: sheets_v4.Schema$Request[]) =>
  sheets.spreadsheets.batchUpdate({
    auth,
    spreadsheetId,
    requestBody: {
      includeSpreadsheetInResponse: true,
      requests: args,
    },
  })

export const addRow = (
  values: sheets_v4.Schema$CellData[],
  sheetId: number
): sheets_v4.Schema$Request => ({
  appendCells: { sheetId, fields: '*', rows: [{ values }] },
})

export const getSheets = () =>
  sheets.spreadsheets
    .get({ spreadsheetId, auth: ENV.GOOGLE_API_KEY, includeGridData: true })
    .then((spreadsheet) => (spreadsheet.data.sheets || []).map((x) => x.properties))

export const getGroupRow = (group: Pick<Group, 'location_name' | 'name' | 'link_facebook'>) => {
  const date = new Date()
  return [
    group.location_name,
    `${date.toLocaleDateString()} ${date.toTimeString().replace(/\s.*/, '')}`,
    group.name,
    group.link_facebook,
  ].map((value) => ({
    userEnteredValue: { stringValue: value },
  }))
}

export const addSheetRow = (
  group: Pick<Group, 'location_name' | 'name' | 'link_facebook'>,
  sheetId?: string
) =>
  authorise().then((auth) =>
    updateSheet(auth)(addRow(getGroupRow(group), sheetId || (ENV.SHEET_ID as any)))
  )

export const getGroupsFromSheet = (spreadsheetId: string, sheetId: number, map: ExternalGroup) =>
  sheets.spreadsheets
    .get({ spreadsheetId, auth: ENV.GOOGLE_API_KEY, includeGridData: true })
    .then((spreadsheet) =>
      (spreadsheet.data.sheets || []).find((x) => x.properties?.sheetId === sheetId)
    )
    .then((x) => {
      const rowData = x && x.data && x.data[0] && x.data[0].rowData
      if (!rowData) return Promise.reject('No row data')

      const [titleRow, ...rows] = rowData.map((cell) =>
        (cell.values || []).map(
          (cell) => cell.userEnteredValue && cell.userEnteredValue.stringValue
        )
      )

      const createGroup = groupConstructor(titleRow, map)

      return rows
        .map((r) => createGroup(r))
        .filter((x) => x.location_name && x.name && x.link_facebook)
    })

// export const createDedupeSheet = async () => {
//   const name = new Date().toISOString()
//   const auth = await authorise()
//   const currentGroups = await getGroupsFromSheet()
//     .then(uniqueBy(isSameGroup))
//     .then((groups) => groups.map(getGroupRow))

//   return Promise.resolve()
//     .then(() => updateSheet(auth)(addSheet(name)))
//     .then((res) => res.data.updatedSpreadsheet?.sheets?.find((x) => x.properties?.title === name))
//     .then((sheet) =>
//       updateSheet(auth)({
//         appendCells: {
//           sheetId: sheet?.properties?.sheetId,
//           fields: '*',
//           rows: currentGroups.map((values) => ({ values })),
//         },
//       })
//     )
// }
