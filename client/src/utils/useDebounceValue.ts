import { useState, useEffect } from 'react'

const useDebouncedValue = <T extends any>(n: number, val: T) => {
  const [state, setState] = useState<T>(val)

  useEffect(() => {
    const timeout = setTimeout(() => setState(val), n)
    return () => clearTimeout(timeout)
  }, [val])

  return state
}

export default useDebouncedValue
