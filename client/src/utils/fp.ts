export const pick = <T extends { [x: string]: any }, K extends (keyof T)[]>(k: K) => (o: T) =>
  k.reduce<Pick<T, K[number]>>((all, key) => ({ ...all, [key]: o[key] }), {} as Pick<T, K[number]>)

export const omit = <T extends { [x: string]: any }, K extends (keyof T)[]>(k: K) => (o: T) =>
  Object.keys(o).reduce<Omit<T, K[number]>>(
    (all, key) => (k.includes(key) ? all : { ...all, [key]: o[key] }),
    {} as Omit<T, K[number]>
  )

export const isTruthy = <T extends any>(x: T | undefined | null): x is T =>
  x !== undefined && x !== null
