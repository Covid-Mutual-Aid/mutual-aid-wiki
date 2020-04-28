export type PubSub<T> = {
  get: {
    (): T
    <R extends any>(fn: (x: T) => R): R
  }
  set: (fn: (x: T) => T) => void
  subscribe: (fn: (x: T) => void) => () => void
}

const createPubSub = <T extends any>(init?: T): PubSub<T> => {
  let listeners = [] as ((x: T) => void)[]
  let values = init || ({} as T)
  return {
    get: <R extends any>(fn?: (x: T) => R) => {
      if (fn) return fn(values)
      return values
    },
    set: (fn: (x: T) => T) => {
      values = fn(values)
      listeners.forEach((cb) => cb(values))
    },
    subscribe: (fn: (x: T) => void) => {
      listeners = [...listeners, fn]
      return () => (listeners = listeners.filter((x) => x !== fn))
    },
  }
}

export default createPubSub
