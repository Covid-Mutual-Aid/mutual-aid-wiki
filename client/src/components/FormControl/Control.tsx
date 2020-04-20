import React from 'react'
import useControl from './useControl'

const Control = <T extends any>({
  children,
  name,
  init,
}: {
  children: ({
    error,
    props,
  }: {
    error: string | null
    props: { value: T; onChange: (e: any) => void }
  }) => JSX.Element
  name: string
  init: T
}) => {
  const { error, props } = useControl(name, init)
  return children({ error, props })
}

export default Control
