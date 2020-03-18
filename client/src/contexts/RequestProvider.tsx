import React, { createContext, useContext } from "react";

export type Request<T extends any> = (input: RequestInfo) => Promise<T>;
const RequestContext = createContext<Request<any>>(() => Promise.reject('No Provider'));

const Provider = ({ request, children }: { children: React.ReactNode, request: Request<any> }) =>
    <RequestContext.Provider value={request}>{children}</RequestContext.Provider>

export default Provider;

export const useRequest = () => useContext(RequestContext);