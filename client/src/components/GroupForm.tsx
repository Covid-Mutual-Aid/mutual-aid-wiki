import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import GroupFormElements from '../components/GroupFormElements'
import ValuesListener from './FormControl/ValuesListener'
import Form from '../components/FormControl'
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
      <Styles>
        <GroupFormElements disabled={disable} />
        <span style={{ color: 'red', height: '1rem' }}>{error || serverError}</span>
      </Styles>
    </Form>
  )
}

const Styles = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default GroupForm
