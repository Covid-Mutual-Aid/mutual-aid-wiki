import React, { createContext, useContext, useEffect } from 'react'
import useLocallyStoredState from '../hooks/useLocallyStoredState'

import enTranslation from '../locales/en.json'
import AboutEN from '../components/internationalized/AboutEN'
import HeroContentEN from '../components/internationalized/HeroContentEN'
import HighlightsContentEN from '../components/internationalized/HighlightsContentEN'

import esTranslation from '../locales/es.json'
import AboutES from '../components/internationalized/AboutES'
import HeroContentES from '../components/internationalized/HeroContentES'
import HighlightsContentES from '../components/internationalized/HighlightsContentES'
import { useLocationState } from '../state/reducers/location'

type Translation = typeof enTranslation

class Locale {
  code: string
  name: string
  translation: Translation
  components: { about: JSX.Element,
                heroContent: JSX.Element,
                highlightsContent: JSX.Element }
  constructor(
    code: string,
    name: string,
    translation: Translation,
    components: { about: JSX.Element,
                  heroContent: JSX.Element,
                  highlightsContent: JSX.Element }
  ) {
    this.code = code
    this.name = name
    this.translation = translation
    this.components = components
  }
}

const en: Locale = new Locale('en', 'English', enTranslation, {
  about: <AboutEN />,
  heroContent: <HeroContentEN />,
  highlightsContent: <HighlightsContentEN />
})

const es: Locale = new Locale('es', 'Castellano', esTranslation, {
  about: <AboutES />,
  heroContent: <HeroContentES />,
  highlightsContent: <HighlightsContentES />
})

const defaultLocaleCode = 'en'

const locales: { [index: string]: Locale } = {
  en: en,
  es: es,
}

const I18nContext = createContext<Locale>(en)

const I18nMethodsContext = createContext<(x: string) => void>((_x) => null)

const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocationState().user
  const [localeString, setLocale] = useLocallyStoredState<string | undefined>('locale', undefined)
  useEffect(() => {
    const localeCode = location && location.countryCode && location.countryCode.toLowerCase()
    if (localeString === undefined) {
      return setLocale(localeCode)
    }
  }, [location, setLocale, localeString])
  const locale = locales[localeString || defaultLocaleCode]
  const localeCallback = (x: string) => {
    setLocale(x)
  }
  return (
    <I18nMethodsContext.Provider value={localeCallback}>
      <I18nContext.Provider value={locale}>{children}</I18nContext.Provider>
    </I18nMethodsContext.Provider>
  )
}

type LocaleTransformer<T> = (v: Locale) => T

export function useI18n<T>(f: LocaleTransformer<T>): T {
  return f(useContext(I18nContext))
}

export const useI18nSetter = () => useContext(I18nMethodsContext)

export const LOCALES = Object.values(locales)

export default I18nProvider
