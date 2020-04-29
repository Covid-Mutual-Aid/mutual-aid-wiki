import React, { createContext, useContext } from 'react'
import { Request } from '../utils/api'

const RequestContext = createContext<Request>(() => Promise.reject('No Provider'))

const RequestProvider = ({
  request,
  children,
}: {
  children: React.ReactNode
  request: Request
}) => <RequestContext.Provider value={request}>{children}</RequestContext.Provider>

export default RequestProvider

export const useRequest = () => useContext(RequestContext)
