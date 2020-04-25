import React, { createContext, useRef, useEffect } from 'react'
import createPubSub, { PubSub } from '../../utils/pubsub'

export const FormContext = createContext<PubSub<FormFields>>({
  get: () => ({}),
  set: () => null,
  subscribe: () => () => null,
})

export type Field<T> = { value: T; error?: string; validate?: (x: T) => true | string }
export type FormFields = { [x: string]: Field<any> }

const Form = <
  T extends Record<string, any>,
  V extends { [Key in keyof T]: (x: T[Key]) => string | true }
>({
  children,
  onSubmit,
  initialValues,
  validators,
  ...props
}: {
  children: React.ReactNode
  onSubmit: (values: T, errors?: [string, string][]) => void
  initialValues?: T
  validators?: V
} & Omit<
  React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>,
  'onSubmit'
>) => {
  const pubsub = useRef(createPubSub<FormFields>())

  useEffect(() => {
    if (!initialValues) return
    pubsub.current.set((x) => ({
      ...x,
      ...Object.keys(initialValues).reduce(
        (all, key) => ({
          ...all,
          [key]: {
            value: initialValues[key],
            validate: (validators && validators[key]) || (x[key] && x[key].validate),
          },
        }),
        {} as any
      ),
    }))
  }, [initialValues, validators])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const values = pubsub.current.get()
    const errors = Object.keys(values).reduce<[string, string][]>((all, key) => {
      const valid = values[key].validate ? (values[key].validate as any)(values[key].value) : true
      if (valid === true) return all
      return [...all, [key, valid]]
    }, [])

    const vals = Object.keys(values).reduce(
      (all, key) => ({ ...all, [key]: values[key].value }),
      {} as T
    )
    onSubmit(vals, errors as [string, string][])
  }

  return (
    <FormContext.Provider value={pubsub.current}>
      <form {...props} onSubmit={handleSubmit}>
        {children}
      </form>
    </FormContext.Provider>
  )
}

export default Form
