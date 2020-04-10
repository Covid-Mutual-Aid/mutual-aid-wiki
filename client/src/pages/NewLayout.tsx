import React, { useReducer } from 'react'
import styled from 'styled-components'

import Map from '../components/NewLayout/Map'
import SearchBox from '../components/NewLayout/SearchBox'
import GroupsList from '../components/NewLayout/GroupsList'
import InfoBox from '../components/NewLayout/InfoBox'

import '../styles/new-layout.css'

const NewLayout = () => {
  const [open, toggleSidebar] = useReducer((x) => !x, true)
  return (
    <LayoutStyles className="new-layout" sidebar={open}>
      <div className="side-bar">
        <div onClick={toggleSidebar} className="toggle">
          <div>{open ? '<' : '>'}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3>Find local mutal aid groups</h3>
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
  grid: 100% / ${(p) => (p.sidebar ? '25rem' : '1rem')} 1fr;
  height: 100vh;
  transition: grid 0.3s;

  .toggle {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    right: -2rem;
    top: 50%;
    width: 2rem;
    height: 4rem;
    background-color: white;
    border-radius: 0 10px 10px 0;
    transition: transform 0.3s;
    cursor: pointer;
    /* transform: translateX(${(p) => (p.sidebar ? '0rem' : '4rem')}); */
    
    div {
      height: 1rem;
    }
  }

  .side-bar {
    display: grid;
    grid: 0fr 0fr 0fr 1fr / 1fr;
    width: 25rem;
    transition: padding-right transform 0.3s;
    transform: translateX(${(p) => (p.sidebar ? '0rem' : '-24rem')});
    padding-right: ${(p) => (p.sidebar ? '0rem' : '4rem')};
    height: 100%;
    box-shadow: 0px 0px 22px -9px #959595;
    background-color: white;
    position: relative;
    z-index: 2;
    display: flex;
    flex-flow: column;

    h3 {
      padding: 1rem;
      font-size: 1.4rem;
      font-weight: bold;
    }
  }
`

const SideBarStyles = styled.div``

export default NewLayout
