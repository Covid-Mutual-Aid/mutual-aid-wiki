import { Group } from './types'
import { useRequest } from '../contexts/RequestProvider'
import { useState, useRef, useCallback, useEffect, useMemo } from 'react'

export type Request = <T extends any>(input: RequestInfo, init?: RequestInit) => Promise<T>

const createRoute = <R extends any, P extends any = undefined>(
  fn: (request: Request, arg: P) => Promise<R>
) => (req: Request, arg: P) => fn(req, arg)

const api = {
  locateIp: createRoute<{ lat: number; lon: number }>((req) => req('/info/locate')),
  getGroups: createRoute<Group[], string | undefined>((req, id) =>
    id ? req(`/group/get?id=${id}`) : req('/group/get')
  ),
  createGroup: createRoute<Group, Omit<Group, 'id'>>((req, group) =>
    req('/info/locate', { method: 'POS', body: JSON.stringify(group) })
  ),
  updateGroup: createRoute<Group, { group: Partial<Omit<Group, 'id'>>; token: string }>(
    (req, { group, token }) =>
      req(`group/update?token=${token}`, { method: 'POS', body: JSON.stringify(group) })
  ),
}

export type API = typeof api

export default api

type Args<F extends (...args: any) => any> = F extends (...args: infer D) => any ? D : never

export const useDataRequest = <T extends keyof API>(type: T, arg?: Args<API[T]>[1]) => {
  const req = useRequest()

  const [data, setData] = useState<ReturnType<API[T]>>()
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)
  const mounted = useRef(true)

  type Req = Args<API[T]>[1] extends undefined
    ? () => void
    : typeof arg extends undefined
    ? (arg?: Args<API[T]>[1]) => void
    : (arg: Args<API[T]>[1]) => void

  const request = useCallback(
    (arg2?: any) => {
      const route = api[type] as (req: Request, x?: any) => Promise<ReturnType<API[T]>>
      const args = arg2 || arg
      setLoading(true)
      setError(null)
      route(req, args)
        .then((x) => {
          if (!mounted.current) return
          setLoading(false)
          if (x && (x as any).error) return setError((x as any).error)
          if (x && (x as any).message) return setError((x as any).message)
          return setData(x)
        })
        .catch((err) => {
          if (!mounted.current) return
          setLoading(false)
          setError(err.message || err)
        })
    },
    [type, req]
  ) as Req

  useEffect(() => {
    if (arg) request(arg)
    mounted.current = true
    return () => void (mounted.current = false)
  }, [])

  return useMemo(() => ({ request, data, isLoading, error }), [request, data, isLoading, error])
}
