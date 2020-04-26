import { useRef, useEffect, useCallback } from 'react'
import MarkerCluster from '@google/markerclustererplus'
import { useGroupsList } from '../../../state/selectors'
import { Group } from '../../../utils/types'

export type Coord = { lat: number; lng: number }
export type MapRef = React.MutableRefObject<google.maps.Map | undefined>

export type ClustorProps = {
  onSelect?: (x: Group) => void
  selected?: Group
  disable?: boolean
}
export const useGroupClusters = (map: MapRef, { disable, onSelect, selected }: ClustorProps) => {
  const groups = useGroupsList()

  const cluster = useRef<MarkerCluster>()
  const markers = useRef<google.maps.Marker[]>([])
  const listeners = useRef<google.maps.MapsEventListener[]>([])

  useEffect(() => {
    if (!map.current) return

    cluster.current = new MarkerCluster(map.current, markers.current, {
      minimumClusterSize: 6,
      gridSize: 50,
      clusterClass: 'map-cluster-icon',
      imagePath: process.env.PUBLIC_URL + '/cluster_',
    })
  }, [map])

  // Adding markers to Cluster
  useEffect(() => {
    if (!map.current || groups.length < 1) return
    const current = cluster.current?.getMarkers().map((x) => x.getTitle())
    const missing = groups
      .filter((x) => !current?.includes(x.id))
      .map((group, i) => {
        const marker = new google.maps.Marker({
          opacity: 0.7,
          title: group.id,
          position: group.location_coord,
          icon: process.env.PUBLIC_URL + '/marker_1.png',
          clickable: true,
        })
        if (onSelect)
          listeners.current = [
            ...listeners.current,
            marker.addListener('click', () => onSelect(group)),
          ]
        return marker
      })
    markers.current = [...markers.current, ...missing]
    cluster.current?.addMarkers(missing)
  }, [groups, onSelect, map])

  useEffect(() => {
    if (!map.current) return
    if (disable) {
      cluster.current?.getMarkers().map((x) => x.setVisible(false))
      cluster.current?.setMap(null)
    } else {
      cluster.current?.getMarkers().map((x) => x.setVisible(true))
      cluster.current?.setMap(map.current)
    }
  }, [disable, map])

  const selectMarker = useCallback((id: string) => {
    cluster.current?.getMarkers().map((marker) => {
      if (marker.getTitle() === id) return marker.setOpacity(1)
      if (marker.getOpacity() === 1) return marker.setOpacity(0.7)
      return marker
    })
  }, [])

  useEffect(
    () => () => {
      cluster.current?.clearMarkers()
      listeners.current.forEach((x) => x.remove())
      markers.current.map((x) => x.setMap(null))
      cluster.current?.setMap(null)
    },
    []
  )

  return selectMarker
}
