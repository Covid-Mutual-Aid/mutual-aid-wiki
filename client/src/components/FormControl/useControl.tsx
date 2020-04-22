import { useContext, useState, useEffect, useCallback, useMemo, useLayoutEffect } from 'react'
import { FormContext } from './Form'

const useFormStore = () => useContext(FormContext)

const useControl = <T extends any>(name: string, init: T, validate?: (x: T) => true | string) => {
  const store = useFormStore()
  const [value, setValue] = useState<T>(init)
  const [error, setError] = useState<string | null>(null)

  useLayoutEffect(() => {
    const field = store.get((x) => x[name])
    store.set((x) => ({
      ...x,
      [name]: {
        value: (field && field.value) || init,
        validate: (field && field.validate) || validate,
      },
    }))
  }, [name, init, validate, store])

  useEffect(
    () =>
      store.subscribe((x) => {
        const validator = x[name] && x[name].validate
        const err = validator ? validator(x[name].value) : true
        setValue(x[name].value)
        setError(err === true ? null : err)
      }),
    [name, store]
  )

  const onChange = useCallback(
    (e: any) => {
      const value = e && e.target ? e.target.value : e
      store.set((x) => ({ ...x, [name]: { ...x[name], value, validate } }))
    },
    [name, store, validate]
  )

  return useMemo(() => ({ props: { value, onChange }, error }), [value, error, onChange])
}

export default useControl
