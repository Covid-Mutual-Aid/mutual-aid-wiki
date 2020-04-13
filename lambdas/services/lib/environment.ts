const env = process.env

export const isOffline = () => !!env.OFFLINE || !!env.IS_LOCAL

export const other = {
  STAGE: env.STAGE as string,
  JWT_SECRET: env.JWT_SECRET as string,
  SLACK_API_TOKEN: env.SLACK_API_TOKEN as string,
  SEND_GRID_API_KEY: env.SEND_GRID_API_KEY as string,
}

export const airtable = {
  AIRTABLE_ATTACH_EMAIL_BASE: env.AIRTABLE_ATTACH_EMAIL_BASE as string,
  AIRTABLE_ATTACH_EMAIL_KEY: env.AIRTABLE_ATTACH_EMAIL_KEY as string,
}

export const google = {
  GOOGLE_API_KEY: env.GOOGLE_API_KEY as string,
  SPREADSHEET_ID: env.SPREADSHEET_ID as string,
  SHEET_ID: env.SHEET_ID as string,
  GOOGLE_PRIVATE_KEY: env.GOOGLE_PRIVATE_KEY as string,
  GOOGLE_CLIENT_EMAIL: env.GOOGLE_CLIENT_EMAIL as string,
}

export const tables = {
  GROUPS_TABLE: env.GROUPS_TABLE as string,
  LOCATION_SEARCHES_TABLE: env.LOCATION_SEARCHES_TABLE as string,
  AUTHENTICATED_KEYS_TABLE: env.AUTHENTICATED_KEYS_TABLE as string,
}

const ENV = { ...other, ...airtable, ...google, ...tables }

export default ENV