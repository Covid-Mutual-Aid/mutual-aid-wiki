import React, { useState, useEffect } from 'react'

import GroupFormElements from '../components/GroupFormElements'
import ValuesListener from './FormControl/ValuesListener'
import { EditPage, CenterAlign } from '../styles/styles'
import Form from '../components/FormControl'
import SingleGroup from './Maps/SingleGroup'
import { Group } from '../utils/types'
import { head } from '../utils/fp'

const GroupForm = <T extends Partial<Group>>({
  group: initialGroup,
  saveGroup,
  disable,
  error: serverError,
}: {
  group?: T
  saveGroup: (x: T) => void
  disable?: boolean
  error?: string
}) => {
  const [error, setError] = useState('')
  const [group, setGroup] = useState(initialGroup)

  useEffect(() => {
    setGroup(initialGroup)
  }, [initialGroup])

  return (
    <Form
      style={{ width: '100%' }}
      onSubmit={(values, errors) => {
        if (errors && errors.length > 0) {
          setError(head(errors)[1])
          setGroup(values)
          return
        }
        saveGroup(values)
      }}
      initialValues={group}
    >
      <ValuesListener onChange={(x) => (error.length > 0 ? setError('') : null)} />
      <EditPage>
        <div className="main">
          <CenterAlign>
            <GroupFormElements disabled={disable} />
            <span style={{ color: 'red', height: '1rem' }}>{error || serverError}</span>
          </CenterAlign>
        </div>
        <div className="preview">
          <SingleGroup />
        </div>
      </EditPage>
    </Form>
  )
}

export default GroupForm
