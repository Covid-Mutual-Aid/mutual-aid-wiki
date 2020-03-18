export type Group = {
  name: string
  link_facebook: string
  location_name: string
  location_coord?: {
    lat: number
    lng: number
  }
}
