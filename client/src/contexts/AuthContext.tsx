import React, { useState, useEffect, useContext } from 'react'
import createAuth0Client from '@auth0/auth0-spa-js'

type Unpack<T extends Promise<any>> = T extends Promise<infer D> ? D : never

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname)

export const Auth0Context = React.createContext({
  isAuthenticated: false as boolean,
  user: {} as any,
  loading: false as boolean,
  popupOpen: false as boolean,
  loginWithPopup: (x: any) => Promise.resolve() as Promise<void>,
  handleRedirectCallback: (x: any) => Promise.resolve() as Promise<void>,
  getIdTokenClaims: (x: any) => ({} as any),
  loginWithRedirect: (x: RedirectLoginOptions) => ({} as any),
  getTokenSilently: (x: any) => ({} as any),
  getTokenWithPopup: (x: any) => ({} as any),
  logout: () => ({} as any),
})
export const useAuth0 = () => useContext(Auth0Context)
export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}: {
  children: React.ReactNode
  onRedirectCallback: (x: any) => void
  domain: string
  client_id: string
  redirect_uri: string
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState()
  const [auth0Client, setAuth0] = useState<Unpack<ReturnType<typeof createAuth0Client>>>()
  const [loading, setLoading] = useState(true)
  const [popupOpen, setPopupOpen] = useState(false)

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions)
      setAuth0(auth0FromHook)

      if (
        window.location.search.includes('code=') &&
        window.location.search.includes('state=')
      ) {
        const { appState } = await auth0FromHook.handleRedirectCallback()
        onRedirectCallback(appState)
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated()

      setIsAuthenticated(isAuthenticated)

      if (isAuthenticated) {
        const user = await auth0FromHook.getUser()
        setUser(user)
      }

      setLoading(false)
    }
    initAuth0()
    // eslint-disable-next-line
  }, [])

  const loginWithPopup = async (params = {}) => {
    if (!auth0Client) return
    setPopupOpen(true)
    try {
      await auth0Client.loginWithPopup(params)
    } catch (error) {
      console.error(error)
    } finally {
      setPopupOpen(false)
    }
    const user = await auth0Client.getUser()
    setUser(user)
    setIsAuthenticated(true)
  }

  const handleRedirectCallback = async () => {
    if (!auth0Client) return
    setLoading(true)
    await auth0Client.handleRedirectCallback()
    const user = await auth0Client.getUser()
    setLoading(false)
    setIsAuthenticated(true)
    setUser(user)
  }

  console.log({ isAuthenticated, user, loading })
  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims: (...p: any) =>
          auth0Client && auth0Client.getIdTokenClaims(...p),
        loginWithRedirect: (...p: any) =>
          auth0Client && auth0Client.loginWithRedirect(...p),
        getTokenSilently: (...p: any) =>
          auth0Client && auth0Client.getTokenSilently(...p),
        getTokenWithPopup: (...p: any) =>
          auth0Client && auth0Client.getTokenWithPopup(...p),
        logout: (...p: any) => auth0Client && auth0Client.logout(...p),
      }}
    >
      {children}
    </Auth0Context.Provider>
  )
}
