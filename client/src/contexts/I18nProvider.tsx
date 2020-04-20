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

type LocaleTransformer<T> = (v : Locale) => T
export function useI18n<T>(f : LocaleTransformer<T>) : T {
    return f(useContext(I18nContext))
}

export default I18nProvider
