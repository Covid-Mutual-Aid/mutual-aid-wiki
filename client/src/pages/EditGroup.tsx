import { useParams, Link } from 'react-router-dom'
import React, { useCallback, useEffect, useState } from 'react'

import GroupForm from '../components/GroupForm'
import { useFetch } from '../utils/useAsync'
import { updateProp } from '../utils/fp'
import { Group } from '../utils/types'

const EditGroup = () => {
  const [done, setDone] = useState(false)
  const { id, token } = useParams<{ id: string; token: string }>()

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

  const { data: savedGroup, trigger: saveGroup, isLoading: isSubmiting, error } = useFetch<any>(
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
    refetch()
    return void (savedGroup ? setDone(true) : null)
  }, [savedGroup]) // eslint-disable-line react-hooks/exhaustive-deps

  if (done)
    return (
      <div>
        <p>
          Your changes have been save got back to <Link to="/">map</Link> or continue{' '}
          <button type="button" onClick={() => setDone(false)}>
            editing
          </button>
        </p>
      </div>
    )
  return (
    <GroupForm
      group={group}
      saveGroup={saveGroup}
      disable={isLoading || isSubmiting}
      error={error}
    />
  )
}

export default EditGroup
