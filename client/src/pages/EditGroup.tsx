import { useParams, Link, useHistory } from 'react-router-dom'
import React, { useState, useEffect, useCallback } from 'react'

import { useRequest } from '../contexts/RequestProvider'
import { Group } from '../utils/types'
import { EditPage, CenterAlign, InputGroup } from '../styles/styles'
import styled from 'styled-components'

import EditGroupComponents, { Validation } from '../components/EditGroupComponents'
import GroupItem from '../components/NewLayout/GroupItem'
import { useFetch } from '../utils/useAsync'
import Form from '../components/FormControl/Form'
import useControl from '../components/FormControl/useControl'
import Control from '../components/FormControl/Control'
import Location from '../components/Location'
import EditGroupForm from '../components/EditGoupForm'

const CreateGroup = () => {
  const [done, setDone] = useState(false)
  const { id, token } = useParams<{ id: string; token: string }>()
  const [group, setGroup] = useState<Omit<Group, 'id'>>()
  const { data } = useFetch<Omit<Group, 'id'>>(useCallback((req) => req(`/group/get?id=${id}`), []))
  useEffect(() => setGroup(data), [data])

  const { retry: submitGroup, isLoading: submiting, error } = useFetch<any>(
    useCallback(
      (req) =>
        req(`/group/update?token=${token}`, {
          method: 'POST',
          body: JSON.stringify(group),
        }),
      [group]
    ),
    true
  )

  const [sucessModal, setSuccessModal] = useState(false)
  const [ready, setReady] = useState(false)
  const [validation, setValidation] = useState<(keyof Validation)[]>([])
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
    if (!ready) return
    submitGroup()
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
              setGroup={(x: any) => {
                setGroup((y) => ({ ...y, ...x }))
                setDone(true)
              }}
            />
          )}
        </CenterAlign>
      </div>
      <div className="preview">
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
      </div>
    </EditPage>
  )
}

export default CreateGroup

const Input = <T extends any>({
  name,
  init,
  valid,
  ...inputProps
}: { name: string; init: T; valid?: (x: T) => string | true } & React.InputHTMLAttributes<
  HTMLInputElement
>) => {
  const { error, props } = useControl(name, init, valid)
  return (
    <div style={{ margin: '1rem 0' }}>
      <span style={{ width: '100%', paddingLeft: '.5rem', height: '.5rem' }}>{error}</span>
      <InputGroup>
        <input
          style={{
            backgroundColor: error ? 'rgba(255, 0, 0, 0.1)' : 'inherit',
          }}
          {...inputProps}
          {...props}
        />
      </InputGroup>
    </div>
  )
}

const FormButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem 0;

  button {
    margin: 0 0.4rem;
  }
`
export function validURL(str: string) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ) // fragment locator

  return !!pattern.test(str) || 'Invalid URL'
}
