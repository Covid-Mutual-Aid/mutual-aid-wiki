export type Coord = { lat: number; lng: number }
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
  created_at?: string
  updated_at?: string
}

export type ExternalGroup = Pick<Group, 'name' | 'link_facebook' | 'location_name' | 'emails'>

export type Search = {
  id: string
  query: string
  place_id: string
  address: string
  coords: { lat: number; lng: number }
}

export type Token = {
  id: string
  type: 'JWT_TOKEN'
}
