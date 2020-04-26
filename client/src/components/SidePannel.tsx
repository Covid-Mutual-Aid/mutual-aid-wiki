import React from 'react'
import styled from 'styled-components'

import { MOBILE_BREAKPOINT } from '../utils/CONSTANTS'
import { useI18n } from '../contexts/I18nProvider'
import { PannelState } from '../pages/MapLayout'
import inIframe from '../utils/inIframe'
import icons from '../utils/icons'
import Nav from './Nav'

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
  return (
    <SidePannelStyles state={state} open={open}>
      <div className="panel">
        <div onClick={toggle} className="toggle">
          {open ? icons('chevronL') : icons('chevronR')}
        </div>
        <Nav>
          <div className="map">
            <div onClick={toggle}>{icons('map', 'green')}</div>
          </div>
        </Nav>
      </div>
      {children}
    </SidePannelStyles>
  )
}

export default SidePannel

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
    transform: translateX(
      ${(p) => {
        if (p.open) return '0rem'
        return 'calc(1rem - 100vw)'
      }}
    );
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
