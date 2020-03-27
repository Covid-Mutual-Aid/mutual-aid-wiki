import React, { useState, useEffect, useRef } from 'react'
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api'
import { useParams } from 'react-router-dom'

import { useRequest } from '../contexts/RequestProvider'
import { Group } from '../utils/types'

// const useGroup = () => {
//   const [name, setName] = useState('')
// }

// {
//     "id": "0",
//     "name": "Group name",
//     "link_facebook": "Facebook group/website (Link/URL) Please only provide one link",
//     "location_name": "Location",
//     "location_coord": {
//       "lat": 37.0908236,
//       "lng": -95.7127471
//     }
//   }

const useGroup = () => {
  const [group, setGroup] = useState<null | Group>(null)
  const { id } = useParams<{ id: string }>()
  const request = useRequest()
  const mounted = useRef(true)

  const get = () => request(`/group/get?id=${id}`).then(grp => mounted.current && setGroup(grp))
  const save = () =>
    request(`/group/create`, { method: 'POST', body: JSON.stringify(group) }).then(get)

  useEffect(() => {
    get()
    return () => void (mounted.current = false)
  }, [])

  return { group, setGroup, save }
}

const EditGroup = ({}) => {
  const { group, setGroup, save } = useGroup()
  if (!group) return null
  return (
    <div style={{ display: 'grid', grid: '20rem 1fr 1fr / 1fr', height: '100%', width: '100%' }}>
      <form
        onSubmit={e => {
          e.preventDefault()
          save()
        }}
      >
        <div>
          <input value={group.name} onChange={e => setGroup({ ...group, name: e.target.value })} />
        </div>
        <div>
          <input
            value={group.link_facebook}
            onChange={e => setGroup({ ...group, link_facebook: e.target.value })}
          />
        </div>
        <div>
          <button type="submit">save</button>
        </div>
      </form>
      <LoadScript id="script-loader" googleMapsApiKey="AIzaSyDD8gtVtIrx6A0FpaTb7WXy0r1tZR8iECg">
        <GoogleMap
          center={group.location_coord}
          zoom={11}
          mapContainerStyle={{
            height: '100%',
            width: 'auto',
          }}
        >
          <Marker
            position={group.location_coord}
            key={group.id}
            onClick={() => {
              //   setMapState({ center: group.location_coord, group, zoom: 11 })
            }}
          />
        </GoogleMap>
      </LoadScript>
    </div>
  )
}

export default EditGroup
