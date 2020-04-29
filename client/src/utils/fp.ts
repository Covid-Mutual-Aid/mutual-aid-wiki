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

export const mapValues = <A extends any, B extends any>(fn: (value: A) => B) => <
  T extends Record<any, A>
>(
  x: T
) =>
  (Object.keys(x) as (keyof T)[]).reduce<{ [Key in keyof T]: B }>(
    (all, key) => ({ ...all, [key]: fn(x[key]) }),
    {} as any
  )

export const tuple = <A extends any[]>(...args: A) => args

export const isObject = <T extends Record<any, any>>(item: unknown): item is T =>
  typeof item === 'object' && !Array.isArray(item) && item !== null

export const compare = <A extends any, B extends any>(fn: (a: A, b: B) => boolean) => (
  a: A,
  b: B
) => fn(a, b)

export const deepCompare = <A extends any, B extends any>(fn: (a: A, b: B) => boolean) => (
  a: any,
  b: any
): boolean => {
  if (Array.isArray(a) && Array.isArray(b))
    return a.reduce<boolean>((all, ai, i) => all && deepCompare(fn)(ai, b[i]), true)
  if (isObject(a) && isObject(b))
    return Array.from(new Set([...Object.keys(a), ...Object.keys(b)])).reduce<boolean>(
      (all, key) => all && deepCompare(fn)(a[key], b[key]),
      true
    )
  return fn(a, b)
}

export const uniqBy = <T extends any>(fn: (a: T, b: T) => boolean) => (x: T[]) =>
  x.reduce((all, n) => (all.some((x) => fn(x, n)) ? all : [...all, n]), [] as T[])
