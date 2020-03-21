import { google, sheets_v4 } from 'googleapis'
import { GOOGLE_API_KEY } from '../lib/utils'
export const sheets = google.sheets('v4')

export const spreadsheetId = '1FAIpQLSdJrgqHazomhDsJDG3Nnye30Ys7sZEl-APCrQh80D1g-iQrgQ'

export const updateSheet = (auth: any) => (...args: sheets_v4.Schema$Request[]) =>
  sheets.spreadsheets.batchUpdate({
    auth,
    spreadsheetId,
    requestBody: {
      includeSpreadsheetInResponse: true,
      requests: args,
    },
  })

export const getSheet = () =>
  sheets.spreadsheets.get({ spreadsheetId, auth: GOOGLE_API_KEY, includeGridData: true })
