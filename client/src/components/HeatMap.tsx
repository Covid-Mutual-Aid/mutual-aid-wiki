import React, { useState, useEffect, useMemo } from 'react'
import { GoogleMap, HeatmapLayer, LoadScript, useLoadScript } from '@react-google-maps/api'
import { useRequest } from '../contexts/RequestProvider'
import haversine from 'haversine-distance'
import Pusher from 'pusher-js'
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

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

type Weighted = { weight: number; location: any; createdAt: string }

const HeatMap = () => {
  const [map, setMap] = useState<GoogleMap | null>(null)
  const [searches, setSearches] = useState<{ weight: number; location: any }[]>([])
  const [timeWindow, setTimeWindow] = useState<{ weight: number; location: any }[]>([])
  const [time, setTime] = useState(Date.now())
  const request = useRequest()
  usePusher()
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDD8gtVtIrx6A0FpaTb7WXy0r1tZR8iECg',
    libraries: ['visualization'],
  })

  useMemo(() => {
    setTimeWindow(searches.filter((a: any) => a.createdAt > Date.now() - time))
    console.log(timeWindow.length)
    console.log(timeWindow)
  }, [time])

  useEffect(() => {
    // request('/search/location/get').then(console.log)
    fetch('https://sn29v7uuxi.execute-api.eu-west-2.amazonaws.com/dev/search/location/get')
      .then(x => x.json())
      // .then(x => x.map((y: any) => new window.google.maps.LatLng(y.coord) as any))
      // .then(setSearches)
      .then(searches => {
        const coords = searches.map(({ coords, createdAt }: any) => ({ coords, createdAt })) as {
          createdAt: number
          coords: {
            lat: number
            lng: number
          }
        }[]

        const grouped = coords.reduce((all, next) => {
          let isModified = false
          const modified = all.map(x => {
            if (haversine(x.coord, next.coords) > 10000) return x
            isModified = true
            return { ...x, createdAt: x.createdAt, weight: x.weight + 5 }
          })
          if (isModified) return modified
          return [...all, { weight: 2, createdAt: next.createdAt, coord: next.coords }]
        }, [] as { weight: number; createdAt: number; coord: { lat: number; lng: number } }[])

        setSearches(grouped.map(x => ({ ...x, location: new window.google.maps.LatLng(x.coord) })))
      })
  }, [])
  if (!isLoaded) return null
  return (
    <div>
      <Slider min={0} max={8500000} step={10} value={time} onChange={e => setTime(e)} />
      <GoogleMap
        ref={ref => setMap(ref)}
        zoom={6}
        center={{ lat: 55.3781, lng: -3.436 }}
        mapContainerStyle={{
          height: '60vh',
          width: '100%',
        }}
      >
        <HeatmapLayer
          options={{ dissipating: false, radius: 0.5, data: timeWindow }}
          data={timeWindow}
        />
      </GoogleMap>
    </div>
  )
}

export default HeatMap
