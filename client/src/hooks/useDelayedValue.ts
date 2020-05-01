import { useState, useEffect } from 'react'

const useDelayedValue = <T extends any>(x: T, delay: number, active?: boolean) => {
  const [value, setValue] = useState<T>(x)

  useEffect(() => {
    if (!active) return setValue(x)
    let timeout = setTimeout(() => setValue(x), delay)
    return () => clearTimeout(timeout)
  }, [x, delay, active])

  return value
}

export default useDelayedValue
