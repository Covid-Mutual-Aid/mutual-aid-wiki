import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useCallback, useRef } from 'react'

import { updateForm } from './reducers/form'
import { RootState } from './reducers'
import { Group } from '../utils/types'

export const useUserLocation = () => useSelector<RootState>((x) => x.location.user)

export const useFormValues = () => useSelector<RootState, RootState['form']>((x) => x.form)

type UseFormControl = {
  <T extends Group, K extends keyof T, V extends T[K]>(name: K, init: V): [V, (x: V) => void]
  <T extends Group, K extends keyof T, V extends T[K]>(name: K, init?: V): [
    V | undefined,
    (x: V) => void
  ]
}

export const useFormControl: UseFormControl = <T extends Group, K extends keyof T, V extends T[K]>(
  name: K,
  init?: V
): [V | undefined, (x: V) => void] => {
  const initial = useRef(init)
  const dispatch = useDispatch()
  const value = useSelector<RootState, V | undefined>((x) => (x.form as any)[name])

  const onChange = useCallback((value: V) => dispatch(updateForm({ [name]: value })), [
    dispatch,
    name,
  ])

  useEffect(() => {
    if (initial.current === undefined) return
    dispatch(updateForm({ [name]: initial.current }))
  }, [name, dispatch])

  return [value || init, onChange]
}
