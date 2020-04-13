import jwt, { SignOptions } from 'jsonwebtoken'

const SECRET = 'SECRET'

export const sign = (payload: string | object, options?: SignOptions) =>
  jwt.sign(payload, SECRET, options)

export const verify = <T extends any>(token: string) =>
  Promise.resolve(jwt.verify(token, SECRET)).then((r) =>
    (r as any).error ? Promise.reject((r as any).error) : r
  ) as Promise<T>
