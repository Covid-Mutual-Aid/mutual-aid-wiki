import React, { useCallback, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import GroupForm from '../components/GroupForm'
import { useFetch } from '../utils/useAsync'

const CreateGroup = () => {
  const [done, setDone] = useState(false)
  const { data, trigger, isLoading, error } = useFetch<any>(
    useCallback(
      (req, grp) =>
        req(`/group/create`, {
          method: 'POST',
          body: JSON.stringify(grp),
        }),
      []
    )
  )

  useEffect(() => {
    console.log(data)
    if (!data) return
    setDone(true)
  }, [data])

  if (done) {
    return (
      <div>
        Thank you for submiting your group click <Link to="/">here</Link> to go back to the map
      </div>
    )
  }

  return <GroupForm saveGroup={trigger} disable={isLoading} error={error} />
}

export default CreateGroup
