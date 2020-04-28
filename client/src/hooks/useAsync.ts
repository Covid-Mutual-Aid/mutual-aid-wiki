import { useState, useEffect, useCallback, useRef } from 'react'

import { useRequest } from '../contexts/RequestProvider'
import { Request } from '../utils/api'

export const useFetch = <T extends any, R extends any = T>(
  fn?: (req: Request, args?: any) => Promise<T>,
  configeration?: { immediate?: boolean; transform?: (x: T) => R }
) => {
  const request = useRequest()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [data, setData] = useState<T>()
  const isMounted = useRef(true)
  const config = useRef(configeration || {})

  const trigger = useCallback(
    (args?: any) => {
      if (!fn) return
      setIsLoading(true)
      setError(undefined)
      fn(request, args)
        .then((x) => {
          if (!isMounted.current) return
          setIsLoading(false)
          if (!x) return
          else if (x.error) return setError(x.error)
          else if (x.message) return setError(x.message)
          return setData(config.current.transform ? config.current.transform(x) : x)
        })
        .catch((err) => {
          console.log(err)
          if (!isMounted.current) return
          setIsLoading(false)
          setError(err.message || err)
        })
    },
    [fn, request]
  )

  useEffect(() => {
    isMounted.current = true
    if (fn && config.current.immediate) trigger()
    return () => void (isMounted.current = false)
  }, [fn, trigger])

  return { data, isLoading, error, trigger }
}
