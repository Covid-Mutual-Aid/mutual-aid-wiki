export type Group = {
  id: string
  name: string
  emails?: string[]
  link_facebook: string
  location_name: string
  location_coord: { lat: number; lng: number }
}

export type Search = {
  id: string
  query: string
  place_id: string
  address: string
  coords: { lat: number; lng: number }
}

export type AuthKey =
  | { type: 'EXPIRE' }
  | { type: 'ONCE' }
  | { id: string; access_type: 'ANY' }
  | { id: string; access_type: 'ITEM'; table: string; itemId: string }
