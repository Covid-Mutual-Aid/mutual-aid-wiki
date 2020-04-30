import styled from 'styled-components'
import { MOBILE_BREAKPOINT } from '../utils/CONSTANTS'
import { useI18n } from '../contexts/I18nProvider'
import { Link, useLocation } from 'react-router-dom'
import React from 'react'

export const EditPage = styled.div`
  @media (max-width: ${MOBILE_BREAKPOINT + 'px'}) {
    grid: 1fr / 1fr;

    .preview {
      display: hidden;
    }
  }
`

export const TextWrapper = styled.div`
  max-width: 30rem;
`

export const CenterAlign = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  height: 100vh;
`

export const Button = styled.div<{ variant?: 'primary' | 'secondary' }>`
  background-color: ${({ variant }) => (variant === 'primary' ? 'blue' : 'lightgrey')};
  color: ${({ variant }) => (variant === 'primary' ? 'white' : 'grey')};
  border-radius: 4px;
  padding: 0.6rem 0.8rem;

  a {
    text-decoration: none;
    color: inherit;
  }
`

export const FormButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem 0;

  button {
    margin: 0 0.4rem;
  }
`

export const Card = styled.div`
  max-width: 30rem;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0px 0px 22px -9px #959595;
  padding: 2rem;
  background: white;

  @media (max-width: ${MOBILE_BREAKPOINT + 'px'}) {
    box-shadow: none;
    padding: 1rem;
  }
`

export const Toggle = () => {
  const t = useI18n((locale) => locale.translation.components.nav)
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  return (
    <Link className={!isHome ? 'selected' : ''} to="/">
      {t.information_link}
    </Link>
  )
}

const ToggleStyles = styled.div`
  position: relative;
  display: grid;
  grid: 0fr/1fr 1fr;
  border: solid 1px rgb(47, 128, 237);
  border-radius: 6px;
  overflow: hidden;

  .selected {
    background-color: rgb(47, 128, 237);
    color: white;
  }

  & > a {
    background-color: white;
    color: rgb(47, 128, 237);
    text-decoration: none;
    padding: 0.2rem 0.4rem;
    text-align: center;
    line-height: 1.26;
  }
`
