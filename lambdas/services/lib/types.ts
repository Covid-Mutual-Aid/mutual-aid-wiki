export type Group = {
  id: string
  pub_id: string
  name: string
  emails?: string[]
  link_facebook: string
  location_name: string
  location_coord: { lat: number; lng: number }
}

type Rebuild<T extends Record<any, any>> = { [K in keyof T]: T[K] }
export type SanitizedGroup = Rebuild<Omit<Group, 'pub_id'>>
