import { useContext, useMemo, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { useSelectedGroup, selectGroup } from '../../../state/reducers/groups'
import { useLocationState } from '../../../state/reducers/location'

import { useGroupClusters } from './useGroupClusters'
import { MapContext } from '../withMap'
import usePolygon from './usePolygon'
import { isSquare } from './utils'

const useGroupsMap = (disable: boolean) => {
  const [, map, setZoom] = useContext(MapContext)
  const selected = useSelectedGroup()
  const search = useLocationState().search
  const dispatch = useDispatch()

  const selectMarker = useGroupClusters(
    map,
    useMemo(() => ({ disable, onSelect: (grp) => dispatch(selectGroup(grp)) }), [dispatch, disable])
  )

  const isDefault = selected && selected.location_poly && isSquare(selected.location_poly)

  usePolygon(
    map,
    useMemo(
      () => ({
        disable: !selected?.location_poly || isDefault,
        path: selected?.location_poly,
        editable: false,
      }),
      [selected, isDefault]
    )
  )

  useEffect(() => {
    if (!search || !map.current || !search.coord || !search.zoom) return
    map.current.panTo(search.coord)
    setZoom(search.zoom)
  }, [search, setZoom, map])

  useEffect(() => {
    if (!map.current || !selected) return
    selectMarker(selected?.id || '')
    if (selected && map.current.getZoom() < 11) setZoom(12)
    map.current.panTo(selected.location_coord)
  }, [selected, setZoom, map, selectMarker])
}

export default useGroupsMap
