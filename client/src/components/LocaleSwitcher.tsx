import React from 'react'
import styled from 'styled-components'

import { useI18nSetter, LOCALES, useI18n } from '../contexts/I18nProvider'

const LocaleSwitcher = () => {
  const currentLocale = useI18n((locale) => locale.code)
  const setLocale = useI18nSetter()
  return (
    <Styles>
      <ul>
        {LOCALES.map((locale) => (
          <li key={locale.code} className={currentLocale === locale.code ? 'selected' : ''}>
            <button className="btn-bland" type="button" onClick={() => setLocale(locale.code)}>
              {locale.code}
              {/* <img src={`/flags/${locale.code}.png`} alt={locale.name} /> */}
            </button>
          </li>
        ))}
      </ul>
    </Styles>
  )
}

const Styles = styled.div`
  position: relative;
  height: 1.7rem;

  & ul {
    list-style-type: none;
    margin: 0;
    padding: 0.1rem;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    position: absolute;
    right: 19.2px;
  }

  & li {
    position: relative;
    height: 1.4rem;
    display: none;
    &.selected {
      display: block;
    }
  }

  & button {
    height: 1.4rem;
    padding: 0.2rem;
    margin: 0;
    border: none;
    outline: none;
    color: grey;
  }
  & img {
    height: 100%;
  }

  &:hover li {
    display: block;
  }
`

export default LocaleSwitcher
