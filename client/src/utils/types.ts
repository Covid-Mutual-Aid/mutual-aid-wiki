export type Coord = {
  lat: number
  lng: number
}

export type Group = {
  name: string
  emails?: string[]
  link_facebook: string
  location_name: string
  location_coord: Coord
}

export type Emails = string[]

export type GroupWithEmails = Group & { emails: Emails }
