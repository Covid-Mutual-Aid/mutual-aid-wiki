import { useParams, Link } from 'react-router-dom'
import React, { useState, useEffect, useCallback } from 'react'

import { EditPage, CenterAlign } from '../styles/styles'
import { Group } from '../utils/types'

import GroupItem from '../components/NewLayout/GroupItem'
import EditGroupForm from '../components/EditGoupForm'
import { useFetch } from '../utils/useAsync'
import { pick } from '../utils/fp'

const getEditableProps = pick(['name', 'location_name', 'link_facebook', 'location_coord'])

const CreateGroup = () => {
  const [done, setDone] = useState(false)
  const { id, token } = useParams<{ id: string; token: string }>()
  const [group, setGroup] = useState<Omit<Group, 'id'>>()

  const { data, isLoading } = useFetch<Omit<Group, 'id'>>(
    useCallback((req) => req(`/group/get?id=${id}`), []),
    true
  )
  useEffect(() => data && setGroup(getEditableProps(data)), [data])

  const { data: submitResponse, retry: submitGroup, isLoading: isSubmiting, error } = useFetch<any>(
    useCallback(
      (req, grp) =>
        req(`/group/update?token=${token}`, {
          method: 'POST',
          body: JSON.stringify(grp),
        }),
      []
    )
  )
  useEffect(() => {
    if (data && submitResponse) {
      setGroup(getEditableProps(submitResponse))
      setDone(true)
    }
  }, [submitResponse])

  const handleSubmit = (grp: any) => {
    if (isSubmiting) return
    submitGroup({ ...grp, id })
  }

  return (
    <EditPage>
      <div className="main">
        <CenterAlign>
          {done ? (
            <div>
              got back to <Link to="/">map</Link> or continue{' '}
              <button type="button" onClick={() => setDone(false)}>
                editing
              </button>
            </div>
          ) : (
            <EditGroupForm
              group={group || {}}
              onSave={handleSubmit}
              isLoading={isSubmiting || isLoading}
            />
          )}
          <span style={{ color: 'red', height: '1rem' }}>{error}</span>
        </CenterAlign>
      </div>
      <div className="preview">
        {!isSubmiting && (
          <CenterAlign>
            <div className="item">
              {group && (
                <GroupItem
                  onSelect={() => null}
                  selected={false}
                  group={{ ...group, id: '1234567890' }}
                  disableDropdown={true}
                />
              )}
            </div>
          </CenterAlign>
        )}
      </div>
    </EditPage>
  )
}

export default CreateGroup
