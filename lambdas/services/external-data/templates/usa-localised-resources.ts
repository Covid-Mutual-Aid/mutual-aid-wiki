// curl https://sheets.googleapis.com/v4/spreadsheets/1HEdNpLB5p-sieHVK-CtS8_N7SIUhlMpY6q1e8Je0ToY/values/Local%20Mutual%20Aid\?key=AIzaSyDD8gtVtIrx6A0FpaTb7WXy0r1tZR8iECg

import { google, sheets_v4 } from 'googleapis'
import ENV from '../../_utility_/environment'
import { Group } from '../../_utility_/types'

const sheets = google.sheets('v4')
const spreadsheetId = '1HEdNpLB5p-sieHVK-CtS8_N7SIUhlMpY6q1e8Je0ToY'

export const getData = () =>
  sheets.spreadsheets
    .get({ spreadsheetId, auth: ENV.GOOGLE_API_KEY, includeGridData: true })
    .then((spreadsheet) => (spreadsheet.data.sheets || []).map((x) => x.properties))
