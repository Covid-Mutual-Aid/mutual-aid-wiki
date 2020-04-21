import { useContext, useEffect } from 'react'
import { FormContext } from './Form'

const ValuesListener = <T extends any>({ onChange }: { onChange: (x: T) => void }) => {
  const pubsub = useContext(FormContext)
  useEffect(() => {
    let unsub: any
    setTimeout(() => {
      unsub = pubsub.subscribe((x) =>
        onChange(Object.keys(x).reduce((a, b) => ({ ...a, [b]: x[b].value }), {} as T))
      )
    }, 0)

    return () => {
      console.log('unsund')
      unsub()
    }
  }, [onChange])

  return null
}

export default ValuesListener
