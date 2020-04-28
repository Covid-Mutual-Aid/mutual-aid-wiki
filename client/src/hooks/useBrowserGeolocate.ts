import { useDispatch } from 'react-redux'
import { useCallback } from 'react'

import { setUserLocation, setSearchLocation } from '../state/reducers/location'

const useBrowserGeolocate = () => {
  const dispatch = useDispatch()

  return useCallback(() => {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        dispatch(
          setSearchLocation({
            name: 'Your area',
            coord: { lat: position.coords.latitude, lng: position.coords.longitude },
            zoom: position.coords.altitudeAccuracy || 7,
          })
        )
        dispatch(
          setUserLocation({
            coord: { lat: position.coords.latitude, lng: position.coords.longitude },
            zoom: position.coords.altitudeAccuracy || 7,
          })
        )
      }, console.error)
    } else {
      alert("Your browser doesn't support this feature")
    }
  }, [dispatch])
}

export default useBrowserGeolocate
