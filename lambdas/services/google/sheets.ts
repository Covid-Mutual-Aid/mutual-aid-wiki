import { google, sheets_v4 } from 'googleapis'
import {
  GOOGLE_API_KEY,
  SPREADSHEET_ID,
  SHEET_ID,
  GOOGLE_PRIVATE_KEY,
  GOOGLE_CLIENT_EMAIL,
} from '../lib/utils'
import { Group } from '../lib/types'

export const sheets = google.sheets('v4')

const spreadsheetId = SPREADSHEET_ID

export const authorise = () =>
  Promise.resolve().then(() =>
    google.auth.getClient({
      credentials: {
        private_key: GOOGLE_PRIVATE_KEY,
        client_email: GOOGLE_CLIENT_EMAIL,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })
  )

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

export const getSheet = () =>
  sheets.spreadsheets
    .get({ spreadsheetId, auth: GOOGLE_API_KEY, includeGridData: true })
    .then(spreadsheet =>
      (spreadsheet.data.sheets || []).find(x => x.properties && x.properties.sheetId === SHEET_ID)
    )

export const addSheetRow = (group: Pick<Group, 'location_name' | 'name' | 'link_facebook'>) => {
  const date = new Date()

  const row = [
    group.location_name,
    `${date.toLocaleDateString()} ${date.toTimeString().replace(/\s.*/, '')}`,
    group.name,
    group.link_facebook,
  ].map(value => ({
    userEnteredValue: { stringValue: value },
  }))

  return authorise()
    .then(auth => updateSheet(auth)(addRow(row, SHEET_ID)))
    .then(console.log)
    .catch(console.log)
}
