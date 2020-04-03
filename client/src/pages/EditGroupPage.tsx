import React, { useState, useEffect, useRef } from 'react'
import { GoogleMap, Marker, LoadScript, GroundOverlay } from '@react-google-maps/api'
import { useParams } from 'react-router-dom'

import { useRequest } from '../contexts/RequestProvider'
import { Group } from '../utils/types'
import { Form } from 'react-bootstrap'

import Location from '../components/Location'
import EditGroup from '../components/EditGroup'

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
  const [group, setGroup] = useState<null | (Group & { emails: string[] })>(null)
  const { id } = useParams<{ id: string }>()
  const request = useRequest()
  const mounted = useRef(true)

  const get = () =>
    request(`/group/get?id=${id}`).then((grp) => {
      mounted.current

      if (!grp.email) {
        setGroup({ ...grp, emails: [] })
      }
      setGroup(grp)
    })
  const save = () =>
    request(`/group/update`, { method: 'POST', body: JSON.stringify(group) }).then(get)

  useEffect(() => {
    get()
    return () => void (mounted.current = false)
  }, [])
  console.log(group)
  return { group, setGroup, save }
}

const EditGroupPage = ({}) => {
  const { group, setGroup, save } = useGroup()

  if (!group) return null
  return (
    <div style={{ display: 'grid', grid: '20rem 1fr 1fr / 1fr', height: '100%', width: '100%' }}>
      <Form
        style={{ width: '100%', padding: '1.5rem' }}
        onSubmit={(e: any) => {
          e.preventDefault()
          save()
        }}
      >
        <div style={{ maxWidth: '50rem', margin: '0 auto' }}>
          <EditGroup initGroup={group} onChange={setGroup} />
          <div>
            <button type="submit">save</button>
          </div>
        </div>
      </Form>
    </div>
  )
}

export default EditGroupPage
