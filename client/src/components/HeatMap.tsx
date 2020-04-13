import React, { useState, useEffect } from 'react'
import { GoogleMap, HeatmapLayer, LoadScript, useLoadScript } from '@react-google-maps/api'
import { useRequest } from '../contexts/RequestProvider'
import haversine from 'haversine-distance'
import Pusher from 'pusher-js'

Pusher.logToConsole = true

var pusher = new Pusher('53f688312eddfe512076', {
  cluster: 'eu',
  forceTLS: true,
})

const usePusher = () => {
  useEffect(() => {
    var channel = pusher.subscribe('location')
    channel.bind('search', (data: any) => {
      console.log(data)
    })
    return () => channel.unsubscribe()
  }, [])
}

const HeatMap = () => {
  const [map, setMap] = useState<GoogleMap | null>(null)
  const [searches, setSearches] = useState<{ weight: number; location: any }[]>([])
  const request = useRequest()
  usePusher()
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDD8gtVtIrx6A0FpaTb7WXy0r1tZR8iECg',
    libraries: ['visualization'],
  })

  useEffect(() => {
    // request('/search/location/get').then(console.log)
    fetch('https://sn29v7uuxi.execute-api.eu-west-2.amazonaws.com/dev/search/location/get')
      .then((x) => x.json())
      // .then(x => x.map((y: any) => new window.google.maps.LatLng(y.coord) as any))
      // .then(setSearches)
      .then((searches) => {
        const coords = searches.map((x: any) => x.coords) as {
          lat: number
          lng: number
        }[]

        const grouped = coords.reduce((all, next) => {
          let isModified = false
          const modified = all.map((x) => {
            if (haversine(x.coord, next) > 10000) return x
            isModified = true
            return { ...x, weight: x.weight + 5 }
          })
          if (isModified) return modified
          return [...all, { weight: 2, coord: next }]
        }, [] as { weight: number; coord: { lat: number; lng: number } }[])

        setSearches(
          grouped.map((x) => ({ ...x, location: new window.google.maps.LatLng(x.coord) }))
        )
      })
  }, [])
  console.log({ searches })
  if (!isLoaded) return null
  return (
    <GoogleMap
      ref={(ref) => setMap(ref)}
      zoom={6}
      center={{ lat: 55.3781, lng: -3.436 }}
      mapContainerStyle={{
        height: '60vh',
        width: '100%',
      }}
    >
      <HeatmapLayer
        // optional
        // required

        options={{ dissipating: false, radius: 0.5, data: searches }}
        data={searches}
      />
      {/* <HeatmapLayer data={[{ lat: 10, lng: 10 }]} /> */}
    </GoogleMap>
  )
}

export default HeatMap
