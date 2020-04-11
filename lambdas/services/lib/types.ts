export type Group = {
  id: string
  name: string
  emails?: string[]
  link_facebook: string
  location_name: string
  location_coord: { lat: number; lng: number }
}
export type StoredGroup = Group & {
  id: string
  pub_id: string
  created_at: number
  updated_at: number
}

export type Search = {
  id: string
  query: string
  place_id: string
  address: string
  coords: { lat: number; lng: number }
}
export type StoredSearch = Search & { id: string; created_at: number; updated_at: number }
