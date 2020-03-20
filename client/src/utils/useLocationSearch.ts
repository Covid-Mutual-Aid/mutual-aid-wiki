import { useState, useCallback } from 'react'

import { useRequest } from '../contexts/RequestProvider'
import { useMap } from '../contexts/MapProvider'

const useLocationSearch = () => {
  const request = useRequest()
  const [error, setError] = useState('')
  const { setMapState } = useMap()

  const locate = useCallback((name: string) => {
    request(`/google/geolocate?name=${name}`)
      .then(res => (!res[0] ? Promise.reject() : res[0]))
      .then(place =>
        setMapState({
          zoom: 11,
          center: place.geometry.location,
          name: place.formatted_address,
        })
      )
      .catch(() => setError('Invalid location, please try again'))
  }, [])

  return { locate, error }
}

export default useLocationSearch
