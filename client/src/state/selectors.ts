import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useCallback } from 'react'

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

export const useFormControl = <T extends Group, K extends keyof T, V extends T[K]>(
  name: K,
  init: V,
  validate?: (x: V) => string | true
): [V, (x: V) => void, string | true] => {
  const dispatch = useDispatch()
  const value = useSelector<RootState, V | undefined>((x) => (x.form.values as any)[name])
  const error = useSelector<RootState, string | true>((x) => (x.form.errors as any)[name])

  const onChange = useCallback(
    (value: V) =>
      dispatch(
        updateForm({
          errors: { [name]: validate ? validate(value) : true },
          values: { [name]: value },
        })
      ),
    [dispatch, name, validate]
  )

  useEffect(() => {
    if (value !== undefined || value === init) return
    onChange(init)
  }, [value, init, onChange])

  return [value || init, onChange, error]
}
