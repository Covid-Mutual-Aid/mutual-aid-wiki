import React, { createContext, useContext } from 'react'
import { Request } from '../utils/api'

const RequestContext = createContext<Request>(() => Promise.reject('No Provider'))

const Provider = ({ request, children }: { children: React.ReactNode; request: Request }) => (
  <RequestContext.Provider value={request}>{children}</RequestContext.Provider>
)

export default Provider

export const useRequest = () => useContext(RequestContext)
