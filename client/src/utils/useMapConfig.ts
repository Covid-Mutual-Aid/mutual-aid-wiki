import { useEffect, useState } from 'react'
import { Coord } from './types'

export type MapConfig = {
  center: Coord
  zoom: number
}

const useMapConfig = (postcode: string): [MapConfig, boolean] => {
  const [postcodeError, setPostcodeError] = useState(false)
  const [mapConfig, setMapConfig] = useState<MapConfig>({
    center: {
      lat: 55.3781,
      lng: -3.436,
    },
    zoom: 5,
  })

  useEffect(() => {
    if (postcode.length < 3) return
    let dismaounted = false
    fetch('https://api.postcodes.io/postcodes/' + postcode)
      .then(response => {
        return response.json()
      })
      .then(data => {
        if (dismaounted) return
        if (!data.result) return setPostcodeError(true)
        setPostcodeError(false)
        setMapConfig({
          center: { lat: data.result.latitude, lng: data.result.longitude },
          zoom: 11,
        })
      })
    return () => {
      dismaounted = true
    }
  }, [postcode])

  return [mapConfig, postcodeError]
}

export default useMapConfig
