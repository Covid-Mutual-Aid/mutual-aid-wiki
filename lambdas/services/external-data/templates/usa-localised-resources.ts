// curl https://sheets.googleapis.com/v4/spreadsheets/1HEdNpLB5p-sieHVK-CtS8_N7SIUhlMpY6q1e8Je0ToY/values/Local%20Mutual%20Aid\?key=AIzaSyDD8gtVtIrx6A0FpaTb7WXy0r1tZR8iECg

import { google, sheets_v4 } from 'googleapis'
import ENV from '../../_utility_/environment'
import { Group } from '../../_utility_/types'

const sheets = google.sheets('v4')
const spreadsheetId = '1HEdNpLB5p-sieHVK-CtS8_N7SIUhlMpY6q1e8Je0ToY'

export const getData = () =>
  //   sheets.spreadsheets
  //     .get({
  //       spreadsheetId,
  //       ranges: ['Local Mutual Aid'],
  //       auth: ENV.GOOGLE_API_KEY,
  //       includeGridData: true,
  //     })
  //     .then((spreadsheet) => (spreadsheet.data.sheets || []).map((x) => x.properties)) //(spreadsheet.data.sheets || []).map((x) => x.properties)
  // // .then((sheet) => sheet.data || {})

  sheets.spreadsheets
    .get({ spreadsheetId, auth: ENV.GOOGLE_API_KEY, includeGridData: true })
    .then((spreadsheet) =>
      (spreadsheet.data.sheets || []).find((x) => x.properties?.sheetId === 1455689482)
    )
    .then((x) => {
      const rowData = x && x.data && x.data[0] && x.data[0].rowData
      if (!rowData) return Promise.reject('No row data')
      // rowData.map(({ values }) => console.log(values))

      return rowData
        .map((x) => {
          const values = (x.values || []).map(
            (x) => x.userEnteredValue && x.userEnteredValue.stringValue
          )
          return {
            location_name: values[3] as string,
            name: values[2] as string,
            link_facebook: values[5] as string,
          }
        })
        .filter((x) => x.location_name && x.name && x.link_facebook)
    })
