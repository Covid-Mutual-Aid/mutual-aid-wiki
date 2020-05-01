import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { useI18n } from "../contexts/I18nProvider"
import { setUserLocation, setSearchLocation } from '../state/reducers/location'

const useBrowserGeolocate = () => {
  const dispatch = useDispatch()
  const t = useI18n(x => x.translation.components.browser_geolocate)
  return useCallback(() => {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        dispatch(
          setSearchLocation({
            name: t.your_area,
            coord: { lat: position.coords.latitude, lng: position.coords.longitude },
            zoom: position.coords.altitudeAccuracy || 9,
          })
        )
        dispatch(
          setUserLocation({
            coord: { lat: position.coords.latitude, lng: position.coords.longitude },
            zoom: position.coords.altitudeAccuracy || 9,
          })
        )
      }, console.error)
    } else {
      alert("Your browser doesn't support this feature")
    }
  }, [dispatch])
}

export default useBrowserGeolocate
