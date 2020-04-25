import React from 'react'
import styled from 'styled-components'
import Nav from './Nav'

import { MOBILE_BREAKPOINT } from '../utils/CONSTANTS'
import { useI18n } from '../contexts/I18nProvider'
import inIframe from '../utils/inIframe'
import icons from '../utils/icons'

const SidePannel = ({
  children,
  open,
  toggle,
}: {
  open: boolean
  toggle: () => void
  children: React.ReactNode
}) => {
  const t = useI18n((locale) => locale.translation.pages.groups)

  return (
    <SidePannelStyles sidebar={open}>
      <div className="panel">
        <div onClick={toggle} className="toggle">
          {open ? icons('chevronL') : icons('chevronR')}
        </div>
        <Nav>
          <div className="map">
            <div onClick={toggle}>{icons('map', 'green')}</div>
          </div>
        </Nav>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginTop: '-1rem',
          }}
        >
          {inIframe() ? (
            <div style={{ height: '1rem' }}></div>
          ) : (
            <h3>
              {t.cta.line1} <br className="break" /> {t.cta.line2}
            </h3>
          )}
        </div>
      </div>
      {children}
    </SidePannelStyles>
  )
}

export default SidePannel

const SidePannelStyles = styled.div<{ sidebar: boolean }>`
  display: grid;
  grid: 0fr 0fr 0fr 1fr / 1fr;
  width: 30rem;
  transform: translateX(${(p) => (p.sidebar ? '0rem' : '-29rem')});
  height: 100%;
  box-shadow: 0px 0px 22px -9px #959595;
  background-color: white;
  position: relative;
  z-index: 2;
  display: flex;
  flex-flow: column;
  transition: all 0.3s;

  h3 {
    margin: 0 0.6rem;
    font-size: 2.2rem;
    font-weight: 800;
    /* width: 16rem; */
  }

  .map {
    cursor: pointer;
    overflow: none;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    transition: box-shadow 0.3s;
  }

  .map div {
    transition: box-shadow 0.2s;
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

  .map:hover {
    box-shadow: 0px 0px 22px -4px rgba(111, 111, 111, 0.69);
  }

  .panel {
    padding: 0.6rem;
  }

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

  @media (max-width: ${MOBILE_BREAKPOINT + 'px'}) {
    width: 100vw;
    transform: translateX(${(p) => (p.sidebar ? '0rem' : 'calc(1rem - 100vw)')});
    .map div {
      opacity: 1;
      margin-right: 0;
    }

    .toggle {
      top: 10%;
      width: 2.6rem;
      height: 4rem;
      right: -2.6rem;
    }
    .break {
      display: none;
    }

    h3 {
      font-size: 1.6rem;
      width: 100%;
    }
  }
`
