import React, { useCallback, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { updateForm } from '../state/reducers/form'
import GroupForm from '../components/GroupForm'
import { useFetch } from '../utils/useAsync'
import { updateProp } from '../utils/fp'
import { Group } from '../utils/types'

const EditGroup = () => {
  const { id, token } = useParams<{ id: string; token: string }>()
  const [done, setDone] = useState(false)
  const dispatch = useDispatch()

  const { data: group, isLoading, trigger: refetch } = useFetch<Omit<Group, 'id'>>(
    useCallback((req) => req(`/group/get?id=${id}&token=${token}`), [id, token]),
    {
      immediate: true,
      transform: (x) =>
        updateProp('location_coord', (x) => ({ lat: parseFloat(x.lat), lng: parseFloat(x.lng) }))(
          x
        ) as Group,
    }
  )
  useEffect(() => {
    if (!group) return
    dispatch(updateForm(group))
  }, [group, dispatch])

  const { data: savedGroup, trigger, isLoading: isSubmiting } = useFetch<any>(
    useCallback(
      (req, grp) =>
        req(`/group/update?token=${token}`, {
          method: 'POST',
          body: JSON.stringify(grp),
        }),
      [token]
    )
  )

  useEffect(() => {
    if (!savedGroup) return
    setDone(true)
  }, [savedGroup])

  if (done)
    return (
      <div>
        <p>
          Your changes have been save got back to <Link to="/">map</Link> or continue{' '}
          <button
            type="button"
            onClick={() => {
              refetch()
              setDone(false)
            }}
          >
            editing
          </button>
        </p>
      </div>
    )

  return (
    <div
      style={{
        pointerEvents: isLoading || isSubmiting ? 'none' : 'all',
        opacity: isLoading || isSubmiting ? '.5' : '1',
      }}
    >
      <GroupForm onSave={trigger} />
    </div>
  )
}

export default EditGroup
