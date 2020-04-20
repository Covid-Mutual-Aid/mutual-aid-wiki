import { useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { FormContext } from './Form'

const useFormStore = () => useContext(FormContext)

const useControl = <T extends any>(name: string, init: T, validate?: (x: T) => true | string) => {
  const store = useFormStore()
  const [value, setValue] = useState<T>(init)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const field = store.get((x) => x[name])
    if (!field || !field.value || (!field.validate && validate)) {
      store.set((x) => ({ ...x, [name]: { value: (field && field.value) || init, validate } }))
    }
    return store.subscribe((x) => {
      if (x[name] === undefined) return
      const err = validate ? validate(x[name].value) : true
      setValue(x[name].value)
      setError(err === true ? null : err)
    })
  }, [name, store, init, validate])

  const onChange = useCallback(
    (e: any) => {
      const value = e && e.target ? e.target.value : e
      store.set((x) => ({ ...x, [name]: { ...x[name], value } }))
    },
    [name, store]
  )

  return useMemo(() => ({ props: { value, onChange }, error }), [value, error])
}

export default useControl
