import { sign, verify, SignOptions } from 'jsonwebtoken'
import { is } from 'ts-prove'

import ENV from './environment'

const verifyToken = <T extends any>(type: string) => (token: string) => {
  const result = verify(token, ENV.JWT_SECRET) as T & { type: string }
  if (is.string(result)) return Promise.reject(result)
  if ((result as any).error) return Promise.reject((result as any).error)
  if (result.type !== type) return Promise.reject('Incorect token type')
  return Promise.resolve(result as T)
}

const createToken = <T extends string>(type: T) => <P extends Record<string, string>>(
  opt?: SignOptions,
  url?: (x: string, data: P) => string
) => ({
  type,
  sign: (data: P) => sign({ ...data, type }, ENV.JWT_SECRET, opt),
  signUrl: (data: P) => {
    if (!url) throw new Error('No url method provided')
    return url(sign(data, ENV.JWT_SECRET, opt), data)
  },
  verify: verifyToken<P>(type),
})

const tokens = {
  edit: createToken('EDIT_GROUP')<{ id: string; email: string }>(
    {
      expiresIn: '1d',
    },
    (token, d) => `${ENV.CLIENT_ENDPOINT}/edit/${d.id}/${token}`
  ),
  support: createToken('SUPPORT_REQUEST')<{ id: string; email: string }>(
    {
      expiresIn: '1d',
    },
    (token, d) => `${ENV.API_ENDPOINT}/request/support?token=${token}`
  ),
  confirm: createToken('CONFIRM')<{ id: string; email: string; key: string }>(
    {},
    (token) => `${ENV.API_ENDPOINT}/request/confirm?token=${token}`
  ),
  reject: createToken('REJECT')<{ id: string; email: string; key: string }>(
    {},
    (token) => `${ENV.API_ENDPOINT}/request/reject?token=${token}`
  ),
}

export type Tokens = typeof tokens
export type TokensNames = keyof Tokens
export type TokenValues = Tokens[keyof Tokens]

export default tokens
