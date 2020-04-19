export type Group = {
  id: string
  name: string
  emails?: string[]
  link_facebook: string
  location_name: string
  location_coord: { lat: number; lng: number }
  created_at?: string
  updated_at?: string
}

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
