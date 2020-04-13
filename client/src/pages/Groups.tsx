import React, { useReducer } from 'react'
import styled from 'styled-components'

import Map from '../components/NewLayout/Map'
import SearchBox from '../components/NewLayout/SearchBox'
import GroupsList from '../components/NewLayout/GroupsList'

import { MOBILE_BREAKPOINT } from '../utils/CONSTANTS'

import icons from '../utils/icons'
import Nav from '../components/NewLayout/Nav'

const NewLayout = () => {
  const [open, toggleSidebar] = useReducer((x) => !x, true)
  return (
    <LayoutStyles className="new-layout" sidebar={open}>
      <div className="side-bar">
        <div className="panel">
          <div onClick={toggleSidebar} className="toggle">
            {open ? icons('chevronL') : icons('chevronR')}
          </div>
          <Nav>
            <div className="map">
              <div onClick={toggleSidebar}>{icons('map', 'white')}</div>
            </div>
          </Nav>
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <h3>
              Find local <br /> mutal aid groups
            </h3>
          </div>
        </div>
        <SearchBox />
        <GroupsList />
      </div>
      <Map />
    </LayoutStyles>
  )
}

const LayoutStyles = styled.div<{ sidebar: boolean }>`
  display: grid;
  grid: 100% / ${(p) => (p.sidebar ? '30rem' : '1rem')} 1fr;
  height: 100vh;
  transition: grid 0.3s;

  .panel {
    padding: 1rem;
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
    /* box-shadow: 0px 0px 22px -9px #959595; */
    box-shadow: 0px 0px 22px -4px rgba(111, 111, 111, 0.69);
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
    /* transform: translateX(${(p) => (p.sidebar ? '0rem' : '4rem')}); */

    div {
      height: 1rem;
    }
  }

  .side-bar {
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
      padding: 1rem;
      font-size: 2.2rem;
      font-weight: 800;
    }
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    grid: 100% / ${(p) => (p.sidebar ? '100vw' : '1rem')} 1fr;

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

    .side-bar {
        width: 100vw;
        transform: translateX(${(p) => (p.sidebar ? '0rem' : 'calc(1rem - 100vw)')});
      }
  }
`

export default NewLayout
