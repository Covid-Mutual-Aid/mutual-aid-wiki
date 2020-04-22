import useControl from './useControl'

const Control = <T extends any>({
  children,
  name,
  init,
  valid,
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
  valid?: (x: T) => string | true
}) => {
  const { error, props } = useControl(name, init, valid)
  return children({ error, props })
}

export default Control
