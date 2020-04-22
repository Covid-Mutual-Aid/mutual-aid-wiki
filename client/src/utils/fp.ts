export const pick = <T extends { [x: string]: any }, K extends (keyof T)[]>(k: K) => (o: T) =>
  k.reduce<Pick<T, K[number]>>((all, key) => ({ ...all, [key]: o[key] }), {} as Pick<T, K[number]>)

export const omit = <T extends { [x: string]: any }, K extends (keyof T)[]>(k: K) => (o: T) =>
  Object.keys(o).reduce<Omit<T, K[number]>>(
    (all, key) => (k.includes(key) ? all : { ...all, [key]: o[key] }),
    {} as Omit<T, K[number]>
  )

export const isTruthy = <T extends any>(x: T | undefined | null): x is T =>
  x !== undefined && x !== null

export const head = <T extends any>(arr: T[]) => arr && arr[0]
export const last = <T extends any>(arr: T[]) => arr && arr[arr.length - 1]
export const prop = <T extends any, K extends keyof T>(key: K) => (x: T) => x && x[key]

type RM<T extends any> = { [Key in keyof T]: T[Key] }

export const updateProp = <T extends any, K extends keyof T, R extends any>(
  key: K,
  fn: (x: T[K]) => R
) => (x: T): RM<Omit<T, K> & { [Key in K]: R }> => ({
  ...x,
  [key]: fn(x[key]),
})
