export type Coord = { lat: number; lng: number }
export type MapRef = React.MutableRefObject<google.maps.Map | undefined>
export const getCoord = (x: google.maps.LatLng) => ({ lat: x.lat(), lng: x.lng() })
export const createSquare = (coord: Coord, radius: number) => {
  const center = new google.maps.Circle({ center: coord, radius }).getBounds()
  const ne = getCoord(center.getNorthEast())
  const sw = getCoord(center.getSouthWest())
  return [ne, { lat: ne.lat, lng: sw.lng }, sw, { lat: sw.lat, lng: ne.lng }]
}
