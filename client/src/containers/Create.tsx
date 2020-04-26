import React, { useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import GroupForm from '../components/Form'
import { useFetch } from '../hooks/useAsync'

const CreateGroup = () => {
  const history = useHistory()
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
    if (error) return alert('Something went wrong with the network')
    if (!data) return
    history.replace('/')
  }, [data, error, history])

  return <>{!isLoading && <GroupForm onSave={trigger} />}</>
}

export default CreateGroup
