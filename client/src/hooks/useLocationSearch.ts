import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { setSearchLocation } from '../state/reducers/location'
import { useRequest } from '../contexts/RequestProvider'

export type Place = { name: string; coords: { lat: number; lng: number } }

const useLocationSearch = (query?: string) => {
  const request = useRequest()
  const dispatch = useDispatch()
  const [error, setError] = useState<null | string>(null)

  useEffect(() => {
    if (!query || query.length === 0) {
      dispatch(setSearchLocation())
      setError(null)
      return
    }
    let mounted = true
    request(`/google/geolocate?name=${query}`)
      .then((res) => (!res[0] ? Promise.reject() : res[0]))
      .then((place) => {
        if (!mounted) return
        dispatch(
          setSearchLocation({
            name: place.formatted_address,
            coord: place.geometry.location,
            zoom: 12,
          })
        )

        return place
      })
      .catch(() => {
        if (!mounted) return
        setError('Invalid location, please try again')
      })
      .then((place) =>
        request('/search/location/add', {
          method: 'POST',
          body: JSON.stringify({
            query,
            place_id: place.place_id,
            coords: place.geometry.location,
            address: place.formatted_address,
          }),
        }).catch((err) => console.error('Failed to add search', err))
      )
    return () => {
      mounted = false
    }
  }, [query, request, dispatch])

  return error
}

export default useLocationSearch
