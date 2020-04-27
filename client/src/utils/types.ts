export type Coord = {
  lat: number
  lng: number
}

export type Group = {
  id: string
  name: string
  emails?: string[]
  description?: string
  contact?: {
    phone?: string
    email?: string
  }
  link_facebook: string
  location_name: string
  location_coord: Coord
  location_poly?: Coord[]
}

export type Emails = string[]

export type GroupWithEmails = Omit<Group, 'id'> & { emails: Emails }
