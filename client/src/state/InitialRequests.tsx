import { useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'

import { setLocation } from './reducers/location'
import { addGroups } from './reducers/groups'

import { useRequest } from '../contexts/RequestProvider'
import { mapValues } from '../utils/fp'
import { Group } from '../utils/types'

const InitialRequests = () => {
  useRequestGroups()
  useUserLocation()
  return null
}

export default InitialRequests

// Wierd thing where coords sometimes come back as strings
const toFloat = mapValues<string | number, number>((x) =>
  typeof x === 'string' ? parseFloat(x) : x
)
const parseGroupCoords = (grp: Group) => ({
  ...grp,
  location_coord: toFloat(grp.location_coord),
  ...(grp.location_poly ? { location_poly: grp.location_poly.map(toFloat) } : {}),
})

// Initial groups request
const useRequestGroups = () => {
  const request = useRequest()
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  useEffect(() => {
    request('/group/get').then((grps: Group[]) => dispatch(addGroups(grps.map(parseGroupCoords))))
  }, [request, isHome, dispatch])
}

// Locate user based on IP
const useUserLocation = () => {
  const request = useRequest()
  const dispatch = useDispatch()

  useEffect(() => {
    request('/info/locate')
      .then((x) => {
        if (x.message) return console.error(x.message)
        return dispatch(setLocation({ coord: { lat: x.lat, lng: x.lon }, zoom: 4 }))
      })
      .catch((err) => console.error(err))
  }, [request, dispatch])
}
