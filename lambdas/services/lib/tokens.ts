import { is } from 'ts-prove'
import { sign, verify } from 'jsonwebtoken'
import ENV from './environment'

const verifyToken = <T extends any>(type: string) => (token: string) => {
  const result = verify(token, ENV.JWT_SECRET) as T & { type: string }
  if (is.string(result)) return Promise.reject(result)
  if ((result as any).error) return Promise.reject((result as any).error)
  if (result.type !== type) return Promise.reject('Incorect token type')
  return Promise.resolve(result as T)
}

const tokens = {
  edit: {
    sign: ({ id, email }: { id: string; email: string }) =>
      `${ENV.CLIENT_ENDPOINT}/edit/${id}/${sign({ id, email, type: 'EDIT_GROUP' }, ENV.JWT_SECRET, {
        expiresIn: '1d',
      })}`,
    verify: verifyToken<{ id: string; email: string }>('EDIT_GROUP'),
  },
  support: {
    sign: ({ id, email }: { id: string; email: string }) =>
      `${ENV.API_ENDPOINT}/request/support?token=${sign(
        { id, email, type: 'SUPPORT_REQUEST' },
        ENV.JWT_SECRET,
        {
          expiresIn: '3d',
        }
      )}`,
    verify: verifyToken<{ id: string; email: string }>('SUPPORT_REQUEST'),
  },
  confirm: {
    sign: ({ id, email, key }: { id: string; email: string; key: string }) =>
      `${ENV.API_ENDPOINT}/request/confirm?token=${sign(
        { email, id, key, type: 'CONFIRM' },
        ENV.JWT_SECRET
      )}`,
    verify: verifyToken<{ id: string; email: string; key: string }>('CONFIRM'),
  },
  reject: {
    sign: ({ id, email, key }: { id: string; email: string; key: string }) =>
      `${ENV.API_ENDPOINT}/request/reject?token=${sign(
        { email, id, key, type: 'REJECT' },
        ENV.JWT_SECRET
      )}`,
    verify: verifyToken<{ id: string; email: string; key: string }>('REJECT'),
  },
}

export type Tokens = typeof tokens
export type TokensNames = keyof Tokens
export type TokenValues = Tokens[keyof Tokens]

export default tokens
