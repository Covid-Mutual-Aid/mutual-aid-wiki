import jwt from 'jsonwebtoken'

export const signForGroups = (ids: string[]) => jwt.sign({ ids }, 'SECRET', { expiresIn: '1h' })
export const verify = (token: string) =>
  Promise.resolve(jwt.verify(token, 'SECRET')).then((r) =>
    (r as any).error ? Promise.reject((r as any).error) : (r as any).ids
  ) as Promise<string[]>
