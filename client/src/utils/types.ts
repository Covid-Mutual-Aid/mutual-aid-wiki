export type Request = <T extends any>(input: RequestInfo, init?: RequestInit) => Promise<T>

export type Coord = {
  lat: number
  lng: number
}

export type GroupLink = {
  url: string
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
  links: GroupLink[]
  link_facebook: string
  location_name: string
  location_country: string
  location_coord: Coord
  location_poly?: Coord[]
}

export type Emails = string[]

export type GroupWithEmails = Omit<Group, 'id'> & { emails: Emails }
