export type Coord = {
  lat: number
  lng: number
}

export type Group = {
  id: string
  name: string
  link_facebook: string
  location_name: string
  location_coord: Coord
}
