import styled from 'styled-components'
import React from 'react'

import { MOBILE_BREAKPOINT, MOON_BLUE } from '../utils/CONSTANTS'
import { PannelState } from '../containers/Landing'
import { useI18n } from '../contexts/I18nProvider'
import LocaleSwitcher from './LocaleSwitcher'
import inIframe from '../utils/inIframe'
import icons from './icons'
import { Toggle } from '../styles/styles'

const SidePannel = ({
  children,
  open,
  state,
  toggle,
}: {
  open: boolean
  state: PannelState
  toggle: () => void
  children: React.ReactNode
}) => {
  const t = useI18n((locale) => locale.translation.components.nav)
  return (
    <SidePannelStyles state={state} open={open}>
      <div className="panel">
        <div onClick={toggle} className="toggle">
          {open ? icons('chevronL') : icons('chevronR')}
        </div>
        <NavWrapper>
          <div className="options">
            {inIframe() ? (
              <a target="_blank" rel="noopener noreferrer" href="https://mutualaid.wiki">
                {t.view_full_site_link}
              </a>
            ) : (
              <Toggle />
            )}
          </div>
          <div className="buttons-right">
            <LocaleSwitcher />
            <MapIcon>
              <div onClick={toggle}>{icons('map', 'green')}</div>
            </MapIcon>
          </div>
        </NavWrapper>
      </div>
      {children}
    </SidePannelStyles>
  )
}

export default SidePannel

const MapIcon = styled.div`
  cursor: pointer;
  overflow: none;
  width: 0rem;
  height: 3rem;
  border-radius: 50%;
  transition: all 0.3s;
  transition-property: box-shadow, width;

  & > div {
    transition: box-shadow 0.3s;
    opacity: 0;
    margin-right: -3rem;
    transition: all 0.2s;
    width: 3rem;
    border-radius: 50%;
    height: 3rem;
    background-color: lightgreen;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &:hover {
    box-shadow: 0px 0px 22px -4px rgba(111, 111, 111, 0.69);
  }
  @media (max-width: ${MOBILE_BREAKPOINT + 'px'}) {
    width: 3rem;

    & > div {
      opacity: 1;
      margin-right: 0;
    }
  }
`
const SidePannelStyles = styled.div<{ state: PannelState; open: boolean }>`
  display: grid;
  grid: 0fr 0fr 0fr 1fr / 1fr;
  width: ${(p) => (p.state === 'pannel' ? '30rem' : '50vw')};
  transform: translateX(
    ${(p) => {
      if (p.open) return '0rem'
      if (p.state === 'edit') return 'calc(-50vw + 1rem)'
      return '-29rem'
    }}
  );
  height: 100%;
  box-shadow: 0px 0px 22px -9px #959595;
  background-color: white;
  position: relative;
  z-index: 2;
  display: flex;
  flex-flow: column;
  transition: all 0.3s;

  .buttons-right {
    width: 8rem;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }

  .panel {
    padding: 0.6rem 1rem;
    .toggle {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      right: -1.2rem;
      top: 50%;
      width: 1.2rem;
      height: 4rem;
      background-color: white;
      border-radius: 0 10px 10px 0;
      transition: transform 0.3s;
      cursor: pointer;
      border-left: 1px solid rgba(0, 0, 0, 0.06);

      div {
        height: 1rem;
      }
    }
  }

  @media (max-width: ${MOBILE_BREAKPOINT + 'px'}) {
    width: 100vw;
    transform: translateX(
      ${(p) => {
        if (p.open) return '0rem'
        return 'calc(1rem - 100vw)'
      }}
    );
    .toggle {
      top: 10%;
      width: 2.6rem;
      height: 4rem;
      right: -2.6rem;
    }
  }
`

const NavWrapper = styled.div`
  display: flex;
  flex-direction: row;
  font-weight: bold;
  flex-basis: center;
  color: rgba(0, 0, 0, 0.6);
  justify-content: space-between;
  align-items: start;

  .options {
    display: flex;
    flex-direction: row;

    a {
      /* border: 1px solid ${MOON_BLUE}; */
      /* padding: 0 0.8rem 0 0;
      margin: 0 0.2rem; */
      /* color: rgb(204, 39, 109); */
    }
  }
`
