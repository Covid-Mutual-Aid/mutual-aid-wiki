import React, { createContext, useContext, useState, useMemo } from 'react'
import enTranslation from '../locales/en.json'
import esTranslation from '../locales/es.json'
import AboutEN from '../components/internationalized/AboutEN'
//import { useParams } from 'react-router-dom'

type Translation = typeof enTranslation



class Locale {
    translation: Translation
    components: { about: JSX.Element }
    constructor(translation: Translation, components: { about: JSX.Element }) {
        this.translation = translation;
        this.components = components;
    }
}


const en : Locale = new Locale(enTranslation, { about: <AboutEN /> })
const es : Locale = new Locale(esTranslation, { about: <AboutEN /> })



const locales : { [index: string] : Locale } = {
    "en": en,
    "es": es
}


const I18nContext = createContext<Locale>(en)

const I18nMethodsContext = createContext<(x : string) => void>((_x) => null)

const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [localeString, setLocale] = useState<string>("en")
  const locale = locales[localeString] || en
  const localeCallback = (x : string) => setLocale(x)
  return (
  <I18nMethodsContext.Provider value={localeCallback}>
    <I18nContext.Provider value={locale}>
    {children}
    </I18nContext.Provider>
  </I18nMethodsContext.Provider>
  )
}

type LocaleTransformer<T> = (v : Locale) => T

export function useI18n<T>(f : LocaleTransformer<T>) : T {
    return f(useContext(I18nContext))
}

export const useI18nSetter = () => useContext(I18nMethodsContext)

export default I18nProvider
