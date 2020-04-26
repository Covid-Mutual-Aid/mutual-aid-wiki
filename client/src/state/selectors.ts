import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useCallback, useRef } from 'react'

import { updateForm } from './reducers/form'
import { RootState } from './reducers'
import { Group } from '../utils/types'

export const useUserLocation = () => useSelector<RootState>((x) => x.location.location)
export const useSelectedGroup = () =>
  useSelector<RootState, Group | undefined>(
    (x) => x.groups.selected,
    (a, b) => a === b && a?.id === b?.id
  )
export const useGroupsList = () => useSelector<RootState, Group[]>((x) => x.groups.all)
export const useGroup = (id: string) =>
  useSelector<RootState, Group | undefined>(
    (x) => x.groups.all.find((y) => y.id === id),
    (a, b) => !!(a && b) && a.id === b.id
  )

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
