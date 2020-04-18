import React, { createContext, useContext } from 'react'
import en from '../locales/en.json'

type Locale = typeof en

const defaultState : Locale = en

const I18nContext = createContext<Locale>(defaultState)

const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <I18nContext.Provider value={defaultState}>
    {children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => useContext(I18nContext)
export default I18nProvider
