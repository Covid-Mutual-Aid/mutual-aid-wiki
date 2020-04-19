import { sign, verify, SignOptions } from 'jsonwebtoken'
import { is } from 'ts-prove'

import ENV from './environment'
import db from './database'

const verifyToken = <T extends any>(type: string) => (token: string) => {
  const result = verify(token, ENV.JWT_SECRET) as T & { type: string }
  if (is.string(result)) return Promise.reject(result)
  if ((result as any).error) return Promise.reject((result as any).error)
  if (result.type !== type) return Promise.reject('Incorect token type')
  if (result.single)
    return db.tokens
      .getById(result.single, ['id'])
      .then((x) => (x.id === result.single ? (result as T) : Promise.reject()))
      .then((res) => db.tokens.delete(result.single).then(() => res))
      .catch(() => Promise.reject('Token already used'))
  return Promise.resolve(result as T)
}

const createToken = <T extends string>(type: T) => <P extends Record<string, string>>(
  opt?: SignOptions
) => ({
  type,
  sign: (data: P, singleUse?: boolean) => {
    if (singleUse)
      return db.tokens
        .create({ type: 'JWT_TOKEN' })
        .then((x) => sign({ ...data, type, single: x.id }, ENV.JWT_SECRET, opt))
    return Promise.resolve(sign({ ...data, type }, ENV.JWT_SECRET, opt))
  },
  verify: verifyToken<P>(type),
})

const tokens = {
  edit: createToken('EDIT_GROUP')<{ id: string; email: string }>({ expiresIn: '1d' }),
  support: createToken('SUPPORT_REQUEST')<{ id: string; email: string }>({ expiresIn: '1d' }),
  confirm: createToken('CONFIRM')<{ id: string; email: string; key: string }>(),
  reject: createToken('REJECT')<{ id: string; email: string; key: string }>(),
}

export type Tokens = typeof tokens
export type TokensNames = keyof Tokens
export type TokenValues = Tokens[keyof Tokens]

export default tokens
